"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Menu,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Typography,
  Tag,
} from "antd";
import type { MenuProps } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";
import { api } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";
import { WeightLineChart } from "@/components/petconnect/WeightLineChart";
import {
  serviceTypeIcon,
  serviceTypeLabel,
} from "@/lib/service-icons";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

type Vac = {
  id: string;
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate?: string | null;
};

type WRec = {
  id: string;
  weight: number;
  recordDate: string;
};

type Booking = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  timeSlot?: string | null;
  serviceType: string;
  provider: { fullName: string };
  pet: { id: string; name?: string };
};

function statusTag(status: string) {
  const s = status?.toUpperCase() || "";
  let color: string = "default";
  if (s.includes("PEND")) color = "volcano";
  else if (s.includes("APPROV") || s.includes("CONF")) color = "success";
  else if (s.includes("DONE")) color = "processing";
  else if (s.includes("CANCEL")) color = "error";
  return (
    <Tag color={color} className="!mr-0 !rounded-full !px-2.5">
      {status}
    </Tag>
  );
}

export default function OwnerPetHubInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const petId = params.petId as string;
  const tab = searchParams.get("tab") || "weight";

  const setTab = (key: string) => {
    router.replace(`/owner/pets/${petId}?tab=${key}`);
  };

  const [petName, setPetName] = useState("");
  const [vacs, setVacs] = useState<Vac[]>([]);
  const [weights, setWeights] = useState<WRec[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notes, setNotes] = useState<
    { id: string; content: string; createdAt: string }[]
  >([]);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteForm] = Form.useForm();
  const [vacOpen, setVacOpen] = useState(false);
  const [vacForm] = Form.useForm();
  const [weightOpen, setWeightOpen] = useState(false);
  const [weightForm] = Form.useForm();

  const loadAll = useCallback(async () => {
    try {
      const { data: pet } = await api.get<{ name: string }>(`/pets/${petId}`);
      setPetName(pet.name);
    } catch {
      notifyError("Pet not found");
    }
    try {
      const { data } = await api.get<Vac[]>(`/vaccination-record/pet/${petId}`);
      setVacs(data);
    } catch {
      setVacs([]);
    }
    try {
      const { data } = await api.get<WRec[]>(`/weight-record/pet/${petId}`);
      setWeights(data);
    } catch {
      setWeights([]);
    }
    try {
      const { data: all } = await api.get<Booking[]>("/bookings/mine");
      setBookings(all.filter((b) => b.pet?.id === petId));
    } catch {
      setBookings([]);
    }
    try {
      const { data } = await api.get(`/pet-notes/pet/${petId}`);
      setNotes(data as typeof notes);
    } catch {
      setNotes([]);
    }
  }, [petId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const menuItems: MenuProps["items"] = [
    { key: "weight", label: "Weight" },
    { key: "vaccination", label: "Vaccination" },
    { key: "bookings", label: "Bookings" },
    { key: "notes", label: "Notes" },
  ];

  const vacCols: ColumnsType<Vac> = [
    { title: "Vaccine", dataIndex: "vaccineName" },
    {
      title: "Date",
      dataIndex: "vaccinationDate",
      render: (d: string) => dayjs(d).format("MMM D, YYYY"),
    },
    {
      title: "Next due",
      dataIndex: "nextDueDate",
      render: (d: string | null) =>
        d ? dayjs(d).format("MMM D, YYYY") : "—",
    },
  ];

  const wLabels = weights.map((w) => dayjs(w.recordDate).format("MMM D"));
  const wVals = weights.map((w) => w.weight);

  const bookCols: ColumnsType<Booking> = [
    { title: "Provider", render: (_, r) => r.provider?.fullName },
    {
      title: "Service",
      align: "center" as const,
      render: (_, r) => (
        <div className="flex flex-col items-center gap-0.5">
          {serviceTypeIcon(r.serviceType)}
          <span className="text-xs text-slate-600">
            {serviceTypeLabel(r.serviceType)}
          </span>
        </div>
      ),
    },
    {
      title: "Date",
      render: (_, r) => dayjs(r.startDate).format("D/M/YYYY"),
    },
    {
      title: "Time",
      render: (_, r) =>
        r.timeSlot?.trim() || dayjs(r.startDate).format("HH:mm"),
    },
    { title: "Status", render: (_, r) => statusTag(r.status) },
    {
      title: "Action",
      render: (_, r) => (
        <Button
          danger
          size="small"
          onClick={async () => {
            try {
              await api.delete(`/bookings/${r.id}`);
              notifySuccess("Booking cancelled successfully");
              loadAll();
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
    <div className="flex flex-col md:flex-row md:gap-4">
      <aside className="hidden md:block md:w-[220px] md:shrink-0 md:self-start">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Menu
            mode="inline"
            selectedKeys={[tab]}
            items={menuItems}
            onClick={({ key }) => setTab(key)}
            className="!border-0"
          />
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="mb-4 md:hidden">
          <Menu
            mode="horizontal"
            selectedKeys={[tab]}
            items={menuItems}
            onClick={({ key }) => setTab(key)}
          />
        </div>
        <Title level={4}>{petName || "Pet"} hub</Title>

        {tab === "weight" && (
          <Card
            className="mt-4 rounded-2xl border-slate-200 shadow-sm"
            extra={
              <Link
                href="/owner/pets"
                className="text-sm font-medium text-teal-600 hover:text-teal-800"
              >
                View all pets <ArrowRightOutlined className="text-xs" />
              </Link>
            }
          >
            <div className="mb-4 flex justify-between">
              <span className="font-medium text-slate-800">Weight trend</span>
              <Button
                type="primary"
                onClick={() => {
                  weightForm.resetFields();
                  setWeightOpen(true);
                }}
              >
                Add entry
              </Button>
            </div>
            {weights.length === 0 ? (
              <p className="text-slate-500">No weight points yet.</p>
            ) : (
              <div className="max-w-3xl">
                <WeightLineChart labels={wLabels} values={wVals} />
              </div>
            )}
          </Card>
        )}

        {tab === "vaccination" && (
          <Card className="mt-4 rounded-2xl border-slate-200 shadow-sm">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Vaccinations</span>
              <Button
                type="primary"
                onClick={() => {
                  vacForm.resetFields();
                  setVacOpen(true);
                }}
              >
                Add record
              </Button>
            </div>
            <Table
              rowKey="id"
              columns={vacCols}
              dataSource={vacs}
              pagination={false}
              className="[&_.ant-table-thead>tr>th]:!bg-slate-100"
            />
          </Card>
        )}

        {tab === "bookings" && (
          <Card className="mt-4 rounded-2xl border-slate-200 shadow-sm">
            <Table
              rowKey="id"
              columns={bookCols}
              dataSource={bookings}
              pagination={false}
              className="[&_.ant-table-thead>tr>th]:!bg-slate-100"
            />
          </Card>
        )}

        {tab === "notes" && (
          <Card className="mt-4 rounded-2xl border-slate-200 shadow-sm">
            <Button
              type="primary"
              className="mb-4"
              onClick={() => {
                noteForm.resetFields();
                setNoteOpen(true);
              }}
            >
              New note
            </Button>
            <ul className="space-y-3">
              {notes.map((n) => (
                <li
                  key={n.id}
                  className="border border-slate-200 rounded-lg p-3 bg-white"
                >
                  <div className="text-xs text-slate-400 mb-1">
                    {dayjs(n.createdAt).format("MMM D, YYYY h:mm A")}
                  </div>
                  <div>{n.content}</div>
                </li>
              ))}
              {notes.length === 0 && (
                <p className="text-slate-500">No notes yet.</p>
              )}
            </ul>
          </Card>
        )}
      </div>

      <Modal
        title="Add weight"
        open={weightOpen}
        onCancel={() => setWeightOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          form={weightForm}
          onFinish={async (v) => {
            try {
              await api.post("/weight-record", {
                petId,
                weight: v.weight,
                recordDate: (v.recordDate as dayjs.Dayjs).format("YYYY-MM-DD"),
              });
              notifySuccess("Weight record saved successfully");
              setWeightOpen(false);
              loadAll();
            } catch (err) {
              notifyError(extractApiError(err, "Could not save weight record"));
            }
          }}
        >
          <Form.Item name="weight" label="Weight" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item
            name="recordDate"
            label="Date"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Add vaccination"
        open={vacOpen}
        onCancel={() => setVacOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          form={vacForm}
          onFinish={async (v) => {
            try {
              await api.post("/vaccination-record", {
                petId,
                vaccineName: v.vaccineName,
                vaccinationDate: (
                  v.vaccinationDate as dayjs.Dayjs
                ).format("YYYY-MM-DD"),
                nextDueDate: v.nextDueDate
                  ? (v.nextDueDate as dayjs.Dayjs).format("YYYY-MM-DD")
                  : undefined,
              });
              notifySuccess("Vaccination record saved successfully");
              setVacOpen(false);
              loadAll();
            } catch (err) {
              notifyError(extractApiError(err, "Could not save vaccination record"));
            }
          }}
        >
          <Form.Item
            name="vaccineName"
            label="Vaccine"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="vaccinationDate"
            label="Date"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="nextDueDate" label="Next due">
            <DatePicker className="w-full" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form>
      </Modal>

      <Modal
        title="New note"
        open={noteOpen}
        onCancel={() => setNoteOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          form={noteForm}
          onFinish={async (v) => {
            try {
              await api.post("/pet-notes", { petId, content: v.content });
              notifySuccess("Note saved successfully");
              setNoteOpen(false);
              loadAll();
            } catch (err) {
              notifyError(extractApiError(err, "Could not save note"));
            }
          }}
        >
          <Form.Item
            name="content"
            label="Note"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
