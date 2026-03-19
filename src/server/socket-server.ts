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

io.on("connection", (socket) => {
  console.log("客户端已连接:", socket.id);

  socket.on("new-video", (video) => {
    socket.broadcast.emit("new-video", video);
  });

  socket.on("disconnect", () => {
    console.log("客户端已断开:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io 服务器已启动，端口: ${PORT}`);
});
