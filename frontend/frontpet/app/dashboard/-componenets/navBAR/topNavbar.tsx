"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Dropdown, Layout } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/dashboard/admin";

const { Header } = Layout;

interface NavBarProps {
  page: string;
  handleLogout: () => void;
}

const NavBar = ({ page, handleLogout }: NavBarProps) => {
  const router = useRouter();

  const employeeData = {
    profileImage: "/chemist.jfif",
  };

  const handleProfileRoute = () => {
    router.push(`/dashboard/user-management/profile`);
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: <span onClick={handleProfileRoute}>Profile</span>,
    },
    {
      key: "logout",
      label: <span onClick={handleLogout}>Logout</span>,
    },
  ];

  return (
    <Header
      className="flex justify-between items-center bg-white shadow-md w-[90%] md:w-full"
      style={{ padding: "0 20px" }}
    >
      <p className="text-lg font-semibold">{page}</p>
      <div className="flex items-center gap-5">
        {/* Notification placeholder */}
        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-white">
          N
        </div>
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Avatar
            src={employeeData?.profileImage}
            className="cursor-pointer border border-gray-300 rounded-full"
            size={40}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default NavBar;
