import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json({ error: "缺少 videoId" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { videoId },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { content, videoId } = await request.json();
  if (!content || !videoId) {
    return NextResponse.json({ error: "评论内容和视频ID不能为空" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      videoId,
      authorId: session.user.id,
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return NextResponse.json(comment);
}
