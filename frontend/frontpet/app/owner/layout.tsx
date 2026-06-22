"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HomeOutlined,
  HeartOutlined,
  CalendarOutlined,
  TeamOutlined,
  SendOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { useEffect, useState } from "react";
import { api } from "@/lib/petconnect-api";
import PetConnectAppShell from "@/components/layouts/PetConnectAppShell";
import MessageNotificationBell from "@/components/layouts/MessageNotificationBell";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const token = useAuthenticationStore((s) => s.token);
  const role = useAuthenticationStore((s) => s.loggedUserRole);
  const logout = useAuthenticationStore((s) => s.logout);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
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
  }, [hydrated, token, role, router]);

  const topItems = [
    {
      key: "/owner",
      title: "Dashboard",
      icon: <HomeOutlined />,
      label: <Link href="/owner">Dashboard</Link>,
    },
    {
      key: "/owner/pets",
      title: "My pets",
      icon: <HeartOutlined />,
      label: <Link href="/owner/pets">My pets</Link>,
    },
    {
      key: "/owner/bookings",
      title: "Bookings",
      icon: <CalendarOutlined />,
      label: <Link href="/owner/bookings">Bookings</Link>,
    },
    {
      key: "/owner/providers",
      title: "Services",
      icon: <TeamOutlined />,
      label: <Link href="/owner/providers">Services</Link>,
    },
    {
      key: "/owner/hire-requests",
      title: "Hire requests",
      icon: <SendOutlined />,
      label: <Link href="/owner/hire-requests">Hire requests</Link>,
    },
    {
      key: "/owner/messages",
      title: "Messages",
      icon: <MessageOutlined />,
      label: <Link href="/owner/messages">Messages</Link>,
    },
    {
      key: "/owner/profile",
      title: "Profile",
      icon: <UserOutlined />,
      label: <Link href="/owner/profile">Profile</Link>,
    },
  ];

  if (!hydrated || !token || (role !== "PROVIDER" && !profileReady)) {
    return null;
  }

  return (
    <PetConnectAppShell
      brandHref="/owner"
      brandTitle="PetConnect"
      menuItems={topItems}
      notificationBell={
        <MessageNotificationBell
          messagesHref="/owner/messages"
          showOwnerHireUpdates
          ownerHireHref="/owner/hire-requests"
        />
      }
      onLogout={() => {
        logout();
        router.push("/");
      }}
    >
      {children}
    </PetConnectAppShell>
  );
}
