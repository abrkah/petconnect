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
  message,
  Tag,
} from "antd";
import Link from "next/link";
import { api } from "@/lib/petconnect-api";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

type Provider = {
  id: string;
  fullName: string;
  hourlyPayment: string | number;
  bio?: string;
  serviceType: string;
  user?: { id: string };
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

  const load = useCallback(async () => {
    const { data } = await api.get<Provider[]>("/provider/directory", {
      params: { search, serviceType, sort },
    });
    setList(data);
  }, [search, serviceType, sort]);

  useEffect(() => {
    load().catch(() => message.error("Could not load providers"));
  }, [load]);

  const openBook = async (p: Provider) => {
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
        Find providers offering walks, vaccinations, and more — then book a slot.
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
        {list.map((p) => (
          <Col xs={24} md={12} key={p.id}>
            <Card
              title={p.fullName}
              extra={<Tag>{p.serviceType.replace(/_/g, " ")}</Tag>}
            >
              <p className="text-slate-600 text-sm mb-2">{p.bio || "—"}</p>
              <p className="font-medium text-teal-700 mb-3">
                ${Number(p.hourlyPayment).toFixed(2)} / hr
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => openHire(p)}>Hire</Button>
                <Link href={`/owner/messages?with=${p.user?.id}`}>
                  <Button>Message</Button>
                </Link>
                <Button type="primary" onClick={() => openBook(p)}>
                  Book
                </Button>
              </div>
            </Card>
          </Col>
        ))}
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
            Weekly slots:{" "}
            {(avail as { dayOfWeek: number; startTime: string; endTime: string }[])
              .map(
                (s) =>
                  `D${s.dayOfWeek} ${s.startTime}-${s.endTime}`,
              )
              .join("; ")}
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
              message.success("Booking requested");
              setBookingOpen(false);
            } catch {
              message.error("Booking failed");
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
              message.success("Hire request sent");
              setHireOpen(false);
            } catch {
              message.error("Request failed");
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
