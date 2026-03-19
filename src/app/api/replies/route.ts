import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "缺少 postId" }, { status: 400 });
  }

  const replies = await prisma.reply.findMany({
    where: { postId },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(replies);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { content, postId } = await request.json();
  if (!content?.trim() || !postId) {
    return NextResponse.json({ error: "回复内容不能为空" }, { status: 400 });
  }

  const reply = await prisma.reply.create({
    data: {
      content: content.trim(),
      postId,
      authorId: session.user.id,
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return NextResponse.json(reply);
}
