import { io, type Socket } from "socket.io-client";
import { getApiBaseUrl } from "@/lib/petconnect-api";

function chatSocketUrl(): string {
  return `${getApiBaseUrl()}/chat`;
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
