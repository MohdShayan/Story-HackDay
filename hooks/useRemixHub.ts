import { useState } from "react";
import { remixHubAbi } from "@/lib/remixHubAbi";
import { BrowserProvider, Contract } from "ethers";

export function useRemixHub() {
  const contractAddress = process.env.NEXT_PUBLIC_REMIX_HUB_ADDRESS!;

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

      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, remixHubAbi as any, signer);

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
