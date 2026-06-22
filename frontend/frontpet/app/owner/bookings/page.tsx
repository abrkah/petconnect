"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table,
  Button,
  Avatar,
  Tag,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { api, petPhotoSrc } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";
import {
  serviceTypeIcon,
  serviceTypeLabel,
} from "@/lib/service-icons";
import { AVAILABILITY_TIME_OPTIONS } from "@/lib/availability";

type Booking = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  timeSlot?: string | null;
  serviceType: string;
  provider: { id: string; fullName: string };
  pet: { id: string; name: string; photoUrl?: string | null };
};

type PetOption = { id: string; name: string };

const SERVICE_OPTIONS = [
  { value: "DOG_WALKING", label: "Dog walking" },
  { value: "VACCINATION", label: "Vaccination" },
  { value: "GENERAL_SERVICE", label: "General" },
];

function statusDisplay(status: string) {
  const s = status?.toUpperCase() || "";
  if (s.includes("PEND")) return { color: "gold", label: "Pending" };
  if (s.includes("APPROV") || s.includes("CONF")) {
    return { color: "success", label: "Confirmed" };
  }
  if (s.includes("DONE") || s.includes("COMPLET")) {
    return { color: "processing", label: "Done" };
  }
  if (s.includes("CANCEL")) return { color: "error", label: "Cancelled" };
  return { color: "default", label: status };
}

function canEditBooking(status: string) {
  const s = status?.toUpperCase() || "";
  return !s.includes("CANCEL") && !s.includes("COMPLET") && !s.includes("DONE");
}

function providerInitials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}

function timeSlotOptions(current?: string | null) {
  const options = [...AVAILABILITY_TIME_OPTIONS];
  const trimmed = current?.trim();
  if (trimmed && !options.some((option) => option.value === trimmed)) {
    options.unshift({ value: trimmed, label: trimmed });
  }
  return options;
}

