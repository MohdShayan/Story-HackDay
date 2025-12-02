
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal ERC20 infe
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @title RoyaltySplitter
/// @notice Splits ETH/ERC20 among Original, Remixer, and Platform using BPS.
contract RoyaltySplitter {
    address public immutable original;
    address public immutable remixer;
    address public immutable platform;

    uint96  public immutable originalBps;   // e.g., 2000 = 20%
    uint96  public immutable platformBps;   // e.g., 1000 = 10%
    uint96  internal constant DENOM = 10_000;

    error BadBps();
    error TransferFailed();

    constructor(
        address _original,
        address _remixer,
        address _platform,
        uint96 _originalBps,
        uint96 _platformBps
    ) {
        if (_original == address(0) || _remixer == address(0) || _platform == address(0)) revert TransferFailed();
        if (_originalBps + _platformBps > DENOM) revert BadBps();
        original = _original;
        remixer  = _remixer;
        platform = _platform;
        originalBps = _originalBps;
        platformBps = _platformBps;
    }

    /// @notice Accept ETH and split immediately
    receive() external payable {
        _splitETH(msg.value);
    }

    /// @notice Explicit ETH payment path (handy for contracts)
    function payETH() external payable {
        _splitETH(msg.value);
    }

    function _splitETH(uint256 amount) internal {
        if (amount == 0) return;

        uint256 toOriginal = (amount * originalBps) / DENOM;
        uint256 toPlatform = (amount * platformBps) / DENOM;
        uint256 toRemixer  = amount - toOriginal - toPlatform;

        (bool ok1,) = payable(original).call{value: toOriginal}("");
        (bool ok2,) = payable(remixer).call{value: toRemixer}("");
        (bool ok3,) = payable(platform).call{value: toPlatform}("");

        if (!ok1 || !ok2 || !ok3) revert TransferFailed();
    }

    /// @notice Split ERC20 tokens pulled from the caller
    function payERC20(IERC20 token, uint256 amount) external {
        if (amount == 0) return;

        bool okPull = token.transferFrom(msg.sender, address(this), amount);
        if (!okPull) revert TransferFailed();

        uint256 toOriginal = (amount * originalBps) / DENOM;
        uint256 toPlatform = (amount * platformBps) / DENOM;
        uint256 toRemixer  = amount - toOriginal - toPlatform;

        if (!token.transfer(original, toOriginal)) revert TransferFailed();
        if (!token.transfer(remixer,  toRemixer))  revert TransferFailed();
        if (!token.transfer(platform, toPlatform)) revert TransferFailed();
    }
}
