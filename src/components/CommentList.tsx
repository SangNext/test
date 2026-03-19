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
    if (res.ok) {
      setComments(await res.json());
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">评论 ({comments.length})</h2>
      <CommentInput videoId={videoId} onCommented={fetchComments} />
      <div className="mt-4 space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{c.author.name}</span>
              <span className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleString("zh-CN")}
              </span>
            </div>
            <p className="text-gray-800 text-sm">{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-400 text-center py-6">暂无评论，来发表第一条吧</p>
        )}
      </div>
    </div>
  );
}
