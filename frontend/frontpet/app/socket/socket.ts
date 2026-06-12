// src/socket/socket.ts
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
  // Optional, specify allowed origin for CORS if needed
  // transports: ['websocket'], // can help with some environments
});
