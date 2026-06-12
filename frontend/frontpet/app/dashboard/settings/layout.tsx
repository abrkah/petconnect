"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaShoppingBag } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { Layout } from "antd";
import TraineeProfileDashboard from "./-component/traineeProfile";
import { useGetProfile } from "@/app/utils/store/server/profile/query";

const { Content } = Layout;

export default function UserAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const { data: user, isLoading: isLoadingProfile, error } = useGetProfile();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("Role"); // "Trainee" or "Admin"
      setRole(storedRole);
    }
  }, []);

  // Example user data for trainee


  const links = [
    {
      href: "/dashboard/settings/products",
      icon: <FaShoppingBag />,
      label: "Products",
    },
    {
      href: "/dashboard/settings/blogs",
      icon: <CgNotes />,
      label: "Blogs",
    },
    {
      href: "/dashboard/settings/pricing-plan",
      icon: <FaShoppingBag />,
      label: "Pricing Plan",
    },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);

  if (!role) return null; // or a loading spinner

  // If role is trainee, render the trainee profile dashboard
  if (role === "Trainee") {
    return <TraineeProfileDashboard userData={user} />;
  }

  // Else, render admin layout
  return (
    <div className="bg-white h-screen overflow-hidden">
      {/* Header */}
      <div className="my-5">
        <h1 className="text-xl font-bold">Setting - User Access</h1>
      </div>

      {/* Sidebar and Content */}
      <div className="grid grid-cols-12 gap-3">
        {/* Sidebar */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg border">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 p-4 transition-all duration-200 ${
                    active
                      ? "bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
                      : "hover:bg-gray-100 text-gray-800 pl-[calc(1rem+4px)]"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <Content className="col-span-10 min-h-screen">{children}</Content>
      </div>
    </div>
  );
}
