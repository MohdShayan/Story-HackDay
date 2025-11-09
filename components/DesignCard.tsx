import Link from "next/link";

interface Props {
  cid: string;
  preview: string | null;
  title: string;
  owner: string;
}

export default function DesignCard({ cid, preview, title, owner }: Props) {
  return (
    <Link
      href={`/design/${cid}`}
      className="border rounded-lg p-3 shadow hover:shadow-md transition bg-white"
    >
      <div className="h-48 w-full bg-gray-100 rounded overflow-hidden flex items-center justify-center mb-3">
        {preview ? (
          <img src={preview} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">No preview</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-gray-500">Owner: {owner.slice(0,6)}…{owner.slice(-4)}</p>
      </div>
    </Link>
  );
}
