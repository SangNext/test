"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CommentInputProps {
  videoId: string;
  onCommented: () => void;
}

export default function CommentInput({ videoId, onCommented }: CommentInputProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session?.user) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500">
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">
            登录
          </Link>
          {" "}后发表评论
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim(), videoId }),
    });

    if (res.ok) {
      setContent("");
      onCommented();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">
          {session.user.name?.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的评论..."
          className="flex-1 bg-gray-50 border-0 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all duration-200"
        >
          {loading ? "..." : "发送"}
        </button>
      </div>
    </form>
  );
}
