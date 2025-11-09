import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { remixHubAbi } from "@/lib/remixHubAbi";

export function useRemixHub() {
  const contractAddress = process.env.NEXT_PUBLIC_REMIX_HUB_ADDRESS!;

  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const txReceipt = useWaitForTransactionReceipt({
    hash: txHash,
  });

  function registerOriginal(ipId: bigint, cidHash: `0x${string}`, presetId = 1) {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: remixHubAbi,
      functionName: "registerOriginal",
      args: [ipId, cidHash, presetId],
    });
  }

  return {
    registerOriginal,
    txHash,
    isPending,
    txReceipt,
    error,
  };
}
