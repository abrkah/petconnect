// src/services/MessageService.ts

import { notification, message, NotificationArgsProps } from "antd";

type MessageType = "success" | "error" | "info";

interface MessageServiceOptions extends Partial<NotificationArgsProps> {
  duration?: number; // For message duration
}

/**
 * Displays a message or notification based on the type provided.
 * @param type - Type of the message ('success', 'error', 'info').
 * @param content - The content of the message.
 * @param options - Additional options for the message or notification.
 */
const MessageService = (
  type: MessageType,
  content: string,
  options: MessageServiceOptions = {}
): void => {
  const notificationTypes: MessageType[] = ["success", "error", "info"];
  const messageTypes: MessageType[] = ["success", "error", "info"];

  if (notificationTypes.includes(type)) {
    notification[type]({
      message: type.charAt(0).toUpperCase() + type.slice(1),
      description: content,
      placement: "topRight",
      ...options,
    });
  } else if (messageTypes.includes(type)) {
    const duration = options.duration ?? 3;
    message[type](content, duration);
  } else {
    console.warn(
      `Unsupported type: ${type}. Use one of ${[
        ...notificationTypes,
        ...messageTypes,
      ].join(", ")}.`
    );
  }
};

export default MessageService;
