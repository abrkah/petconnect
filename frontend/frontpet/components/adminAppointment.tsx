"use client";

import React from "react";
import { Table, Tag, Button, Popconfirm } from "antd";
import { useGetAllConsultancies } from "@/app/utils/store/server/consultancy/query";
import {
  useApproveConsultancy,
  useRejectConsultancy,
} from "@/app/utils/store/server/consultancy/mutation"; // import your mutations
import dayjs from "dayjs";
import CalendarAppointments from "@/app/dashboard/-componenets/Calendar";

const formatDate = (date: string) => dayjs(date).format("M/D/YYYY");

const getDaysLeft = (date: string) => {
  const today = dayjs();
  const target = dayjs(date);
  const diff = target.diff(today, "day");
  return diff >= 0 ? `${diff} day${diff === 1 ? "" : "s"} left` : "Expired";
};

const AdminAppointmentPage = () => {
  const { data: appointments = [], isLoading } = useGetAllConsultancies();

  // Using your mutation hooks
  const approveMutation = useApproveConsultancy();
  const rejectMutation = useRejectConsultancy();

  const updateStatus = (id: string, status: "Approved" | "Rejected") => {
    if (status === "Approved") {
      approveMutation.mutate(id);
    } else {
      rejectMutation.mutate(id);
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Topic",
      dataIndex: "topic",
    },
    {
      title: "Days Left",
      dataIndex: "date",
      render: (date: string) => (
        <span className="text-indigo-600">{getDaysLeft(date)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string = "Pending") => {
        const color =
          status === "Approved"
            ? "green"
            : status === "Rejected"
            ? "red"
            : "gold";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id: string, record: any) => {
        const isPending = record.status === "Pending";
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              disabled={!isPending || approveMutation.isLoading}
              loading={approveMutation.isLoading}
              onClick={() => updateStatus(id, "Approved")}
            >
              Approve
            </Button>
            <Popconfirm
              title="Are you sure to reject this appointment?"
              onConfirm={() => updateStatus(id, "Rejected")}
              okText="Yes"
              cancelText="No"
              disabled={!isPending || rejectMutation.isLoading}
            >
              <Button
                danger
                disabled={!isPending || rejectMutation.isLoading}
                loading={rejectMutation.isLoading}
              >
                Reject
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Admin Appointment Requests
      </h1>
      <CalendarAppointments appointments={appointments} />

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={appointments}
        columns={columns}
        pagination={{ pageSize: 6 }}
        bordered
      />
    </div>
  );
};

export default AdminAppointmentPage;
