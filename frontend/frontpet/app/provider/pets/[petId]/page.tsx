"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Tabs,
  message,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { api } from "@/lib/petconnect-api";

type Vac = {
  id: string;
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate?: string | null;
  isApproved: boolean;
};

type WRec = {
  id: string;
  weight: number;
  recordDate: string;
  isApproved: boolean;
};

export default function ProviderPetRecordsPage() {
  const params = useParams();
  const petId = params.petId as string;
  const [petName, setPetName] = useState("");
  const [vacs, setVacs] = useState<Vac[]>([]);
  const [weights, setWeights] = useState<WRec[]>([]);
  const [vacForm] = Form.useForm();
  const [weightForm] = Form.useForm();
  const [vacOpen, setVacOpen] = useState(false);
  const [wOpen, setWOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data: pet } = await api.get<{ name: string }>(`/pets/assigned/${petId}`);
      setPetName(pet.name);
    } catch {
      message.error("Pet not found or not assigned");
    }
    try {
      const { data: v } = await api.get<Vac[]>(`/vaccination-record/pet/${petId}`);
      setVacs(v);
    } catch {
      setVacs([]);
    }
    try {
      const { data: w } = await api.get<WRec[]>(`/weight-record/pet/${petId}`);
      setWeights(w);
    } catch {
      setWeights([]);
    }
  }, [petId]);

  useEffect(() => {
    load();
  }, [load]);

  const vacCols: ColumnsType<Vac> = [
    { title: "Vaccine", dataIndex: "vaccineName" },
    {
      title: "Date",
      dataIndex: "vaccinationDate",
      render: (d: string) => dayjs(d).format("MMM D, YYYY"),
    },
    {
      title: "Status",
      render: (_, r) =>
        r.isApproved ? <Tag color="green">Approved</Tag> : <Tag>Pending</Tag>,
    },
    {
      title: "",
      render: (_, r) =>
        !r.isApproved ? (
          <Button
            size="small"
            type="primary"
            onClick={async () => {
              try {
                await api.post(`/vaccination-record/${r.id}/approve`);
                message.success("Approved for owner");
                load();
              } catch {
                message.error("Failed");
              }
            }}
          >
            Approve
          </Button>
        ) : null,
    },
  ];

  const wCols: ColumnsType<WRec> = [
    {
      title: "Date",
      dataIndex: "recordDate",
      render: (d: string) => dayjs(d).format("MMM D, YYYY"),
    },
    { title: "Weight", dataIndex: "weight" },
    {
      title: "Status",
      render: (_, r) =>
        r.isApproved ? <Tag color="green">Approved</Tag> : <Tag>Pending</Tag>,
    },
    {
      title: "",
      render: (_, r) =>
        !r.isApproved ? (
          <Button
            size="small"
            type="primary"
            onClick={async () => {
              try {
                await api.post(`/weight-record/${r.id}/approve`);
                load();
              } catch {
                message.error("Failed");
              }
            }}
          >
            Approve
          </Button>
        ) : null,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{petName} — clinical records</h2>
      <Tabs
        items={[
          {
            key: "vac",
            label: "Vaccinations",
            children: (
              <Card>
                <Button
                  type="primary"
                  className="mb-3"
                  onClick={() => {
                    vacForm.resetFields();
                    setVacOpen(true);
                  }}
                >
                  Add record
                </Button>
                <Table rowKey="id" columns={vacCols} dataSource={vacs} pagination={false} />
              </Card>
            ),
          },
          {
            key: "w",
            label: "Weight",
            children: (
              <Card>
                <Button
                  type="primary"
                  className="mb-3"
                  onClick={() => {
                    weightForm.resetFields();
                    setWOpen(true);
                  }}
                >
                  Add weight
                </Button>
                <Table rowKey="id" columns={wCols} dataSource={weights} pagination={false} />
              </Card>
            ),
          },
        ]}
      />

      <Modal title="New vaccination" open={vacOpen} onCancel={() => setVacOpen(false)} footer={null}>
        <Form
          form={vacForm}
          layout="vertical"
          onFinish={async (v) => {
            try {
              await api.post("/vaccination-record", {
                petId,
                vaccineName: v.vaccineName,
                vaccinationDate: (v.vaccinationDate as dayjs.Dayjs).format("YYYY-MM-DD"),
                nextDueDate: v.nextDueDate
                  ? (v.nextDueDate as dayjs.Dayjs).format("YYYY-MM-DD")
                  : undefined,
              });
              setVacOpen(false);
              load();
            } catch {
              message.error("Failed");
            }
          }}
        >
          <Form.Item name="vaccineName" label="Vaccine" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="vaccinationDate" label="Date" rules={[{ required: true }]}>
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

      <Modal title="New weight" open={wOpen} onCancel={() => setWOpen(false)} footer={null}>
        <Form
          form={weightForm}
          layout="vertical"
          onFinish={async (v) => {
            try {
              await api.post("/weight-record", {
                petId,
                weight: v.weight,
                recordDate: (v.recordDate as dayjs.Dayjs).format("YYYY-MM-DD"),
              });
              setWOpen(false);
              load();
            } catch {
              message.error("Failed");
            }
          }}
        >
          <Form.Item name="weight" label="Weight" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="recordDate" label="Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
