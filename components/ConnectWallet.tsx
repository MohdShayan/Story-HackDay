"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

export default function ConnectWallet() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try to find an Ethereum linked account on the Privy user object
  const ethAccount = user?.linkedAccounts?.find((a: any) => a.type === "ethereum");
  const address = (ethAccount as any)?.address as string | undefined;

  useEffect(() => {
    // optionally: react to ready/authenticated changes
  }, [ready, authenticated]);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      await login?.();
    } catch (e: any) {
      console.error("Privy login failed", e);
      setError(e?.message ?? String(e) ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setError(null);
    try {
      await logout?.();
    } catch (e: any) {
      console.error("Privy logout failed", e);
      setError(e?.message ?? String(e) ?? "Logout failed");
    }
  }

  if (!authenticated) {
    return (
      <div>
        <button onClick={handleLogin} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Connecting..." : "Sign in with Privy"}
        </button>
        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col">
        <span className="font-mono text-sm">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
        </span>
        <div className="text-xs text-gray-300">Provider: Privy</div>
      </div>

      <div>
        <button onClick={handleLogout} className="px-3 py-1 bg-gray-700 text-white rounded">
          Disconnect
        </button>
        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </div>
    </div>
  );
}
