"use client";
import { useState } from "react";
import { FiSearch, FiPhoneCall } from "react-icons/fi";
import { BsThreeDotsVertical, BsList } from "react-icons/bs";
import Image from "next/image";
import { Drawer, Modal } from "antd";
import { useGetMessages } from "@/app/utils/store/server/message/queries"; 
import { useCreateMessage } from "@/app/utils/store/server/message/mutation"; 
import dayjs from "dayjs"; // Import dayjs for date formatting
import { useGetUsers } from "@/app/utils/store/server/user/queries"; 

interface Message {
  id: string;
  content: string;
  sentAt: string;
  updatedAt: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  recipient: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
}

const LOGGED_IN_USER_ID = "cfbbba38-ea04-4684-acb5-f2cbcc55d801"; // Replace with actual user ID
export default function ChatUI() {
  const { data: messagesData = [], isLoading, error } = useGetMessages();
  const messagesList = messagesData as Message[];
  const { data: usersData = [] } = useGetUsers();
  const usersList = usersData as { id: string; role?: string }[];
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false); // Drawer visibility
  const [selectedCategory, setSelectedCategory] = useState<string>("student"); // Track selected category
  const [isModalVisible, setIsModalVisible] = useState(false); // For showing modal when category is selected
  const [categoryUsers, setCategoryUsers] = useState<any[]>([]); // To hold the list of users based on selected category
  const { mutate: sendMessage } = useCreateMessage();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "" || !selectedChatUser) return;

    setIsSending(true);

    const newMessage = {
      content: messageInput,
      senderId: LOGGED_IN_USER_ID,
      recipientId: selectedChatUser,
    };

    sendMessage(newMessage, {
      onSuccess: () => {
        setMessageInput("");
        setIsSending(false);
      },
      onError: () => {
        setIsSending(false);
      },
    });
  };

  const relevantMessages = messagesList.filter(
    (msg) =>
      msg.sender.id === LOGGED_IN_USER_ID ||
      msg.recipient.id === LOGGED_IN_USER_ID
  );

  const groupedMessages = relevantMessages.reduce((acc, msg) => {
    const otherUserId =
      msg.sender.id === LOGGED_IN_USER_ID ? msg.recipient.id : msg.sender.id;
    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(msg);
    return acc;
  }, {} as { [key: string]: Message[] });

  // Sort messages within each chat by sentAt
  Object.values(groupedMessages).forEach((msgs) => {
    msgs.sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );
  });

  const openDrawer = () => {
    setVisibleDrawer(true);
  };

  const closeDrawer = () => {
    setVisibleDrawer(false);
  };

  // Handle category click to filter users based on category
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCategoryUsers(usersList.filter((user) => user.role === category));
    setIsModalVisible(true); // Show modal with users for selected category
  };

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 mt-24">
      {/* Message List */}
      <div className="w-1/4 bg-white p-4 border-r overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <BsList className="text-xl cursor-pointer" onClick={openDrawer} />
          <h2 className="text-lg font-semibold">Messages</h2>
          <FiSearch className="text-gray-500" />
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading messages...</p>
          ) : error ? (
            <p>Error loading messages.</p>
          ) : (
            Object.entries(groupedMessages).map(([otherUserId, msgs]) => {
              const latestMessage = msgs[msgs.length - 1];
              const otherUser =
                latestMessage.sender.id === LOGGED_IN_USER_ID
                  ? latestMessage.recipient
                  : latestMessage.sender;

              return (
                <div
                  key={otherUserId}
                  className={`flex items-center p-2 rounded-lg cursor-pointer`}
                  onClick={() => setSelectedChatUser(otherUserId)}
                >
                  <Image
                    src="https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="User Avatar"
                    width={24}
                    height={24}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 ml-2">
                    <h3 className="font-semibold text-sm">
                      {otherUser.first_name} {otherUser.last_name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {latestMessage.content}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {dayjs(latestMessage.sentAt).format("h:mm A")}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="w-3/4 flex flex-col">
        {selectedChatUser && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b">
              <div className="flex items-center">
                <Image
                  src="https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="User Avatar"
                  width={24}
                  height={24}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-2">
                  <h3 className="font-semibold">
                    {groupedMessages[selectedChatUser]?.[0]?.sender.id ===
                    LOGGED_IN_USER_ID
                      ? groupedMessages[selectedChatUser]?.[0]?.recipient
                          .first_name
                      : groupedMessages[selectedChatUser]?.[0]?.sender
                          .first_name}{" "}
                    {groupedMessages[selectedChatUser]?.[0]?.sender.id ===
                    LOGGED_IN_USER_ID
                      ? groupedMessages[selectedChatUser]?.[0]?.recipient
                          .last_name
                      : groupedMessages[selectedChatUser]?.[0]?.sender
                          .last_name}
                  </h3>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <FiPhoneCall className="text-gray-600 cursor-pointer" />
                <BsThreeDotsVertical className="text-gray-600 cursor-pointer" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
              {groupedMessages[selectedChatUser]?.length === 0 ? (
                <div className="text-center text-gray-500">
                  Start a conversation!
                </div>
              ) : (
                groupedMessages[selectedChatUser]?.map((msg) => {
                  const sender =
                    msg.sender.id === LOGGED_IN_USER_ID ? "right" : "left";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        sender === "right" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-2 rounded-lg ${
                          sender === "right"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span className="text-xs text-gray-500">
                          {dayjs(msg.sentAt).format("h:mm A")}
                        </span>
                      </div>
                      <div
                        className={`ml-2 ${
                          sender === "left" ? "order-first" : ""
                        }`}
                      >
                        <Image
                          src="https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"
                          alt="User Avatar"
                          width={24}
                          height={24}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <input
                type="text"
                value={messageInput}
                onChange={handleInputChange}
                placeholder="Type a message"
                className="w-full p-2 border rounded-lg"
              />
              <button
                className="p-2 text-white bg-blue-500 rounded-lg mt-2 w-full"
                onClick={handleSendMessage}
                disabled={isSending || !messageInput.trim()}
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Drawer for Category Selection */}
      <Drawer
        title="contacts"
        placement="left"
        onClose={closeDrawer}
        visible={visibleDrawer}
        width={320}
      >
        <div className="space-y-4">
          <div className="flex flex-col space-y-3">
            <button
              className="w-full p-3 text-black rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              onClick={() => handleCategoryClick("student")}
            >
              <span className="font-medium">Student</span>
            </button>
            <button
              className="w-full p-3 text-black rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              onClick={() => handleCategoryClick("teacher")}
            >
              <span className="font-medium">Teacher</span>
            </button>
            <button
              className="w-full p-3 text-black rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              onClick={() => handleCategoryClick("parent")}
            >
              <span className="font-medium">Parent</span>
            </button>
            <button
              className="w-full p-3 text-black rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              onClick={() => handleCategoryClick("saved_message")}
            >
              <span className="font-medium">Saved Messages</span>
            </button>
            <button
              className="w-full p-3 text-black rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              onClick={() => handleCategoryClick("calls")}
            >
              <span className="font-medium">Calls</span>
            </button>
          </div>
        </div>
      </Drawer>

      {/* Modal for displaying users based on category */}
      <Modal
        title={`List of ${selectedCategory}`}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={500}
      >
        <div className="space-y-4">
          {categoryUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-2 cursor-pointer"
              onClick={() => {
                setSelectedChatUser(user.id);
                closeModal();
              }}
            >
              <Image
                src="https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="User Avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-2">
                <p className="font-semibold">{user.first_name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
