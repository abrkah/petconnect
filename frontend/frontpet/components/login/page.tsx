"use client";
import { FaGoogle } from "react-icons/fa";
import { FaMicrosoft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Checkbox, Divider } from "antd";
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { useLoginMutation } from "@/app/utils/store/server/authentication/mutation/login";
import MessageService from "../Success";
import Link from "next/link";

const { Title, Text } = Typography;

const LoginForm = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();
  const { mutate: login, isPending: loading } = useLoginMutation();

  const onFinish = (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    login(values, {
      onSuccess: () => {
        MessageService("success", "Logged in successfully!");
        router.push("/dashboard");
        onClose?.();
      },
      onError: (error) => {
        MessageService("error", error?.message || "Login failed");
      },
    });
  };

  const handleOAuthLogin = (provider: "google" | "microsoft") => {
    // Replace this with real OAuth redirect logic
    MessageService("info", `Redirecting to ${provider} login...`);
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div>
      <Title level={3} className="text-center mb-4">
        Login
      </Title>

      <Form
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ remember: true }}
      >
        {/* Autofill trap */}
        <input type="text" name="fake_user" autoComplete="username" hidden />
        <input
          type="password"
          name="fake_pass"
          autoComplete="current-password"
          hidden
        />

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            size="large"
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
            autoComplete="new-password"
          />
        </Form.Item>

        <div className="flex justify-between items-center mb-4">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember Me</Checkbox>
          </Form.Item>
          <Link
            href="/forgot-password"
            className="text-blue-500 hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          loading={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Divider className="my-6">Or Login With</Divider>

        <div className="flex gap-4 justify-between">
          <Button
            icon={<FaGoogle size={20} />}
            onClick={() => handleOAuthLogin("google")}
            className="flex-1 border border-gray-300 bg-white text-gray-800 hover:border-gray-400"
          >
            Google
          </Button>
          <Button
            icon={<FaMicrosoft size={20} color="#5E5E5E" />}
            onClick={() => handleOAuthLogin("microsoft")}
            className="flex-1 border border-gray-300 bg-white text-gray-800 hover:border-gray-400"
          >
            Microsoft
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
