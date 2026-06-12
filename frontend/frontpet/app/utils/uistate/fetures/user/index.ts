import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Define the types for better type safety
interface EditState {
  name: boolean;
  grade: boolean;
  teacher: boolean;
}

interface ModalState {
  open: boolean;
  type: string;
}

interface UserStore {
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

  selectedUser: any;
  selectedUserFrom: any;
  selectedUserTo: any;
  dateRange: any[];

  setSelectedUser: (user: any) => void;
  setSelectedUserFrom: (user: any) => void;
  setSelectedUserTo: (user: any) => void;
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

export const useUserStore = create<UserStore>()(
  devtools((set) => ({
    open: false,
    isConsume: false,
    deleteModal: false,
    confirmModal: false,

    edit: {
      name: false,
      grade: false,
      teacher: false,
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

    selectedUser: null,
    selectedUserFrom: null,
    selectedUserTo: null,
    dateRange: [],

    setSelectedUser: (user) => set({ selectedUser: user }),
    setSelectedUserFrom: (user) => set({ selectedUserFrom: user }),
    setSelectedUserTo: (user) => set({ selectedUserTo: user }),
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
