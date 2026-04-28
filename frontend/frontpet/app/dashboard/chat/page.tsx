"use client";

import { useEffect, useCallback, useState } from "react";
import { useGetMessages } from "@/app/utils/store/server/message/queries";
import { useCreateMessage } from "@/app/utils/store/server/message/mutation";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import Sidebar from "./-componenets/sidbar";
import ChatHeader from "./-componenets/hatHeader";
import ChatArea from "./-componenets/ChatBody";
import { useMessageStore } from "@/app/utils/uistate/fetures/message";
import { useSocket } from "@/app/hooks/useSocket";
import { useGetUsers } from "@/app/utils/store/server/user/queries";

const ChatUI = () => {
  const LOGGED_IN_USER_ID = useAuthenticationStore.getState().userId;

  const { data: messagesList = [], isLoading, error } = useGetMessages();
  const { data: usersList = [], isLoading: isUsersLoading, error: usersError } = useGetUsers();

  const { mutate: sendMessage } = useCreateMessage();

  const {
    selectedChatUserId,
    setSelectedChatUserId,
    addMessage,
    setMessages,
    messages,
  } = useMessageStore();

  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  // Sync messages from query to store
  useEffect(() => {
    const isSame =
      messagesList.length === messages.length &&
      messagesList.every((msg, idx) => msg.id === messages[idx]?.id);

    if (!isSame) setMessages(messagesList);
  }, [messagesList, messages, setMessages]);

  // Socket handlers
  const onNewMessage = useCallback((message) => addMessage(message), [addMessage]);
  const onTyping = useCallback(
    ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => ({ ...prev, [senderId]: isTyping }));
    },
    []
  );

  const { emitTyping } = useSocket(LOGGED_IN_USER_ID, onNewMessage, onTyping);

  // Default selected user if none
  useEffect(() => {
    if (!selectedChatUserId && usersList.length > 0) {
      setSelectedChatUserId(usersList[0].id);
    }
  }, [usersList, selectedChatUserId, setSelectedChatUserId]);

  // Filter and group messages by user
  const relevantMessages = messages.filter(
    (msg) =>
      msg.sender.id === LOGGED_IN_USER_ID ||
      msg.receiver.id === LOGGED_IN_USER_ID
  );

  const groupedMessages = relevantMessages.reduce((acc, msg) => {
    const otherUser =
      msg.sender.id === LOGGED_IN_USER_ID ? msg.receiver : msg.sender;
    if (!acc[otherUser.id]) acc[otherUser.id] = [];
    acc[otherUser.id].push(msg);
    return acc;
  }, {} as Record<string, typeof messages>);

  // Get selected user info (fallback to usersList if no messages)
  const selectedUser =
    selectedChatUserId
      ? groupedMessages[selectedChatUserId]?.length
        ? groupedMessages[selectedChatUserId][0].sender.id === LOGGED_IN_USER_ID
          ? groupedMessages[selectedChatUserId][0].receiver
          : groupedMessages[selectedChatUserId][0].sender
        : usersList.find((u) => u.id === selectedChatUserId) || null
      : null;

  const messagesForSelectedUser = selectedChatUserId
    ? groupedMessages[selectedChatUserId] || []
    : [];

  const isSelectedUserTyping = selectedChatUserId
    ? typingUsers[selectedChatUserId] === true
    : false;

  const handleSend = (content: string) => {
    if (!selectedChatUserId) return;
    sendMessage({
      content,
      senderId: LOGGED_IN_USER_ID,
      receiverId: selectedChatUserId,
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        usersList={usersList}
        messagesList={messages}
        isLoading={isLoading}
        error={error}
        loggedInUserId={LOGGED_IN_USER_ID}
      />

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <ChatHeader selectedUser={selectedUser} />
            <ChatArea
              messages={messagesForSelectedUser}
              loggedInUserId={LOGGED_IN_USER_ID}
              isTyping={isSelectedUserTyping}
              onSend={handleSend}
              onTyping={(isTyping: boolean) => {
                if (!selectedChatUserId) return;
                emitTyping(selectedChatUserId, isTyping);
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;
