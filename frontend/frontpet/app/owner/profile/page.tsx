"use client";

import { useEffect } from "react";
import { Card, Form, Input, Button, message, Typography } from "antd";
import { api } from "@/lib/petconnect-api";

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
      } catch {
        message.error("Load profile failed");
      }
    })();
  }, [form]);

  const save = async (v: Record<string, string>) => {
    try {
      await api.patch("/owner/profile", v);
      message.success("Saved");
    } catch {
      message.error("Save failed");
    }
  };

  return (
    <Card className="max-w-xl">
      <Title level={4}>Your profile</Title>
      <Form layout="vertical" form={form} onFinish={save}>
        <Form.Item name="fullName" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form>
    </Card>
  );
}
