"use client";

import Link from "next/link";

interface VideoCardProps {
  id: string;
  title: string;
  authorName: string;
  filePath: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

export default function VideoCard({
  id,
  title,
  authorName,
  filePath,
  createdAt,
  likeCount,
  commentCount,
}: VideoCardProps) {
  return (
    <Link href={`/video/${id}`} className="group block">
      <div className="bg-white/8 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-video bg-black/40 relative overflow-hidden">
          <video
            src={filePath}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            muted
            preload="metadata"
            onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
            onMouseOut={(e) => {
              const v = e.target as HTMLVideoElement;
              v.pause();
              v.currentTime = 0;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              点击播放
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-100 line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {title}
          </h3>
          <div className="flex items-center mt-3">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">
                {authorName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-400 font-medium">{authorName}</span>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {likeCount}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
                {commentCount}
              </span>
            </div>
            <span>{new Date(createdAt).toLocaleDateString("zh-CN")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
