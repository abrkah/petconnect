"use client";

import {
  ConfigProvider,
  Menu,
  Button,
  theme,
  Drawer,
} from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type PropsWithChildren, type ReactNode } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

export type AppShellMenuItem = {
  key: string;
  icon: ReactNode;
  label: ReactNode;
};

type Props = {
  brandHref: string;
  brandTitle: string;
  brandBadge?: string;
  menuItems: AppShellMenuItem[];
  onLogout: () => void;
  /** Header bell + unread badge (e.g. message notifications). */
  notificationBell?: ReactNode;
};

function LogoIcon({ variant = "gradient" }: { variant?: "gradient" | "soft" }) {
  const shell =
    variant === "soft"
      ? "bg-white/15 ring-1 ring-white/25 shadow-none"
      : "bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-black/20";

  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${shell}`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </span>
  );
}

const sidebarMenuClass =
  "!border-0 !bg-transparent !pt-1 " +
  "[&_.ant-menu-item]:!mx-3 [&_.ant-menu-item]:!rounded-xl " +
  "[&_.ant-menu-item]:!text-teal-100/90 " +
  "[&_.ant-menu-item_.anticon]:!text-teal-300/90 " +
  "[&_.ant-menu-item:hover]:!bg-white/[0.08] [&_.ant-menu-item:hover]:!text-white " +
  "[&_.ant-menu-item-selected]:!bg-gradient-to-r [&_.ant-menu-item-selected]:!from-teal-500/35 [&_.ant-menu-item-selected]:!to-cyan-600/25 " +
  "[&_.ant-menu-item-selected]:!text-white [&_.ant-menu-item-selected]:!shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] " +
  "[&_.ant-menu-item-selected_.anticon]:!text-teal-100";

const drawerMenuClass =
  "border-0 bg-transparent !pt-1 [&_.ant-menu-item]:!mx-3 [&_.ant-menu-item]:!rounded-xl " +
  "[&_.ant-menu-item-selected]:!bg-teal-50 [&_.ant-menu-item-selected]:!text-teal-800";

export default function PetConnectAppShell({
  brandHref,
  brandTitle,
  brandBadge,
  menuItems,
  onLogout,
  notificationBell,
  children,
}: PropsWithChildren<Props>) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const items: MenuProps["items"] = menuItems.map((m) => ({
    key: m.key,
    icon: m.icon,
    label: m.label,
  }));

  const sortedByLength = [...menuItems].sort((a, b) => b.key.length - a.key.length);
  const best = sortedByLength.find(
    (m) => pathname === m.key || pathname.startsWith(`${m.key}/`),
  );
  const activeKey = best ? [best.key] : [pathname];

  const roleLabel =
    brandBadge === "Pro" || brandHref.startsWith("/provider")
      ? "Provider"
      : "Pet owner";
  const headerSubtitle =
    pathname === brandHref
      ? "Overview and shortcuts for your workspace."
      : "Manage your pet care workflow from here.";

  const sidebarMenu = (
    <Menu
      mode="inline"
      theme="dark"
      selectedKeys={activeKey}
      items={items}
      className={sidebarMenuClass}
      onClick={() => setDrawerOpen(false)}
    />
  );

  const drawerMenu = (
    <Menu
      mode="inline"
      selectedKeys={activeKey}
      items={items}
      className={drawerMenuClass}
      onClick={() => setDrawerOpen(false)}
    />
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#0d9488",
          borderRadiusLG: 12,
          fontFamily:
            'var(--font-petconnect), ui-sans-serif, system-ui, sans-serif',
        },
        components: {
          Menu: {
            itemSelectedColor: "#0f766e",
            itemSelectedBg: "transparent",
            itemHoverBg: "rgba(13, 148, 136, 0.08)",
            itemHeight: 48,
            iconSize: 18,
            darkItemBg: "transparent",
            darkSubMenuItemBg: "transparent",
          },
        },
      }}
    >
      <div className="flex min-h-screen bg-[var(--app-canvas)]">
        <aside className="relative hidden w-[260px] shrink-0 flex-col border-r border-white/10 bg-gradient-to-b from-slate-900 via-teal-950 to-slate-950 shadow-[4px_0_32px_-8px_rgba(0,0,0,0.45)] md:flex md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-4h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h4v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />
          <div className="relative border-b border-white/10">
            <Link
              href={brandHref}
              className="flex items-center gap-3 px-5 py-5 text-lg font-semibold tracking-tight text-white no-underline transition hover:text-teal-100"
            >
              <LogoIcon variant="soft" />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate">{brandTitle}</span>
                {brandBadge ? (
                  <span className="mt-1 w-fit rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-100 ring-1 ring-white/15">
                    {brandBadge}
                  </span>
                ) : null}
              </span>
            </Link>
          </div>
          <div className="relative flex flex-1 flex-col py-3">{sidebarMenu}</div>
          <div className="relative mt-auto border-t border-white/10 p-5">
            <Button
              size="large"
              block
              className="!h-11 !border-white/25 !bg-white/10 !font-semibold !text-white hover:!border-white/40 hover:!bg-white/15"
              onClick={onLogout}
            >
              Log out
            </Button>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-3 shadow-sm backdrop-blur-md md:hidden">
            <Link
              href={brandHref}
              className="flex min-w-0 items-center gap-2 py-2 font-semibold text-teal-800 no-underline"
            >
              <LogoIcon />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-base leading-tight">{brandTitle}</span>
                {brandBadge ? (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-teal-600">
                    {brandBadge}
                  </span>
                ) : null}
              </span>
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              {notificationBell}
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
                aria-label="Open navigation"
                onClick={() => setDrawerOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </header>

          <header className="sticky top-0 z-30 hidden items-center justify-between gap-6 border-b border-slate-200/90 bg-white/90 px-3 py-3 shadow-sm backdrop-blur-md md:flex md:px-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-600">
                <HomeIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>{roleLabel}</span>
              </div>
              <p className="mt-0.5 text-sm text-slate-500">{headerSubtitle}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {brandHref === "/owner" ? (
                <Link
                  href="/owner/providers"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50 hover:text-teal-800"
                >
                  Caregivers
                </Link>
              ) : null}
              {notificationBell ?? (
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50 hover:text-teal-700"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </header>

          <Drawer
            title={
              <div className="flex items-center justify-between pr-1">
                <span className="font-semibold text-slate-800">{brandTitle}</span>
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                  aria-label="Close menu"
                  onClick={() => setDrawerOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            }
            placement="left"
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            width={280}
            styles={{ body: { paddingTop: 8, paddingLeft: 0, paddingRight: 0 } }}
            closable={false}
            rootClassName="md:hidden"
          >
            <div className="pb-2">{drawerMenu}</div>
            <div className="border-t border-slate-100 px-4 pb-2 pt-4">
              <Button type="primary" block size="large" onClick={onLogout}>
                Log out
              </Button>
            </div>
          </Drawer>

          <main className="w-full flex-1 px-3 py-4 md:px-4 md:py-5">
            <div className="dashboard-scope mx-auto w-full max-w-8xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}
