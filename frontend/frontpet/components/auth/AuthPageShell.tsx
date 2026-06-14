"use client";

import type { ReactNode } from "react";
import { ConfigProvider } from "antd";
import { motion } from "framer-motion";
import MarketingNav from "@/components/MarketingNav";
import { authDarkTheme } from "@/lib/auth-page-theme";

type AuthPageShellProps = {
  authPage: "login" | "register";
  badge: string;
  headline: ReactNode;
  description: string;
  features: { icon: ReactNode; label: string; accent?: string }[];
  sideNote?: ReactNode;
  children: ReactNode;
};

export default function AuthPageShell({
  authPage,
  badge,
  headline,
  description,
  features,
  sideNote,
  children,
}: AuthPageShellProps) {
  return (
    <ConfigProvider theme={authDarkTheme}>
      <div className="pc-auth-canvas relative flex min-h-screen flex-col overflow-hidden text-slate-200">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="auth-orb auth-orb-teal" />
          <div className="auth-orb auth-orb-sky" />
          <div className="auth-orb auth-orb-violet" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

        <MarketingNav mode="auth" authPage={authPage} />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-8 sm:px-8 md:py-12 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="auth-card-glow relative mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-slate-900/50 shadow-2xl shadow-black/50 backdrop-blur-xl lg:min-h-[580px] lg:flex-row"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

            {/* Hero panel */}
            <div className="relative flex flex-1 flex-col justify-between overflow-hidden border-b border-white/[0.06] px-7 py-9 sm:px-9 sm:py-10 lg:max-w-[44%] lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
              <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-teal-500/[0.07] blur-[90px]" />

              <div className="relative">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.7)]" />
                  </span>
                  {badge}
                </p>

                <h1 className="mt-6 text-balance text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-[2rem] lg:text-[2.15rem]">
                  {headline}
                </h1>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-400">
                  {description}
                </p>

                <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div
                      key={feature.label}
                      className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-sm"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-teal-400">
                        {feature.icon}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {sideNote ? (
                <div className="relative mt-8 hidden rounded-2xl border border-white/[0.06] bg-slate-950/50 p-4 backdrop-blur-sm sm:block">
                  {sideNote}
                </div>
              ) : null}
            </div>

            {/* Form panel */}
            <div className="relative flex flex-1 flex-col justify-center px-6 py-9 sm:px-9 sm:py-10 lg:px-10 lg:py-12">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/[0.03] via-transparent to-violet-500/[0.04]" />
              <div className="relative mx-auto w-full max-w-md">{children}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </ConfigProvider>
  );
}
