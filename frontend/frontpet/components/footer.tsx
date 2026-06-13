"use client";

import React, { useState } from "react";
import Link from "next/link";
import { message } from "antd";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { HeartIcon } from "@heroicons/react/24/solid";
import { subscribeNewsletterApi } from "@/lib/petconnect-api";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FooterComponent = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      message.warning("Enter your email address.");
      return;
    }

    if (!emailPattern.test(trimmed)) {
      message.warning("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await subscribeNewsletterApi(trimmed);
      if (result.alreadySubscribed) {
        message.info(result.message);
      } else {
        message.success(result.message);
        setEmail("");
      }
    } catch {
      message.error("Could not subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative w-full overflow-hidden bg-slate-950 text-slate-200">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-teal-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-16 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-10">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-white no-underline"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/25">
                <HeartIcon className="h-5 w-5" />
              </span>
              PetConnect
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              The easiest way to manage pets, appointments, and health records
              in one modern workspace—for families and the pros who support
              them.
            </p>
            <div className="mt-6 flex gap-4 text-xl text-slate-400">
              <a
                href="https://linkedin.com/in/abrhakahsay"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 transition hover:bg-white/5 hover:text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/abrhakahsay"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 transition hover:bg-white/5 hover:text-white"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://twitter.com/abrhakahsay"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 transition hover:bg-white/5 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-300 transition hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/login?role=OWNER"
                  className="text-slate-300 transition hover:text-white"
                >
                  Owner login
                </Link>
              </li>
              <li>
                <Link
                  href="/login?role=PROVIDER"
                  className="text-slate-300 transition hover:text-white"
                >
                  Provider login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-slate-300 transition hover:text-white"
                >
                  Create account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-slate-300 transition hover:text-white"
                >
                  Blog
                </Link>
              </li>
              <li>
                <span className="cursor-not-allowed text-slate-500">
                  Help Center
                </span>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 transition hover:text-white"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="cursor-not-allowed text-slate-500">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed text-slate-500">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-12 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-md">
            <h4 className="text-base font-semibold text-white">
              Product updates
            </h4>
            <p className="mt-1 text-sm text-slate-500">
              Occasional notes on new features—no spam.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                disabled={submitting}
                autoComplete="email"
                className="min-h-11 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 text-slate-100 placeholder:text-slate-500 outline-none ring-teal-500/0 transition focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/30 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="min-h-11 shrink-0 rounded-xl bg-teal-500 px-6 font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 disabled:cursor-wait disabled:opacity-70"
              >
                {submitting ? "Sending email..." : "Subscribe"}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-slate-600 lg:text-right">
            © {new Date().getFullYear()} PetConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
