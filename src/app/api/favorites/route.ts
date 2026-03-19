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

  const existing = await prisma.favorite.findUnique({
    where: { userId_videoId: { userId: session.user.id, videoId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    const count = await prisma.favorite.count({ where: { videoId } });
    return NextResponse.json({ favorited: false, count });
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id, videoId },
    });
    const count = await prisma.favorite.count({ where: { videoId } });
    return NextResponse.json({ favorited: true, count });
  }
}

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json({ error: "缺少 videoId" }, { status: 400 });
  }

  const session = await auth();
  const count = await prisma.favorite.count({ where: { videoId } });

  let favorited = false;
  if (session?.user?.id) {
    const existing = await prisma.favorite.findUnique({
      where: { userId_videoId: { userId: session.user.id, videoId } },
    });
    favorited = !!existing;
  }

  return NextResponse.json({ favorited, count });
}
