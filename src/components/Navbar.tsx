"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdmin = (session?.user as { isAdmin?: boolean } | undefined)?.isAdmin;

  return (
    <>
      {/* Top bar */}
      <nav className="bg-[#0d0a1f]/80 backdrop-blur-2xl border-b border-white/[0.06] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gradient">慧娴雅叙</span>
          </Link>

          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-[11px] bg-amber-500/15 text-amber-400 px-2 py-1 rounded-lg border border-amber-500/20 hover:bg-amber-500/25 transition font-medium">
                    管理
                  </Link>
                )}
                <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-2.5 py-1.5 border border-white/[0.06]">
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{session.user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium hidden sm:inline max-w-[80px] truncate">{session.user.name}</span>
                  <button onClick={() => signOut()} className="text-gray-500 hover:text-gray-300 p-1 rounded-lg hover:bg-white/[0.06] transition" title="登出">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-gray-400 text-sm font-medium hover:text-white transition px-3 py-1.5">登录</Link>
                <Link href="/register" className="btn-primary !py-2 !px-4 !text-sm !rounded-xl">注册</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:sticky sm:top-14 bg-[#0d0a1f]/90 backdrop-blur-2xl border-t sm:border-t-0 sm:border-b border-white/[0.06] safe-bottom">
        <div className="max-w-6xl mx-auto flex items-center justify-around sm:justify-center sm:gap-1 px-1 py-1 sm:py-1">
          {[
            { href: "/", label: "首页", match: (p: string) => p === "/", icon: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /> },
            { href: "/forum", label: "讨论", match: (p: string) => p.startsWith("/forum"), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /> },
            { href: "/upload", label: "上传", match: (p: string) => p === "/upload", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />, highlight: true },
            { href: "/chat", label: "聊天", match: (p: string) => p === "/chat", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /> },
          ].map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link key={tab.href} href={tab.href}
                className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-4 sm:px-5 py-2 sm:py-1.5 rounded-xl sm:rounded-xl text-[11px] sm:text-sm font-medium transition-all duration-200 ${
                  tab.highlight && !active
                    ? "text-purple-300"
                    : active
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
                }`}>
                <span className={tab.highlight && !active ? "bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg text-white shadow-lg shadow-purple-500/20" : ""}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">{tab.icon}</svg>
                </span>
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
