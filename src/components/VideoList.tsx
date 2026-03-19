"use client";

import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { getSocket } from "@/lib/socket";

interface Video {
  id: string;
  title: string;
  filePath: string;
  createdAt: string;
  author: { name: string };
}

export default function VideoList({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);

  useEffect(() => {
    const socket = getSocket();

    socket.on("new-video", (video: Video) => {
      setVideos((prev) => [video, ...prev]);
    });

    return () => {
      socket.off("new-video");
    };
  }, []);

  if (videos.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">还没有视频</p>
        <p className="text-sm mt-2">登录后上传第一个视频吧</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          title={video.title}
          authorName={video.author.name}
          filePath={video.filePath}
          createdAt={video.createdAt}
        />
      ))}
    </div>
  );
}
