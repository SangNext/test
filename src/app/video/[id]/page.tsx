import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import CommentList from "@/components/CommentList";
import LikeButton from "@/components/LikeButton";
import FavoriteButton from "@/components/FavoriteButton";
import Link from "next/link";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!video) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回首页
      </Link>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/50">
        <VideoPlayer src={video.filePath} title={video.title} />

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {video.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{video.author.name}</p>
                <p className="text-xs text-gray-400">
                  {video.createdAt.toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LikeButton videoId={video.id} />
              <FavoriteButton videoId={video.id} />
            </div>
          </div>

          {video.description && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-700 text-sm leading-relaxed">{video.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 mt-6 p-6">
        <CommentList videoId={video.id} />
      </div>
    </div>
  );
}
