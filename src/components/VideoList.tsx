"use client";

import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { getSocket } from "@/lib/socket";

interface Video {
  id: string;
  title: string;
  category?: string;
  filePath: string;
  createdAt: string;
  author: { name: string };
  _count: { likes: number; comments: number };
}

export default function VideoList({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);

  useEffect(() => {
    const socket = getSocket();
    socket.on("new-video", (video: Video) => {
      setVideos((prev) => [video, ...prev]);
    });
    return () => { socket.off("new-video"); };
  }, []);

  if (videos.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <p className="text-gray-300 text-lg font-medium">还没有视频</p>
        <p className="text-gray-500 text-sm mt-1">登录后上传第一个视频吧</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {videos.map((video) => (
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
  );
}
