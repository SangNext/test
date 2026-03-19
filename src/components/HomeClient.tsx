"use client";

import { useEffect, useState, useRef } from "react";
import VideoCard from "./VideoCard";
import { getSocket } from "@/lib/socket";

const CATEGORIES = [
  { key: "最新", icon: "🔥" },
  { key: "生活", icon: "🌿" },
  { key: "音乐", icon: "🎵" },
  { key: "游戏", icon: "🎮" },
  { key: "科技", icon: "🚀" },
  { key: "搞笑", icon: "😂" },
  { key: "知识", icon: "📚" },
];

interface Video {
  id: string;
  title: string;
  category: string;
  filePath: string;
  createdAt: string;
  author: { name: string };
  _count: { likes: number; comments: number };
}

export default function HomeClient({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [activeCategory, setActiveCategory] = useState("最新");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.on("new-video", (video: Video) => {
      setVideos((prev) => [video, ...prev]);
    });
    return () => { socket.off("new-video"); };
  }, []);

  const filtered = activeCategory === "最新"
    ? videos
    : videos.filter((v) => v.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 sm:py-8">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">发现精彩视频</h1>
        <p className="text-gray-500 text-sm mt-1">浏览最新上传的视频内容</p>
      </div>

      {/* Category tabs - horizontally scrollable on mobile */}
      <div ref={scrollRef} className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border shrink-0 ${
              activeCategory === cat.key
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                : "bg-white/[0.03] text-gray-400 border-white/[0.06] hover:text-gray-200 hover:bg-white/[0.06]"
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.key}</span>
          </button>
        ))}
      </div>

      {/* Video grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <p className="text-gray-300 font-medium">
            {activeCategory === "最新" ? "还没有视频" : `「${activeCategory}」分类暂无视频`}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {activeCategory === "最新" ? "登录后上传第一个视频吧" : "换个分类看看？"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {filtered.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              authorName={video.author.name}
              filePath={video.filePath}
              createdAt={video.createdAt}
              likeCount={video._count?.likes ?? 0}
              commentCount={video._count?.comments ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
