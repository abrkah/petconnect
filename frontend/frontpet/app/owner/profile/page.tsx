"use client";

import { useEffect } from "react";
import { Card, Form, Input, Button, Typography, Divider } from "antd";
import { api } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";
import AustriaPhoneInput from "@/components/petconnect/AustriaPhoneInput";
import {
  validateAustriaPhoneRule,
  validateRequiredAustriaPhoneRule,
} from "@/lib/austria-phone";

const { Title } = Typography;

type OwnerProfileForm = {
  fullName: string;
  phoneNumber: string;
  city: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
};

export default function OwnerProfilePage() {
  const [form] = Form.useForm<OwnerProfileForm>();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<OwnerProfileForm>("/owner/profile");
        form.setFieldsValue({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          city: data.city ?? "",
          address: data.address ?? "",
          emergencyContactName: data.emergencyContactName ?? "",
          emergencyContactPhone: data.emergencyContactPhone ?? "",
          notes: data.notes ?? "",
        });
      } catch (err) {
        notifyError(extractApiError(err, "Could not load profile"));
      }
    })();
  }, [form]);

  const save = async (v: OwnerProfileForm) => {
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
        <Form.Item
          name="phoneNumber"
          label="Phone (Austria)"
          rules={[{ validator: validateRequiredAustriaPhoneRule }]}
        >
          <AustriaPhoneInput placeholder="660 1234567" />
        </Form.Item>
        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Input placeholder="Vienna" />
        </Form.Item>
        <Form.Item name="address" label="Home address (optional)">
          <Input placeholder="Street, building, postal code" />
        </Form.Item>

        <Divider />

        <Form.Item name="emergencyContactName" label="Emergency contact name">
          <Input />
        </Form.Item>
        <Form.Item
          name="emergencyContactPhone"
          label="Emergency contact phone"
          rules={[{ validator: validateAustriaPhoneRule }]}
        >
          <AustriaPhoneInput placeholder="660 1234567" />
        </Form.Item>
        <Form.Item name="notes" label="Notes for providers">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Button type="primary" htmlType="submit" className="!bg-teal-600">
          Save
        </Button>
      </Form>
    </Card>
  );
}
