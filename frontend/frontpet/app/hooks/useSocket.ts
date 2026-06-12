import { useEffect, useCallback, useState, useRef } from "react";
import { socket } from "../socket/socket";

export function useSocket(
  userId: string | null,
  onMessage: (msg: any) => void,
  onTyping: (data: { senderId: string; isTyping: boolean }) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (!userId) return;

    socket.auth = { userId };

    const onConnect = () => {
      console.log("Socket connected:", socket.connected);
      setIsConnected(true);
      isConnectedRef.current = true;
      socket.emit("joinRoom", userId);
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      isConnectedRef.current = false;
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.connect();

    socket.on("newMessage", onMessage);
    socket.on("typing", onTyping);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("newMessage", onMessage);
      socket.off("typing", onTyping);
      socket.disconnect();
      setIsConnected(false);
      isConnectedRef.current = false;
    };
  }, [userId, onMessage, onTyping]);

  // Queue typing emits if socket is not connected yet
  const emitTyping = useCallback(
    (receiverId: string, isTyping: boolean) => {
      if (!isConnectedRef.current) {
        console.log("Socket not connected yet, delaying emitTyping...");
        // Wait for connection then emit
        const handleConnect = () => {
          socket.emit("typing", { senderId: userId, receiverId, isTyping });
          socket.off("connect", handleConnect);
        };
        socket.on("connect", handleConnect);
        return;
      }
      console.log("EMITTING TYPING:", { receiverId, isTyping });
      socket.emit("typing", { senderId: userId, receiverId, isTyping });
    },
    [userId]
  );

  return { emitTyping };
}
