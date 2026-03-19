import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "无权限" }, { status: 403 });

  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true, isAdmin: true, createdAt: true,
      _count: { select: { videos: true, posts: true, comments: true, replies: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "无权限" }, { status: 403 });

  const { id, name, password, isAdmin } = await request.json();
  if (!id) return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (isAdmin !== undefined) data.isAdmin = isAdmin;
  if (password) data.password = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, isAdmin: true, createdAt: true },
  });

  return NextResponse.json(user);
}
