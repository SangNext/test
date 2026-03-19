import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { postId } = await request.json();
  if (!postId) return NextResponse.json({ error: "缺少 postId" }, { status: 400 });

  const existing = await prisma.postLike.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.postLike.create({ data: { userId: session.user.id, postId } });
  }

  const count = await prisma.postLike.count({ where: { postId } });
  return NextResponse.json({ liked: !existing, count });
}

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "缺少 postId" }, { status: 400 });

  const session = await auth();
  const count = await prisma.postLike.count({ where: { postId } });
  let liked = false;
  if (session?.user?.id) {
    liked = !!(await prisma.postLike.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    }));
  }
  return NextResponse.json({ liked, count });
}
