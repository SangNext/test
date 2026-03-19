"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
}

export default function ReplyList({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReplies = async () => {
    const res = await fetch(`/api/replies?postId=${postId}`);
    if (res.ok) setReplies(await res.json());
  };

  useEffect(() => { fetchReplies(); }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;
    setLoading(true);
    const res = await fetch("/api/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim(), postId }),
    });
    if (res.ok) { setContent(""); fetchReplies(); }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
        </svg>
        回复 ({replies.length})
      </h2>

      {session?.user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{session.user.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 flex gap-2">
            <input type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="写下你的回复..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition" />
            <button type="submit" disabled={loading || !content.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all duration-200">
              {loading ? "..." : "回复"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5 mb-6">
          <p className="text-sm text-gray-500">
            <Link href="/login" className="text-indigo-400 font-medium hover:underline">登录</Link>{" "}后参与回复
          </p>
        </div>
      )}

      <div className="space-y-4">
        {replies.map((r) => (
          <div key={r.id} className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{r.author.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 bg-white/5 rounded-2xl rounded-tl-md px-4 py-3 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-200">{r.author.name}</span>
                <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString("zh-CN")}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{r.content}</p>
            </div>
          </div>
        ))}
        {replies.length === 0 && (
          <p className="text-gray-500 text-center py-8 text-sm">暂无回复，来发表第一条吧</p>
        )}
      </div>
    </div>
  );
}
