import { create } from "zustand";

export type MessageNotificationItem = {
  senderUserId: string;
  unreadCount: number;
  previewText: string;
  lastMessageAt: string;
};

type State = {
  totalUnread: number;
  items: MessageNotificationItem[];
  setSummary: (total: number, items: MessageNotificationItem[]) => void;
  setTotalUnread: (n: number) => void;
  reset: () => void;
};

export const useMessageNotificationsStore = create<State>((set) => ({
  totalUnread: 0,
  items: [],
  setSummary: (total, items) =>
    set({ totalUnread: total, items }),
  setTotalUnread: (totalUnread) => set({ totalUnread }),
  reset: () => set({ totalUnread: 0, items: [] }),
}));
