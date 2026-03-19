"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <>
      {/* Top bar: Logo + User info */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              慧娴雅叙
            </span>
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-200 text-sm font-medium hidden sm:inline">{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
                title="登出"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-gray-300 text-sm font-medium hover:text-white transition px-3 py-2">
                登录
              </Link>
              <Link href="/register"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200">
                注册
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom tab bar: fixed on mobile, inline on desktop */}
      <BottomTabBar pathname={pathname} isLoggedIn={!!session?.user} />
    </>
  );
}

function BottomTabBar({ pathname, isLoggedIn }: { pathname: string; isLoggedIn: boolean }) {
  const tabs = [
    {
      href: "/",
      label: "首页",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      match: (p: string) => p === "/",
    },
    {
      href: "/forum",
      label: "讨论",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      match: (p: string) => p.startsWith("/forum"),
    },
    {
      href: isLoggedIn ? "/upload" : "/login",
      label: "上传",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      match: (p: string) => p === "/upload",
      highlight: true,
    },
    {
      href: isLoggedIn ? "/chat" : "/login",
      label: "聊天",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      ),
      match: (p: string) => p === "/chat",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:sticky sm:top-[57px] bg-black/40 backdrop-blur-xl border-t sm:border-t-0 sm:border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-around sm:justify-center sm:gap-2 px-2 py-1 sm:py-1.5">
        {tabs.map((tab) => {
          const isActive = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-w-[60px] sm:min-w-0 ${
                tab.highlight && !isActive
                  ? "text-indigo-300"
                  : isActive
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <span className={tab.highlight && !isActive ? "bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-full text-white" : ""}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
