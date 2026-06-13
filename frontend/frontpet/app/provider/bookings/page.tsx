"use client";

import { useEffect, useState } from "react";
import { Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { api } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";

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
    load().catch((err) =>
      notifyError(extractApiError(err, "Could not load bookings")),
    );
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
              notifySuccess("Booking status updated successfully");
              load();
            } catch (err) {
              notifyError(extractApiError(err, "Could not update booking"));
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
              notifySuccess("Booking cancelled successfully");
              load();
            } catch (err) {
              notifyError(extractApiError(err, "Could not cancel booking"));
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
