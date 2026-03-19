import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "无权限" }, { status: 403 });

  const videos = await prisma.video.findMany({
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(videos);
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "无权限" }, { status: 403 });

  const { id, title, visible } = await request.json();
  if (!id) return NextResponse.json({ error: "缺少ID" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (visible !== undefined) data.visible = visible;

  const video = await prisma.video.update({ where: { id }, data });
  return NextResponse.json(video);
}
