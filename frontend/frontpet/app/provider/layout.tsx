"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HomeOutlined,
  MessageOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { useEffect } from "react";
import PetConnectAppShell from "@/components/layouts/PetConnectAppShell";
import MessageNotificationBell from "@/components/layouts/MessageNotificationBell";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthenticationStore((s) => s.token);
  const role = useAuthenticationStore((s) => s.loggedUserRole);
  const logout = useAuthenticationStore((s) => s.logout);

  useEffect(() => {
    if (!token) router.replace("/login?role=PROVIDER");
    else if (role === "OWNER") router.replace("/owner");
  }, [token, role, router]);

  const topItems = [
    {
      key: "/provider",
      icon: <HomeOutlined />,
      label: <Link href="/provider">Dashboard</Link>,
    },
    {
      key: "/provider/bookings",
      icon: <CalendarOutlined />,
      label: <Link href="/provider/bookings">Bookings</Link>,
    },
    {
      key: "/provider/messages",
      icon: <MessageOutlined />,
      label: <Link href="/provider/messages">Messages</Link>,
    },
    {
      key: "/provider/profile",
      icon: <UserOutlined />,
      label: <Link href="/provider/profile">Profile</Link>,
    },
  ];

  return (
    <PetConnectAppShell
      brandHref="/provider"
      brandTitle="PetConnect"
      brandBadge="Pro"
      menuItems={topItems}
      notificationBell={<MessageNotificationBell messagesHref="/provider/messages" />}
      onLogout={() => {
        logout();
        router.push("/");
      }}
    >
      {children}
    </PetConnectAppShell>
  );
}
