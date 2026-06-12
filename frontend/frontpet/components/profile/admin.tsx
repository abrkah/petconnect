"use client"
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  notification,
  Skeleton,
  Image,
  Divider,
  Tooltip,
  Row,
  Col,
} from "antd";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";

const phoneRegexUpdated = /^\+\d{1,3}-\d{1,4}-\d{3,4}-\d{3,4}$/;

const AdminProfile = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sampleData, setSampleData] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      const mockProfile = {
        companyName: "EthioTech Innovations",
        companyEmail: "admin@ethiotech.et",
        companyPhone: "+251-11-123-4567",
        logo: "https://via.placeholder.com/150x80?text=Company+Logo",
        stamp: "https://via.placeholder.com/150x80?text=Company+Stamp",
        contactPersonName: "Abirha Kahsay",
        personEmail: "abirha@ethiotech.et",
        personPhone: "+251-91-234-5678",
      };

      setSampleData(mockProfile);
      form.setFieldsValue(mockProfile);
      setIsLoading(false);
    }, 1000);
  }, [form]);

  const handleSubmit = (values: any) => {
    setSubmitting(true);
    setTimeout(() => {
      console.log("Submitted Data:", values);
      notification.success({ message: "Profile updated successfully!" });
      setSubmitting(false);
    }, 1500);
  };

  const renderImageUpload = (label: string, url?: string) => (
    <Form.Item label={label}>
      {url && <Image width={150} src={url} alt={label} className="mb-2" />}
      <Upload showUploadList={false}>
        <Button icon={<UploadOutlined />}>Upload {label}</Button>
      </Upload>
    </Form.Item>
  );

  const RequiredLabel = (label: string) => (
    <span>
      {label} <span className="text-red-500">*</span>
    </span>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Admin Profile Settings</h2>
      <Divider />

      {isLoading ? (
        <Skeleton active />
      ) : (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {/* Company Info Section */}
          <h3 className="text-lg font-medium mb-2">Company Information</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label={RequiredLabel("Company Name")}
                rules={[
                  { required: true, message: "Please enter company name" },
                ]}
              >
                <Input placeholder="e.g. EthioTech Innovations" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="companyEmail"
                label={RequiredLabel("Company Email")}
                rules={[
                  { required: true, message: "Enter email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input placeholder="e.g. info@ethiotech.et" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="companyPhone"
                label={
                  <span>
                    {RequiredLabel("Company Phone")}{" "}
                    <Tooltip title="Format: +251-11-123-4567">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Phone required" },
                  {
                    pattern: phoneRegexUpdated,
                    message: "Invalid phone (e.g. +251-11-123-4567)",
                  },
                ]}
              >
                <Input placeholder="+251-11-123-4567" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              {renderImageUpload("Company Logo", sampleData?.logo)}
            </Col>
            <Col span={12}>
              {renderImageUpload("Company Stamp", sampleData?.stamp)}
            </Col>
          </Row>

          <Divider />

          {/* Contact Person Info Section */}
          <h3 className="text-lg font-medium mb-2">
            Contact Person Information
          </h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPersonName"
                label={RequiredLabel("Full Name")}
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input placeholder="e.g. Abirha Kahsay" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="personEmail"
                label={RequiredLabel("Email")}
                rules={[
                  { required: true, message: "Enter email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input placeholder="e.g. abirha@ethiotech.et" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="personPhone"
                label={RequiredLabel("Phone Number")}
                rules={[
                  { required: true, message: "Phone is required" },
                  {
                    pattern: phoneRegexUpdated,
                    message: "Invalid phone (e.g. +251-91-234-5678)",
                  },
                ]}
              >
                <Input placeholder="+251-91-234-5678" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="px-6 py-2 rounded-lg"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default AdminProfile;
