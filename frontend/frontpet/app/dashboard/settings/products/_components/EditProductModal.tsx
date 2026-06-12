"use client";

import { Modal, Form, Input } from "antd";
import { useEffect } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  isActive: boolean;
};

type EditProductModalProps = {
  open: boolean;
  product: Product | null;
  onCancel: () => void;
  onSave: (values: Omit<Product, "id">) => void;
};

export default function EditProductModal({
  open,
  product,
  onCancel,
  onSave,
}: EditProductModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
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
      title="Edit Product"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="edit_product_form">
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
