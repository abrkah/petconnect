"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, theme } from "antd";
import Link from "next/link";
import {
  DashboardOutlined,
  ReadOutlined,
  DollarOutlined,
  UserOutlined,
  SettingOutlined,
  SolutionOutlined,
  MenuOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  
  CalendarOutlined,
  ClockCircleOutlined,
  SwapOutlined,

  BarChartOutlined,
  BellOutlined,
  
  
} from "@ant-design/icons";
import NavBar from "./-componenets/navBAR/topNavbar";
import { IoCloseOutline } from "react-icons/io5";

const { Header, Sider, Content } = Layout;

// Menu config per role
const adminMenuItems = [
  {
    label: "Dashboard",
    key: "/dashboard",
    icon: <DashboardOutlined />,
  },

  {
    label: "Schedule Management",
    key: "/dashboard/schedule",
    icon: <CalendarOutlined />,
  },

  {
    label: "Attendance",
    key: "/dashboard/attendance",
    icon: <ClockCircleOutlined />,
  },

  {
    label: "Shift Requests",
    key: "/dashboard/shift-requests",
    icon: <SwapOutlined />,
  },

  {
    label: "Employees",
    key: "/dashboard/employees",
    icon: <UserOutlined />,
  },

  {
    label: "Reports",
    key: "/dashboard/reports",
    icon: <BarChartOutlined />,
  },

  {
    label: "Notifications",
    key: "/dashboard/notifications",
    icon: <BellOutlined />,
  },

  {
    label: "Messages",
    key: "/dashboard/messages",
    icon: <MessageOutlined />,
  },

  {
    label: "Settings",
    key: "/dashboard/settings",
    icon: <SettingOutlined />,
  },
];

const traineeMenuItems = [
  { label: "Dashboard", key: "/dashboard", icon: <DashboardOutlined /> },
  {
    label: "Training Management",
    key: "/dashboard/traninig",
    icon: <ReadOutlined />,
  },
  { label: "Chat", key: "/dashboard/chat", icon: <MessageOutlined /> },

  {
    label: "Consultancy",
    key: "/dashboard/consultancy",
    icon: <SolutionOutlined />,
  },
  { label: "Settings", key: "/dashboard/settings", icon: <SettingOutlined /> },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // Mobile sidebar state
  const [isMobile, setIsMobile] = useState(false);
  const [mobileCollapsed, setMobileCollapsed] = useState(true);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Get role from localStorage
   // const storedRole = localStorage.getItem("Role");
    const storedRole = "Admin" ;
    setRole(storedRole);

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileCollapsed = () => setMobileCollapsed(!mobileCollapsed);

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.replace("/");
  };

  const siderWidth = 240;
  const collapsedWidth = 80;

  const siderAndHeaderBg = "#1D2635";
  const toggleButtonColor = "#4C9AFF";

  // Choose menu based on role
  const menuItems =
    role === "Admin"
      ? adminMenuItems
      : role === "Trainee"
      ? traineeMenuItems
      : [];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      {role && (
        <Sider
          width={siderWidth}
          collapsible={!isMobile}
          collapsed={isMobile ? mobileCollapsed : collapsed}
          trigger={null}
          style={{
            height: "100vh",
            position: "fixed",
            left: 0,
            background: siderAndHeaderBg,
            overflow: "auto",
            zIndex: 1100,
          }}
        >
          <div className="my-2 flex justify-center">
            {(isMobile ? mobileCollapsed : collapsed) && (
              <img src="/logo.jpg" alt="Logo" />
            )}
          </div>
          <div className="flex justify-start px-4 my-4">
            {!(isMobile ? mobileCollapsed : collapsed) && (
              <div className="flex items-center gap-4">
                <img src="/logo.jpg" alt="Logo" width={80} height={80} />
              </div>
            )}
          </div>

          <Menu
            theme="dark"
            mode="inline"
            items={menuItems.map((item) => ({
              label: <Link href={item.key}>{item.label}</Link>,
              key: item.key,
              icon: item.icon,
            }))}
            style={{ background: siderAndHeaderBg }}
            onClick={() => {
              if (isMobile) setMobileCollapsed(true);
            }}
          />
        </Sider>
      )}

      {/* Main Content */}
      <Layout
        style={{
          marginLeft:
            isMobile && !mobileCollapsed
              ? 0
              : collapsed
              ? collapsedWidth
              : siderWidth,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header
          style={{
            padding: 4,
            background: siderAndHeaderBg,
            display: "flex",
            alignItems: "center",
            position: "fixed",
            width: isMobile
              ? "100%"
              : collapsed
              ? `calc(100% - ${collapsedWidth}px)`
              : `calc(100% - ${siderWidth}px)`,
            zIndex: 1000,
            top: 0,
            left:
              isMobile && !mobileCollapsed
                ? 0
                : collapsed
                ? collapsedWidth
                : siderWidth,
            transition: "left 0.3s ease, width 0.3s ease",
            boxShadow: isMobile ? "none" : "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          {isMobile && (
            <div className="w-full h-full p-[10px] flex justify-center items-center">
              <Button
                className="w-full h-full"
                onClick={toggleMobileCollapsed}
                icon={
                  !mobileCollapsed ? (
                    <IoCloseOutline
                      size={24}
                      style={{ color: toggleButtonColor }}
                    />
                  ) : (
                    <MenuOutlined
                      size={24}
                      style={{ color: toggleButtonColor }}
                    />
                  )
                }
              />
            </div>
          )}

          <NavBar page="" handleLogout={handleLogout} />
        </Header>
        <Content
          style={{
            margin: "64px 16px 24px",
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
