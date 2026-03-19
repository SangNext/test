"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            VideoHub
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/upload"
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                上传
              </Link>
              <div className="flex items-center gap-2 bg-gray-100 rounded-full pl-3 pr-1 py-1">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 text-sm font-medium">{session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200 transition"
                  title="登出"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 text-sm font-medium hover:text-gray-900 transition px-3 py-2"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
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
