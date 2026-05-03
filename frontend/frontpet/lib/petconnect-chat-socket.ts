import { io, type Socket } from "socket.io-client";

function chatSocketUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5003";
  return `${base}/chat`;
}

let socket: Socket | null = null;
let boundToken: string | null = null;

export function getPetConnectChatSocket(token: string): Socket {
  if (!token) {
    throw new Error("getPetConnectChatSocket: token required");
  }
  if (socket && boundToken !== token) {
    socket.disconnect();
    socket = null;
    boundToken = null;
  }
  boundToken = token;
  if (!socket) {
    socket = io(chatSocketUrl(), {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 8,
      reconnectionDelay: 1200,
    });
  }
  return socket;
}

export function disconnectPetConnectChatSocket() {
  socket?.disconnect();
  socket = null;
  boundToken = null;
}
