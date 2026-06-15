"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Typography,
  Modal,
  Form,
  DatePicker,
  Tag,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { api } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";
import {
  formatAvailabilitySummary,
  type AvailabilitySlot,
} from "@/lib/availability";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

type Provider = {
  id: string;
  fullName: string;
  hourlyPayment: string | number;
  bio?: string;
  serviceType: string;
  user?: { id: string };
  availabilities?: AvailabilitySlot[];
};

type HireRequestRow = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message?: string | null;
  responseMessage?: string | null;
  decidedByRole?: string | null;
  petIds?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
  provider: { id: string; fullName: string };
};

type HireStatus = "PENDING" | "APPROVED";

type HireFeedback = {
  status: "REJECTED";
  responseMessage?: string | null;
};

function buildHireStatusMap(requests: HireRequestRow[]): Map<string, HireStatus> {
  const map = new Map<string, HireStatus>();
  for (const request of requests) {
    const providerId = request.provider.id;
    if (request.status === "APPROVED") {
      map.set(providerId, "APPROVED");
    } else if (
      request.status === "PENDING" &&
      map.get(providerId) !== "APPROVED"
    ) {
      map.set(providerId, "PENDING");
    }
  }
  return map;
}

function buildHireFeedbackMap(
  requests: HireRequestRow[],
): Map<string, HireFeedback> {
  const latestByProvider = new Map<string, HireRequestRow>();
  for (const request of requests) {
    const providerId = request.provider.id;
    if (!latestByProvider.has(providerId)) {
      latestByProvider.set(providerId, request);
    }
  }

  const map = new Map<string, HireFeedback>();
  for (const [providerId, request] of latestByProvider) {
    if (
      request.status === "REJECTED" &&
      request.decidedByRole === "PROVIDER"
    ) {
      map.set(providerId, {
        status: "REJECTED",
        responseMessage: request.responseMessage,
      });
    }
  }
  return map;
}

const hireStatusColor: Record<string, string> = {
  PENDING: "gold",
  APPROVED: "green",
  REJECTED: "red",
};

