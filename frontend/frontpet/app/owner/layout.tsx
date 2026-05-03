"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HomeOutlined,
  HeartOutlined,
  CalendarOutlined,
  TeamOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { useEffect } from "react";
import PetConnectAppShell from "@/components/layouts/PetConnectAppShell";
import MessageNotificationBell from "@/components/layouts/MessageNotificationBell";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthenticationStore((s) => s.token);
  const role = useAuthenticationStore((s) => s.loggedUserRole);
  const logout = useAuthenticationStore((s) => s.logout);

  useEffect(() => {
    if (!token) router.replace("/login?role=OWNER");
    else if (role === "PROVIDER") router.replace("/provider");
  }, [token, role, router]);

  const topItems = [
    {
      key: "/owner",
      icon: <HomeOutlined />,
      label: <Link href="/owner">Dashboard</Link>,
    },
    {
      key: "/owner/pets",
      icon: <HeartOutlined />,
      label: <Link href="/owner/pets">My pets</Link>,
    },
    {
      key: "/owner/bookings",
      icon: <CalendarOutlined />,
      label: <Link href="/owner/bookings">Bookings</Link>,
    },
    {
      key: "/owner/providers",
      icon: <TeamOutlined />,
      label: <Link href="/owner/providers">Services</Link>,
    },
    {
      key: "/owner/messages",
      icon: <MessageOutlined />,
      label: <Link href="/owner/messages">Messages</Link>,
    },
    {
      key: "/owner/profile",
      icon: <UserOutlined />,
      label: <Link href="/owner/profile">Profile</Link>,
    },
  ];

  return (
    <PetConnectAppShell
      brandHref="/owner"
      brandTitle="PetConnect"
      menuItems={topItems}
      notificationBell={<MessageNotificationBell messagesHref="/owner/messages" />}
      onLogout={() => {
        logout();
        router.push("/");
      }}
    >
      {children}
    </PetConnectAppShell>
  );
}
