import { useState } from "react";
import { remixHubAbi } from "@/lib/remixHubAbi";
import { BrowserProvider, Contract } from "ethers";

export function useRemixHub() {
  const contractAddress = process.env.NEXT_PUBLIC_REMIX_HUB_ADDRESS;

  const [txHash, setTxHash] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [txReceipt, setTxReceipt] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);

  async function registerOriginal(ipId: bigint, cidHash: `0x${string}`, presetId = 1) {
    try {
      setError(null);
      setIsPending(true);

      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("No Ethereum provider found");
      }

      if (!contractAddress) {
        throw new Error("Missing NEXT_PUBLIC_REMIX_HUB_ADDRESS env");
      }

      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      // Ensure we're on Story Aeneid (chainId 1315 -> 0x523)
      try {
        const current = await (window as any).ethereum.request({ method: "eth_chainId" });
        if (current?.toLowerCase() !== "0x523") {
          try {
            await (window as any).ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x523" }],
            });
          } catch (switchErr: any) {
            // Attempt to add chain if not present
            if (switchErr?.code === 4902) {
              await (window as any).ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x523",
                    chainName: "Story Aeneid Testnet",
                    nativeCurrency: { name: "IP", symbol: "IP", decimals: 18 },
                    rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || "https://aeneid.storyrpc.io"],
                    blockExplorerUrls: ["https://aeneid.storyscan.io"],
                  },
                ],
              });
            } else {
              throw switchErr;
            }
          }
        }
      } catch (netErr) {
        console.warn("Chain check/switch failed", netErr);
      }

      const contract = new Contract(contractAddress as `0x${string}`, remixHubAbi as any, signer);

      // Ensure ipId is passed as a string/BigNumber
      const tx = await contract.registerOriginal(ipId.toString(), cidHash, presetId);
      setTxHash(tx.hash);

      const receipt = await tx.wait();
      setTxReceipt(receipt);
      setIsPending(false);
      return receipt;
    } catch (e) {
      setError(e);
      setIsPending(false);
      throw e;
    }
  }

  return {
    registerOriginal,
    txHash,
    isPending,
    txReceipt,
    error,
  };
}
