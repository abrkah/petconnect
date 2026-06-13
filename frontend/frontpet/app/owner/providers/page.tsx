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
} from "antd";
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
  status: "PENDING" | "APPROVED" | "REJECTED";
  provider: { id: string };
};

type HireStatus = "PENDING" | "APPROVED";

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

  const loadHireStatuses = useCallback(async () => {
    try {
      const { data } = await api.get<HireRequestRow[]>("/hire-requests/mine");
      setHireByProvider(buildHireStatusMap(data));
    } catch {
      setHireByProvider(new Map());
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
          const isHired = hireStatus === "APPROVED";
          const isPending = hireStatus === "PENDING";

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
    </div>
  );
}
