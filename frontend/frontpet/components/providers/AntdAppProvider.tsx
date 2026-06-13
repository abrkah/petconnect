"use client";

import { App, ConfigProvider, unstableSetRender } from "antd";
import { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { registerNotificationApi } from "@/components/common/actionbutton/notification/notficationmessage";

type ContainerWithRoot = Element & {
  _antdReactRoot?: ReturnType<typeof createRoot>;
};

if (typeof window !== "undefined") {
  unstableSetRender((node, container) => {
    const host = container as ContainerWithRoot;
    host._antdReactRoot ??= createRoot(host);
    const root = host._antdReactRoot;
    root.render(node);
    return async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      root.unmount();
      host._antdReactRoot = undefined;
    };
  });
}

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
