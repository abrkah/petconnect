"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BellOutlined,
  MessageOutlined,
  UserOutlined,
  PlusOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  LineChartOutlined,
  FileTextOutlined,
  TeamOutlined,
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Tag,
  Tooltip,
  Progress,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const weightData = [
  { date: "Jan", weight: 12.2 },
  { date: "Feb", weight: 12.5 },
  { date: "Mar", weight: 12.1 },
  { date: "Apr", weight: 13.0 },
  { date: "May", weight: 12.8 },
  { date: "Jun", weight: 13.2 },
  { date: "Jul", weight: 13.5 },
];

const vaccinations = [
  { name: "Rabies", date: "2024-03-15", due: "2025-03-15", status: "up-to-date" },
  { name: "Distemper", date: "2024-01-10", due: "2025-01-10", status: "up-to-date" },
  { name: "Parvovirus", date: "2023-11-20", due: "2024-11-20", status: "due-soon" },
  { name: "Bordetella", date: "2024-05-01", due: "2025-05-01", status: "up-to-date" },
];

const bookings = [
  { provider: "Jane Cooper", pet: "Buddy", service: "Dog Walking", date: "2024-07-28", time: "10:00 AM", status: "CONFIRMED" },
  { provider: "Robert Fox", pet: "Luna", service: "General Service", date: "2024-07-30", time: "2:00 PM", status: "PENDING" },
  { provider: "Cameron W.", pet: "Buddy", service: "Vaccination", date: "2024-08-05", time: "11:00 AM", status: "CONFIRMED" },
];

const pets = [
  { name: "Buddy", breed: "Golden Retriever", age: 3, weight: 13.5, photo: null },
  { name: "Luna", breed: "Siamese Cat", age: 2, weight: 4.2, photo: null },
];

const navItems = [
  { icon: <MessageOutlined />, label: "Messages", href: "/owner/messages", badge: 3 },
  { icon: <TeamOutlined />, label: "Providers", href: "/owner/providers" },
  { icon: <UserOutlined />, label: "Profile", href: "/owner/profile" },
];

const sidebarItems = [
  { icon: <LineChartOutlined />, label: "Weight", key: "weight" },
  { icon: <MedicineBoxOutlined />, label: "Vaccination", key: "vaccination" },
  { icon: <CalendarOutlined />, label: "Bookings", key: "bookings" },
  { icon: <FileTextOutlined />, label: "Notes", key: "notes" },
];

export default function OwnerDashboard() {
  const [activeSection, setActiveSection] = useState("weight");
  const [activePet, setActivePet] = useState(0);

  const statusColor: Record<string, string> = {
    CONFIRMED: "green",
    PENDING: "orange",
    COMPLETED: "blue",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* MAIN */}
        <main className="flex-1 space-y-6">
          {/* Welcome + Pet Selector */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-6 pt-8 pb-12 text-white flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Good morning, Sarah!<br/> 👋</h1>
              <p className="text-blue-100 text-md mt-1">Here's an overview of your pets' health and activities.</p>
            </div>
            <div className="flex gap-3">
              {pets.map((pet, i) => (
                <button
                  key={pet.name}
                  onClick={() => setActivePet(i)}
                  className={`px-4 py-4 rounded-xl text-sm font-semibold transition-all ${
                    activePet === i
                      ? "bg-white text-blue-600 shadow-md"
                      : "bg-blue-700/50 text-white hover:bg-blue-500"
                  }`}
                >
                  🐾 {pet.name}
                </button>
              ))}
              <Link href="/owner/pets">
                <button className="px-4 py-4 rounded-xl text-sm font-semibold bg-blue-700/50 text-white hover:bg-blue-500 transition-all flex items-center gap-1">
                  <EyeOutlined /> View All Pets
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Active Pets", value: "2", icon: "🐾", color: "blue" },
              { label: "Upcoming Bookings", value: "3", icon: "📅", color: "purple" },
              { label: "Vaccinations Due", value: "1", icon: "💉", color: "orange" },
              { label: "Active Providers", value: "2", icon: "👤", color: "green" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-${s.color}-50 flex items-center justify-center text-2xl`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section Content */}
          {activeSection === "weight" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Weight Tracking — {pets[activePet].name}</h2>
                  <p className="text-sm text-gray-500">Current: <span className="font-semibold text-blue-600">{pets[activePet].weight} kg</span></p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 border-blue-600 rounded-xl">
                  Add Record
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                  <ReTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2.5} fill="url(#wGrad)" dot={{ fill: "#2563eb", r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeSection === "vaccination" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Vaccinations — {pets[activePet].name}</h2>
                <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 border-blue-600 rounded-xl">
                  Add Vaccination
                </Button>
              </div>
              <div className="space-y-3">
                {vaccinations.map((v) => (
                  <div key={v.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${v.status === "up-to-date" ? "bg-green-100" : "bg-orange-100"}`}>
                        <MedicineBoxOutlined className={v.status === "up-to-date" ? "text-green-600" : "text-orange-500"} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{v.name}</p>
                        <p className="text-xs text-gray-500">Administered: {v.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Next Due</p>
                        <p className="text-sm font-semibold text-gray-700">{v.due}</p>
                      </div>
                      <Tag color={v.status === "up-to-date" ? "green" : "orange"} className="rounded-full capitalize">
                        {v.status === "up-to-date" ? "✓ Up to date" : "⚠ Due soon"}
                      </Tag>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "bookings" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Bookings</h2>
                <Link href="/owner/providers">
                  <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 border-blue-600 rounded-xl">
                    New Booking
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {bookings.map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar size={40} className="bg-blue-600">{b.provider[0]}</Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{b.provider}</p>
                        <p className="text-xs text-gray-500">{b.service} · 🐾 {b.pet}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">{b.date}</p>
                        <p className="text-xs text-gray-500">{b.time}</p>
                      </div>
                      <Tag color={statusColor[b.status]} className="rounded-full">{b.status}</Tag>
                      <Button danger size="small" icon={<CloseCircleOutlined />} className="rounded-lg">Cancel</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "notes" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Notes</h2>
                <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 border-blue-600 rounded-xl">Add Note</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["Buddy prefers morning walks", "Luna is on a special diet — no dry food", "Next vet visit scheduled for August"].map((note, i) => (
                  <div key={i} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-700">{note}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="small" icon={<EditOutlined />} className="rounded-lg">Edit</Button>
                      <Button size="small" danger icon={<DeleteOutlined />} className="rounded-lg">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
  );
}