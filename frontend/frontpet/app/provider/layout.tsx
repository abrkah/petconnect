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
import { useEffect, useState } from "react";
import { api } from "@/lib/petconnect-api";
import PetConnectAppShell from "@/components/layouts/PetConnectAppShell";
import MessageNotificationBell from "@/components/layouts/MessageNotificationBell";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const token = useAuthenticationStore((s) => s.token);
  const role = useAuthenticationStore((s) => s.loggedUserRole);
  const setLoggedUserRole = useAuthenticationStore((s) => s.setLoggedUserRole);
  const logout = useAuthenticationStore((s) => s.logout);
  const [accessReady, setAccessReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login?role=PROVIDER");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<{ id: string; role: string }>("/auth/me");
        if (cancelled) return;

        if (data.role !== role) {
          setLoggedUserRole(data.role);
        }

        if (data.role === "OWNER") {
          router.replace("/owner");
          return;
        }
        if (data.role !== "PROVIDER") {
          router.replace("/login?role=PROVIDER");
          return;
        }

        setAccessReady(true);
      } catch {
        if (!cancelled) router.replace("/login?role=PROVIDER");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, token, role, router, setLoggedUserRole]);

  if (!hydrated || !token || !accessReady) return null;

  const topItems = [
    {
      key: "/provider",
      title: "Dashboard",
      icon: <HomeOutlined />,
      label: <Link href="/provider">Dashboard</Link>,
    },
    {
      key: "/provider/bookings",
      title: "Bookings",
      icon: <CalendarOutlined />,
      label: <Link href="/provider/bookings">Bookings</Link>,
    },
    {
      key: "/provider/messages",
      title: "Messages",
      icon: <MessageOutlined />,
      label: <Link href="/provider/messages">Messages</Link>,
    },
    {
      key: "/provider/profile",
      title: "Profile",
      icon: <UserOutlined />,
      label: <Link href="/provider/profile">Profile</Link>,
    },
  ];

  return (
    <PetConnectAppShell
      brandHref="/provider"
      brandTitle="PetConnect"
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
