"use client";

import { Modal, Form, Input } from "antd";

type CreateBlogModalProps = {
  open: boolean;
  onCancel: () => void;
  onCreate: (values: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
  }) => void;
};

export default function CreateBlogModal({
  open,
  onCancel,
  onCreate,
}: CreateBlogModalProps) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onCreate(values);
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
      title="Add New Blog"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Add"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="create_blog_form">
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
