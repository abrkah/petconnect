"use client";

import React from "react";
import { Avatar } from "antd";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alice Johnson",
    role: "Pet parent",
    image: "/testmonial1.jfif",
    review:
      "PetConnect made managing my dog’s appointments and health data so easy. I finally feel organized and in control.",
  },
  {
    name: "Michael Smith",
    role: "Cat owner",
    image: "/testmonial2.jfif",
    review:
      "A fantastic platform for keeping multiple pets in one place. The booking tools are incredibly helpful.",
  },
  {
    name: "Sophia Martinez",
    role: "Grooming studio owner",
    image: "/testmonial3.jfif",
    review:
      "Our team lives in the provider dashboard—hire requests, messaging, and records without the spreadsheet chaos.",
  },
  {
    name: "Daniel Lee",
    role: "Dog trainer",
    image: "/testmonial4.jfif",
    review:
      "One of the best investments I've made! The reminders and appointment scheduling save me so much time.",
  },
  {
    name: "Emma Brown",
    role: "Multi-pet household",
    image: "/testmonial5.jfif",
    review:
      "The platform is perfect for everyday pet owners. It’s easy to use and keeps all pet information in one place.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const TestimonialsSection = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 px-6 py-14 shadow-xl shadow-black/30 ring-1 ring-white/5 sm:px-8 sm:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />
      <div className="pointer-events-none absolute -right-20 top-16 h-56 w-56 rounded-full bg-teal-600/10 blur-[90px]" />

      <div className="relative mx-auto mb-12 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Loved by pet people
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Real stories from owners &amp; providers
        </h2>
        <p className="mt-3 text-base text-slate-400 sm:text-lg">
          A calmer way to coordinate care—from vaccines and weight checks to
          bookings and chat.
        </p>
      </div>

      <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-5">
        {testimonials.map((testimonial, index) => (
          <motion.article
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:border-teal-500/35 hover:shadow-teal-950/20"
          >
            <span
              className="font-serif text-5xl font-bold leading-none text-teal-500/30"
              aria-hidden
            >
              &ldquo;
            </span>
            <p className="mt-3 flex-1 text-base leading-relaxed text-slate-300">
              “{testimonial.review}”
            </p>
            <div className="mt-6 flex items-center gap-4 border-t border-slate-800 pt-5">
              <Avatar
                src={testimonial.image}
                size={56}
                className="ring-2 ring-teal-900"
              />
              <div>
                <h4 className="font-semibold text-white">
                  {testimonial.name}
                </h4>
                <p className="text-sm font-medium text-teal-400/90">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
