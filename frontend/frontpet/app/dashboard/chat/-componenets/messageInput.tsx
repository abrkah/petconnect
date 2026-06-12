"use client";

import { useState, useRef } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSend, onTyping, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
    if (onTyping) {
      console.log("TYPING ENDED (on send)"); // ✅ Debug typing ended after sending message
      onTyping(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (onTyping) {
      console.log("TYPING STARTED"); // ✅ Debug typing started on input change
      onTyping(true);

      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        console.log("TYPING ENDED (timeout)"); // ✅ Debug typing ended after timeout
        onTyping(false);
      }, 1000); // stop typing after 1s idle
    }
  };

  return (
    <div className="p-4 border-t flex items-center space-x-2 mt-2">
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
