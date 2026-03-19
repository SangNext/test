import { createServer } from "http";
import { Server } from "socket.io";

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const PORT = parseInt(process.env.SOCKET_PORT || "3001", 10);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Track online users
const onlineUsers = new Map<string, { name: string; socketId: string }>();

// Store recent chat messages in memory (last 100)
const chatHistory: Array<{
  id: string;
  userName: string;
  content: string;
  timestamp: string;
}> = [];
const MAX_HISTORY = 100;

io.on("connection", (socket) => {
  console.log("客户端已连接:", socket.id);

  // Video events
  socket.on("new-video", (video) => {
    socket.broadcast.emit("new-video", video);
  });

  // Chat: user joins
  socket.on("chat:join", (user: { id: string; name: string }) => {
    onlineUsers.set(socket.id, { name: user.name, socketId: socket.id });
    // Send chat history to the new user
    socket.emit("chat:history", chatHistory);
    // Broadcast online count
    io.emit("chat:online", onlineUsers.size);
    // Broadcast join message
    io.emit("chat:system", { content: `${user.name} 加入了聊天`, timestamp: new Date().toISOString() });
  });

  // Chat: send message
  socket.on("chat:message", (data: { content: string }) => {
    const user = onlineUsers.get(socket.id);
    if (!user || !data.content?.trim()) return;

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userName: user.name,
      content: data.content.trim(),
      timestamp: new Date().toISOString(),
    };

    chatHistory.push(message);
    if (chatHistory.length > MAX_HISTORY) chatHistory.shift();

    io.emit("chat:message", message);
  });

  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      io.emit("chat:online", onlineUsers.size);
      io.emit("chat:system", { content: `${user.name} 离开了聊天`, timestamp: new Date().toISOString() });
    }
    console.log("客户端已断开:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io 服务器已启动，端口: ${PORT}`);
});
