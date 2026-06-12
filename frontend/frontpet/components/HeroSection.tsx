"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  HeartOutlined,
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const HeroSection = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: <FileTextOutlined />,
      title: "Health records",
      text: "Vaccinations, weight trends, and vet notes in one place.",
      accent: "from-emerald-500/20 to-teal-500/10",
    },
    {
      icon: <HeartOutlined />,
      title: "Trusted providers",
      text: "Browse professionals, chat, hire, and book care confidently.",
      accent: "from-rose-500/15 to-orange-500/10",
    },
    {
      icon: <CalendarOutlined />,
      title: "Flexible booking",
      text: "Date ranges, services from walks to vaccinations.",
      accent: "from-sky-500/20 to-indigo-500/10",
    },
    {
      icon: <MessageOutlined />,
      title: "Direct messaging",
      text: "Stay in sync with providers before and after appointments.",
      accent: "from-violet-500/15 to-fuchsia-500/10",
    },
  ];

  const stats = [
    { label: "Health events tracked", value: "24k+" },
    { label: "Avg. booking time", value: "2 min" },
    { label: "Provider response", value: "< 1h" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-slate-200">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-teal-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-10 md:px-12 md:pb-12 md:pt-12">
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 shadow-2xl shadow-black/40 ring-1 ring-white/5">
          <div className="relative px-4 pb-20 pt-6 text-white sm:px-8 sm:pb-24 sm:pt-8 lg:px-10 lg:pb-28">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-slate-950" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.18),transparent)]" />
            <div className="absolute inset-0 opacity-40 mix-blend-soft-light">
              <div
                className="h-full w-full opacity-[0.35]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            <div className="relative z-10">
              <nav className="mb-10 flex items-center justify-between gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white/95 no-underline"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                    <HeartOutlined className="text-xl" />
                  </span>
                  PetConnect
                </Link>
                <div className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-2 text-sm font-medium text-white/90 shadow-lg shadow-black/10 backdrop-blur-md md:flex">
                  <Link
                    href="#features"
                    className="rounded-full px-4 py-2 transition hover:bg-white/15 hover:text-white"
                  >
                    Features
                  </Link>
                  <Link
                    href="#loved-by"
                    className="rounded-full px-4 py-2 transition hover:bg-white/15 hover:text-white"
                  >
                    Stories
                  </Link>
                  <Link
                    href="/login"
                    className="ml-1 rounded-full bg-white px-5 py-2 font-semibold text-teal-800 shadow-md transition hover:bg-teal-50"
                  >
                    Sign in
                  </Link>
                </div>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/25 md:hidden"
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
                  className="mb-8 space-y-2 md:hidden"
                >
                  <Link
                    href="#features"
                    className="block rounded-xl bg-white/10 px-4 py-3 text-white/95 ring-1 ring-white/20"
                    onClick={() => setMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="/login?role=OWNER"
                    className="block rounded-xl bg-white px-4 py-3 text-center font-semibold text-teal-800 shadow-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Pet owner login
                  </Link>
                  <Link
                    href="/login?role=PROVIDER"
                    className="block rounded-xl border-2 border-white/40 px-4 py-3 text-center font-semibold text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Provider login
                  </Link>
                </motion.div>
              )}

              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-100 ring-1 ring-white/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    Care, connected
                  </p>
                  <h1 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
                    Care for every pet,{" "}
                    <span className="bg-gradient-to-r from-teal-100 via-white to-cyan-100 bg-clip-text text-transparent">
                      one calm dashboard
                    </span>
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-teal-50/90 sm:text-lg">
                    PetConnect helps owners track health, message providers, and
                    book services—while professionals manage pets, schedules, and
                    records in a single workflow.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <Link
                      href="/login?role=OWNER"
                      className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-teal-800 shadow-xl shadow-teal-950/25 transition hover:bg-teal-50"
                    >
                      Login as pet owner
                      <ArrowRightOutlined className="transition group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/login?role=PROVIDER"
                      className="inline-flex items-center justify-center rounded-2xl border-2 border-white/55 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
                    >
                      Provider login
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center px-2 py-3 text-sm font-medium text-white/85 underline decoration-white/40 underline-offset-4 transition hover:text-white sm:ml-1"
                    >
                      Create account →
                    </Link>
                  </div>

                  <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/15 pt-8 sm:max-w-lg sm:gap-6">
                    {stats.map((s) => (
                      <div key={s.label}>
                        <dt className="text-[10px] font-medium uppercase leading-tight tracking-wide text-teal-200/80 sm:text-xs">
                          {s.label}
                        </dt>
                        <dd className="mt-1 text-xl font-bold tabular-nums text-white sm:text-2xl">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, delay: 0.08 }}
                  className="relative"
                >
                  <div className="grid grid-cols-6 grid-rows-[repeat(4,minmax(0,1fr))] gap-2 sm:gap-3 lg:h-[min(420px,55vh)] lg:min-h-[320px]">
                    <div className="relative col-span-6 row-span-2 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/30 sm:rounded-3xl">
                      <Image
                        src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80"
                        alt="Happy dog outdoors"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-teal-950/60 via-transparent to-transparent" />
                      <p className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white drop-shadow sm:bottom-4 sm:left-4">
                        Your pet&apos;s story — visible to everyone who cares.
                      </p>
                    </div>
                    <div className="relative col-span-3 row-span-2 overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/25 sm:rounded-2xl">
                      <Image
                        src="https://images.unsplash.com/photo-1514888287744-e339aab2952e?auto=format&fit=crop&w=800&q=80"
                        alt="Cat relaxing indoors"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="relative col-span-3 row-span-2 overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/25 sm:rounded-2xl">
                      <Image
                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
                        alt="Dog with owner"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute -bottom-6 -right-4 hidden h-24 w-24 rounded-2xl bg-gradient-to-br from-cyan-400/90 to-teal-500/90 opacity-80 blur-2xl sm:block" />
                </motion.div>
              </div>
            </div>
          </div>

          <div
            id="features"
            className="scroll-mt-24 border-t border-slate-800 bg-slate-950 px-4 py-16 sm:px-8 sm:py-20 lg:px-10"
          >
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Product
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Built for real pet care teams
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Owners get a calm dashboard; providers get hire requests,
                bookings, and clinical-style records—with approval flows so
                everyone sees the right data.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-lg shadow-black/25 transition duration-300 hover:-translate-y-1.5 hover:border-teal-500/40 hover:shadow-teal-950/25"
                >
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${f.accent} opacity-0 blur-2xl transition group-hover:opacity-100`}
                  />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-950 text-xl text-teal-400 shadow-inner ring-1 ring-teal-500/20 transition duration-300 group-hover:bg-teal-600 group-hover:text-white">
                    {f.icon}
                  </div>
                  <h3 className="relative mt-4 text-base font-semibold text-white">
                    {f.title}
                  </h3>
                  <p className="relative mt-1 text-sm leading-relaxed text-slate-400">
                    {f.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