export default function OwnerProvidersPage() {
  const [list, setList] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [serviceType, setServiceType] = useState<string | undefined>();
  const [sort, setSort] = useState<"name" | "price_asc" | "price_desc">("name");
  const [avail, setAvail] = useState<unknown[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selected, setSelected] = useState<Provider | null>(null);
  const [pets, setPets] = useState<{ id: string; name: string }[]>([]);
  const [form] = Form.useForm();
  const [hireForm] = Form.useForm();
  const [hireOpen, setHireOpen] = useState(false);
  const [hirePick, setHirePick] = useState<Provider | null>(null);
  const [hireByProvider, setHireByProvider] = useState<Map<string, HireStatus>>(
    () => new Map(),
  );
  const [hireFeedbackByProvider, setHireFeedbackByProvider] = useState<
    Map<string, HireFeedback>
  >(() => new Map());
  const [hireHistory, setHireHistory] = useState<HireRequestRow[]>([]);
  const [historyHire, setHistoryHire] = useState<HireRequestRow | null>(null);

  const loadHireStatuses = useCallback(async () => {
    try {
      const { data } = await api.get<HireRequestRow[]>("/hire-requests/mine");
      setHireHistory(data);
      setHireByProvider(buildHireStatusMap(data));
      setHireFeedbackByProvider(buildHireFeedbackMap(data));
    } catch {
      setHireHistory([]);
      setHireByProvider(new Map());
      setHireFeedbackByProvider(new Map());
    }
  }, []);

  const load = useCallback(async () => {
    const { data } = await api.get<Provider[]>("/provider/directory", {
      params: { search, serviceType, sort },
    });
    setList(data);
  }, [search, serviceType, sort]);

  useEffect(() => {
    load().catch(() => notifyError("Could not load providers"));
    loadHireStatuses();
  }, [load, loadHireStatuses]);

  const openHireHistory = useCallback(async (hire: HireRequestRow) => {
    setHistoryHire(hire);
    if (hire.status === "REJECTED" && hire.decidedByRole === "PROVIDER") {
      try {
        await api.patch(`/hire-requests/${hire.id}/mark-seen`);
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || hireHistory.length === 0) return;
    const hireId = new URLSearchParams(window.location.search).get("viewHire");
    if (!hireId) return;
    const match = hireHistory.find((h) => h.id === hireId);
    if (match) void openHireHistory(match);
  }, [hireHistory, openHireHistory]);

  const historyCols: ColumnsType<HireRequestRow> = [
    {
      title: "Provider",
      render: (_, row) => row.provider.fullName,
    },
    {
      title: "Status",
      render: (_, row) => (
        <Tag color={hireStatusColor[row.status] ?? "default"}>
          {row.status}
        </Tag>
      ),
    },
    {
      title: "Your message",
      ellipsis: true,
      render: (_, row) => row.message?.trim() || "—",
    },
    {
      title: "Provider reply",
      ellipsis: true,
      render: (_, row) =>
        row.decidedByRole === "PROVIDER" && row.responseMessage?.trim()
          ? row.responseMessage
          : "—",
    },
    {
      title: "Date",
      render: (_, row) =>
        row.updatedAt
          ? dayjs(row.updatedAt).format("D MMM YYYY, h:mm A")
          : "—",
    },
    {
      title: "",
      render: (_, row) => (
        <Button size="small" onClick={() => void openHireHistory(row)}>
          View
        </Button>
      ),
    },
  ];

  const openBook = async (p: Provider) => {
    if (hireByProvider.get(p.id) !== "APPROVED") {
      notifyError("Hire this provider and wait for approval before booking.");
      return;
    }
    setSelected(p);
    try {
      const { data: a } = await api.get(`/provider-availability/provider/${p.id}`);
      setAvail(a as unknown[]);
    } catch {
      setAvail([]);
    }
    const { data: mine } = await api.get<{ id: string; name: string }[]>("/pets/mine");
    setPets(mine);
    form.resetFields();
    setBookingOpen(true);
  };

  const openHire = async (p: Provider) => {
    setHirePick(p);
    const { data: mine } = await api.get<{ id: string; name: string }[]>("/pets/mine");
    setPets(mine);
    hireForm.resetFields();
    setHireOpen(true);
  };

  return (
    <div>
      <Title level={3}>Services</Title>
      <Paragraph type="secondary">
        Find providers, send a hire request, and book once they accept.
      </Paragraph>
      <div className="flex flex-wrap gap-3 mb-6">
        <Input.Search
          placeholder="Search by name"
          onSearch={setSearch}
          allowClear
          className="max-w-xs"
        />
        <Select
          allowClear
          placeholder="Service type"
          className="w-48"
          onChange={setServiceType}
          options={[
            { value: "DOG_WALKING", label: "Dog walking" },
            { value: "VACCINATION", label: "Vaccination" },
            { value: "GENERAL_SERVICE", label: "General" },
          ]}
        />
        <Select
          value={sort}
          className="w-44"
          onChange={setSort}
          options={[
            { value: "name", label: "Name A–Z" },
            { value: "price_asc", label: "Price low–high" },
            { value: "price_desc", label: "Price high–low" },
          ]}
        />
        <Button type="primary" onClick={() => load()}>
          Apply
        </Button>
      </div>
      <Row gutter={[16, 16]}>
        {list.map((p) => {
          const hireStatus = hireByProvider.get(p.id);
          const hireFeedback = hireFeedbackByProvider.get(p.id);
          const isHired = hireStatus === "APPROVED";
          const isPending = hireStatus === "PENDING";
          const wasDeclined = !isHired && !isPending && hireFeedback?.status === "REJECTED";

          return (
          <Col xs={24} md={12} key={p.id}>
            <Card
              title={p.fullName}
              extra={<Tag>{p.serviceType.replace(/_/g, " ")}</Tag>}
            >
              <p className="text-slate-600 text-sm mb-2">{p.bio || "—"}</p>
              <p className="font-medium text-teal-700 mb-1">
                ${Number(p.hourlyPayment).toFixed(2)} / hr
              </p>
              <p
                className="mb-3 text-xs leading-relaxed text-slate-500"
                title={formatAvailabilitySummary(p.availabilities)}
              >
                <span className="font-medium text-slate-600">Available: </span>
                {formatAvailabilitySummary(p.availabilities)}
              </p>
              {wasDeclined ? (
                <div className="mb-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                  <p className="font-medium">Provider declined your request</p>
                  {hireFeedback.responseMessage?.trim() ? (
                    <p className="mt-1 whitespace-pre-wrap text-rose-700">
                      {hireFeedback.responseMessage}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {isHired ? (
                  <Button disabled>Hired</Button>
                ) : isPending ? (
                  <Button disabled>Pending</Button>
                ) : (
                  <Button onClick={() => openHire(p)}>Hire</Button>
                )}
                <Link href={`/owner/messages?with=${p.user?.id}`}>
                  <Button>Message</Button>
                </Link>
                <Button
                  type="primary"
                  disabled={!isHired}
                  title={
                    isHired
                      ? undefined
                      : isPending
                        ? "Waiting for provider to accept your hire request"
                        : "Send a hire request and wait for approval before booking"
                  }
                  onClick={() => openBook(p)}
                >
                  Book
                </Button>
              </div>
            </Card>
          </Col>
          );
        })}
      </Row>

      <Card className="mt-8" title="Hire request history">
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
        title={selected ? `Book ${selected.fullName}` : "Book"}
        open={bookingOpen}
        onCancel={() => setBookingOpen(false)}
        footer={null}
        width={480}
      >
        {avail.length === 0 ? (
          <p className="text-slate-500 mb-3">
            This provider has not published weekly availability yet.
          </p>
        ) : (
          <p className="text-sm text-slate-600 mb-3">
            {formatAvailabilitySummary(
              avail as AvailabilitySlot[],
              "No weekly slots published",
            )}
          </p>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={async (v) => {
            if (!selected) return;
            try {
              await api.post("/bookings", {
                petId: v.petId,
                providerId: selected.id,
                serviceType: v.serviceType,
                startDate: (v.startDate as dayjs.Dayjs).format("YYYY-MM-DD"),
                endDate: (v.endDate as dayjs.Dayjs).format("YYYY-MM-DD"),
                timeSlot: v.timeSlot,
              });
              notifySuccess("Booking requested successfully");
              setBookingOpen(false);
            } catch (err) {
              notifyError(extractApiError(err, "Could not create booking"));
            }
          }}
        >
          <Form.Item name="petId" label="Pet" rules={[{ required: true }]}>
            <Select options={pets.map((x) => ({ value: x.id, label: x.name }))} />
          </Form.Item>
          <Form.Item
            name="serviceType"
            label="Service"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "DOG_WALKING", label: "Dog walking" },
                { value: "VACCINATION", label: "Vaccination" },
                { value: "GENERAL_SERVICE", label: "General" },
              ]}
            />
          </Form.Item>
          <Form.Item name="startDate" label="Start" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="endDate" label="End" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="timeSlot" label="Time (optional)">
            <Input placeholder="e.g. 09:00" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit booking
          </Button>
        </Form>
      </Modal>

      <Modal
        title={hirePick ? `Hire ${hirePick.fullName}` : "Hire provider"}
        open={hireOpen}
        onCancel={() => setHireOpen(false)}
        footer={null}
      >
        <Form
          form={hireForm}
          layout="vertical"
          onFinish={async (v) => {
            if (!hirePick) return;
            try {
              await api.post("/hire-requests", {
                providerId: hirePick.id,
                petIds: v.petIds,
                message: v.message || "",
              });
              notifySuccess("Hire request sent successfully");
              setHireOpen(false);
              await loadHireStatuses();
            } catch (err) {
              notifyError(extractApiError(err, "Could not send hire request"));
            }
          }}
        >
          <Form.Item
            name="petIds"
            label="Pets to manage"
            rules={[{ required: true, message: "Select at least one pet" }]}
          >
            <Select
              mode="multiple"
              options={pets.map((x) => ({ value: x.id, label: x.name }))}
            />
          </Form.Item>
          <Form.Item name="message" label="Message (optional)">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Send request
          </Button>
        </Form>
      </Modal>

      <Modal
        title={
          historyHire
            ? `Hire request · ${historyHire.provider.fullName}`
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
                Your message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                {historyHire.message?.trim() || "No message was included."}
              </p>
            </div>
            {historyHire.decidedByRole === "PROVIDER" &&
            historyHire.status === "REJECTED" ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                  Provider response
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-rose-900">
                  {historyHire.responseMessage?.trim() ||
                    "The provider declined without a message."}
                </p>
              </div>
            ) : null}
            <p className="text-xs text-slate-400">
              Sent{" "}
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
    </div>
  );
}
