"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const FooterComponent = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-200 pt-16 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold mb-3">
            PetConnect
          </h2>
          <p className="text-sm text-slate-400">
            The easiest way to manage your pets, appointments, and health records in one place.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/" className="hover:text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                Health Tracking
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white">
                Bookings
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white">
                Resources
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/blog" className="hover:text-white">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-white">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-white">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="my-10 border-t border-slate-800" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full md:w-1/2">
          <h4 className="text-lg font-semibold mb-2 text-slate-100">
            Subscribe for product updates
          </h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-2 w-full sm:w-auto rounded border border-slate-700 bg-slate-900 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
            <button
              onClick={handleSubscribe}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium transition"
            >
              Subscribe
            </button>
          </div>
        </div>

        <div className="flex gap-6 text-xl text-slate-300">
          <a
            href="https://linkedin.com/in/abrhakahsay"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/abrhakahsay"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            <FaGithub />
          </a>
          <a
            href="https://twitter.com/abrhakahsay"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            <FaTwitter />
          </a>
        </div>
      </div>

      <div className="mt-10 text-center text-slate-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} PetConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterComponent;
