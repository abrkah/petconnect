"use client";
import React from "react";
import AdminDashboard from "@/components/dashboard/admin";
import TraineeDashboard from "@/components/dashboard/trainee";

// Mocked user data – replace with actual auth/user context
//const storedRole = localStorage.getItem("Role");

const storedRole = "Admin"; // Change to "Trainee" for testing
const DashboardPage = () => {
  return (
    <div>
      {storedRole === "Admin" ? <AdminDashboard /> : <TraineeDashboard />}
    </div>
  );
};

export default DashboardPage;
