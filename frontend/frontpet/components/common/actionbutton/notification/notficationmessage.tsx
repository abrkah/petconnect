import React from "react";
import type { NotificationInstance } from "antd/es/notification/interface";
import {
  CloseCircleFilled,
  InfoCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";

interface NotificationProps {
  message: string;
  description?: string;
}

let notificationApi: NotificationInstance | null = null;

export function registerNotificationApi(api: NotificationInstance | null) {
  notificationApi = api;
}

function showNotification(
  type: "success" | "error" | "warning" | "info",
  { message, description }: NotificationProps,
  style: React.CSSProperties,
  icon: React.ReactNode,
) {
  if (!notificationApi) return;
  notificationApi[type]({
    message,
    description,
    className: "notification",
    style: {
      margin: 0,
      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
      ...style,
    },
    icon,
  });
}

const NotificationMessage = {
  error: (props: NotificationProps) => {
    showNotification(
      "error",
      props,
      {
        backgroundColor: "#fff1f0",
        border: "1px solid #ffa39e",
      },
      <CloseCircleFilled style={{ color: "#f5222e" }} />,
    );
  },
  warning: (props: NotificationProps) => {
    showNotification(
      "warning",
      props,
      {
        backgroundColor: "#fffbe6",
        border: "1px solid #ffe58f",
      },
      <InfoCircleFilled style={{ color: "#f9bf02" }} />,
    );
  },
  success: (props: NotificationProps) => {
    showNotification(
      "success",
      props,
      {
        backgroundColor: "#f0fdfa",
        border: "1px solid #99f6e4",
      },
      <CheckCircleFilled style={{ color: "#0d9488" }} />,
    );
  },
  info: (props: NotificationProps) => {
    showNotification(
      "info",
      props,
      {
        backgroundColor: "#e6f4ff",
        border: "1px solid #91caff",
      },
      <InfoCircleFilled style={{ color: "#1677ff" }} />,
    );
  },
};

export default NotificationMessage;
