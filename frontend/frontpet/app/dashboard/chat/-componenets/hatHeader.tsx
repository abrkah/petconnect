"use client";

import Image from "next/image";
import { FiMenu, FiPhoneCall } from "react-icons/fi";
import { useMessageStore } from "@/app/utils/uistate/fetures/message"; 

interface User {
  id: string;
  name: string;
  user_image: string | null;
}

interface ChatHeaderProps {
  selectedUser: User | null;
}

const ChatHeader = ({ selectedUser }: ChatHeaderProps) => {
  if (!selectedUser) return null;

  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Image
          src={selectedUser.user_image || "/trainer.jfif"}
          alt="Avatar"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
          <span className="text-xs text-green-500">Online</span>
        </div>
      </div>
      <div className="flex space-x-3 text-gray-500">
        <FiPhoneCall className="cursor-pointer" />
        {/* <FiMenu className="cursor-pointer" /> */}
      </div>
    </div>
  );
};

export default ChatHeader;
