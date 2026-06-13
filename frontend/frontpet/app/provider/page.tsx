"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Table,
  Typography,
  Tag,
  Empty,
  Skeleton,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import dayjs from "dayjs";
import {
  UserGroupIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { CalendarOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { api } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";

const { Title, Paragraph } = Typography;

type Hire = {
  id: string;
  status: string;
  message?: string;
  petIds?: string[] | null;
  owner: { fullName: string; id: string };
};

type Managed = {
  pet: { id: string; name: string; breed: string };
};

type Booking = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  serviceType: string;
  pet: { name: string };
  owner: { fullName: string };
};

export default function ProviderDashboardPage() {
  const [managed, setManaged] = useState<Managed[]>([]);
  const [hires, setHires] = useState<Hire[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    let loadError: unknown = null;
    try {
      const { data: m } = await api.get<Managed[]>("/pets/managed");
      setManaged(m);
    } catch (err) {
      loadError = err;
      setManaged([]);
    }
    try {
      const { data: h } = await api.get<Hire[]>("/hire-requests/mine");
      setHires(h.filter((x) => x.status === "PENDING"));
    } catch (err) {
      loadError ??= err;
      setHires([]);
    }
    try {
      const { data: b } = await api.get<Booking[]>("/bookings/mine");
      setBookings(b);
    } catch (err) {
      loadError ??= err;
      setBookings([]);
    } finally {
      setLoading(false);
      if (loadError) {
        notifyError(extractApiError(loadError, "Could not load dashboard"));
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upcomingCount = useMemo(
    () =>
      bookings.filter((b) =>
        ["PENDING", "CONFIRMED"].includes(String(b.status).toUpperCase()),
      ).length,
    [bookings],
  );

  const calendarBookings = useMemo(
    () =>
      bookings.map((b) => ({
        id: b.id,
        status: b.status,
        startDate: b.startDate,
        endDate: b.endDate,
        serviceType: b.serviceType,
        label: `${b.pet?.name ?? "Pet"} · ${b.owner?.fullName ?? "Owner"}`,
      })),
    [bookings],
  );

  const hireCols: ColumnsType<Hire> = [
    { title: "Owner", render: (_, r) => r.owner?.fullName },
    { title: "Pets", render: (_, r) => (r.petIds || []).length },
    { title: "Message", dataIndex: "message", ellipsis: true },
    {
      title: "",
      render: (_, r) => (
        <>
          <Button
            size="small"
            type="primary"
            className="mr-2 !bg-teal-600"
            onClick={async () => {
              try {
                await api.patch(`/hire-requests/${r.id}`, { status: "APPROVED" });
                notifySuccess("Hire request approved");
                load();
              } catch (err) {
                notifyError(extractApiError(err, "Could not approve request"));
              }
            }}
          >
            Approve
          </Button>
          <Button
            danger
            size="small"
            onClick={async () => {
              try {
                await api.patch(`/hire-requests/${r.id}`, { status: "REJECTED" });
                notifySuccess("Hire request rejected");
                load();
              } catch (err) {
                notifyError(extractApiError(err, "Could not reject request"));
              }
            }}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton active paragraph={{ rows: 1 }} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
      </div>
    );
  }

  const statCard =
    "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-teal-200/50 bg-gradient-to-br from-teal-600 to-teal-800 px-5 py-6 text-white shadow-md">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-100">
          Provider workspace
        </p>
        <Title level={3} className="!mb-1 !text-white !text-xl sm:!text-2xl">
          Your care dashboard
        </Title>
        <Paragraph className="!mb-0 !text-teal-50/90 !text-sm">
          Manage hire requests, bookings, and pet records in one place.
        </Paragraph>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/provider/bookings">
            <Button
              icon={<CalendarOutlined />}
              className="!rounded-xl !border-white/30 !bg-white/10 !text-white hover:!bg-white/20"
            >
              Bookings
            </Button>
          </Link>
          <Link href="/provider/messages">
            <Button className="!rounded-xl !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
              Messages
            </Button>
          </Link>
        </div>
      </section>

      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={8}>
          <div className={statCard}>
            <div className="mb-2 flex items-center gap-2 text-teal-700">
              <HeartIcon className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase text-slate-500">
                Pets managed
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{managed.length}</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={statCard}>
            <div className="mb-2 flex items-center gap-2 text-amber-700">
              <UserGroupIcon className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase text-slate-500">
                Pending hires
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{hires.length}</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={statCard}>
            <div className="mb-2 flex items-center gap-2 text-slate-700">
              <CalendarOutlined className="text-base" />
              <span className="text-xs font-semibold uppercase text-slate-500">
                Active bookings
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{upcomingCount}</div>
          </div>
        </Col>
      </Row>

      <Card title="Pending hire requests">
        {hires.length === 0 ? (
          <p className="text-slate-500">No pending requests.</p>
        ) : (
          <Table rowKey="id" columns={hireCols} dataSource={hires} pagination={false} />
        )}
      </Card>

      <section className="mt-6 space-y-4">
        <Title level={5} className="!mb-0">
          Pets you manage
        </Title>
        {managed.length === 0 ? (
          <Card>
            <p className="text-slate-600">You do not have any pets yet.</p>
            <p className="text-sm text-slate-500">
              Owners send hire requests after messaging you. Approve a request to see pets here.
            </p>
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {managed.map((m) => (
              <Col xs={24} sm={12} md={8} key={m.pet.id}>
                <Card
                  title={m.pet.name}
                  extra={<Tag>{m.pet.breed}</Tag>}
                >
                  <Link href={`/provider/pets/${m.pet.id}`}>
                    <Button type="primary">Open records</Button>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </div>
  );
}
