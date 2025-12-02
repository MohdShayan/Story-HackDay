"use client";
import React from "react";

export default function ProcessFlow() {
    const steps = [
        {
            title: "Upload & Pin",
            desc: "Designer uploads Figma URL or .fig file. Metadata JSON + assets are pinned to IPFS.",
        },
        {
            title: "Story Registration",
            desc: "Backend uses Story SDK to register an original IP asset with PIL terms. Returns ipId (0x…).",
        },
        {
            title: "Anchor in RemixHub",
            desc: "Frontend calls registerOriginal(ipId, keccak256(CID), presetId). OriginalRegistered event is emitted.",
        },
        {
            title: "Remix Licensing",
            desc: "Others buy a remix license (buyRemixLicense). Fee splits between platform and the original owner.",
        },
        {
            title: "Derivative + Splitter",
            desc: "Remixer mints derivative on Story; RemixHub registerDerivative deploys a RoyaltySplitter and links parent/child.",
        },
        {
            title: "Commercial License",
            desc: "Buyers purchase commercial license for the child IP. ETH flows through the splitter to all parties.",
        },
    ];
    return (
        <section className="mx-auto max-w-5xl px-6 pb-16">
            <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">End-to-End Flow</h2>
                <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {steps.map((s, i) => (
                        <li key={s.title} className="rounded-xl border border-black/10 bg-white/70 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-7 w-7 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold">
                                    {i + 1}
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
                            </div>
                            <p className="text-sm text-gray-700">{s.desc}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
