"use client";
import Link from "next/link";
import ConnectWallet from "@/components/ConnectWallet";
import ContractsOverview from "@/components/ContractsOverview";
import ProcessFlow from "@/components/ProcessFlow";
import { usePrivy } from "@privy-io/react-auth";
import { Bricolage_Grotesque } from "next/font/google";
const geistSans = Bricolage_Grotesque({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Bricolage_Grotesque({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function Home() {
  const { authenticated: isConnected } = usePrivy();

  return (
    <main className={`relative min-h-screen overflow-hidden gradient-bg text-black ${geistSans.variable} ${geistMono.variable} pt-20`}>


      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-5xl px-6 pt-20 pb-12 text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-sans font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
          Own, remix and monetize your Figma designs
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-700 md:text-lg">
          Publish designs as on-chain IP assets, enable collaborative remixes, and automate revenue sharing.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Start Upload – disabled when not connected */}
          <Link
            href={isConnected ? "/upload" : "#"}
            className={`
              group flex font-sans items-center justify-center rounded-md px-6 py-3 text-sm font-medium text-white
              bg-linear-to-r from-sky-500 to-indigo-500 shadow-lg shadow-indigo-900/20 transition
              hover:from-sky-400 hover:to-indigo-400 active:scale-[.99]
              ${!isConnected ? "pointer-events-none opacity-50" : ""}
            `}
            onClick={(e) => !isConnected && e.preventDefault()}
          >
            Start Upload
            {/* <span className="ml-2 h-px w-5 bg-white/60 transition-all group-hover:w-7" aria-hidden /> */}
          </Link>

          <Link
            href="/explore"
            className="flex items-center font-sans justify-center rounded-md border border-black/10 bg-white/70 px-6 py-3 text-sm font-medium text-gray-900 transition hover:bg-white"
          >
            Explore Designs
          </Link>
        </div>

        {!isConnected && (
          <p className="mt-4 text-xs text-red-600">
            Connect your wallet to upload and register designs.
          </p>
        )}
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto my-8 max-w-5xl border-t border-black/10" />

      {/* ── Feature Grid ── */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "On-chain IP Assets", desc: "Mint canonical records for your UI work, portable across the ecosystem." },
            { title: "Remix Collaboration", desc: "Enable derivatives with attribution to grow shared value across creators." },
            { title: "Programmatic Licensing", desc: "Attach permissive terms and control commercial use via presets." },
            { title: "Revenue Splits", desc: "Automate split distribution for original and remix contributors." },
          ].map((f) => (
            <article
              key={f.title}
              className="rounded-xl bg-white/70 p-5 backdrop-blur-sm transition hover:bg-white border border-black/10"
            >
              <h3 className="mb-2 text-sm font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-700">{f.desc}</p>
            </article>
          ))}
        </div>


      </section>
      <ContractsOverview />
      <ProcessFlow />
    </main>
  );
}