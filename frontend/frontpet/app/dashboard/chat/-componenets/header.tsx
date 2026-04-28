"use client";

import { FiBell, FiUser } from "react-icons/fi";
import Image from "next/image";

const Header = () => {
  return (
    <header className="h-16 px-6 flex items-center justify-between border-b bg-white shadow-sm">
      <h1 className="text-xl font-semibold">Communication</h1>

      <div className="flex items-center space-x-4">
        <FiBell className="w-5 h-5 text-gray-600 cursor-pointer" />
        <FiUser className="w-5 h-5 text-gray-600 cursor-pointer" />
        <Image
          src="/trainer.jfif"
          alt="User Avatar"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Header;
