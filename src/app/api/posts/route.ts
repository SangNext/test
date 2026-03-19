import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { replies: true, likes: true, favorites: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "标题和内容不能为空" }, { status: 400 });
  }

  // Handle image uploads
  const imagePaths: string[] = [];
  const files = formData.getAll("images") as File[];

  for (const file of files) {
    if (!file.size || !file.type.startsWith("image/")) continue;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    await writeFile(filePath, buffer);
    imagePaths.push(`/uploads/${fileName}`);
  }

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      images: imagePaths.length > 0 ? JSON.stringify(imagePaths) : null,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { replies: true, likes: true, favorites: true } },
    },
  });

  return NextResponse.json(post);
}
