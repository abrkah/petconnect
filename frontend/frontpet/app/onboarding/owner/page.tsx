"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { api } from "@/lib/petconnect-api";
import { useEffect } from "react";

const { Title, Text } = Typography;

export default function OnboardOwnerPage() {
  const router = useRouter();
  const token = useAuthenticationStore((s) => s.token);
  const role = useAuthenticationStore((s) => s.loggedUserRole);

  useEffect(() => {
    if (!token) router.replace("/login?role=OWNER");
    else if (role && role !== "OWNER") router.replace("/provider");
  }, [token, role, router]);

  const onFinish = async (v: { fullName: string; phoneNumber: string }) => {
    try {
      await api.post("/owner/profile", v);
      message.success("Profile saved");
      router.replace("/owner");
    } catch {
      message.error("Could not save profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-lg shadow-lg">
        <Title level={4}>Welcome to PetConnect</Title>
        <Text type="secondary">
          Tell us a bit about you so we can set up your owner dashboard.
        </Text>
        <Form layout="vertical" className="mt-6" onFinish={onFinish}>
          <Form.Item
            name="fullName"
            label="Full name"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Continue
          </Button>
        </Form>
      </Card>
    </div>
  );
}
