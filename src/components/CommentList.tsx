"use client";

import { useEffect, useState } from "react";
import CommentInput from "./CommentInput";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
}

export default function CommentList({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?videoId=${videoId}`);
    if (res.ok) setComments(await res.json());
  };

  useEffect(() => { fetchComments(); }, [videoId]);

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
        </svg>
        评论 ({comments.length})
      </h2>
      <CommentInput videoId={videoId} onCommented={fetchComments} />
      <div className="mt-5 space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{c.author.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 bg-white/5 rounded-2xl rounded-tl-md px-4 py-3 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-200">{c.author.name}</span>
                <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString("zh-CN")}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8 text-sm">暂无评论，来发表第一条吧</p>
        )}
      </div>
    </div>
  );
}
