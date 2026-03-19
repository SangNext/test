import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import CommentList from "@/components/CommentList";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const video = await prisma.video.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });

  if (!video) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <VideoPlayer src={video.filePath} title={video.title} />

      <div className="mt-4">
        <h1 className="text-xl font-bold text-gray-900">{video.title}</h1>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <span>{video.author.name}</span>
          <span>{video.createdAt.toLocaleDateString("zh-CN")}</span>
        </div>
        {video.description && (
          <p className="mt-3 text-gray-700">{video.description}</p>
        )}
      </div>

      <CommentList videoId={video.id} />
    </div>
  );
}
