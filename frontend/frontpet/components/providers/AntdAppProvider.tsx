"use client";

import { App, ConfigProvider } from "antd";
import { useLayoutEffect } from "react";
import { registerNotificationApi } from "@/components/common/actionbutton/notification/notficationmessage";

function NotificationRegistrar() {
  const { notification } = App.useApp();

  useLayoutEffect(() => {
    registerNotificationApi(notification);
    return () => registerNotificationApi(null);
  }, [notification]);

  return null;
}

export default function AntdAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0d9488",
          borderRadius: 12,
        },
      }}
    >
      <App message={{ top: 80, duration: 4 }} notification={{ placement: "topRight", top: 24, duration: 4 }}>
        <NotificationRegistrar />
        {children}
      </App>
    </ConfigProvider>
  );
}
