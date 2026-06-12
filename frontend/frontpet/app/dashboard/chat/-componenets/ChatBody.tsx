"use client";

import { useState, useRef } from "react";
import dayjs from "dayjs";

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  content: string;
  sentAt: string;
  sender: User;
  receiver: User;
}

interface ChatAreaProps {
  messages: Message[];
  loggedInUserId: string;
  isTyping: boolean;
  onSend: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
}

const ChatArea = ({
  messages,
  loggedInUserId,
  isTyping,
  onSend,
  onTyping,
  disabled,
}: ChatAreaProps) => {
  const [message, setMessage] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle sending message
  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
    if (onTyping) {
      onTyping(false);
    }
  };

  // Handle typing events with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (onTyping) {
      onTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white border rounded shadow">
      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ overflowX: "hidden" }}
      >
        {messages.map((msg) => {
          const isSender = msg.sender.id === loggedInUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-lg p-2 break-words ${
                  isSender ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {msg.content}
                <div className="text-xs text-gray-300 text-right mt-1">
                  {dayjs(msg.sentAt).format("HH:mm")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Typing indicator centered */}
      {isTyping && (
        <div className="flex justify-center mb-1">
          <div className="bg-gray-100 border border-gray-300 px-4 py-1 rounded-full text-sm text-gray-600 italic shadow-sm animate-pulse">
            Typing...
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="pb-4 border-t flex items-center space-x-2">
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
    </div>
  );
};

export default ChatArea;
