"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { api } from "@/lib/petconnect-api";
import { useEffect, useState } from "react";
import AustriaPhoneInput from "@/components/petconnect/AustriaPhoneInput";
import { validateRequiredAustriaPhoneRule } from "@/lib/austria-phone";

const { Title, Text } = Typography;

export default function OnboardOwnerPage() {
  const router = useRouter();
  const token = useAuthenticationStore((s) => s.token);
  const role = useAuthenticationStore((s) => s.loggedUserRole);

  const setIsFirstLogin = useAuthenticationStore((s) => s.setIsFirstLogin);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) router.replace("/login?role=OWNER");
    else if (role && role !== "OWNER") router.replace("/provider");
  }, [token, role, router]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        await api.get("/owner/profile");
        setIsFirstLogin(false);
        router.replace("/owner");
      } catch {
        /* no profile yet — stay on onboarding */
      }
    })();
  }, [token, router, setIsFirstLogin]);

  const onFinish = async (v: { fullName: string; phoneNumber: string }) => {
    setSubmitting(true);
    try {
      await api.post("/owner/profile", v);
      setIsFirstLogin(false);
      message.success("Profile saved");
      window.location.assign("/owner");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      message.error(
        err?.response?.data?.message || "Could not save profile",
      );
    } finally {
      setSubmitting(false);
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
            label="Phone (Austria)"
            rules={[{ validator: validateRequiredAustriaPhoneRule }]}
          >
            <AustriaPhoneInput size="large" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={submitting}
          >
            Continue
          </Button>
        </Form>
      </Card>
    </div>
  );
}