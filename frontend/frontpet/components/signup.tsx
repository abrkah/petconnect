"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Progress,
  Modal,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRegisterMutation } from "@/app/utils/store/server/authentication/mutation/register";
import MessageService from "./Success";

const { Title, Text } = Typography;

interface SignUpFormData {
  name: string;
  user_email: string;
  user_password: string;
}

const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return Math.min(strength, 4);
};

interface SignUpFormProps {
  onClose?: () => void;
}

const SignUpForm = ({ onClose }: SignUpFormProps) => {
  const [form] = Form.useForm();
  const { mutate: registerUser, isPending } = useRegisterMutation();
  const [password, setPassword] = useState("");

  const onFinish = (values: SignUpFormData) => {
    const payload = {
      name: values.name,
      email: values.user_email,
      password: values.user_password,
    };

    registerUser(payload, {
      onSuccess: () => {
        MessageService(
          "success",
          "Your account has been successfully registered."
        );
        form.resetFields();
        setPassword("");
        onClose?.();
      },
      onError: (error: any) => {
        MessageService("error", error?.message || "Registration failed");
      },
    });
  };
  

  const strength = getPasswordStrength(password);
  const strengthPercent = (strength / 4) * 100;
  const strengthColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "gold";
      case 4:
        return "green";
      default:
        return "red";
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="max-w-md w-full">
        <Title level={3} className="text-center mb-8 text-gray-900">
          Create an Account
        </Title>

        {/* Autofill trap for Chrome */}
        <input
          type="text"
          name="fake_username"
          autoComplete="username"
          hidden
        />
        <input
          type="password"
          name="fake_password"
          autoComplete="new-password"
          hidden
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark="optional"
          scrollToFirstError
        >
          {/* Full Name */}
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Full name is required" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
            hasFeedback
          >
            <Input placeholder="John Doe" size="large" autoComplete="off" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email Address"
            name="user_email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email address" },
            ]}
            hasFeedback
          >
            <Input
              placeholder="you@example.com"
              size="large"
              autoComplete="new-email"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="user_password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "At least 6 characters" },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="••••••••"
              size="large"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* Password Strength Meter */}
          {password && (
            <div className="mb-4">
              <Text strong>Password Strength:</Text>
              <Progress
                percent={strengthPercent}
                showInfo={false}
                strokeColor={strengthColor()}
                status={strengthPercent < 50 ? "exception" : "normal"}
              />
              <Text
                type={strengthPercent < 50 ? "danger" : "success"}
                className="text-sm"
              >
                {
                  ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][
                    strength
                  ]
                }
              </Text>
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-4"
            loading={isPending}
            size="large"
            disabled={isPending}
          >
            {isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default SignUpForm;
