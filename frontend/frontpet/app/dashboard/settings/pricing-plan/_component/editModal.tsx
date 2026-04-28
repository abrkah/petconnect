"use client";

import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";

type Plan = {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
};

type EditPlanModalProps = {
  open: boolean;
  plan: Plan | null;
  onCancel: () => void;
  onSave: (updatedPlan: Omit<Plan, "id" | "popular">) => void;
};

export default function EditPlanModal({
  open,
  plan,
  onCancel,
  onSave,
}: EditPlanModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (plan) {
      form.setFieldsValue({
        name: plan.name,
        price: Number(plan.price.replace("$", "")),
        description: plan.description,
        features: plan.features.join(", "),
      });
    } else {
      form.resetFields();
    }
  }, [plan, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSave({
          name: values.name,
          price: `$${values.price}`,
          description: values.description,
          features: values.features
            .split(",")
            .map((f: string) => f.trim())
            .filter((f: string) => f.length > 0),
        });
        form.resetFields();
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Edit Pricing Plan"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Save"
    >
      <Form form={form} layout="vertical" initialValues={{ price: 0 }}>
        <Form.Item
          label="Plan Name"
          name="name"
          rules={[{ required: true, message: "Please enter plan name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price (USD)"
          name="price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Features (comma separated)"
          name="features"
          rules={[{ required: true, message: "Please enter features" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
