"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FooterComponent from "@/components/footer";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/testimonial";
import {
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const chips = [
    {
      icon: ShieldCheckIcon,
      title: "Privacy-first",
      text: "Role-aware data so owners and providers only see what they need.",
    },
    {
      icon: DevicePhoneMobileIcon,
      title: "Responsive",
      text: "Book, message, and review records on phone or desktop.",
    },
    {
      icon: SparklesIcon,
      title: "Modern UX",
      text: "Fast flows, clear status, and a UI that feels calm—not cluttered.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-200">
      <HeroSection />

      <section className="relative border-y border-slate-800 py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
        <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-teal-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Why teams switch
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Designed for trust and everyday speed
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {chips.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-teal-950/20"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-teal-500/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-500/25 ring-1 ring-teal-400/30">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="relative mt-5 text-lg font-bold text-white">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative mx-auto w-full max-w-7xl flex-1 space-y-16 px-6 pb-20 pt-12 md:px-12">
        <section id="loved-by" className="relative scroll-mt-28">
          <TestimonialsSection />
        </section>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 px-8 py-14 text-center shadow-lg shadow-black/25 sm:px-14 sm:py-16"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <SparklesIcon className="h-4 w-4 text-teal-400" aria-hidden />
              Free to start
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready when your pets are
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              Sign in with your role or create an account in under a minute—same
              polished experience on web.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login?role=OWNER"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-950/30 transition hover:bg-teal-500"
              >
                I&apos;m a pet owner
                <ArrowRightIcon className="h-5 w-5 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login?role=PROVIDER"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-600 bg-slate-950 px-8 py-4 text-base font-bold text-white transition hover:border-teal-500/50 hover:bg-slate-800"
              >
                I&apos;m a provider
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-500">
              New here?{" "}
              <Link
                href="/register"
                className="font-semibold text-teal-400 underline decoration-teal-500/40 underline-offset-4 hover:text-teal-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </motion.section>
      </div>

      <FooterComponent />
    </div>
  );
};

export default LandingPage;
