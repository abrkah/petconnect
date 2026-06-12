"use client";

import { useEffect } from "react";
import { Card, Form, Input, Button, Typography } from "antd";
import { api } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";

const { Title } = Typography;

export default function OwnerProfilePage() {
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<{
          fullName: string;
          phoneNumber: string;
        }>("/owner/profile");
        form.setFieldsValue({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
        });
      } catch (err) {
        notifyError(extractApiError(err, "Could not load profile"));
      }
    })();
  }, [form]);

  const save = async (v: Record<string, string>) => {
    try {
      await api.patch("/owner/profile", v);
      notifySuccess("Your profile was updated successfully");
    } catch (err) {
      notifyError(extractApiError(err, "Could not save profile"));
    }
  };

  return (
    <Card className="max-w-xl rounded-2xl border-slate-200 shadow-sm">
      <Title level={4}>Your profile</Title>
      <Form layout="vertical" form={form} onFinish={save}>
        <Form.Item name="fullName" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" className="!bg-teal-600">
          Save
        </Button>
      </Form>
    </Card>
  );
}
