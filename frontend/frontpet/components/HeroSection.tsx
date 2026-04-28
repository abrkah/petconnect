"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HeartOutlined,
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const HeroSection = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    { icon: <FileTextOutlined />, title: "Digital Pet Passport" },
    { icon: <HeartOutlined />, title: "Health Dashboard" },
    { icon: <CalendarOutlined />, title: "Easy Booking" },
    { icon: <MessageOutlined />, title: "Direct Messaging" },
  ];

  return (
    <section className="relative overflow-hidden">

      {/* BACKGROUND BLOBS */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-sky-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-indigo-300/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto">

        <div className="bg-white border border-slate-200 shadow-[0_40px_120px_rgba(0,0,0,0.12)] overflow-hidden">

          {/* HERO */}
          <div className="relative bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white px-5 sm:px-10 pt-6 pb-24">

            {/* NAV */}
            <div className="flex items-center justify-between mb-10">

              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                PetConnect
              </h2>

              {/* DESKTOP MENU */}
              <div className="hidden md:flex gap-8 text-sm text-white/80">
                {["About", "Services", "Pricing"].map((item) => (
                  <span
                    key={item}
                    className="hover:text-white cursor-pointer transition"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* DESKTOP BUTTONS */}
              <div className="hidden md:flex gap-3">
                <button className="px-4 py-2 rounded-lg text-sm border border-white/30 hover:bg-white/10 transition">
                  Login
                </button>

                <button className="px-4 py-2 rounded-lg text-sm bg-white text-blue-600 font-semibold hover:scale-105 transition">
                  Get Started
                </button>
              </div>

              {/* MOBILE MENU BUTTON */}
              <button
                className="md:hidden text-white text-2xl"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
              <div className="md:hidden mb-6 bg-white/10 backdrop-blur rounded-xl p-4 space-y-3">
                {["About", "Services", "Pricing"].map((item) => (
                  <div key={item} className="text-white/90">
                    {item}
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-3 py-2 rounded-lg border border-white/30">
                    Login
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg bg-white text-blue-600 font-semibold">
                    Get Started
                  </button>
                </div>
              </div>
            )}

            {/* MAIN CONTENT */}
            <div className="grid lg:grid-cols-2 items-center gap-10">

              {/* LEFT */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
                  All Your Pet Care in One Place
                </h1>

                <p className="text-white/85 text-base sm:text-lg mb-8 max-w-lg">
                  Manage pets, health records, bookings, and communication
                  in a modern platform built for pet lovers and clinics.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 active:scale-95 transition">
                    Get Started
                  </button>
                  <button className="border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                    View Demo
                  </button>
                </div>
              </motion.div>

              {/* RIGHT MOCK DASHBOARD */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="hidden lg:block"
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-white/80">
                      Today’s Overview
                    </h3>
                    <span className="text-xs text-white/60">Live</span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/15 rounded-xl p-4">
                      🐶 Bella — Vaccination due next week
                    </div>
                    <div className="bg-white/15 rounded-xl p-4">
                      🩺 Vet appointment: Tomorrow 10:00 AM
                    </div>
                    <div className="bg-white/15 rounded-xl p-4">
                      💬 New message from Dr. Smith
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="h-10 bg-white/20 rounded-lg" />
                    <div className="h-10 bg-white/20 rounded-lg" />
                  </div>

                </div>
              </motion.div>

            </div>

            {/* CURVE */}
            <div className="absolute bottom-0 left-0 w-full">
              <svg viewBox="0 0 1440 120" className="w-full h-[90px]">
                <path
                  fill="white"
                  d="M0,40 C320,120 1120,0 1440,80 L1440,120 L0,120 Z"
                />
              </svg>
            </div>

          </div>

          {/* FEATURES */}
          <div className="bg-white py-14 px-5 sm:px-10">

            <div className="text-center mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Everything you need for pet care
              </h2>
              <p className="text-slate-500 mt-2">
                All tools in one simple dashboard
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 text-xl group-hover:bg-sky-600 group-hover:text-white transition">
                    {f.icon}
                  </div>

                  <h3 className="text-base font-semibold mt-4 group-hover:text-sky-600 transition">
                    {f.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Manage everything in one place.
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