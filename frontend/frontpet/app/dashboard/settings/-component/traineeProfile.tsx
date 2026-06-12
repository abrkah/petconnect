"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Form,
  Input,
  Button,
  message,
  Select,
  Tag,
  Upload,
  Row,
  Col,
  Card,
  List,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateUser } from "@/app/utils/store/server/user/mutation";

const { Option } = Select;

const UserProfileDashboard: React.FC<{ userData: any }> = ({ userData }) => {
  const { mutate: updateUser } = useUpdateUser();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    userData?.user_image
  );
  const role = userData?.role?.name || "Trainee";

  useEffect(() => {
    form.setFieldsValue({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      sex: userData.sex,
      password: "",
      confirmPassword: "",
    });
  }, [userData, form]);

  const handleImageChange = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target?.result as string);
    reader.readAsDataURL(file);
    return false;
  };

  const onFinish = (values: any) => {
    if (values.password && values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    const payload = {
      id: userData.id,
      name: values.name,
      phone: values.phone,
      address: values.address,
      sex: values.sex,
      password: values.password || undefined,
      user_image: imageUrl,
    };

    updateUser(
      { userData: payload, userId: userData.id },
      {
        onSuccess: () => message.success("Profile updated successfully!"),
        onError: (err: any) => {
          message.error("Failed to update profile");
          console.error(err);
        },
      }
    );
  };

  const roleColors: Record<string, string> = {
    Admin: "red",
    Trainee: "blue",
    Instructor: "green",
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl bg-white p-6 md:p-10 rounded-lg shadow-md">
        {/* Avatar */}
        <div className="flex justify-center mb-6 relative">
          <Avatar size={120} src={imageUrl} className="border border-gray-300">
            {!imageUrl && userData?.name
              ? userData.name.charAt(0).toUpperCase()
              : null}
          </Avatar>
          <Upload
            showUploadList={false}
            beforeUpload={handleImageChange}
            className="absolute bottom-0 right-0"
          >
            <Button
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
              size="small"
            />
          </Upload>
        </div>

        {/* Conditional UI */}
        {role === "Trainee" ? (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Phone" name="phone">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Address" name="address">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Sex" name="sex">
                  <Select placeholder="Select gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Role" name="role">
                  <Select disabled>
                    <Option value="Trainee">Trainee</Option>
                    <Option value="Admin">Admin</Option>
                    <Option value="Instructor">Instructor</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ min: 6 }]}
                >
                  <Input.Password placeholder="Leave blank to keep current" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Confirm Password" name="confirmPassword">
                  <Input.Password placeholder="Confirm password" />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
              <Button type="primary" htmlType="submit">
                Update Profile
              </Button>
              <Tag color={roleColors[role]} className="uppercase font-bold">
                {role}
              </Tag>
            </div>
          </Form>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">Prepared Courses</h2>
            {userData.preparedCourses?.length ? (
              <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={userData.preparedCourses}
                renderItem={(course: any, idx: number) => (
                  <List.Item key={idx}>
                    <Card title={course.title || `Course ${idx + 1}`}>
                      <p>{course.description || "No description available"}</p>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <p>No prepared courses available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileDashboard;
