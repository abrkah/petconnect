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
  type HireNotificationItem,
  type HireOwnerNotificationItem,
  type MessageNotificationItem,
} from "@/lib/message-notifications-store";
import { peerDisplayName } from "@/lib/message-peer";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(calendar);

type Props = {
  messagesHref: string;
  /** Show pending hire requests (provider workspace). */
  showHireRequests?: boolean;
  /** Show provider rejections / updates (owner workspace). */
  showOwnerHireUpdates?: boolean;
  hireRequestsHref?: string;
  ownerHireHref?: string;
  /** Desktop wraps bell + badge in this trigger style */
  className?: string;
};

export default function MessageNotificationBell({
  messagesHref,
  showHireRequests = false,
  showOwnerHireUpdates = false,
  hireRequestsHref = "/provider",
  ownerHireHref = "/owner/providers",
  className = "",
}: Props) {
  const token = useAuthenticationStore((s) => s.token);
  const totalUnread = useMessageNotificationsStore((s) => s.totalUnread);
  const items = useMessageNotificationsStore((s) => s.items);
  const hirePendingTotal = useMessageNotificationsStore((s) => s.hirePendingTotal);
  const hireItems = useMessageNotificationsStore((s) => s.hireItems);
  const hireOwnerUpdateTotal = useMessageNotificationsStore(
    (s) => s.hireOwnerUpdateTotal,
  );
  const hireOwnerItems = useMessageNotificationsStore((s) => s.hireOwnerItems);
  const setSummary = useMessageNotificationsStore((s) => s.setSummary);
  const setHireSummary = useMessageNotificationsStore((s) => s.setHireSummary);
  const setHireOwnerSummary = useMessageNotificationsStore(
    (s) => s.setHireOwnerSummary,
  );
  const setTotalUnread = useMessageNotificationsStore((s) => s.setTotalUnread);
  const setHirePendingTotal = useMessageNotificationsStore(
    (s) => s.setHirePendingTotal,
  );
  const setHireOwnerUpdateTotal = useMessageNotificationsStore(
    (s) => s.setHireOwnerUpdateTotal,
  );
  const reset = useMessageNotificationsStore((s) => s.reset);
  const [open, setOpen] = useState(false);

  const fetchMessageSummary = useCallback(async () => {
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

  const fetchHireSummary = useCallback(async () => {
    if (!token || !showHireRequests) return;
    try {
      const { data } = await api.get<{
        total: number;
        items: HireNotificationItem[];
      }>("/hire-requests/notifications");
      setHireSummary(data.total, data.items);
    } catch {
      /* ignore */
    }
  }, [token, showHireRequests, setHireSummary]);

  const fetchOwnerHireSummary = useCallback(async () => {
    if (!token || !showOwnerHireUpdates) return;
    try {
      const { data } = await api.get<{
        total: number;
        items: HireOwnerNotificationItem[];
      }>("/hire-requests/notifications");
      setHireOwnerSummary(data.total, data.items);
    } catch {
      /* ignore */
    }
  }, [token, showOwnerHireUpdates, setHireOwnerSummary]);

  const fetchAll = useCallback(async () => {
    await Promise.all([
      fetchMessageSummary(),
      fetchHireSummary(),
      fetchOwnerHireSummary(),
    ]);
  }, [fetchMessageSummary, fetchHireSummary, fetchOwnerHireSummary]);

  useEffect(() => {
    if (!token) {
      reset();
      disconnectPetConnectChatSocket();
      return;
    }
    fetchAll();

    let socket: ReturnType<typeof getPetConnectChatSocket>;
    try {
      socket = getPetConnectChatSocket(token);
    } catch {
      return;
    }

    const onUnread = (payload: { totalUnread: number }) => {
      setTotalUnread(payload.totalUnread);
      fetchMessageSummary();
    };

    const onHirePending = (payload: { pendingCount: number }) => {
      setHirePendingTotal(payload.pendingCount);
      fetchHireSummary();
    };

    const onHireOwnerUpdate = (payload: { unreadCount: number }) => {
      setHireOwnerUpdateTotal(payload.unreadCount);
      fetchOwnerHireSummary();
    };

    socket.on("message:unread", onUnread);
    if (showHireRequests) {
      socket.on("hire:pending", onHirePending);
    }
    if (showOwnerHireUpdates) {
      socket.on("hire:owner-update", onHireOwnerUpdate);
    }

    const onFocus = () => {
      fetchAll();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      socket.off("message:unread", onUnread);
      if (showHireRequests) {
        socket.off("hire:pending", onHirePending);
      }
      if (showOwnerHireUpdates) {
        socket.off("hire:owner-update", onHireOwnerUpdate);
      }
      window.removeEventListener("focus", onFocus);
    };
  }, [
    token,
    fetchAll,
    fetchMessageSummary,
    fetchHireSummary,
    fetchOwnerHireSummary,
    reset,
    setTotalUnread,
    setHirePendingTotal,
    setHireOwnerUpdateTotal,
    showHireRequests,
    showOwnerHireUpdates,
  ]);

  const combinedTotal =
    totalUnread +
    (showHireRequests ? hirePendingTotal : 0) +
    (showOwnerHireUpdates ? hireOwnerUpdateTotal : 0);
  const badge =
    combinedTotal > 0
      ? combinedTotal > 99
        ? "99+"
        : String(combinedTotal)
      : null;

  const dropdownContent = (
    <div className="w-[min(100vw-2rem,22rem)] rounded-2xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/15">
      <div className="border-b border-slate-100 px-4 pb-2 pt-1">
        <p className="text-sm font-bold text-slate-900">Notifications</p>
        <p className="text-xs text-slate-500">
          {combinedTotal === 0
            ? "You're all caught up"
            : `${combinedTotal} item${combinedTotal === 1 ? "" : "s"} need attention`}
        </p>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {showOwnerHireUpdates && hireOwnerItems.length > 0 ? (
          <div>
            <p className="px-4 pt-2 text-[11px] font-semibold uppercase tracking-wide text-rose-700">
              Hire updates
            </p>
            <ul className="divide-y divide-slate-50">
              {hireOwnerItems.map((hire) => (
                <li key={hire.id}>
                  <Link
                    href={`${ownerHireHref}?viewHire=${hire.id}`}
                    className="block px-4 py-3 transition hover:bg-rose-50/80"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900">
                        {hire.providerFullName}
                      </span>
                      <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-800">
                        Declined
                      </span>
                    </div>
                    {hire.responseMessage ? (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {hire.responseMessage}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm italic text-slate-400">
                        No message from provider
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-slate-400">
                      {dayjs(hire.updatedAt).calendar(null, {
                        sameDay: "[Today], h:mm A",
                        lastDay: "[Yesterday]",
                        sameElse: "D MMM YYYY, h:mm A",
                      })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {showHireRequests && hireItems.length > 0 ? (
          <div>
            <p className="px-4 pt-2 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
              Hire requests
            </p>
            <ul className="divide-y divide-slate-50">
              {hireItems.map((hire) => (
                <li key={hire.id}>
                  <Link
                    href={`${hireRequestsHref}?reviewHire=${hire.id}`}
                    className="block px-4 py-3 transition hover:bg-amber-50/80"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900">
                        {hire.ownerFullName}
                      </span>
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                        New
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {hire.petCount} pet{hire.petCount === 1 ? "" : "s"}
                    </p>
                    {hire.message ? (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {hire.message}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm italic text-slate-400">
                        No message included
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-slate-400">
                      {dayjs(hire.createdAt).calendar(null, {
                        sameDay: "[Today], h:mm A",
                        lastDay: "[Yesterday]",
                        sameElse: "D MMM YYYY, h:mm A",
                      })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wide text-teal-700">
            Messages
          </p>
          {items.length === 0 ? (
            <p className="px-4 py-4 text-center text-sm text-slate-500">
              No unread messages.
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
                        {peerDisplayName(
                          it.senderUserId,
                          it.senderDisplayName,
                        )}
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

        {combinedTotal === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-slate-500">
            You&apos;re all caught up.
          </p>
        ) : null}
      </div>
      <div className="border-t border-slate-100 px-3 py-2 space-y-1">
        {showOwnerHireUpdates ? (
          <Link
            href={ownerHireHref}
            className="block rounded-xl px-3 py-2 text-center text-sm font-semibold text-rose-800 hover:bg-rose-50"
            onClick={() => setOpen(false)}
          >
            View hire history
          </Link>
        ) : null}
        {showHireRequests ? (
          <Link
            href={hireRequestsHref}
            className="block rounded-xl px-3 py-2 text-center text-sm font-semibold text-amber-800 hover:bg-amber-50"
            onClick={() => setOpen(false)}
          >
            Review hire requests
          </Link>
        ) : null}
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
        if (next) fetchAll();
      }}
      popupRender={() => dropdownContent}
      trigger={["click"]}
      placement="bottomRight"
    >
      <button
        type="button"
        className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50 hover:text-teal-700 ${className}`}
        aria-label={
          combinedTotal > 0
            ? `Notifications, ${combinedTotal} items`
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
