import { prisma } from "@/lib/prisma";
import VideoList from "@/components/VideoList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const videos = await prisma.video.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const serializedVideos = videos.map((v) => ({
    id: v.id,
    title: v.title,
    filePath: v.filePath,
    createdAt: v.createdAt.toISOString(),
    author: { name: v.author.name },
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">最新视频</h1>
      <VideoList initialVideos={serializedVideos} />
    </div>
  );
}
