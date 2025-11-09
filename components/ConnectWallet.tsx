"use client";

import {
    useAccount,
    useConnect,
    useDisconnect,
    useBalance,
    useChainId,
    useChains,
} from "wagmi";
import { injected } from "wagmi/connectors";

export default function ConnectWallet() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const chainId = useChainId();
    const chains = useChains();
    const activeChain = chains.find((c) => c.id === chainId);
    const { data: balance, isLoading: balanceLoading } = useBalance(
        address
            ? {
                address,
                chainId,
            }
            : undefined
    );

    if (!isConnected) {
        return (
            <button
                onClick={() => connect({ connector: injected({ target: "metaMask" }) })}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Connect Wallet
            </button>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex flex-col">
                <span className="font-mono text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <div className="text-xs text-gray-300">
                    Network: {activeChain?.name ?? "Unknown"}
                    {typeof chainId === "number" ? ` (id: ${chainId})` : null}
                </div>
                <div className="text-xs text-gray-400">
                    {/* show simple provider info available on the window.ethereum object */}
                    {typeof window !== "undefined" && (window as any).ethereum ? (
                        <>
                            <span>
                                Provider: {(window as any).ethereum.isMetaMask ? "MetaMask" : "Injected"}
                            </span>
                            <span className="mx-2">•</span>
                            <span>ChainId: {(window as any).ethereum.chainId ?? (window as any).ethereum.networkVersion ?? "unknown"}</span>
                        </>
                    ) : (
                        <span>Provider: unknown</span>
                    )}
                </div>
                <div className="text-xs text-gray-300">
                    Balance: {balanceLoading ? "…" : balance ? `${balance.formatted} ${balance.symbol}` : "--"}
                </div>
            </div>

            {/* <button
                onClick={() => navigator.clipboard?.writeText(address ?? "")}
                className="px-2 py-1 bg-gray-600 text-white rounded"
                title="Copy address"
            >
                Copy
            </button> */}

            {/* <a
                href={`${activeChain?.blockExplorers?.default?.url ?? "https://etherscan.io"}/address/${address}`}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 bg-gray-600 text-white rounded text-sm"
            >
                View
            </a> */}

            <button
                onClick={() => disconnect()}
                className="px-3 py-1 bg-gray-700 text-white rounded"
            >
                Disconnect
            </button>
        </div>
    );
}
