"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";

const { Title } = Typography;

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SignUpFormData) => {
    setLoading(true);
    try {
      console.log("Signup Data:", values);
      // TODO: Replace with real signup API logic
    } catch (error) {
      console.error("Signup Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-12 p-8 rounded-xl shadow-xl">
      <Title level={3} className="text-center mb-6">
        Create 
      </Title>

      <Form layout="vertical" onFinish={onFinish}>
        {/* Name Field */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[
            { required: true, message: "Full name is required" },
            { min: 3, message: "Name must be at least 3 characters" },
          ]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input type="email" placeholder="you@example.com" />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 6, message: "Password must be at least 6 characters" },
            {
              validator: (_, value) => {
                if (!value || value.length < 6) {
                  return Promise.resolve(); // handled by min rule
                }
                if (!/[A-Z]/.test(value)) {
                  return Promise.reject(
                    new Error("Include at least one uppercase letter")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className="w-full mt-4"
          loading={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </Form>
    </Card>
  );
};

export default SignUpForm;
