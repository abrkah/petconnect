import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Add these interfaces for message typing (adjust as needed)
interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  content: string;
  sender: User;
  receiver: User;
  sentAt: string;
}

interface EditState {
  details: boolean;
  schedule: boolean;
  pricing: boolean;
  specifications: boolean;
  categories: boolean;
}

interface ModalState {
  open: boolean;
  type: string;
}

interface MessageStore {
  open: boolean;
  isConsume: boolean;
  deleteModal: boolean;
  confirmModal: boolean;

  edit: EditState;
  setEdit: (key: keyof EditState) => void;

  categoryQuery: string;
  setSelectedCategory: (query: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isBatch: boolean;
  setIsBatch: (isBatch: boolean) => void;

  selectedMessage: any;
  selectedMessageFrom: any;
  selectedMessageTo: any;
  dateRange: any[];

  // ** Chat/message related state **
  messages: Message[];
  selectedChatUserId: string | null;

  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setSelectedChatUserId: (id: string | null) => void;

  setSelectedMessage: (message: any) => void;
  setSelectedMessageFrom: (message: any) => void;
  setSelectedMessageTo: (message: any) => void;
  setDateRange: (range: any[]) => void;

  modalState: ModalState;
  setModalState: (newState: Partial<ModalState>) => void;

  maxQuantity: number | null;
  setMaxQuantity: (maxQuantity: number | null) => void;

  modalTitle: string;
  setModalTitle: (title: string) => void;

  modalAction: () => void;
  setModalAction: (action: () => void) => void;

  selectedProject: any;
  setSelectedProject: (project: any) => void;

  searchParams: any;
  setSearchParams: (searchParams: any) => void;

  formMode: string;
  setFormMode: (mode: string) => void;

  isDrawerOpen: boolean;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;

  setOpen: (open: boolean) => void;
}

export const useMessageStore = create<MessageStore>()(
  devtools((set) => ({
    open: false,
    isConsume: false,
    deleteModal: false,
    confirmModal: false,

    edit: {
      details: false,
      schedule: false,
      pricing: false,
      specifications: false,
      categories: false,
    },

    setEdit: (key) =>
      set((state) => ({
        edit: {
          ...state.edit,
          [key]: !state.edit[key],
        },
      })),

    categoryQuery: "",
    setSelectedCategory: (query) => set({ categoryQuery: query }),

    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),

    isBatch: false,
    setIsBatch: (isBatch) => set({ isBatch }),

    selectedMessage: null,
    selectedMessageFrom: null,
    selectedMessageTo: null,
    dateRange: [],

    // ** Chat state initial values **
    messages: [],
    selectedChatUserId: null,

    // ** Chat state setters **
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
      set((state) => ({ messages: [...state.messages, message] })),
    setSelectedChatUserId: (id) => set({ selectedChatUserId: id }),

    setSelectedMessage: (message) => set({ selectedMessage: message }),
    setSelectedMessageFrom: (message) => set({ selectedMessageFrom: message }),
    setSelectedMessageTo: (message) => set({ selectedMessageTo: message }),
    setDateRange: (range) => set({ dateRange: range }),

    modalState: {
      open: false,
      type: "",
    },

    setModalState: (newState) =>
      set((state) => ({
        modalState: {
          ...state.modalState,
          ...newState,
        },
      })),

    maxQuantity: null,
    setMaxQuantity: (maxQuantity) => set({ maxQuantity }),

    modalTitle: "",
    setModalTitle: (title) => set({ modalTitle: title }),

    modalAction: () => {},
    setModalAction: (action) => set({ modalAction: action }),

    selectedProject: null,
    setSelectedProject: (project) => set({ selectedProject: project }),

    searchParams: null,
    setSearchParams: (searchParams) => set({ searchParams }),

    formMode: "",
    setFormMode: (mode) => set({ formMode: mode }),

    isDrawerOpen: false,
    setIsDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),

    setOpen: (open) => set({ open }),
  }))
);
