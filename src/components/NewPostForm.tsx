"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NewPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 9 - images.length);
    const updated = [...images, ...newFiles];
    setImages(updated);
    setPreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setPreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || loading) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    images.forEach((img) => formData.append("images", img));

    const res = await fetch("/api/posts", { method: "POST", body: formData });
    if (res.ok) {
      const post = await res.json();
      router.push(`/forum/${post.id}`);
    } else {
      const data = await res.json();
      setError(data.error || "发帖失败");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">标题 *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="帖子标题"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">内容 *</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="写下你的想法..." rows={6}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition resize-none" required />
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">图片（最多9张）</label>
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {images.length < 9 && (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500/30 hover:text-indigo-400 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-xs mt-1">添加</span>
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => handleImages(e.target.files)} className="hidden" />
      </div>

      {error && <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl border border-red-500/20">{error}</div>}
      <button type="submit" disabled={loading || !title.trim() || !content.trim()}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all duration-200 text-lg">
        {loading ? "发布中..." : "发布帖子"}
      </button>
    </form>
  );
}
