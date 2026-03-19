import { prisma } from "@/lib/prisma";
import VideoList from "@/components/VideoList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const videos = await prisma.video.findMany({
    where: { visible: true },
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedVideos = videos.map((v) => ({
    id: v.id,
    title: v.title,
    filePath: v.filePath,
    createdAt: v.createdAt.toISOString(),
    author: { name: v.author.name },
    _count: v._count,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">发现精彩视频</h1>
        <p className="text-gray-500 text-sm mt-1">浏览最新上传的视频内容</p>
      </div>
      <VideoList initialVideos={serializedVideos} />
    </div>
  );
}
