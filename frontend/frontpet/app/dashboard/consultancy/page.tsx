"use client";

import React, { useState } from "react";
import AdminAppointmentPage from "@/components/adminAppointment"; 
import ConsultancyAppointmentPage from "@/components/traineeAppointment"; 



const AppointmentPageRouter = () => {

  const userRole = localStorage.getItem("Role");

  if (userRole === "Admin") {
    return <AdminAppointmentPage />;
  }

  if (userRole === "Trainee") {
    return <ConsultancyAppointmentPage />;
  }

  // Optional fallback if user is neither admin nor consultant
  return (
    <div className="text-center p-6">
      <p className="text-gray-700">
        You do not have permission to view this page.
      </p>
    </div>
  );
};

export default AppointmentPageRouter;
