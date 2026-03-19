"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function PostActions({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    fetch(`/api/post-likes?postId=${postId}`).then((r) => r.json()).then((d) => { setLiked(d.liked); setLikeCount(d.count); });
    fetch(`/api/post-favorites?postId=${postId}`).then((r) => r.json()).then((d) => { setFavorited(d.favorited); setFavCount(d.count); });
  }, [postId]);

  const toggleLike = async () => {
    if (!session?.user) return;
    const res = await fetch("/api/post-likes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId }) });
    if (res.ok) { const d = await res.json(); setLiked(d.liked); setLikeCount(d.count); }
  };

  const toggleFav = async () => {
    if (!session?.user) return;
    const res = await fetch("/api/post-favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId }) });
    if (res.ok) { const d = await res.json(); setFavorited(d.favorited); setFavCount(d.count); }
  };

  return (
    <div className="flex items-center gap-2 mt-5">
      <button onClick={toggleLike} disabled={!session?.user}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
          liked ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
        } ${!session?.user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
        <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        {likeCount > 0 && <span>{likeCount}</span>}
      </button>
      <button onClick={toggleFav} disabled={!session?.user}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
          favorited ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
        } ${!session?.user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
        <svg className="w-5 h-5" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        {favCount > 0 && <span>{favCount}</span>}
      </button>
    </div>
  );
}
