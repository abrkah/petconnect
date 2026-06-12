"use client";

import { useMemo } from "react";
import { Button, Card, Form, Input, Typography, Segmented, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signupApi, type UserRole } from "@/lib/petconnect-api";
import { HeartIcon, UserPlusIcon } from "@heroicons/react/24/solid";

const { Title, Text } = Typography;

export default function RegisterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramRole = searchParams.get("role") as UserRole | null;
  const defaultRole: UserRole =
    paramRole === "PROVIDER" ? "PROVIDER" : "OWNER";

  const [form] = Form.useForm();

  const initial = useMemo(
    () => ({ role: defaultRole }),
    [defaultRole],
  );

  const onFinish = async (values: {
    email: string;
    password: string;
    confirm: string;
    role: UserRole;
  }) => {
    if (values.password !== values.confirm) {
      message.error("Passwords do not match");
      return;
    }
    try {
      await signupApi({
        email: values.email,
        password: values.password,
        role: values.role,
      });
      message.success("Account created. Please sign in.");
      router.replace(`/login?role=${values.role}`);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: unknown } } };
      const m = err?.response?.data?.message;
      message.error(
        typeof m === "string"
          ? m
          : Array.isArray(m)
            ? m.join(", ")
            : "Registration failed",
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pc-mesh-bg px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-emerald-400/15 blur-[90px]" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-sky-400/15 blur-[100px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 shadow-2xl shadow-slate-900/10 ring-1 ring-white/60 backdrop-blur-xl lg:min-h-[680px] lg:flex-row dark:border-slate-800 dark:bg-slate-900/75 dark:ring-slate-700/50">
        <div className="relative flex flex-1 flex-col justify-between bg-gradient-to-br from-slate-900 via-teal-900 to-teal-700 px-8 py-10 text-white lg:max-w-md lg:px-10 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(45,212,191,0.2),transparent_50%)]" />
          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-white/95 no-underline"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <HeartIcon className="h-5 w-5" />
              </span>
              PetConnect
            </Link>
            <h2 className="mt-10 text-2xl font-bold leading-tight sm:text-3xl">
              Create your space for pet care.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-teal-100/90 sm:text-base">
              One account for owners or providers—tailored dashboards after you
              sign in.
            </p>
          </div>
          <div className="relative mt-8 flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <UserPlusIcon className="h-6 w-6 shrink-0 text-teal-200" />
            <p className="text-sm text-teal-50/95">
              Already have access?{" "}
              <Link href="/login" className="font-semibold text-white underline decoration-white/40 underline-offset-2">
                Sign in instead
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-12">
          <Card
            bordered={false}
            className="w-full max-w-md border-0 bg-transparent shadow-none"
            styles={{ body: { padding: 0 } }}
          >
            <div className="mb-8 text-center lg:text-left">
              <Title level={3} className="!mb-1 !text-slate-900 dark:!text-white">
                Create account
              </Title>
              <Text type="secondary" className="text-base dark:text-slate-400">
                Join PetConnect as an owner or provider.
              </Text>
            </div>
            <Form
              form={form}
              layout="vertical"
              initialValues={initial}
              onFinish={onFinish}
              size="large"
              requiredMark={false}
            >
              <Form.Item label="I am a" name="role" className="[&_.ant-form-item-label>label]:font-medium">
                <Segmented
                  block
                  size="large"
                  options={[
                    { label: "Pet owner", value: "OWNER" },
                    { label: "Service provider", value: "PROVIDER" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email required" },
                  { type: "email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-slate-400" />}
                  className="!rounded-xl"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, min: 6, message: "Min 6 characters" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-400" />}
                  className="!rounded-xl"
                />
              </Form.Item>
              <Form.Item
                label="Confirm password"
                name="confirm"
                dependencies={["password"]}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, v) {
                      if (!v || getFieldValue("password") === v) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-400" />}
                  className="!rounded-xl"
                />
              </Form.Item>
              <Form.Item className="!mb-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  className="h-12 !rounded-xl font-semibold shadow-lg shadow-teal-600/20"
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
            <div className="text-center text-sm text-slate-600 lg:text-left dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
