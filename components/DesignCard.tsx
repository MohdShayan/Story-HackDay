import Link from "next/link";
import Image from "next/image";
import imgg from "@/public/ippy.png";
export interface DesignCardProps {
    cid: string;
    preview: string | null;
    title: string;
    owner: string;
    ipId?: string | null;
    transactionHash?: string;
    blockHash?: string | null;
}

export default function DesignCard({ cid, preview, title, owner, ipId, transactionHash, blockHash }: DesignCardProps) {
    const ownerMask = `${owner.slice(0, 6)}…${owner.slice(-4)}`;
    const initials = owner.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || ownerMask.slice(0, 2);
    const ipIdMask = ipId ? `${ipId.slice(0, 10)}…${ipId.slice(-6)}` : null;

    return (
        <div className="group rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <div className="relative h-40 w-full overflow-hidden rounded-lg bg-linear-to-br from-gray-100 to-white flex items-center justify-center mb-3">
                {preview && /^https?:\/\//.test(preview) ? (
                    <img
                        src={preview}
                        alt={title}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                ) : (
                    <Image
                        src={imgg}
                        alt={title}
                        width={320}
                        height={160}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
            </div>

            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                        {title}
                    </p>
                    {ipId && (
                        <div className="mt-1 text-[11px] text-gray-700 flex items-center gap-2">
                            <span className="font-mono">{ipIdMask}</span>
                            <button
                                type="button"
                                className="text-[11px] rounded px-2 py-0.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(ipId);
                                    } catch {
                                        const ta = document.createElement("textarea");
                                        ta.value = ipId;
                                        document.body.appendChild(ta);
                                        ta.select();
                                        try { document.execCommand("copy"); } finally { document.body.removeChild(ta); }
                                    }
                                }}
                                title="Copy IP ID"
                            >Copy</button>
                        </div>
                    )}

                    <div className="mt-1 text-[11px] text-gray-700 flex items-center gap-3">
                        {transactionHash && (
                            <a
                                href={`https://aeneid.storyscan.io/tx/${transactionHash}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="underline"
                            >Tx</a>
                        )}
                        {blockHash && (
                            <a
                                href={`https://aeneid.storyscan.io/block/${blockHash}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="underline"
                            >Block</a>
                        )}
                        <Link href={`/design/${cid}`} className="underline">Open</Link>
                    </div>

                </div>

                <div className="flex items-center gap-3">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white"
                        style={{
                            background: "linear-gradient(135deg, #6366F1 0%, #EC4899 100%)",
                            boxShadow: "0 2px 8px rgba(99,102,241,0.18)",
                        }}
                        title={owner}
                    >
                        {initials}
                    </div>

                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                            {ownerMask}
                        </span>
                        <span className="text-[11px] text-gray-500">Owner</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
