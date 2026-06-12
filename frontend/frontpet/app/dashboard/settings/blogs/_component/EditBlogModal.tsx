"use client";

import { Modal, Form, Input } from "antd";
import { useEffect } from "react";

type Blog = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

type EditBlogModalProps = {
  open: boolean;
  blog: Blog | null;
  onCancel: () => void;
  onSave: (values: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
  }) => void;
};

export default function EditBlogModal({
  open,
  blog,
  onCancel,
  onSave,
}: EditBlogModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (blog) {
      form.setFieldsValue(blog);
    } else {
      form.resetFields();
    }
  }, [blog, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      form.resetFields();
    } catch (error) {
      // validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit Blog"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="edit_blog_form">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="subtitle"
          label="Subtitle"
          rules={[{ required: true, message: "Please input the subtitle!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image URL"
          rules={[{ required: true, message: "Please input the image URL!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
