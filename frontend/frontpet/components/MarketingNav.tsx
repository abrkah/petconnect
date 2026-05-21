"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeartOutlined } from "@ant-design/icons";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

type MarketingNavProps = {
  mode?: "landing" | "auth";
  authPage?: "login" | "register";
};

export default function MarketingNav({
  mode = "landing",
  authPage,
}: MarketingNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <nav className="flex w-full items-center justify-between gap-4 px-6 py-4 md:px-10 lg:px-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white no-underline"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-950 text-teal-400 ring-1 ring-teal-500/25">
            <HeartOutlined className="text-xl" />
          </span>
          PetConnect
        </Link>

        {mode === "landing" ? (
          <div className="hidden items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-2 py-2 text-sm font-medium text-slate-300 md:flex">
            <Link
              href="#features"
              className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#loved-by"
              className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white"
            >
              Stories
            </Link>
            <Link
              href="/login"
              className="ml-1 rounded-full bg-teal-600 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-teal-500"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <div className="hidden items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-2 py-2 text-sm font-medium text-slate-300 md:flex">
            <Link
              href="/"
              className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white"
            >
              Features
            </Link>
            {authPage === "register" ? (
              <Link
                href="/login"
                className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white"
              >
                Sign in
              </Link>
            ) : (
              <Link
                href="/register"
                className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white"
              >
                Register
              </Link>
            )}
            <Link
              href={authPage === "register" ? "/register" : "/login"}
              className="ml-1 rounded-full bg-teal-600 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-teal-500"
              aria-current="page"
            >
              {authPage === "register" ? "Register" : "Sign in"}
            </Link>
          </div>
        )}

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </nav>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 border-t border-slate-800 px-6 py-4 md:hidden md:px-10"
        >
          {mode === "landing" ? (
            <>
              <Link
                href="#features"
                className="block rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-200"
                onClick={close}
              >
                Features
              </Link>
              <Link
                href="/login?role=OWNER"
                className="block rounded-xl bg-teal-600 px-4 py-3 text-center font-semibold text-white"
                onClick={close}
              >
                Pet owner login
              </Link>
              <Link
                href="/login?role=PROVIDER"
                className="block rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-center font-semibold text-white"
                onClick={close}
              >
                Provider login
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="block rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-200"
                onClick={close}
              >
                Home
              </Link>
              <Link
                href="/login?role=OWNER"
                className="block rounded-xl bg-teal-600 px-4 py-3 text-center font-semibold text-white"
                onClick={close}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="block rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-center font-semibold text-white"
                onClick={close}
              >
                Register
              </Link>
            </>
          )}
        </motion.div>
      )}
    </header>
  );
}
