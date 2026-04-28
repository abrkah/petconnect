"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGetPlans } from "@/app/utils/store/server/pricing/query";

// Define the Plan type
type Plan = {
  id: number;
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
};

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const PricingPage = () => {
  const { data: plans = [], isLoading } = useGetPlans();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-indigo-600 text-xl font-semibold">
          Loading Plans...
        </span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full 
    border border-blue-100 dark:border-neutral-700 
    rounded-2xl
      dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 
      overflow-hidden pb-20 pt-24 px-6 md:px-12 
      transition-all duration-500 
      hover:shadow-[0_8px_40px_rgba(59,130,246,0.4)] 
      hover:-translate-y-1 
      hover:bg-gradient-to-br hover:from-blue-50 hover:via-blue-100 hover:to-blue-50"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 text-base md:text-lg mb-12 max-w-2xl mx-auto">
          Affordable pricing plans designed for every type of learner and
          organization.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <div
                className={`relative p-8 rounded-2xl shadow-md bg-white flex flex-col border transition-all ${
                  plan.popular
                    ? "border-indigo-600 ring-2 ring-indigo-300"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.title}
                </h2>
                <p className="text-4xl font-extrabold text-indigo-600 mb-2">
                  {plan.price}
                </p>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="flex-1 space-y-2 mb-6 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-gray-700 flex items-start">
                      <span className="text-green-500 mr-2 text-lg">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  aria-label={`Select ${plan.title} plan`}
                  className="mt-auto bg-indigo-600 text-white font-semibold px-5 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Select Plan
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
