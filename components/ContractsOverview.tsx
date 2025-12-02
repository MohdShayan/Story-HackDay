"use client";
import React from "react";

export default function ContractsOverview() {
    return (
        <section className="mx-auto max-w-5xl px-6 pb-16">
            <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">How It Works Behind the Scenes</h2>
                <p className="text-sm text-gray-700 mb-6">
                    Your designs are secured on the blockchain using smart contracts that handle ownership, licensing, and payments. Here's what each part does in simple terms.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* RemixHub Card */}
                    <div className="rounded-xl border border-black/10 bg-white/70 p-5 hover:bg-white transition">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">⚙️</span>
                            <h3 className="text-base font-semibold text-gray-900">RemixHub</h3>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                            The marketplace manager. It keeps track of original designs, allows others to buy remix licenses, and connects remixes back to originals.
                        </p>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">✓</span>
                                <span><strong>Register Originals:</strong> Your design gets permanently recorded on-chain with its unique ID</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">✓</span>
                                <span><strong>Sell Remix Licenses:</strong> Others pay ETH to remix your design. Money is split between you and the platform</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">✓</span>
                                <span><strong>Track Derivatives:</strong> Every remix is linked back to the original, creating a chain of credit</span>
                            </div>
                        </div>
                    </div>

                    {/* RoyaltySplitter Card */}
                    <div className="rounded-xl border border-black/10 bg-white/70 p-5 hover:bg-white transition">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">💰</span>
                            <h3 className="text-base font-semibold text-gray-900">Royalty Splitter</h3>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                            The payment distributor. When someone buys a license for a remix, this contract automatically splits the payment fairly among everyone who contributed.
                        </p>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-start gap-2">
                                <span className="text-purple-600 font-bold">✓</span>
                                <span><strong>Automatic Payouts:</strong> Each remix gets its own splitter that remembers who deserves what percentage</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-purple-600 font-bold">✓</span>
                                <span><strong>Multi-way Split:</strong> Original creator, remixer, and platform each get their fair share instantly</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-purple-600 font-bold">✓</span>
                                <span><strong>Handles Payments:</strong> Works with ETH and other tokens, splitting them automatically per agreed percentages</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Story Protocol Card */}
                <div className="mt-6 rounded-xl border border-black/10 bg-white/70 p-5 hover:bg-white transition">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">📚</span>
                        <h3 className="text-base font-semibold text-gray-900">Story Protocol (Global Registry)</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        The official record keeper. Story Protocol is a blockchain standard that records your designs and their relationships permanently and transparently.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="text-pink-600 font-bold">✓</span>
                            <span><strong>Stores Designs:</strong> Your metadata lives on IPFS (decentralized storage) with a permanent record on-chain</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-pink-600 font-bold">✓</span>
                            <span><strong>Creates Lineage:</strong> Shows who created the original, who made each remix, and how they're connected</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-pink-600 font-bold">✓</span>
                            <span><strong>Universal ID:</strong> Your design gets a unique 40-character identifier that works across any platform using Story Protocol</span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>In short:</strong> Your design is registered globally on Story Protocol, RemixHub manages who can remix it and tracks remixes, and the Royalty Splitter automatically pays everyone their fair share whenever a remix is used commercially.
                    </p>
                </div>
            </div>
        </section>
    );
}
