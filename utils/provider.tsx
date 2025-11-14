"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { aeneid } from "@story-protocol/core-sdk";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        defaultChain: aeneid,
        supportedChains: [aeneid],
      }}
    >
      {children}
    </PrivyProvider>
  );
}