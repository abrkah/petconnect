import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { setCookie, removeCookie } from "@/components/helpers/storageHelper";

interface StoreState {
  token: string;
  setToken: (token: string) => void;

  userId: string;
  setUserId: (userId: string) => void;

  userData: Record<string, any>;
  setUserData: (userData: Record<string, any>) => void;

  loggedUserRole: string;
  setLoggedUserRole: (loggedUserRole: string) => void;

  isFirstLogin: boolean;
  setIsFirstLogin: (v: boolean) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;

  hostname: string | null;
  setHostName: (hostname: string | null) => void;

  activeCalendar: string | number | Date | undefined;
  setActiveCalendar: (
    activeCalendar: string | number | Date | undefined
  ) => void;

  logout: () => void;
}

export const useAuthenticationStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        token: "",
        setToken: (token: string) => {
          setCookie("token", token, 30); // set cookie for 30 days
          set({ token });
        },

        userId: "",
        setUserId: (userId: string) => {
          set({ userId });
        },

        userData: {},
        setUserData: (userData: Record<string, any>) => {
          set({ userData });
        },

        loggedUserRole: "",
        setLoggedUserRole: (loggedUserRole: string) => {
          setCookie("loggedUserRole", loggedUserRole, 30);
          set({ loggedUserRole });
        },

        isFirstLogin: false,
        setIsFirstLogin: (isFirstLogin: boolean) => set({ isFirstLogin }),

        loading: false,
        setLoading: (loading: boolean) => set({ loading }),

        error: null,
        setError: (error: string | null) => set({ error }),

        hostname: null,
        setHostName: (hostname: string | null) => set({ hostname }),

        activeCalendar: "",
        setActiveCalendar: (activeCalendar) => {
          setCookie("activeCalendar", activeCalendar, 30);
          set({ activeCalendar });
        },

        logout: () => {
          removeCookie("token");
          removeCookie("loggedUserRole");
          removeCookie("activeCalendar");
          localStorage.removeItem("login"); // if you keep this flag
          set({
            token: "",
            userId: "",
            userData: {},
            loggedUserRole: "",
            activeCalendar: "",
            isFirstLogin: false,
          });
        },
      }),
      {
        name: "authentications-storage",
        getStorage: () => localStorage,
        partialize: (state) => ({
          token: state.token,
          userId: state.userId,
          userData: state.userData,
          loggedUserRole: state.loggedUserRole,
          activeCalendar: state.activeCalendar,
          isFirstLogin: state.isFirstLogin,
        }),
      }
    )
  )
);
