"use client";

import { Modal, Form, Input, InputNumber } from "antd";

type CreateProductModalProps = {
  open: boolean;
  onCancel: () => void;
  onCreate: (values: {
    name: string;
    description: string;
    price: string;
    image: string;
    isActive: boolean;
  }) => void;
};

export default function CreateProductModal({
  open,
  onCancel,
  onCreate,
}: CreateProductModalProps) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onCreate(values);
      form.resetFields();
    } catch {
      // validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Add New Product"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Add"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please input the product name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please input the price!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image URL"
          rules={[{ required: true, message: "Please input the image URL!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="isActive" label="Is Active" valuePropName="checked">
          <Input type="checkbox" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
