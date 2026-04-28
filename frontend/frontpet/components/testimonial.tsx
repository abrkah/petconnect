"use client";

import React from "react";
import { Card, Avatar } from "antd";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alice Johnson",
    role: "Pet Parent",
    image: "/testmonial1.jfif",
    review:
      "PetConnect made managing my dog’s appointments and health data so easy. I finally feel organized and in control.",
  },
  {
    name: "Michael Smith",
    role: "Cat Owner",
    image: "/testmonial2.jfif",
    review:
      "A fantastic platform for keeping multiple pets in one place. The booking tools are incredibly helpful.",
  },
  {
    name: "Sophia Martinez",
    role: "Small Pet Business Owner",
    image: "/testmonial3.jfif",
    review:
      "I love the community and support. The dashboard has everything I need for easy pet care management.",
  },
  {
    name: "Daniel Lee",
    role: "Dog Trainer",
    image: "/testmonial4.jfif",
    review:
      "One of the best investments I've made! The reminders and appointment scheduling save me so much time.",
  },
  {
    name: "Emma Brown",
    role: "Pet Enthusiast",
    image: "/testmonial5.jfif",
    review:
      "The platform is perfect for everyday pet owners. It’s easy to use and keeps all pet information in one place.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const TestimonialsSection = () => {
  return (
    <section
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
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700">
          What Our Students Say
        </h2>
        <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
          Hear from our growing community of skilled learners and professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <Card
              className="rounded-xl shadow-md hover:shadow-xl transition duration-300 h-full bg-white border-t-4 border-indigo-500"
              styles={{ body: { padding: "24px" } }}
            >
              <p className="text-gray-700 italic text-base md:text-lg">
                "{testimonial.review}"
              </p>
              <div className="flex items-center mt-6">
                <Avatar src={testimonial.image} size={64} />
                <div className="ml-4">
                  <h4 className="font-semibold text-lg text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-indigo-600 font-medium text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
