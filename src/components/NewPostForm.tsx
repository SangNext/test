"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || loading) return;
    setLoading(true); setError("");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), content: content.trim() }),
    });
    if (res.ok) { const post = await res.json(); router.push(`/forum/${post.id}`); }
    else { const data = await res.json(); setError(data.error || "发帖失败"); setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">标题 *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="帖子标题"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">内容 *</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="写下你的想法..." rows={8}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition resize-none" required />
      </div>
      {error && <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl border border-red-500/20">{error}</div>}
      <button type="submit" disabled={loading || !title.trim() || !content.trim()}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all duration-200 text-lg">
        {loading ? "发布中..." : "发布帖子"}
      </button>
    </form>
  );
}
