"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";

interface ChatMessage {
  id: string;
  userName: string;
  content: string;
  timestamp: string;
}

interface SystemMessage {
  content: string;
  timestamp: string;
}

type DisplayMessage =
  | { type: "chat"; data: ChatMessage }
  | { type: "system"; data: SystemMessage };

export default function ChatRoom({ userId, userName }: { userId: string; userName: string }) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("chat:join", { id: userId, name: userName });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("chat:history", (history: ChatMessage[]) => {
      setMessages(history.map((m) => ({ type: "chat" as const, data: m })));
    });

    socket.on("chat:message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, { type: "chat", data: msg }]);
    });

    socket.on("chat:system", (msg: SystemMessage) => {
      setMessages((prev) => [...prev, { type: "system", data: msg }]);
    });

    socket.on("chat:online", (count: number) => {
      setOnlineCount(count);
    });

    // If already connected, join immediately
    if (socket.connected) {
      setConnected(true);
      socket.emit("chat:join", { id: userId, name: userName });
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat:history");
      socket.off("chat:message");
      socket.off("chat:system");
      socket.off("chat:online");
    };
  }, [userId, userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !connected) return;
    getSocket().emit("chat:message", { content: input.trim() });
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8 flex flex-col h-[calc(100vh-130px)] sm:h-[calc(100vh-160px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">实时聊天</h1>
          <p className="text-gray-400 text-sm mt-0.5">和大家一起畅聊</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
          <span className="text-sm text-gray-300">{onlineCount} 人在线</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">还没有消息，说点什么吧</p>
            </div>
          )}

          {messages.map((msg, i) => {
            if (msg.type === "system") {
              return (
                <div key={`sys-${i}`} className="flex justify-center">
                  <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                    {msg.data.content}
                  </span>
                </div>
              );
            }

            const isMe = msg.data.userName === userName;

            return (
              <div key={msg.data.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {msg.data.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && (
                    <span className="text-xs text-gray-500 ml-1 mb-0.5 block">{msg.data.userName}</span>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-md"
                      : "bg-white/10 text-gray-200 rounded-tl-md border border-white/5"
                  }`}>
                    {msg.data.content}
                  </div>
                  <span className={`text-xs text-gray-600 mt-0.5 block ${isMe ? "text-right mr-1" : "ml-1"}`}>
                    {new Date(msg.data.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-3 border-t border-white/10 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={connected ? "输入消息..." : "连接中..."}
            disabled={!connected}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 transition"
          />
          <button
            type="submit"
            disabled={!connected || !input.trim()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
