import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

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
    category: v.category,
    filePath: v.filePath,
    createdAt: v.createdAt.toISOString(),
    author: { name: v.author.name },
    _count: v._count,
  }));

  return <HomeClient initialVideos={serializedVideos} />;
}
