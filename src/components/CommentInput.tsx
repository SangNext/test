"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

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
      <p className="text-sm text-gray-400 bg-gray-50 rounded-lg p-3 text-center">
        请先登录后发表评论
      </p>
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
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="写下你的评论..."
        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? "发送中..." : "发送"}
      </button>
    </form>
  );
}
