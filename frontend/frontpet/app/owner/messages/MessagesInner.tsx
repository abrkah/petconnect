"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Form, Input, message as antMessage } from "antd";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { getPetConnectChatSocket } from "@/lib/petconnect-chat-socket";
import { api } from "@/lib/petconnect-api";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { useMessageNotificationsStore } from "@/lib/message-notifications-store";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(calendar);
dayjs.extend(relativeTime);

type Msg = {
  id: string;
  senderUserId: string;
  receiverUserId: string;
  messageText: string;
  createdAt: string;
};

type PeerPresence = {
  online: boolean;
  lastSeenAt: string | null;
};

function peerInitial(userId: string) {
  const c = userId.replace(/-/g, "").charAt(0);
  return /[0-9a-f]/i.test(c) ? c.toUpperCase() : "?";
}

function peerHue(userId: string) {
  let h = 0;
  for (let i = 0; i < userId.length; i++) h = (h + userId.charCodeAt(i) * (i + 1)) % 360;
  return h;
}

function lastSeenLabel(p: PeerPresence | undefined): string {
  if (!p) return "…";
  if (p.online) return "online";
  if (p.lastSeenAt) return dayjs(p.lastSeenAt).fromNow();
  return "recently";
}

export default function OwnerMessagesInner() {
  const searchParams = useSearchParams();
  const withId = searchParams.get("with") || "";
  const token = useAuthenticationStore((s) => s.token);
  const myId = useAuthenticationStore((s) => s.userId);

  const [threads, setThreads] = useState<{ userId: string; lastMessage: Msg }[]>(
    [],
  );
  const [activePeer, setActivePeer] = useState(withId);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [form] = Form.useForm();
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activePeerRef = useRef(activePeer);
  const [presenceByUser, setPresenceByUser] = useState<
    Record<string, PeerPresence>
  >({});

  useEffect(() => {
    activePeerRef.current = activePeer;
  }, [activePeer]);

  const patchPresence = useCallback((userId: string, patch: PeerPresence) => {
    setPresenceByUser((prev) => ({ ...prev, [userId]: patch }));
  }, []);

  const loadInbox = useCallback(async () => {
    const { data } = await api.get<{ userId: string; lastMessage: Msg }[]>(
      "/message/inbox",
    );
    setThreads(data);
  }, []);

  useEffect(() => {
    loadInbox().catch(() => {});
  }, [loadInbox]);

  useEffect(() => {
    if (withId) setActivePeer(withId);
  }, [withId]);

  const loadThread = useCallback(async (peerId: string) => {
    if (!peerId) {
      setMessages([]);
      return;
    }
    const { data } = await api.get<Msg[]>(`/message/conversation/${peerId}`);
    setMessages(data);
  }, []);

  useEffect(() => {
    if (activePeer) loadThread(activePeer).catch(() => {});
  }, [activePeer, loadThread]);

  useEffect(() => {
    if (!activePeer || !token) return;
    api
      .post<{ totalUnread: number }>(`/message/read/${activePeer}`)
      .then(({ data }) => {
        useMessageNotificationsStore.getState().setTotalUnread(data.totalUnread);
      })
      .catch(() => {});
  }, [activePeer, token]);

  useEffect(() => {
    if (!activePeer) return;
    let cancelled = false;
    api
      .get<PeerPresence>(`/message/presence/${activePeer}`)
      .then(({ data }) => {
        if (!cancelled) patchPresence(activePeer, data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [activePeer, patchPresence]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, activePeer]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof Notification === "undefined") {
      return;
    }
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    let socket: ReturnType<typeof getPetConnectChatSocket>;
    try {
      socket = getPetConnectChatSocket(token);
    } catch {
      return;
    }

    const onPresence = (payload: {
      userId: string;
      online: boolean;
      lastSeenAt: string | null;
    }) => {
      patchPresence(payload.userId, {
        online: payload.online,
        lastSeenAt: payload.lastSeenAt,
      });
    };

    const onNewMessage = (msg: Msg) => {
      const viewingChat =
        activePeerRef.current &&
        (msg.senderUserId === activePeerRef.current ||
          msg.receiverUserId === activePeerRef.current);
      const openAndVisible =
        viewingChat &&
        typeof document !== "undefined" &&
        document.visibilityState === "visible";

      loadInbox().catch(() => {});

      if (
        msg.senderUserId !== myId &&
        msg.receiverUserId === myId &&
        activePeerRef.current === msg.senderUserId
      ) {
        setMessages((prev) => {
          if (prev.some((x) => x.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }

      const notify =
        msg.senderUserId !== myId &&
        msg.receiverUserId === myId &&
        (!openAndVisible || document.visibilityState === "hidden");

      if (notify) {
        const title = `New message · User ${msg.senderUserId.slice(0, 8)}`;
        antMessage.open({
          type: "info",
          content: (
            <span className="text-slate-800">
              <span className="font-semibold">{title}</span>
              <span className="mt-1 block line-clamp-2 text-slate-600">
                {msg.messageText}
              </span>
            </span>
          ),
          duration: 5,
        });

        if (
          Notification.permission === "granted" &&
          typeof Notification !== "undefined"
        ) {
          try {
            new Notification(title, {
              body: msg.messageText.slice(0, 160),
              tag: `msg-${msg.senderUserId}`,
            });
          } catch {
            /* ignore */
          }
        }
      }
    };

    socket.on("presence:changed", onPresence);
    socket.on("message:new", onNewMessage);

    return () => {
      socket.off("presence:changed", onPresence);
      socket.off("message:new", onNewMessage);
    };
  }, [token, myId, loadInbox, patchPresence]);

  const send = async (v: { messageText: string }) => {
    const text = v.messageText?.trim();
    if (!activePeer) {
      antMessage.info("Select a conversation");
      return;
    }
    if (!text) return;
    setSending(true);
    try {
      await api.post("/message", {
        receiverUserId: activePeer,
        messageText: text,
      });
      form.resetFields();
      await Promise.all([loadThread(activePeer), loadInbox()]);
    } catch {
      antMessage.error("Send failed");
    } finally {
      setSending(false);
    }
  };

  const activeHue = activePeer ? peerHue(activePeer) : 160;
  const headerPresence = activePeer ? presenceByUser[activePeer] : undefined;

  return (
    <div
      className="flex h-[min(720px,calc(100vh-9rem))] min-h-[520px] overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.25)]"
      role="region"
      aria-label="Messages"
    >
      {/* Thread list */}
      <aside className="flex w-full shrink-0 flex-col border-slate-200 bg-slate-50/80 md:w-[300px] md:border-r lg:w-[320px]">
        <div className="border-b border-slate-200/90 bg-white/90 px-4 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-600/25">
              <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold tracking-tight">Chats</p>
              <p className="text-xs text-slate-500">
                {threads.length} conversation{threads.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              No threads yet. Message someone from Services.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 p-2">
              {threads.map((t) => {
                const hue = peerHue(t.userId);
                const active = activePeer === t.userId;
                const lm = t.lastMessage;
                const fromMe = lm.senderUserId === myId;
                const online = presenceByUser[t.userId]?.online;
                return (
                  <li key={t.userId}>
                    <button
                      type="button"
                      onClick={() => setActivePeer(t.userId)}
                      className={`flex w-full gap-3 rounded-2xl px-3 py-3 text-left transition ${
                        active
                          ? "bg-teal-600 text-white shadow-md shadow-teal-900/20"
                          : "hover:bg-white"
                      }`}
                    >
                      <span className="relative shrink-0">
                        <span
                          className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-inner ring-2 ring-white/20"
                          style={{
                            background: active
                              ? "rgba(255,255,255,0.2)"
                              : `linear-gradient(145deg, hsl(${hue} 55% 46%), hsl(${(hue + 40) % 360} 50% 38%))`,
                          }}
                        >
                          {peerInitial(t.userId)}
                        </span>
                        {online ? (
                          <span
                            className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm"
                            title="Online"
                            aria-hidden
                          />
                        ) : null}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span
                            className={`truncate font-semibold ${active ? "text-white" : "text-slate-900"}`}
                          >
                            {`User ${t.userId.slice(0, 8)}`}
                          </span>
                          <span
                            className={`shrink-0 text-[11px] tabular-nums ${active ? "text-teal-100" : "text-slate-400"}`}
                          >
                            {dayjs(lm.createdAt).calendar(null, {
                              sameDay: "[Today], h:mm A",
                              lastDay: "[Yesterday]",
                              lastWeek: "ddd",
                              sameElse: "D MMM",
                            })}
                          </span>
                        </div>
                        <p
                          className={`mt-0.5 truncate text-sm ${active ? "text-teal-50" : "text-slate-600"}`}
                        >
                          {fromMe ? "You: " : ""}
                          {lm.messageText}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Conversation */}
      <section className="relative flex min-w-0 flex-1 flex-col bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
        {!activePeer ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-200/80 text-slate-500">
              <ChatBubbleLeftRightIcon className="h-8 w-8" aria-hidden />
            </span>
            <p className="max-w-sm text-sm font-medium text-slate-700">
              Select a chat or start one from the provider directory.
            </p>
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-slate-200/90 bg-white/95 px-4 py-3 backdrop-blur-md">
              <span className="relative shrink-0">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-md"
                  style={{
                    background: `linear-gradient(145deg, hsl(${activeHue} 52% 46%), hsl(${(activeHue + 35) % 360} 48% 40%))`,
                  }}
                >
                  {peerInitial(activePeer)}
                </span>
                {headerPresence?.online ? (
                  <span
                    className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow"
                    title="Online"
                    aria-hidden
                  />
                ) : null}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-slate-900">
                  User {activePeer.slice(0, 8)}
                </h2>
                <p className="truncate text-xs text-slate-600">
                  {headerPresence?.online ? (
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      Online
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Last seen{" "}
                      <span className="font-medium text-slate-700">
                        {lastSeenLabel(headerPresence)}
                      </span>
                    </span>
                  )}
                </p>
              </div>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-3 py-4 sm:px-5"
            >
              <div className="mx-auto flex max-w-3xl flex-col gap-1">
                {messages.map((m, idx) => {
                  const mine = m.senderUserId === myId;
                  const dayKey = dayjs(m.createdAt).format("YYYY-MM-DD");
                  const prevDay =
                    idx > 0
                      ? dayjs(messages[idx - 1].createdAt).format("YYYY-MM-DD")
                      : null;
                  const showDateChip = dayKey !== prevDay;

                  return (
                    <div key={m.id}>
                      {showDateChip ? (
                        <div className="my-4 flex justify-center">
                          <span className="rounded-full bg-slate-300/35 px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 backdrop-blur-sm">
                            {dayjs(m.createdAt).calendar(null, {
                              sameDay: "Today",
                              lastDay: "Yesterday",
                              sameElse: "MMMM D, YYYY",
                            })}
                          </span>
                        </div>
                      ) : null}
                      <div
                        className={`flex w-full ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`group relative max-w-[min(85%,420px)] px-1 pb-1 pt-0.5 ${mine ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`relative px-3.5 py-2.5 text-[15px] leading-snug shadow-sm ${
                              mine
                                ? "rounded-[18px] rounded-br-md bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-teal-900/15"
                                : "rounded-[18px] rounded-bl-md border border-slate-200/90 bg-white text-slate-900 shadow-slate-900/5"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">
                              {m.messageText}
                            </p>
                          </div>
                          <time
                            dateTime={m.createdAt}
                            className={`mt-1 block px-1 text-[11px] tabular-nums ${
                              mine
                                ? "text-right text-slate-500"
                                : "text-left text-slate-500"
                            }`}
                          >
                            {dayjs(m.createdAt).format("h:mm A")}
                          </time>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {messages.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">
                  No messages yet. Say hello below.
                </p>
              ) : null}
            </div>

            <footer className="border-t border-slate-200/90 bg-white/95 p-3 backdrop-blur-md sm:p-4">
              <Form form={form} onFinish={send} className="mx-auto max-w-3xl">
                <div className="flex items-end gap-2 rounded-[22px] border border-slate-200 bg-slate-50/90 p-2 pl-3 shadow-inner shadow-slate-900/5 focus-within:border-teal-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500/20">
                  <Form.Item
                    name="messageText"
                    rules={[{ required: true, message: "" }]}
                    className="!mb-0 flex-1"
                  >
                    <Input.TextArea
                      rows={1}
                      autoSize={{ minRows: 1, maxRows: 6 }}
                      placeholder="Write a message…"
                      bordered={false}
                      className="!resize-none !bg-transparent !px-0 !py-2.5 !text-[15px] !text-slate-900 placeholder:!text-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.submit();
                        }
                      }}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={sending}
                    className="!flex !h-11 !w-11 !items-center !justify-center !rounded-xl !border-0 !p-0 !shadow-lg !shadow-teal-900/25"
                    aria-label="Send message"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 -translate-x-px translate-y-px" />
                  </Button>
                </div>
                <p className="mt-2 hidden text-center text-[11px] text-slate-400 sm:block">
                  Enter to send · Shift+Enter for new line
                </p>
              </Form>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
