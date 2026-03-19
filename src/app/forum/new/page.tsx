"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NewPostForm from "@/components/NewPostForm";

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">发表新帖</h1>
        <p className="text-gray-400 text-sm mt-1">分享你的想法</p>
      </div>
      <div className="bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
        <NewPostForm />
      </div>
    </div>
  );
}
