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
import { useEffect, useState } from "react";
import { api } from "@/lib/petconnect-api";
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
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login?role=OWNER");
      return;
    }
    if (role === "PROVIDER") {
      router.replace("/provider");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await api.get("/owner/profile");
        if (!cancelled) setProfileReady(true);
      } catch (e: unknown) {
        const status = (e as { response?: { status?: number } })?.response
          ?.status;
        if (status === 404 && !cancelled) {
          router.replace("/onboarding/owner");
          return;
        }
        if (!cancelled) setProfileReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
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

  if (!token || (role !== "PROVIDER" && !profileReady)) {
    return null;
  }

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
