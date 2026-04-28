"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section
      className="relative w-full border border-slate-200 rounded-2xl overflow-hidden pb-20 pt-24 px-6 md:px-12 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(14,165,233,0.2)] hover:-translate-y-1 bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            A smarter way to care for your pets
          </h2>
          <p className="mt-6 text-lg text-slate-700 leading-relaxed">
            PetConnect simplifies every part of pet ownership. Manage medical
            records, appointments, and communication with vets and caregivers
            from one easy-to-use platform.
          </p>
          <p className="mt-4 text-lg text-slate-700 leading-relaxed">
            Whether you have one pet or a whole family, our tools help you stay
            organized and keep your pets healthy, happy, and well cared for.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex justify-center w-full"
        >
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
            <Image
              src="/trainer.jfif"
              alt="Pet care dashboard"
              width={800}
              height={600}
              className="rounded-xl shadow-xl hover:shadow-2xl transition duration-300 ease-in-out object-cover w-full h-auto"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
