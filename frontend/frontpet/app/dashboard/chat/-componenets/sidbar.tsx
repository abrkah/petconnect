"use client";

import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Modal } from "antd";
import { FiMenu } from "react-icons/fi";
import { useMessageStore } from "@/app/utils/uistate/fetures/message";

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

interface User {
  id: string;
  name: string;
  user_image: string | null;
  isOnline?: boolean;
  lastSeen?: string;
}

interface Message {
  id: string;
  content: string;
  sentAt: string;
  sender: User;
  receiver: User;
}

interface SidebarProps {
  messagesList: Message[];
  usersList: User[];
  isLoading: boolean;
  error: unknown;
  loggedInUserId: string;
}

const Sidebar = ({
  messagesList,
  usersList,
  isLoading,
  error,
  loggedInUserId,
}: SidebarProps) => {
  const { selectedChatUserId, setSelectedChatUserId } = useMessageStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter messages where loggedInUser is sender or receiver
  const relevantMessages = messagesList.filter(
    (msg) =>
      msg.sender.id === loggedInUserId || msg.receiver.id === loggedInUserId
  );

  // Group messages by the other user id
  const groupedMessages = relevantMessages.reduce((acc, msg) => {
    const otherUser =
      msg.sender.id === loggedInUserId ? msg.receiver : msg.sender;
    if (!acc[otherUser.id]) acc[otherUser.id] = [];
    acc[otherUser.id].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  // Create an array of { user, lastMessage } for rendering
const chatUsers = Object.entries(groupedMessages)
  .map(([userId, messages]) => {
    // Sort messages within this chat by sentAt descending
    const sortedMessages = messages.sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );

    return {
      user:
        sortedMessages[0].sender.id === loggedInUserId
          ? sortedMessages[0].receiver
          : sortedMessages[0].sender,
      lastMessage: sortedMessages[0],
    };
  })
  // Sort all chats by the last message sent (most recent first)
  .sort(
    (a, b) =>
      new Date(b.lastMessage.sentAt).getTime() -
      new Date(a.lastMessage.sentAt).getTime()
  );


  if (error) return <p>Error loading messages.</p>;

  // Filter users for modal search
  const filteredUsers = usersList
    .filter((u) => u.id !== loggedInUserId)
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-1/4 bg-white p-4 border-r overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <FiMenu
          className="cursor-pointer text-xl"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {isLoading && <p>Loading messages...</p>}
      {chatUsers.length === 0 && !isLoading && <p>No messages found.</p>}

      <ul>
        {chatUsers.map(({ user, lastMessage }) => (
          <li
            key={user.id}
            onClick={() => setSelectedChatUserId(user.id)}
            className={`flex items-center space-x-3 p-2 rounded cursor-pointer ${
              selectedChatUserId === user.id
                ? "bg-blue-100"
                : "hover:bg-gray-100"
            }`}
          >
            <Image
              src={user.user_image || "/trainer.jfif"}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600 truncate">
                {lastMessage.content}
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {dayjs(lastMessage.sentAt).format("h:mm A")}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for selecting user */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closable={false}
        className="[&_.ant-modal-content]:p-0"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Contacts</h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contacts List */}
          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedChatUserId(user.id);
                  setIsModalOpen(false);
                }}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <div className="relative">
                  <Image
                    src={user.user_image || "/trainer.jfif"}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{user.name}</h4>
                    {!user.isOnline && user.lastSeen && (
                      <span className="text-xs text-gray-500">
                        {dayjs(user.lastSeen).fromNow()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {user.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Contact Footer */}
          {/* <div className="mt-6 border-t pt-4">
            <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Add Contact
            </button>
          </div> */}
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
