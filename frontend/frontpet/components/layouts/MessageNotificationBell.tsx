"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown } from "antd";
import { BellIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/petconnect-api";
import {
  disconnectPetConnectChatSocket,
  getPetConnectChatSocket,
} from "@/lib/petconnect-chat-socket";
import {
  useMessageNotificationsStore,
  type MessageNotificationItem,
} from "@/lib/message-notifications-store";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(calendar);

type Props = {
  messagesHref: string;
  /** Desktop wraps bell + badge in this trigger style */
  className?: string;
};

export default function MessageNotificationBell({
  messagesHref,
  className = "",
}: Props) {
  const token = useAuthenticationStore((s) => s.token);
  const totalUnread = useMessageNotificationsStore((s) => s.totalUnread);
  const items = useMessageNotificationsStore((s) => s.items);
  const setSummary = useMessageNotificationsStore((s) => s.setSummary);
  const setTotalUnread = useMessageNotificationsStore((s) => s.setTotalUnread);
  const reset = useMessageNotificationsStore((s) => s.reset);
  const [open, setOpen] = useState(false);

  const fetchSummary = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get<{
        total: number;
        items: MessageNotificationItem[];
      }>("/message/notifications");
      setSummary(data.total, data.items);
    } catch {
      /* ignore */
    }
  }, [token, setSummary]);

  useEffect(() => {
    if (!token) {
      reset();
      disconnectPetConnectChatSocket();
      return;
    }
    fetchSummary();

    let socket: ReturnType<typeof getPetConnectChatSocket>;
    try {
      socket = getPetConnectChatSocket(token);
    } catch {
      return;
    }

    const onUnread = (payload: { totalUnread: number }) => {
      setTotalUnread(payload.totalUnread);
    };

    socket.on("message:unread", onUnread);

    const onFocus = () => {
      fetchSummary();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      socket.off("message:unread", onUnread);
      window.removeEventListener("focus", onFocus);
    };
  }, [token, fetchSummary, reset, setTotalUnread]);

  const badge =
    totalUnread > 0 ? (totalUnread > 99 ? "99+" : String(totalUnread)) : null;

  const dropdownContent = (
    <div className="w-[min(100vw-2rem,22rem)] rounded-2xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/15">
      <div className="border-b border-slate-100 px-4 pb-2 pt-1">
        <p className="text-sm font-bold text-slate-900">Messages</p>
        <p className="text-xs text-slate-500">
          {totalUnread === 0
            ? "No unread messages"
            : `${totalUnread} unread`}
        </p>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-slate-500">
            You&apos;re all caught up.
          </p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {items.map((it) => (
              <li key={it.senderUserId}>
                <Link
                  href={`${messagesHref}?with=${it.senderUserId}`}
                  className="block px-4 py-3 transition hover:bg-teal-50/80"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-900">
                      User {it.senderUserId.slice(0, 8)}
                    </span>
                    <span className="flex h-6 min-w-[1.5rem] shrink-0 items-center justify-center rounded-full bg-teal-600 px-1.5 text-[11px] font-bold text-white">
                      {it.unreadCount > 99 ? "99+" : it.unreadCount}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {it.previewText}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {dayjs(it.lastMessageAt).calendar(null, {
                      sameDay: "[Today], h:mm A",
                      lastDay: "[Yesterday]",
                      sameElse: "D MMM YYYY, h:mm A",
                    })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t border-slate-100 px-3 py-2">
        <Link
          href={messagesHref}
          className="block rounded-xl px-3 py-2 text-center text-sm font-semibold text-teal-700 hover:bg-teal-50"
          onClick={() => setOpen(false)}
        >
          Open all chats
        </Link>
      </div>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) fetchSummary();
      }}
      dropdownRender={() => dropdownContent}
      trigger={["click"]}
      placement="bottomRight"
    >
      <button
        type="button"
        className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50 hover:text-teal-700 ${className}`}
        aria-label={
          totalUnread > 0
            ? `Notifications, ${totalUnread} unread messages`
            : "Notifications"
        }
      >
        <BellIcon className="h-5 w-5" aria-hidden />
        {badge ? (
          <span className="absolute -right-1 -top-1 flex h-[1.35rem] min-w-[1.35rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white shadow ring-2 ring-white">
            {badge}
          </span>
        ) : null}
      </button>
    </Dropdown>
  );
}
