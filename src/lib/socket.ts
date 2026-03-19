"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    // In production, Socket.io goes through Nginx at the same origin
    // In development, connect directly to port 3001
    const url =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      (typeof window !== "undefined" && window.location.hostname !== "localhost"
        ? window.location.origin
        : "http://localhost:3001");

    socket = io(url, {
      autoConnect: true,
    });
  }
  return socket;
}
