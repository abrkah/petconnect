import { create } from "zustand";

export type MessageNotificationItem = {
  senderUserId: string;
  senderDisplayName?: string | null;
  unreadCount: number;
  previewText: string;
  lastMessageAt: string;
};

export type HireNotificationItem = {
  id: string;
  ownerFullName: string;
  message?: string | null;
  petCount: number;
  createdAt: string;
};

export type HireOwnerNotificationItem = {
  id: string;
  providerFullName: string;
  status: string;
  message?: string | null;
  responseMessage?: string | null;
  petCount: number;
  updatedAt: string;
};

type State = {
  totalUnread: number;
  items: MessageNotificationItem[];
  hirePendingTotal: number;
  hireItems: HireNotificationItem[];
  hireOwnerUpdateTotal: number;
  hireOwnerItems: HireOwnerNotificationItem[];
  setSummary: (total: number, items: MessageNotificationItem[]) => void;
  setHireSummary: (total: number, items: HireNotificationItem[]) => void;
  setHireOwnerSummary: (
    total: number,
    items: HireOwnerNotificationItem[],
  ) => void;
  setTotalUnread: (n: number) => void;
  setHirePendingTotal: (n: number) => void;
  setHireOwnerUpdateTotal: (n: number) => void;
  reset: () => void;
};

export const useMessageNotificationsStore = create<State>((set) => ({
  totalUnread: 0,
  items: [],
  hirePendingTotal: 0,
  hireItems: [],
  hireOwnerUpdateTotal: 0,
  hireOwnerItems: [],
  setSummary: (total, items) =>
    set({ totalUnread: total, items }),
  setHireSummary: (total, items) =>
    set({ hirePendingTotal: total, hireItems: items }),
  setHireOwnerSummary: (total, items) =>
    set({ hireOwnerUpdateTotal: total, hireOwnerItems: items }),
  setTotalUnread: (totalUnread) => set({ totalUnread }),
  setHirePendingTotal: (hirePendingTotal) => set({ hirePendingTotal }),
  setHireOwnerUpdateTotal: (hireOwnerUpdateTotal) =>
    set({ hireOwnerUpdateTotal }),
  reset: () =>
    set({
      totalUnread: 0,
      items: [],
      hirePendingTotal: 0,
      hireItems: [],
      hireOwnerUpdateTotal: 0,
      hireOwnerItems: [],
    }),
}));
