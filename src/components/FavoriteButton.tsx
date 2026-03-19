"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function FavoriteButton({ videoId }: { videoId: string }) {
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/favorites?videoId=${videoId}`)
      .then((r) => r.json())
      .then((data) => { setFavorited(data.favorited); setCount(data.count); });
  }, [videoId]);

  const handleClick = async () => {
    if (!session?.user || loading) return;
    setLoading(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
    });
    if (res.ok) {
      const data = await res.json();
      setFavorited(data.favorited);
      setCount(data.count);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!session?.user}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
        favorited
          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
          : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
      } ${!session?.user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <svg className="w-5 h-5" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
