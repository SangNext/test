import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { postId } = await request.json();
  if (!postId) return NextResponse.json({ error: "缺少 postId" }, { status: 400 });

  const existing = await prisma.postFavorite.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  });

  if (existing) {
    await prisma.postFavorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.postFavorite.create({ data: { userId: session.user.id, postId } });
  }

  const count = await prisma.postFavorite.count({ where: { postId } });
  return NextResponse.json({ favorited: !existing, count });
}

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "缺少 postId" }, { status: 400 });

  const session = await auth();
  const count = await prisma.postFavorite.count({ where: { postId } });
  let favorited = false;
  if (session?.user?.id) {
    favorited = !!(await prisma.postFavorite.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    }));
  }
  return NextResponse.json({ favorited, count });
}
