"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          VideoHub
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link
                href="/upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                上传视频
              </Link>
              <span className="text-gray-600 text-sm">{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="text-gray-500 text-sm hover:text-gray-700 transition"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 text-sm hover:text-gray-900 transition"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
