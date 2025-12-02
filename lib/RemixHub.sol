// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RoyaltySplitter.sol";

/// @notice Optional Story interface placeholder (you'll call Story via SDK off-chain in MVP)
interface IStoryLike {
    // function registerIP(bytes calldata contentCid, address owner, bytes calldata licenseData) external returns (uint256 ipId);
    // function linkDerivative(uint256 parentIpId, uint256 childIpId) external;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Lightweight ReentrancyGuard (no OZ import to keep hackathon deploy simple)
   ───────────────────────────────────────────────────────────────────────────── */
abstract contract ReentrancyGuardLite {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED     = 2;
    uint256 private _status;

    constructor() { _status = _NOT_ENTERED; }

    modifier nonReentrant() {
        require(_status != _ENTERED, "REENTRANCY");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

/// @title RemixHub
/// @notice Commerce layer on top of Story IP: presets, remix/commercial licensing, derivative anchoring, and payout splitters.
contract RemixHub is ReentrancyGuardLite {
    /* ----------------------------- TYPES / STORAGE ---------------------------- */

    struct Preset {
        uint96 remixFeeWei;        // fee to buy remix license
        uint96 commercialPriceWei; // price to buy commercial license for derivative
        uint96 originalBps;        // % for original creator on commercial sales
        uint96 platformBps;        // % for platform on all splitter flows
        bool   active;
    }

    struct Original {
        address owner;
        uint256 ipId;     // Story IP id
        bytes32 cidHash;  // keccak256(IPFS CID string) anchor
        uint16  presetId;
        bool    exists;
    }

    struct Derivative {
        uint256 parentIpId;
        uint256 childIpId;
        address remixer;
        address splitter;   // RoyaltySplitter address
        uint96  originalBps;
        bool    exists;
    }

    /* ------------------------------- IMMUTABLES ------------------------------- */
    address public immutable platform; // fee recipient / admin
    IStoryLike public story;           // optional on-chain Story integration (MVP uses SDK off-chain)

    /* --------------------------------- MAPPINGS ------------------------------- */
    mapping(uint16 => Preset) public presets;          // presetId -> Preset
    mapping(uint256 => Original) public originals;     // parent ipId -> Original
    mapping(uint256 => Derivative) public derivatives; // child ipId -> Derivative

    // Access receipts to help your frontend gate downloads:
    mapping(uint256 => mapping(address => bool)) public remixLicensed;      // parentIpId -> buyer -> has license
    mapping(uint256 => mapping(address => bool)) public commercialLicensed; // childIpId  -> buyer -> has license

    /* ---------------------------------- EVENTS -------------------------------- */
    event OriginalRegistered(uint256 indexed ipId, address indexed owner, uint16 presetId, bytes32 cidHash);
    event RemixLicenseSold(uint256 indexed parentIpId, address indexed buyer, uint256 feeWei);
    event DerivativeLinked(uint256 indexed parentIpId, uint256 indexed childIpId, address splitter, uint96 originalBps, uint96 platformBps);
    event CommercialLicenseSold(uint256 indexed childIpId, address indexed buyer, uint256 priceWei);

    /* ---------------------------------- ERRORS -------------------------------- */
    error NotPlatform();
    error UnknownOriginal();
    error UnknownDerivative();
    error AlreadyExists();
    error BadPreset();
    error BadAddress();
    error WrongValue();

    /* --------------------------------- MODIFIERS ------------------------------ */
    modifier onlyPlatform() {
        if (msg.sender != platform) revert NotPlatform();
        _;
    }

    /* -------------------------------- CONSTRUCTOR ----------------------------- */
    constructor(address _platform, address _story) {
        if (_platform == address(0)) revert BadAddress();
        platform = _platform;
        story    = IStoryLike(_story);

        // Seed a sensible default preset: 0.005 ETH remix fee, 0.10 ETH commercial, 20% original, 10% platform
        presets[1] = Preset({
            remixFeeWei:        0.005 ether,
            commercialPriceWei: 0.10  ether,
            originalBps:        2000,
            platformBps:        1000,
            active:             true
        });
    }

    /* ------------------------------- ADMIN ACTIONS ---------------------------- */

    /// @notice Set or update a licensing preset (platform admin)
    function setPreset(uint16 id, Preset calldata p) external onlyPlatform {
        // Basic sanity: ensure split bps won't exceed 100% in splitter usage.
        require(p.originalBps + p.platformBps <= 10_000, "BPS>100%");
        presets[id] = p;
    }

    /// @notice (Optional) update Story reference if you later wire on-chain integration
    function setStory(address _story) external onlyPlatform {
        story = IStoryLike(_story);
    }

    /* ------------------------------- CREATOR FLOW ----------------------------- */

    /// @notice Anchor an original IP already registered on Story (called by original owner)
    function registerOriginal(
        uint256 ipId,
        bytes32 cidHash,
        uint16 presetId
    ) external {
        if (originals[ipId].exists) revert AlreadyExists();

        Preset memory p = presets[presetId];
        if (!p.active) revert BadPreset();

        originals[ipId] = Original({
            owner: msg.sender,
            ipId: ipId,
            cidHash: cidHash,
            presetId: presetId,
            exists: true
        });

        emit OriginalRegistered(ipId, msg.sender, presetId, cidHash);
    }

    /* -------------------------------- REMIX FLOW ------------------------------ */

    /// @notice Buyer purchases a remix license for a given original (records on-chain receipt)
    function buyRemixLicense(uint256 parentIpId) external payable nonReentrant {
        Original memory o = originals[parentIpId];
        if (!o.exists) revert UnknownOriginal();

        Preset memory p = presets[o.presetId];
        if (msg.value != p.remixFeeWei) revert WrongValue();

        // Split remix fee: platform cut, rest to original
        uint256 toPlatform = (msg.value * p.platformBps) / 10_000;
        uint256 toOriginal = msg.value - toPlatform;

        (bool okP,) = payable(platform).call{value: toPlatform}("");
        (bool okO,) = payable(o.owner).call{value: toOriginal}("");
        require(okP && okO, "FEE_SPLIT_FAIL");

        remixLicensed[parentIpId][msg.sender] = true;

        emit RemixLicenseSold(parentIpId, msg.sender, p.remixFeeWei);
    }

    /// @notice After Story registers and links the derivative, anchor the child and deploy its splitter.
    function registerDerivative(
        uint256 parentIpId,
        uint256 childIpId,
        address remixer
    ) external nonReentrant {
        Original memory o = originals[parentIpId];
        if (!o.exists) revert UnknownOriginal();
        if (derivatives[childIpId].exists) revert AlreadyExists();
        if (remixer == address(0)) revert BadAddress();

        Preset memory p = presets[o.presetId];

        // Deploy splitter for all commercial sales on this child
        RoyaltySplitter splitter = new RoyaltySplitter(
            o.owner,
            remixer,
            platform,
            p.originalBps,
            p.platformBps
        );

        derivatives[childIpId] = Derivative({
            parentIpId: parentIpId,
            childIpId: childIpId,
            remixer: remixer,
            splitter: address(splitter),
            originalBps: p.originalBps,
            exists: true
        });

        emit DerivativeLinked(parentIpId, childIpId, address(splitter), p.originalBps, p.platformBps);
    }

    /* --------------------------- COMMERCIAL LICENSE FLOW ---------------------- */

    /// @notice Buyer purchases the commercial license for a specific derivative.
    function buyCommercialLicense(uint256 childIpId) external payable nonReentrant {
        Derivative memory d = derivatives[childIpId];
        if (!d.exists) revert UnknownDerivative();

        Original memory o = originals[d.parentIpId];
        Preset memory p = presets[o.presetId];

        if (msg.value != p.commercialPriceWei) revert WrongValue();

        // Route the entire commercial price into the splitter
        RoyaltySplitter(payable(d.splitter)).payETH{value: msg.value}();

        commercialLicensed[childIpId][msg.sender] = true;

        emit CommercialLicenseSold(childIpId, msg.sender, p.commercialPriceWei);
    }

    /* --------------------------------- VIEWS ---------------------------------- */

    function getOriginal(uint256 ipId) external view returns (Original memory) {
        return originals[ipId];
    }

    function getDerivative(uint256 childIpId) external view returns (Derivative memory) {
        return derivatives[childIpId];
    }

    function getPreset(uint16 id) external view returns (Preset memory) {
        return presets[id];
    }

    function getSplitter(uint256 childIpId) external view returns (address) {
        return derivatives[childIpId].splitter;
    }

    function hasRemixLicense(uint256 parentIpId, address user) external view returns (bool) {
        return remixLicensed[parentIpId][user];
    }

    function hasCommercialLicense(uint256 childIpId, address user) external view returns (bool) {
        return commercialLicensed[childIpId][user];
    }
}
