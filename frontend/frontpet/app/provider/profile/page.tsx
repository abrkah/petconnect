"use client";

import { useEffect } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { api } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";

const services = [
  { value: "DOG_WALKING", label: "Dog walking" },
  { value: "VACCINATION", label: "Vaccination" },
  { value: "GENERAL_SERVICE", label: "General" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const days = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export default function ProviderProfilePage() {
  const [form] = Form.useForm();
  const [slotForm] = Form.useForm();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Record<string, unknown>>("/provider/profile");
        form.setFieldsValue({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          hourlyPayment: data.hourlyPayment,
          gender: data.gender,
          serviceType: data.serviceType,
          bio: data.bio,
        });
      } catch (err) {
        notifyError(extractApiError(err, "Could not load profile"));
      }
    })();
  }, [form]);

  const saveProfile = async (v: Record<string, unknown>) => {
    try {
      await api.patch("/provider/profile", v);
      notifySuccess("Your profile was updated successfully");
    } catch (err) {
      notifyError(extractApiError(err, "Could not save profile"));
    }
  };

  const saveSlots = async (v: {
    slots: { dayOfWeek: number; startTime: string; endTime: string }[];
  }) => {
    try {
      await api.put("/provider-availability/me", v);
      notifySuccess("Weekly availability was saved");
    } catch (err) {
      notifyError(extractApiError(err, "Could not save availability"));
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Public profile" className="rounded-2xl border-slate-200 shadow-sm">
        <Form layout="vertical" form={form} onFinish={saveProfile}>
          <Form.Item name="fullName" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="hourlyPayment" label="Hourly rate" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select options={GENDER_OPTIONS} placeholder="Select gender" />
          </Form.Item>
          <Form.Item name="serviceType" label="Service" rules={[{ required: true }]}>
            <Select options={services} />
          </Form.Item>
          <Form.Item name="bio" label="Introduction">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="!bg-teal-600">
            Save profile
          </Button>
        </Form>
      </Card>

      <Card title="Weekly availability" className="rounded-2xl border-slate-200 shadow-sm">
        <p className="text-slate-600 text-sm mb-4">
          Pet owners see these windows before they book. Replace all slots below.
        </p>
        <Form
          form={slotForm}
          layout="vertical"
          onFinish={saveSlots}
          initialValues={{
            slots: [{ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }],
          }}
        >
          <Form.List name="slots">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                {fields.map(({ key, name, ...rest }) => (
                  <Space key={key} align="baseline" wrap>
                    <Form.Item
                      {...rest}
                      name={[name, "dayOfWeek"]}
                      rules={[{ required: true }]}
                    >
                      <Select options={days} className="min-w-[88px]" />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, "startTime"]}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="09:00" className="w-24" />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, "endTime"]}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="17:00" className="w-24" />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="text-red-500 cursor-pointer"
                      onClick={() => remove(name)}
                    />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add window
                </Button>
              </div>
            )}
          </Form.List>
          <Button type="primary" htmlType="submit" className="mt-4 !bg-teal-600">
            Save availability
          </Button>
        </Form>
      </Card>
    </div>
  );
}
