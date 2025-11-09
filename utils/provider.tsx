"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
import { storyAeneid } from "@/lib/storychain";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [storyAeneid],
  connectors: [
    injected({
      target: "metaMask", // Force MetaMask only
    }),
  ],
  transports: {
    [storyAeneid.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL || "https://aeneid.storyrpc.io"
    ),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
