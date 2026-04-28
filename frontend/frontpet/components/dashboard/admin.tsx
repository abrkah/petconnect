"use client";
import React from "react";
import { Card, Table } from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  DollarCircleOutlined,
  BookOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import CourseEnrollmentsBarChart from "@/app/dashboard/-componenets/chart/CourseEnrollmentsBarChart";
import MonthlyRevenueChart from "@/app/dashboard/-componenets/chart/MonthlyRevenueChart";
import { useGetUsers } from "@/app/utils/store/server/user/queries";
import { useGetPayments, useGetTopPerformingCourses } from "@/app/utils/store/server/payment/query";
import { useGetCourseEnrollments, useGetCourseManagement } from "@/app/utils/store/server/training/query";
import { useGetAllConsultancies } from "@/app/utils/store/server/consultancy/query";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AdminDashboard = () => {
  const { data: users } = useGetUsers();
  const { data: payments = [] } = useGetPayments();
  const { data: coursesData = [], isLoading } = useGetCourseManagement();
  const { data: appointments = [] } = useGetAllConsultancies();
  const { data: enrollmentsData = [] } = useGetCourseEnrollments();
  const { data: fetchedTopCoursesData = [] } = useGetTopPerformingCourses();



  // Total users count
  const totalUsers = Array.isArray(users) ? users.length : 0;

  // Total revenue sum
  const totalRevenue = payments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  // Count unique active users who have paid
  const uniqueUserIds = new Set(payments.map((payment) => payment.user.id));
  const activeUsersCount = uniqueUserIds.size;

  // Format revenue with Ethiopian Birr currency (ETB)
  const formattedRevenue = totalRevenue.toLocaleString("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
  });

  // Dynamic monthly revenue calculation from payments
  const revenueByMonth = {};
  payments.forEach(({ payment_date, amount }) => {
    const date = new Date(payment_date);
    const monthIndex = date.getMonth();
    revenueByMonth[monthIndex] = (revenueByMonth[monthIndex] || 0) + amount;
  });

  const monthlyRevenueData = monthNames.map((month, index) => ({
    month,
    revenue: revenueByMonth[index] || 0,
  }));

  const summaryStats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: <UserOutlined />,
      color: "#3B82F6",
    },
    {
      title: "Active Users",
      value: activeUsersCount.toLocaleString(),
      icon: <UserAddOutlined />,
      color: "#22C55E",
    },
    {
      title: "Total Revenue",
      value: formattedRevenue,
      icon: <DollarCircleOutlined />,
      color: "#F59E0B",
    },
    {
      title: "Total Courses",
      value: coursesData?.length || 0,
      icon: <BookOutlined />,
      color: "#8B5CF6",
    },
    {
      title: "Total Appointments",
      value: appointments?.length || 0,
      icon: <CalendarOutlined />,
      color: "#10B981",
    },
  ];


 

  const columns = [
    { title: "Course Name", dataIndex: "name", key: "name" },
    { title: "Enrollments", dataIndex: "enrollments", key: "enrollments" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    { title: "Revenue", dataIndex: "revenue", key: "revenue" },
  ];

  return (
    <div className="p-6 lg:p-10 bg-gray-50 min-h-screen space-y-12">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {summaryStats.map((item, index) => (
          <Card
            key={index}
         
            className="transition-all duration-300 hover:shadow-lg rounded-xl"
            style={{ borderLeft: `5px solid ${item.color}` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-md text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <div className="text-gray-600 text-sm">{item.title}</div>
                <div className="text-xl font-semibold">{item.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="📈 Monthly Revenue"
          className="rounded-xl shadow-sm hover:shadow-md transition duration-300"
        >
          <MonthlyRevenueChart data={monthlyRevenueData} />
        </Card>

        <Card
          title="📊 Course Enrollments"
          className="rounded-xl shadow-sm hover:shadow-md transition duration-300"
        >
          <div className="flex justify-center items-center h-64 text-gray-400">
            <CourseEnrollmentsBarChart data={enrollmentsData} />
          </div>
        </Card>
      </div>

      {/* Table Section */}
      <div>
        <h3 className="text-xl font-bold mb-4">🏆 Top Performing Courses</h3>
        <div className="overflow-x-auto bg-white shadow-sm rounded-xl p-4">
          <Table
            columns={columns}
            dataSource={fetchedTopCoursesData}
            pagination={false}
            bordered
            className="min-w-[700px]"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
