"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  Row,
  Col,
  Table,
  Typography,
  Tag,
  Skeleton,
  Modal,
  Form,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import dayjs from "dayjs";
import {
  UserGroupIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { CalendarOutlined } from "@ant-design/icons";
import { api } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";

const { Title, Paragraph } = Typography;

type Hire = {
  id: string;
  status: string;
  message?: string | null;
  responseMessage?: string | null;
  decidedByRole?: string | null;
  petIds?: string[] | null;
  owner: { fullName: string; id: string };
  createdAt?: string;
  updatedAt?: string;
};

const hireStatusColor: Record<string, string> = {
  PENDING: "gold",
  APPROVED: "green",
  REJECTED: "red",
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

export default function ProviderDashboardInner() {
  const searchParams = useSearchParams();
  const [managed, setManaged] = useState<Managed[]>([]);
  const [hires, setHires] = useState<Hire[]>([]);
  const [hireHistory, setHireHistory] = useState<Hire[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewHire, setReviewHire] = useState<Hire | null>(null);
  const [historyHire, setHistoryHire] = useState<Hire | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [acting, setActing] = useState(false);
  const [rejectForm] = Form.useForm();

  const load = useCallback(async () => {
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
      setHireHistory(h);
      setHires(h.filter((x) => x.status === "PENDING"));
    } catch (err) {
      loadError ??= err;
      setHires([]);
      setHireHistory([]);
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
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const hireId = searchParams.get("reviewHire");
    if (!hireId || hires.length === 0) return;
    const match = hires.find((h) => h.id === hireId);
    if (match) setReviewHire(match);
  }, [searchParams, hires]);

  const upcomingCount = useMemo(
    () =>
      bookings.filter((b) =>
        ["PENDING", "CONFIRMED"].includes(String(b.status).toUpperCase()),
      ).length,
    [bookings],
  );

  const approveHire = async (hire: Hire) => {
    setActing(true);
    try {
      await api.patch(`/hire-requests/${hire.id}`, { status: "APPROVED" });
      notifySuccess("Hire request approved");
      setReviewHire(null);
      setRejectOpen(false);
      rejectForm.resetFields();
      await load();
    } catch (err) {
      notifyError(extractApiError(err, "Could not approve request"));
    } finally {
      setActing(false);
    }
  };

  const rejectHire = async (hire: Hire, responseMessage?: string) => {
    setActing(true);
    try {
      await api.patch(`/hire-requests/${hire.id}`, {
        status: "REJECTED",
        responseMessage: responseMessage?.trim() || undefined,
      });
      notifySuccess("Hire request rejected");
      setReviewHire(null);
      setRejectOpen(false);
      rejectForm.resetFields();
      await load();
    } catch (err) {
      notifyError(extractApiError(err, "Could not reject request"));
    } finally {
      setActing(false);
    }
  };

  const hireCols: ColumnsType<Hire> = [
    { title: "Owner", render: (_, r) => r.owner?.fullName },
    { title: "Pets", render: (_, r) => (r.petIds || []).length },
    {
      title: "Message",
      render: (_, r) =>
        r.message?.trim() ? (
          <span className="line-clamp-2">{r.message}</span>
        ) : (
          <span className="text-slate-400 italic">No message</span>
        ),
    },
    {
      title: "",
      render: (_, r) => (
        <Button
          size="small"
          type="primary"
          className="!bg-teal-600"
          onClick={() => setReviewHire(r)}
        >
          Review
        </Button>
      ),
    },
  ];

  const historyCols: ColumnsType<Hire> = [
    { title: "Owner", render: (_, r) => r.owner?.fullName },
    {
      title: "Status",
      render: (_, r) => (
        <Tag color={hireStatusColor[r.status] ?? "default"}>{r.status}</Tag>
      ),
    },
    {
      title: "Owner message",
      ellipsis: true,
      render: (_, r) => r.message?.trim() || "—",
    },
    {
      title: "Your reply",
      ellipsis: true,
      render: (_, r) =>
        r.decidedByRole === "PROVIDER" && r.responseMessage?.trim()
          ? r.responseMessage
          : "—",
    },
    {
      title: "Date",
      render: (_, r) =>
        r.updatedAt
          ? dayjs(r.updatedAt).format("D MMM YYYY, h:mm A")
          : "—",
    },
    {
      title: "",
      render: (_, r) => (
        <Button size="small" onClick={() => setHistoryHire(r)}>
          View
        </Button>
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

      <Card className="mt-6" title="Hire request history">
        {hireHistory.length === 0 ? (
          <p className="text-slate-500">No hire requests yet.</p>
        ) : (
          <Table
            rowKey="id"
            columns={historyCols}
            dataSource={hireHistory}
            pagination={{ pageSize: 8, hideOnSinglePage: true }}
          />
        )}
      </Card>

      <Modal
        title={
          reviewHire
            ? `Hire request from ${reviewHire.owner.fullName}`
            : "Hire request"
        }
        open={!!reviewHire && !rejectOpen}
        onCancel={() => setReviewHire(null)}
        footer={null}
        width={520}
      >
        {reviewHire ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Owner message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                {reviewHire.message?.trim()
                  ? reviewHire.message
                  : "No message was included with this request."}
              </p>
            </div>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">Pets requested: </span>
              {(reviewHire.petIds || []).length}
            </p>
            {reviewHire.createdAt ? (
              <p className="text-xs text-slate-400">
                Sent {dayjs(reviewHire.createdAt).format("D MMM YYYY, h:mm A")}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="primary"
                className="!bg-teal-600"
                loading={acting}
                onClick={() => approveHire(reviewHire)}
              >
                Approve
              </Button>
              <Button
                danger
                loading={acting}
                onClick={() => {
                  rejectForm.resetFields();
                  setRejectOpen(true);
                }}
              >
                Reject
              </Button>
              <Button onClick={() => setReviewHire(null)} disabled={acting}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        title="Reject hire request"
        open={rejectOpen && !!reviewHire}
        onCancel={() => {
          if (!acting) setRejectOpen(false);
        }}
        footer={null}
        width={480}
      >
        {reviewHire ? (
          <Form
            form={rejectForm}
            layout="vertical"
            onFinish={async (values) => {
              await rejectHire(reviewHire, values.responseMessage);
            }}
          >
            <p className="mb-4 text-sm text-slate-600">
              You can optionally let {reviewHire.owner.fullName} know why you
              are declining.
            </p>
            <Form.Item name="responseMessage" label="Message to owner (optional)">
              <Input.TextArea
                rows={4}
                placeholder="e.g. I am fully booked this month, but happy to revisit later."
              />
            </Form.Item>
            <div className="flex flex-wrap gap-2">
              <Button danger htmlType="submit" loading={acting}>
                Confirm reject
              </Button>
              <Button onClick={() => setRejectOpen(false)} disabled={acting}>
                Back
              </Button>
            </div>
          </Form>
        ) : null}
      </Modal>

      <Modal
        title={
          historyHire
            ? `Hire request · ${historyHire.owner.fullName}`
            : "Hire request"
        }
        open={!!historyHire}
        onCancel={() => setHistoryHire(null)}
        footer={
          <Button type="primary" onClick={() => setHistoryHire(null)}>
            Close
          </Button>
        }
        width={560}
      >
        {historyHire ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Status:</span>
              <Tag color={hireStatusColor[historyHire.status] ?? "default"}>
                {historyHire.status}
              </Tag>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Owner message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                {historyHire.message?.trim() || "No message was included."}
              </p>
            </div>
            {historyHire.decidedByRole === "PROVIDER" &&
            historyHire.responseMessage?.trim() ? (
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Your response
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                  {historyHire.responseMessage}
                </p>
              </div>
            ) : null}
            <p className="text-xs text-slate-400">
              Received{" "}
              {historyHire.createdAt
                ? dayjs(historyHire.createdAt).format("D MMM YYYY, h:mm A")
                : "—"}
              {historyHire.updatedAt &&
              historyHire.updatedAt !== historyHire.createdAt
                ? ` · Updated ${dayjs(historyHire.updatedAt).format("D MMM YYYY, h:mm A")}`
                : ""}
            </p>
          </div>
        ) : null}
      </Modal>

      <section className="mt-6 space-y-4">
        <Title level={5} className="!mb-0">
          Pets you manage
        </Title>
        {managed.length === 0 ? (
          <Card>
            <p className="text-slate-600">You do not have any pets yet.</p>
            <p className="text-sm text-slate-500">
              Owners send hire requests from Services. Approve a request to see pets here.
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
