"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

type Tab = "users" | "videos" | "posts";

interface UserItem {
  id: string; name: string; email: string; isAdmin: boolean; createdAt: string;
  _count: { videos: number; posts: number; comments: number; replies: number };
}
interface VideoItem {
  id: string; title: string; visible: boolean; filePath: string; createdAt: string;
  author: { name: string }; _count: { likes: number; comments: number };
}
interface PostItem {
  id: string; title: string; content: string; visible: boolean; createdAt: string;
  author: { name: string }; _count: { likes: number; favorites: number; replies: number };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; password: string } | null>(null);
  const [editingVideo, setEditingVideo] = useState<{ id: string; title: string } | null>(null);
  const [editingPost, setEditingPost] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const loadData = useCallback(async (t: Tab) => {
    const res = await fetch(`/api/admin/${t}`);
    if (res.status === 403) { router.push("/"); return; }
    if (!res.ok) return;
    const data = await res.json();
    if (t === "users") setUsers(data);
    if (t === "videos") setVideos(data);
    if (t === "posts") setPosts(data);
  }, [router]);

  useEffect(() => { if (status === "authenticated") loadData(tab); }, [tab, status, loadData]);

  if (status === "loading") return <Loading />;
  if (!session?.user) return null;

  const updateUser = async () => {
    if (!editingUser) return;
    const body: Record<string, unknown> = { id: editingUser.id, name: editingUser.name };
    if (editingUser.password) body.password = editingUser.password;
    await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setEditingUser(null);
    loadData("users");
  };

  const toggleAdmin = async (id: string, current: boolean) => {
    await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isAdmin: !current }) });
    loadData("users");
  };

  const toggleVideoVisible = async (id: string, current: boolean) => {
    await fetch("/api/admin/videos", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, visible: !current }) });
    loadData("videos");
  };

  const updateVideoTitle = async () => {
    if (!editingVideo) return;
    await fetch("/api/admin/videos", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingVideo.id, title: editingVideo.title }) });
    setEditingVideo(null);
    loadData("videos");
  };

  const togglePostVisible = async (id: string, current: boolean) => {
    await fetch("/api/admin/posts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, visible: !current }) });
    loadData("posts");
  };

  const updatePostTitle = async () => {
    if (!editingPost) return;
    await fetch("/api/admin/posts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingPost.id, title: editingPost.title }) });
    setEditingPost(null);
    loadData("posts");
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "users", label: "用户管理", icon: "👥" },
    { key: "videos", label: "视频管理", icon: "🎬" },
    { key: "posts", label: "帖子管理", icon: "📝" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">管理后台</h1>
      <p className="text-gray-400 mb-6">管理用户、视频和帖子内容</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              tab === t.key ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="bg-white/8 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              {editingUser?.id === u.id ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50" placeholder="昵称" />
                    <input value={editingUser.password} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50" placeholder="新密码（留空不改）" type="password" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={updateUser} className="px-4 py-1.5 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition">保存</button>
                    <button onClick={() => setEditingUser(null)} className="px-4 py-1.5 bg-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/20 transition">取消</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{u.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-200 font-medium">{u.name}</span>
                        {u.isAdmin && <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">管理员</span>}
                      </div>
                      <span className="text-xs text-gray-500">{u.email}</span>
                      <div className="flex gap-3 text-xs text-gray-600 mt-1">
                        <span>{u._count.videos} 视频</span>
                        <span>{u._count.posts} 帖子</span>
                        <span>{u._count.comments + u._count.replies} 评论</span>
                        <span>{new Date(u.createdAt).toLocaleDateString("zh-CN")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingUser({ id: u.id, name: u.name, password: "" })}
                      className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-lg text-xs hover:bg-white/10 transition border border-white/10">编辑</button>
                    <button onClick={() => toggleAdmin(u.id, u.isAdmin)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition border ${
                        u.isAdmin ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                      }`}>
                      {u.isAdmin ? "取消管理员" : "设为管理员"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {users.length === 0 && <p className="text-gray-500 text-center py-12">暂无用户</p>}
        </div>
      )}

      {/* Videos Tab */}
      {tab === "videos" && (
        <div className="space-y-3">
          {videos.map((v) => (
            <div key={v.id} className={`bg-white/8 backdrop-blur-sm rounded-2xl p-4 border transition ${v.visible ? "border-white/10" : "border-red-500/20 opacity-60"}`}>
              {editingVideo?.id === v.id ? (
                <div className="flex gap-2">
                  <input value={editingVideo.title} onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50" />
                  <button onClick={updateVideoTitle} className="px-4 py-1.5 bg-indigo-500 text-white rounded-lg text-sm">保存</button>
                  <button onClick={() => setEditingVideo(null)} className="px-4 py-1.5 bg-white/10 text-gray-300 rounded-lg text-sm">取消</button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-200 font-medium">{v.title}</span>
                      {!v.visible && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">已隐藏</span>}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                      <span>作者: {v.author.name}</span>
                      <span>❤️ {v._count.likes}</span>
                      <span>💬 {v._count.comments}</span>
                      <span>{new Date(v.createdAt).toLocaleDateString("zh-CN")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingVideo({ id: v.id, title: v.title })}
                      className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-lg text-xs hover:bg-white/10 transition border border-white/10">改名</button>
                    <button onClick={() => toggleVideoVisible(v.id, v.visible)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition border ${
                        v.visible ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"
                      }`}>
                      {v.visible ? "显示中" : "已隐藏"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {videos.length === 0 && <p className="text-gray-500 text-center py-12">暂无视频</p>}
        </div>
      )}

      {/* Posts Tab */}
      {tab === "posts" && (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className={`bg-white/8 backdrop-blur-sm rounded-2xl p-4 border transition ${p.visible ? "border-white/10" : "border-red-500/20 opacity-60"}`}>
              {editingPost?.id === p.id ? (
                <div className="flex gap-2">
                  <input value={editingPost.title} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50" />
                  <button onClick={updatePostTitle} className="px-4 py-1.5 bg-indigo-500 text-white rounded-lg text-sm">保存</button>
                  <button onClick={() => setEditingPost(null)} className="px-4 py-1.5 bg-white/10 text-gray-300 rounded-lg text-sm">取消</button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-200 font-medium">{p.title}</span>
                      {!p.visible && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">已隐藏</span>}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                      <span>作者: {p.author.name}</span>
                      <span>❤️ {p._count.likes}</span>
                      <span>⭐ {p._count.favorites}</span>
                      <span>💬 {p._count.replies}</span>
                      <span>{new Date(p.createdAt).toLocaleDateString("zh-CN")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingPost({ id: p.id, title: p.title })}
                      className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-lg text-xs hover:bg-white/10 transition border border-white/10">改名</button>
                    <button onClick={() => togglePostVisible(p.id, p.visible)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition border ${
                        p.visible ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"
                      }`}>
                      {p.visible ? "显示中" : "已隐藏"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {posts.length === 0 && <p className="text-gray-500 text-center py-12">暂无帖子</p>}
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
