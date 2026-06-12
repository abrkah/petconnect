"use client";
import React from "react";
import Link from "next/link";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const FooterComponent = () => {
  return (
    <footer className="w-full p-6 bg-slate-950 text-slate-200">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0 text-center sm:text-left">
          <h1 className="text-4xl font-bold">
            PetConnect
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            The easiest way to keep your pets happy, healthy, and well organized.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6 mt-4 sm:mt-0">
          <div className="flex items-center space-x-6 mb-4 sm:mb-0">
            <Link
              href="/privacy-policy"
              className="text-slate-300 hover:text-white"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-slate-300 hover:text-white"
              aria-label="Terms of Service"
            >
              Terms of Service
            </Link>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://linkedin.com/in/abrhakahsay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://github.com/abrhakahsay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white"
              aria-label="GitHub"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://twitter.com/abrhakahsay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white"
              aria-label="Twitter"
            >
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-slate-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} PetConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterComponent;
