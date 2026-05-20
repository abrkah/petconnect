"use client";

import { useState } from "react";
import Link from "next/link";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      console.log("Login payload:", values);
      message.success("Logged in successfully!");
    } catch {
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      <div
        className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #e8f0fe 0%, #dbeafe 60%, #bfdbfe 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-25 bg-blue-400" />
        <div className="absolute bottom-[-60px] right-[-60px] w-56 h-56 rounded-full opacity-20 bg-blue-700" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full opacity-10 bg-blue-400" />

        <div className="relative z-10 p-10">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="PetConnect Logo"
              className="w-8 h-8 object-cover rounded-full"
            />
            <span className="text-xl font-bold text-gray-800">PetConnect</span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-12">
          <div className="w-80 h-80 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/60">
            <img
              src="/dogCat.png"
              alt="Happy pets"
              className="object-contain w-full h-full"
            />
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-3xl font-bold text-blue-900">
              Welcome to PetConnect
            </h2>
            <p className="text-blue-600 mt-3 text-base leading-relaxed max-w-xs">
              Login to manage your pet care, bookings, and activities — all in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-8 justify-center">
            {["🐾 Pet Profiles", "📅 Bookings", "💬 Messaging", "💉 Health Records"].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-700 border border-white/70 shadow-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-10 text-center text-xs text-blue-400">
          © 2024 PetConnect. All rights reserved.
        </div>
      </div>

      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-6 py-12 bg-blue-50">

        <div className="flex lg:hidden items-center absolute top-6 left-6">
          <img
            src="/logo.png"
            alt="PetConnect Logo"
            className="w-8 h-8 object-cover rounded-full"
          />
          <span className="text-xl font-bold text-gray-800">PetConnect</span>
        </div>

        {/* ── CARD ── */}
        <div className="w-full max-w-md rounded-3xl p-10 bg-blue-50 shadow-card-blue">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Login to Your Account
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Enter your credentials to access your dashboard.
          </p>

          <Form form={form} layout="vertical" onFinish={handleLogin} requiredMark={false}>

            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">Email or Username</span>}
              name="email"
              rules={[{ required: true, message: "Please enter your email or username" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter your email or username"
                size="large"
                className="rounded-xl bg-white"
              />
            </Form.Item>

            <Form.Item
  label={
    <div className="flex justify-between items-center w-full">
      <p className="text-sm font-medium text-gray-700">Password</p>
      <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
        Forgot Password?
      </Link>
    </div>
  }
  name="password"
  rules={[{ required: true, message: "Please enter your password" }]}
  className="mb-8"
>
  <Input.Password
    prefix={<LockOutlined className="text-gray-400" />}
    placeholder="Enter your password"
    size="large"
    className="rounded-xl bg-white"
    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
  />
</Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full rounded-lg font-semibold text-base bg-blue-600 border-blue-600 hover:bg-blue-700"
                style={{ height: "48px" }}
              >
                Login
              </Button>
            </Form.Item>

          </Form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-900 font-semibold">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}