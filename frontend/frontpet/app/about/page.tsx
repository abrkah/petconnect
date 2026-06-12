"use client";

import Image from "next/image";

const About = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-950 leading-tight">
            The all-in-one platform for pet owners
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            PetConnect brings pet care, health tracking, and booking tools
            together so owners can focus on what matters most — their pets.
          </p>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Manage multiple pets, schedule appointments, and communicate with
            care professionals from a single dashboard designed for everyday
            pet parents.
          </p>
        </div>

        <div className="flex justify-center w-full">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
            <Image
              src="/trainer.jfif"
              alt="Pet care team"
              width={800}
              height={600}
              className="rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out object-cover w-full h-auto"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
