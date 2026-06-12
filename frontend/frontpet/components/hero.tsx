"use client";
import React, { useState } from "react";
import { Button, Modal, Drawer } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import LoginForm from "@/components/login/page";
import SignUpForm from "./signup";

const HeaderComponent = () => {
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isSignupVisible, setSignupVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "products", label: "Services" },
    { id: "pricing", label: "Pricing" },
    { id: "blog", label: "Blog" },
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuVisible(false);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full px-6 py-4 flex justify-between items-center bg-white/95 text-slate-900 shadow-sm backdrop-blur-md border-b border-slate-200">
      <div
        className="font-bold text-2xl cursor-pointer tracking-wide text-sky-600"
        onClick={() => scrollToSection("home")}
      >
        PetConnect
      </div>

      <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="cursor-pointer capitalize text-slate-200 hover:text-white transition"
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        <Button
          type="default"
          className="rounded-full border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
          onClick={() => setSignupVisible(true)}
        >
          Get Started
        </Button>
        <Button
          type="primary"
          className="rounded-full bg-sky-600 border-sky-600 hover:bg-sky-700"
          onClick={() => setLoginVisible(true)}
        >
          Login
        </Button>
      </div>

      <div className="md:hidden">
        <Button
          icon={<MenuOutlined />}
          type="text"
          className="text-white"
          onClick={() => setMobileMenuVisible(true)}
        />
      </div>

      <Drawer
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        closeIcon={<CloseOutlined />}
        bodyStyle={{ padding: "1.5rem" }}
      >
        <nav className="flex flex-col space-y-6 text-lg font-semibold">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="text-slate-700 hover:text-sky-700 transition text-left"
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 space-y-4">
          <Button
            block
            type="primary"
            className="bg-sky-600 border-sky-600"
            onClick={() => {
              setLoginVisible(true);
              setMobileMenuVisible(false);
            }}
          >
            Login
          </Button>
          <Button
            block
            type="default"
            className="text-slate-900 bg-slate-100 hover:bg-slate-200"
            onClick={() => {
              setSignupVisible(true);
              setMobileMenuVisible(false);
            }}
          >
            Get Started
          </Button>
        </div>
      </Drawer>

      <Modal
        open={isLoginVisible}
        onCancel={() => setLoginVisible(false)}
        footer={null}
        destroyOnHidden
      >
        <LoginForm onClose={() => setLoginVisible(false)} />
      </Modal>

      <Modal
        open={isSignupVisible}
        onCancel={() => setSignupVisible(false)}
        footer={null}
        destroyOnHidden
      >
        <SignUpForm onClose={() => setSignupVisible(false)} />
      </Modal>
    </header>
  );
};

export default HeaderComponent;
