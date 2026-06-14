import { theme } from "antd";
import type { ThemeConfig } from "antd";

export const authDarkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#14b8a6",
    colorBgContainer: "#0f172a",
    colorBgElevated: "#1e293b",
    colorBorder: "#334155",
    colorBorderSecondary: "#1e293b",
    colorText: "#e2e8f0",
    colorTextSecondary: "#94a3b8",
    colorTextPlaceholder: "#64748b",
    borderRadiusLG: 14,
    fontFamily:
      'var(--font-petconnect), ui-sans-serif, system-ui, sans-serif',
  },
  components: {
    Input: {
      activeBorderColor: "#2dd4bf",
      hoverBorderColor: "#475569",
      activeShadow: "0 0 0 2px rgba(45, 212, 191, 0.15)",
    },
    Select: {
      activeBorderColor: "#2dd4bf",
      hoverBorderColor: "#475569",
    },
    InputNumber: {
      activeBorderColor: "#2dd4bf",
      hoverBorderColor: "#475569",
    },
    Segmented: {
      trackBg: "rgba(15, 23, 42, 0.9)",
      itemColor: "#94a3b8",
      itemHoverColor: "#e2e8f0",
      itemSelectedBg: "#0d9488",
      itemSelectedColor: "#ffffff",
    },
    Button: {
      primaryShadow: "0 10px 28px -8px rgba(13, 148, 136, 0.55)",
    },
  },
};

export const authInputClassName =
  "!rounded-xl !border-slate-700 !bg-slate-950 !py-2.5";

export const authSegmentedClassName =
  "[&_.ant-segmented]:!rounded-xl [&_.ant-segmented-item]:!rounded-lg [&_.ant-segmented]:!bg-slate-950 [&_.ant-segmented]:!p-1 [&_.ant-segmented-thumb]:!rounded-lg";

export const authPrimaryButtonClassName =
  "!h-12 !rounded-xl !border-0 !bg-gradient-to-r !from-teal-500 !to-teal-600 !font-bold !text-base !text-white shadow-lg shadow-teal-500/30 hover:!from-teal-400 hover:!to-teal-500 !transition-all";

export const authFormBoxClassName =
  "rounded-2xl border border-white/[0.08] bg-slate-950/40 p-6 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-7";

export const authLabelClassName = "text-sm font-medium text-slate-300";

export const authErrorAlertClassName =
  "!mb-5 !rounded-xl !border-red-500/25 !bg-red-950/30 backdrop-blur-sm [&_.ant-alert-message]:!text-red-200 [&_.ant-alert-description]:!text-red-100/90";
