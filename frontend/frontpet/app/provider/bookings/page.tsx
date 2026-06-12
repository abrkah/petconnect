"use client";

import { useEffect, useState } from "react";
import { Table, Button, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { api } from "@/lib/petconnect-api";

type Booking = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  pet: { name: string };
  owner: { fullName: string };
  serviceType: string;
};

export default function ProviderBookingsPage() {
  const [rows, setRows] = useState<Booking[]>([]);

  const load = async () => {
    const { data } = await api.get<Booking[]>("/bookings/mine");
    setRows(data);
  };

  useEffect(() => {
    load().catch(() => message.error("Load failed"));
  }, []);

  const cols: ColumnsType<Booking> = [
    { title: "Owner", render: (_, r) => r.owner?.fullName },
    { title: "Pet", render: (_, r) => r.pet?.name },
    { title: "Service", dataIndex: "serviceType" },
    {
      title: "Dates",
      render: (_, r) =>
        `${dayjs(r.startDate).format("MMM D")} – ${dayjs(r.endDate).format("MMM D")}`,
    },
    {
      title: "Status",
      render: (_, r) => (
        <Select
          value={r.status}
          className="w-36"
          options={[
            { value: "PENDING", label: "Pending" },
            { value: "CONFIRMED", label: "Confirmed" },
            { value: "COMPLETED", label: "Completed" },
          ]}
          onChange={async (v) => {
            try {
              await api.patch(`/bookings/${r.id}`, { status: v });
              message.success("Updated");
              load();
            } catch {
              message.error("Update failed");
            }
          }}
        />
      ),
    },
    {
      title: "",
      render: (_, r) => (
        <Button
          danger
          size="small"
          onClick={async () => {
            try {
              await api.delete(`/bookings/${r.id}`);
              load();
            } catch {
              message.error("Cancel failed");
            }
          }}
        >
          Cancel
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bookings</h2>
      <Table rowKey="id" columns={cols} dataSource={rows} />
    </div>
  );
}
