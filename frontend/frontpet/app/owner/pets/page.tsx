"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Card,
} from "antd";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import { api } from "@/lib/petconnect-api";

type Pet = {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender?: string | null;
  weight?: number | null;
  photoUrl?: string | null;
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=70";

export default function OwnerPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pet | null>(null);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Pet[]>("/pets/mine");
      setPets(data);
    } catch {
      message.error("Could not load pets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (v: Record<string, unknown>) => {
    try {
      if (editing) {
        await api.patch(`/pets/${editing.id}`, v);
        message.success("Pet updated");
      } else {
        await api.post("/pets", v);
        message.success("Pet added");
      }
      setOpen(false);
      setEditing(null);
      form.resetFields();
      load();
    } catch {
      message.error("Save failed");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            My pets
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your pet profiles — open a hub for weight, vaccines, and bookings.
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="!h-11 !rounded-xl !border-0 !bg-emerald-600 hover:!bg-emerald-500"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          Add pet
        </Button>
      </div>

      {loading && pets.length === 0 ? (
        <div className="py-20 text-center text-slate-500">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((p) => (
            <Card
              key={p.id}
              loading={loading}
              classNames={{ body: "!p-0" }}
              className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-square w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.photoUrl || PLACEHOLDER}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                  <li>
                    <span className="text-slate-400">Breed </span>
                    <span className="font-medium text-slate-800">{p.breed}</span>
                  </li>
                  <li>
                    <span className="text-slate-400">Age </span>
                    <span className="font-medium text-slate-800">{p.age} yrs</span>
                  </li>
                  <li>
                    <span className="text-slate-400">Weight </span>
                    <span className="font-medium text-slate-800">
                      {p.weight != null && p.weight !== undefined
                        ? `${p.weight} kg`
                        : "—"}
                    </span>
                  </li>
                </ul>
                <div className="mt-5 flex gap-3">
                  <Link href={`/owner/pets/${p.id}`} className="flex-1">
                    <Button type="primary" block className="!rounded-xl !bg-sky-600 hover:!bg-sky-500">
                      View
                    </Button>
                  </Link>
                  <Button
                    block
                    className="!rounded-xl !border-emerald-500 !font-semibold !text-emerald-700 hover:!border-emerald-600 hover:!text-emerald-800"
                    onClick={() => {
                      setEditing(p);
                      form.setFieldsValue(p);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && pets.length === 0 && (
        <Card className="rounded-2xl border-dashed">
          <p className="mb-4 text-slate-600">You haven&apos;t added a pet yet.</p>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>
            Add your first pet
          </Button>
        </Card>
      )}

      <Modal
        title={editing ? "Edit pet" : "Add pet"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="breed" label="Breed" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="weight" label="Weight kg (optional)">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="gender" label="Gender (optional)">
            <Input />
          </Form.Item>
          <Form.Item name="photoUrl" label="Photo URL (optional)">
            <Input placeholder="https://…" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
