import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReplyList from "@/components/ReplyList";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回讨论区
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {post.author.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{post.author.name}</p>
            <p className="text-xs text-gray-400">
              {post.createdAt.toLocaleString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 mt-6 p-6">
        <ReplyList postId={post.id} />
      </div>
    </div>
  );
}
