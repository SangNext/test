"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function LikeButton({ videoId }: { videoId: string }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/likes?videoId=${videoId}`)
      .then((r) => r.json())
      .then((data) => { setLiked(data.liked); setCount(data.count); });
  }, [videoId]);

  const handleClick = async () => {
    if (!session?.user || loading) return;
    setLoading(true);
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
    });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!session?.user}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
        liked
          ? "bg-red-500/20 text-red-400 border-red-500/30"
          : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
      } ${!session?.user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
