"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/login");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/20">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gradient">创建账号</h1>
          <p className="text-gray-500 text-sm mt-1">加入慧娴雅叙，分享精彩内容</p>
        </div>

        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">用户名</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="input-dark" placeholder="你的昵称" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">邮箱</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-dark" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">密码</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-dark" placeholder="至少6个字符" required minLength={6} />
            </div>
            {error && <div className="bg-red-500/10 text-red-400 text-sm px-4 py-2.5 rounded-xl border border-red-500/15">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "注册中..." : "注册"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          已有账号？ <Link href="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition">登录</Link>
        </p>
      </div>
    </div>
  );
}