export default function OwnerBookingsPage() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<PetOption[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Booking[]>("/bookings/mine");
      setRows(data);
    } catch (err) {
      notifyError(extractApiError(err, "Could not load bookings"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = async (booking: Booking) => {
    if (!canEditBooking(booking.status)) {
      notifyError("This booking can no longer be edited.");
      return;
    }

    try {
      if (pets.length === 0) {
        const { data } = await api.get<PetOption[]>("/pets/mine");
        setPets(data);
      }
    } catch (err) {
      notifyError(extractApiError(err, "Could not load pets"));
      return;
    }

    setEditing(booking);
    form.setFieldsValue({
      petId: booking.pet.id,
      serviceType: booking.serviceType,
      startDate: dayjs(booking.startDate),
      endDate: dayjs(booking.endDate),
      timeSlot: booking.timeSlot?.trim() || undefined,
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const saveEdit = async (values: {
    petId: string;
    serviceType: string;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    timeSlot?: string;
  }) => {
    if (!editing) return;

    setSubmitting(true);
    try {
      const { data } = await api.patch<{ message?: string; booking?: Booking }>(
        `/bookings/${editing.id}`,
        {
          petId: values.petId,
          providerId: editing.provider.id,
          serviceType: values.serviceType,
          startDate: values.startDate.format("YYYY-MM-DD"),
          endDate: values.endDate.format("YYYY-MM-DD"),
          timeSlot: values.timeSlot?.trim() || undefined,
        },
      );

      notifySuccess(data.message ?? "Booking updated successfully");
      closeEdit();
      await load();
    } catch (err) {
      notifyError(extractApiError(err, "Could not update booking"));
    } finally {
      setSubmitting(false);
    }
  };

  const cols: ColumnsType<Booking> = [
    {
      title: "Provider",
      render: (_, r) => (
        <Space size="middle">
          <Avatar style={{ backgroundColor: "#0d9488" }} size={40}>
            {providerInitials(r.provider?.fullName || "")}
          </Avatar>
          <span className="font-medium text-slate-800">
            {r.provider?.fullName || "—"}
          </span>
        </Space>
      ),
    },
    {
      title: "Pet",
      render: (_, r) => (
        <Link
          href={`/owner/pets/${r.pet.id}?tab=bookings`}
          className="inline-flex items-center gap-2 font-medium text-teal-700 hover:text-teal-900"
        >
          {r.pet.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={petPhotoSrc(r.pet.photoUrl) ?? ""}
              alt=""
              className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-sm font-bold text-teal-800">
              {r.pet.name?.charAt(0) || "?"}
            </span>
          )}
          {r.pet.name}
        </Link>
      ),
    },
    {
      title: "Service",
      align: "center",
      render: (_, r) => (
        <div className="flex flex-col items-center gap-1">
          {serviceTypeIcon(r.serviceType)}
          <span className="text-xs text-slate-600">
            {serviceTypeLabel(r.serviceType)}
          </span>
        </div>
      ),
    },
    {
      title: "Date",
      render: (_, r) => (
        <span className="tabular-nums">
          {dayjs(r.startDate).format("D/M/YYYY")}
          {dayjs(r.startDate).isSame(r.endDate, "day")
            ? ""
            : ` – ${dayjs(r.endDate).format("D/M/YYYY")}`}
        </span>
      ),
    },
    {
      title: "Time",
      render: (_, r) => (
        <span className="tabular-nums text-slate-700">
          {r.timeSlot?.trim() ||
            dayjs(r.startDate).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      render: (_, r) => {
        const { color, label } = statusDisplay(r.status);
        return (
          <Tag
            color={color}
            className="!mr-0 inline-flex items-center gap-1.5 !rounded-full !px-2.5 !py-0.5"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-current opacity-80"
              aria-hidden
            />
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      width: 160,
      render: (_, r) => (
        <Space>
          <Button
            type="default"
            size="small"
            className="text-teal-700"
            disabled={!canEditBooking(r.status)}
            onClick={() => openEdit(r)}
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            onClick={async () => {
              try {
                await api.delete(`/bookings/${r.id}`);
                setRows((prev) => prev.filter((x) => x.id !== r.id));
                notifySuccess("Booking cancelled successfully");
              } catch (err) {
                notifyError(extractApiError(err, "Could not cancel booking"));
              }
            }}
          >
            Cancel
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            My bookings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Upcoming and past appointments with your providers.
          </p>
        </div>
        <Link href="/owner/providers">
          <Button type="primary" size="large" icon={<PlusOutlined />} className="!rounded-xl">
            New booking
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table
          rowKey="id"
          loading={loading}
          columns={cols}
          dataSource={rows}
          pagination={{ pageSize: 8 }}
          locale={{
            emptyText: "No bookings yet — start with a new booking.",
          }}
          className="[&_.ant-table-thead>tr>th]:!bg-slate-100 [&_.ant-table-thead>tr>th]:!text-slate-700 [&_.ant-table-thead>tr>th]:!font-semibold"
        />
      </div>

      <Modal
        title={editing ? `Edit booking — ${editing.provider.fullName}` : "Edit booking"}
        open={editOpen}
        onCancel={submitting ? undefined : closeEdit}
        footer={null}
        width={480}
        destroyOnHidden
      >
        {editing ? (
          <Form
            form={form}
            layout="vertical"
            disabled={submitting}
            onFinish={saveEdit}
          >
            <Form.Item label="Provider">
              <Input value={editing.provider.fullName} disabled />
            </Form.Item>
            <Form.Item name="petId" label="Pet" rules={[{ required: true }]}>
              <Select
                options={pets.map((p) => ({ value: p.id, label: p.name }))}
              />
            </Form.Item>
            <Form.Item
              name="serviceType"
              label="Service"
              rules={[{ required: true }]}
            >
              <Select options={SERVICE_OPTIONS} />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Start date"
              rules={[{ required: true }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="End date"
              rules={[{ required: true }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="timeSlot" label="Time (optional)">
              <Select
                allowClear
                className="petconnect-pointer-select w-full"
                placeholder="Select time"
                options={timeSlotOptions(editing.timeSlot)}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              Save changes
            </Button>
          </Form>
        ) : null}
      </Modal>
    </div>
  );
}
