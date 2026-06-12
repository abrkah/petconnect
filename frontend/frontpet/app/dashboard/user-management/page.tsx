"use client";
import React from "react";
import { Input } from "antd";
import { MdAddCircleOutline } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import CustomDrawerLayout from "@/components/drawer";
import UserForm from "./form/page";
import UserListPage from "./table/page";
import { useUserStore } from "@/app/utils/uistate/fetures/user";
import ButtonComponent from "@/components/button";

const Index = () => {
  const {
    formMode,
    setFormMode,
    isDrawerOpen,
    setIsDrawerOpen,
    searchParams,
    setSearchParams,
  } = useUserStore();

  const handleFormSubmit = (values) => {
    closeModal();
  };

  const closeModal = () => {
    setIsDrawerOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchParams(e.target.value);
  };

  return (
    <div className="border border-gray-200 rounded-lg relative  overflow-y-auto h-full lg:p-4 p-4">
      <UserListPage />
    </div>
  );
};

export default Index;
