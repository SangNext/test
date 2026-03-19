import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PostImageLayout from "@/components/PostImageLayout";

export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { name: true } },
      _count: { select: { replies: true, likes: true, favorites: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">讨论区</h1>
          <p className="text-gray-400 mt-1">畅所欲言，交流分享</p>
        </div>
        <Link href="/forum/new"
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          发帖
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <p className="text-gray-300 text-lg font-medium">还没有帖子</p>
          <p className="text-gray-500 text-sm mt-1">来发表第一个话题吧</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const images: string[] = post.images ? JSON.parse(post.images) : [];
            const hasImages = images.length > 0;

            return (
              <Link key={post.id} href={`/forum/${post.id}`} className="block group">
                <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-200">
                  {/* Author row */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{post.author.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{post.author.name}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-500">
                      {formatTime(post.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-gray-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Content preview (show when 3+ images or no images) */}
                  {(images.length >= 3 || !hasImages) && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{post.content}</p>
                  )}

                  {/* Images */}
                  <PostImageLayout images={images} />

                  {/* Stats bar */}
                  <div className="flex items-center gap-5 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      {post._count.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      {post._count.favorites}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                      </svg>
                      {post._count.replies}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return date.toLocaleDateString("zh-CN");
}
