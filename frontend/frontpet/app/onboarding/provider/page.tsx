"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  message,
} from "antd";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { api } from "@/lib/petconnect-api";
import { useEffect } from "react";

const { Title, Text } = Typography;

const services = [
  { value: "DOG_WALKING", label: "Dog walking" },
  { value: "VACCINATION", label: "Vaccination" },
  { value: "GENERAL_SERVICE", label: "General service" },
];

export default function OnboardProviderPage() {
  const router = useRouter();
  const token = useAuthenticationStore((s) => s.token);
  const role = useAuthenticationStore((s) => s.loggedUserRole);

  useEffect(() => {
    if (!token) router.replace("/login?role=PROVIDER");
    else if (role && role !== "PROVIDER") router.replace("/owner");
  }, [token, role, router]);

  const onFinish = async (v: Record<string, unknown>) => {
    try {
      await api.post("/provider/profile", {
        fullName: v.fullName,
        phoneNumber: v.phoneNumber,
        hourlyPayment: v.hourlyPayment,
        gender: v.gender,
        serviceType: v.serviceType,
        bio: v.bio || undefined,
      });
      message.success("Profile saved");
      router.replace("/provider");
    } catch {
      message.error("Could not save profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-lg shadow-lg">
        <Title level={4}>Provider profile</Title>
        <Text type="secondary">
          Clients will see this when browsing providers on PetConnect.
        </Text>
        <Form layout="vertical" className="mt-6" onFinish={onFinish}>
          <Form.Item name="fullName" label="Name" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="hourlyPayment"
            label="Hourly rate"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} className="w-full" size="large" />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Input size="large" placeholder="How you identify" />
          </Form.Item>
          <Form.Item
            name="serviceType"
            label="Primary service"
            rules={[{ required: true }]}
          >
            <Select options={services} size="large" />
          </Form.Item>
          <Form.Item name="bio" label="Introduction (optional)">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Continue
          </Button>
        </Form>
      </Card>
    </div>
  );
}
