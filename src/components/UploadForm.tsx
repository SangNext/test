"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";

export default function UploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File | null) => {
    if (f && f.type.startsWith("video/")) { setFile(f); setError(""); }
    else if (f) setError("请选择视频文件");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file || uploading) return;
    setUploading(true); setError("");
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try { getSocket().emit("new-video", JSON.parse(xhr.responseText)); } catch {}
        router.push("/"); router.refresh();
      } else {
        setError(JSON.parse(xhr.responseText).error || "上传失败"); setUploading(false);
      }
    });
    xhr.addEventListener("error", () => { setError("网络错误，请重试"); setUploading(false); });
    xhr.open("POST", "/api/videos"); xhr.send(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">视频标题 *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="给你的视频起个标题"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">描述</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="介绍一下这个视频（可选）" rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">视频文件 *</label>
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
            dragOver ? "border-indigo-400 bg-indigo-500/10" : file ? "border-green-500/30 bg-green-500/5" : "border-white/10 bg-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0] || null); }}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-200">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            </div>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-gray-400 text-sm">拖拽视频到这里，或点击选择</p>
              <p className="text-gray-600 text-xs mt-1">支持 MP4、WebM、MOV 等格式</p>
            </>
          )}
          <input id="file-input" type="file" accept="video/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} className="hidden" />
        </div>
      </div>
      {error && <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl border border-red-500/20">{error}</div>}
      {uploading && (
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-2"><span>上传中...</span><span>{progress}%</span></div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      <button type="submit" disabled={uploading || !title.trim() || !file}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all duration-200 text-lg">
        {uploading ? `上传中 ${progress}%` : "上传视频"}
      </button>
    </form>
  );
}
