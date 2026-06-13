"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Divider, Form, Input, Typography, message } from "antd";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { api } from "@/lib/petconnect-api";
import { useEffect, useState } from "react";
import AustriaPhoneInput from "@/components/petconnect/AustriaPhoneInput";
import {
  validateAustriaPhoneRule,
  validateRequiredAustriaPhoneRule,
} from "@/lib/austria-phone";

const { Title, Text } = Typography;

type OwnerOnboardingValues = {
  fullName: string;
  phoneNumber: string;
  city: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
};

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

  const onFinish = async (v: OwnerOnboardingValues) => {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-lg shadow-lg">
        <Title level={4}>Welcome to PetConnect</Title>
        <Text type="secondary">
          A few details help providers reach you and care for your pets safely.
        </Text>
        <Form layout="vertical" className="mt-6" onFinish={onFinish}>
          <Title level={5} className="!mb-3 !text-base">
            About you
          </Title>
          <Form.Item
            name="fullName"
            label="Full name"
            rules={[{ required: true, message: "Enter your full name" }]}
          >
            <Input size="large" placeholder="Alex Rivera" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone (Austria)"
            rules={[{ validator: validateRequiredAustriaPhoneRule }]}
          >
            <AustriaPhoneInput size="large" />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Enter your city" }]}
          >
            <Input size="large" placeholder="Vienna" />
          </Form.Item>
          <Form.Item name="address" label="Home address (optional)">
            <Input size="large" placeholder="Street, building, postal code" />
          </Form.Item>

          <Divider className="!my-5" />

          <Title level={5} className="!mb-3 !text-base">
            Emergency contact
          </Title>
          <Text type="secondary" className="mb-4 block text-sm">
            Someone we can reach if you are unavailable during a booking.
          </Text>
          <Form.Item name="emergencyContactName" label="Contact name (optional)">
            <Input size="large" placeholder="Jordan Lee" />
          </Form.Item>
          <Form.Item
            name="emergencyContactPhone"
            label="Contact phone (optional)"
            rules={[{ validator: validateAustriaPhoneRule }]}
          >
            <AustriaPhoneInput size="large" placeholder="660 1234567" />
          </Form.Item>

          <Divider className="!my-5" />

          <Form.Item
            name="notes"
            label="Notes for providers (optional)"
            extra="e.g. pet count, preferred visit times, access instructions"
          >
            <Input.TextArea
              rows={3}
              placeholder="I have two dogs and prefer morning walks on weekdays."
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={submitting}
            className="!bg-teal-600"
          >
            Continue to dashboard
          </Button>
        </Form>
      </Card>
    </div>
  );
}
