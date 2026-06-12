"use client";

import { Modal, Form, Input, Checkbox, Button, Space } from "antd";
import { useEffect } from "react";

type CreatePlanModalProps = {
  open: boolean;
  onCancel: () => void;
  onCreate: (plan: {
    name: string;
    price: string;
    description: string;
    features: string[];
  }) => void;
};

export default function CreatePlanModal({
  open,
  onCancel,
  onCreate,
}: CreatePlanModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const onFinish = (values: any) => {
    // features comes as string with line breaks or array
    // For simplicity, we expect user to input features comma-separated
    const featuresArray = values.features
      ? values.features.split(",").map((f: string) => f.trim())
      : [];

    onCreate({
      name: values.name,
      price: values.price,
      description: values.description,
      features: featuresArray,
    });
  };

  return (
    <Modal
      title="Add New Pricing Plan"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Plan Name"
          name="name"
          rules={[{ required: true, message: "Please input the plan name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please input the price!" }]}
        >
          <Input placeholder="$19" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Features (comma separated)"
          name="features"
          rules={[
            { required: true, message: "Please input at least one feature!" },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Feature1, Feature2, Feature3" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Add Plan
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
