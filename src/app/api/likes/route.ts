import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { videoId } = await request.json();
  if (!videoId) {
    return NextResponse.json({ error: "缺少 videoId" }, { status: 400 });
  }

  const existing = await prisma.like.findUnique({
    where: { userId_videoId: { userId: session.user.id, videoId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    const count = await prisma.like.count({ where: { videoId } });
    return NextResponse.json({ liked: false, count });
  } else {
    await prisma.like.create({
      data: { userId: session.user.id, videoId },
    });
    const count = await prisma.like.count({ where: { videoId } });
    return NextResponse.json({ liked: true, count });
  }
}

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json({ error: "缺少 videoId" }, { status: 400 });
  }

  const session = await auth();
  const count = await prisma.like.count({ where: { videoId } });

  let liked = false;
  if (session?.user?.id) {
    const existing = await prisma.like.findUnique({
      where: { userId_videoId: { userId: session.user.id, videoId } },
    });
    liked = !!existing;
  }

  return NextResponse.json({ liked, count });
}
