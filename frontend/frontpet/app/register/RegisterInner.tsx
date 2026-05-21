"use client";

import { useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Segmented,
  ConfigProvider,
  theme,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { message } from "antd";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  BoltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { signupApi, type UserRole } from "@/lib/petconnect-api";
import { HeartIcon, SparklesIcon } from "@heroicons/react/24/solid";

const { Title, Text } = Typography;

export default function RegisterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramRole = searchParams.get("role") as UserRole | null;

  const [form] = Form.useForm();

  const defaultRole = useMemo<UserRole>(() => {
    if (paramRole === "PROVIDER" || paramRole === "OWNER") return paramRole;
    return "OWNER";
  }, [paramRole]);

  useEffect(() => {
    form.setFieldsValue({ role: defaultRole });
  }, [defaultRole, form]);

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
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#14b8a6",
          colorBgContainer: "#0f172a",
          colorBgElevated: "#1e293b",
          colorBorder: "#334155",
          colorBorderSecondary: "#1e293b",
          colorText: "#e2e8f0",
          colorTextSecondary: "#94a3b8",
          colorTextPlaceholder: "#64748b",
          borderRadiusLG: 14,
          fontFamily:
            'var(--font-petconnect), ui-sans-serif, system-ui, sans-serif',
        },
        components: {
          Input: {
            activeBorderColor: "#2dd4bf",
            hoverBorderColor: "#475569",
            activeShadow: "0 0 0 2px rgba(45, 212, 191, 0.15)",
          },
          Segmented: {
            trackBg: "rgba(15, 23, 42, 0.9)",
            itemColor: "#94a3b8",
            itemHoverColor: "#e2e8f0",
            itemSelectedBg: "#0d9488",
            itemSelectedColor: "#ffffff",
          },
          Button: {
            primaryShadow: "0 10px 28px -8px rgba(13, 148, 136, 0.55)",
          },
        },
      }}
    >
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
        <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-teal-600/10 blur-[100px]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-10 md:px-12 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 shadow-2xl shadow-black/40 ring-1 ring-white/5 lg:min-h-[560px] lg:flex-row"
          >
            <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-slate-950 px-8 py-10 text-white lg:max-w-[46%] lg:px-11 lg:py-12">
              <div className="pointer-events-none absolute -right-16 top-1/4 h-64 w-64 rounded-full bg-cyan-400/25 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-teal-500/20 blur-[90px]" />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-4h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h4v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-white/90 transition hover:text-white"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/25 ring-1 ring-teal-400/30">
                    <HeartIcon className="h-5 w-5" />
                  </span>
                  <span className="text-lg font-bold tracking-tight">
                    PetConnect
                  </span>
                </Link>

                <p className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-teal-100 ring-1 ring-white/20">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                  Free to join
                </p>
                <h1 className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl">
                  Create your{" "}
                  <span className="bg-gradient-to-r from-white via-teal-50 to-cyan-100 bg-clip-text text-transparent">
                    PetConnect account
                  </span>
                </h1>
                <p className="mt-4 max-w-md text-base leading-relaxed text-teal-50/95">
                  Choose owner or provider, then set up your profile and start
                  managing pets, bookings, and care in one place.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-teal-50 ring-1 ring-white/15">
                    <ShieldCheckIcon className="h-4 w-4 text-emerald-200" />
                    Owner or provider
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-teal-50 ring-1 ring-white/15">
                    <BoltIcon className="h-4 w-4 text-amber-200" />
                    Guided onboarding
                  </span>
                </div>
              </div>

              <div className="relative mt-10 hidden items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-sm sm:flex">
                <SparklesIcon className="h-6 w-6 shrink-0 text-amber-200" />
                <p className="text-sm leading-relaxed text-teal-50/95">
                  Already registered?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-white underline decoration-white/40 underline-offset-2"
                  >
                    Sign in
                  </Link>{" "}
                  with your email and password.
                </p>
              </div>
            </div>

            <div className="relative flex flex-1 flex-col justify-center border-t border-slate-800 bg-slate-950 px-6 py-10 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white lg:absolute lg:left-10 lg:top-10 lg:mb-0"
              >
                <ArrowLeftIcon className="h-4 w-4" aria-hidden />
                Back to home
              </Link>

              <Card
                bordered={false}
                className="mx-auto w-full max-w-md border-0 bg-transparent shadow-none"
                styles={{ body: { padding: 0 } }}
              >
                <div className="mb-8 text-center lg:text-left">
                  <Title
                    level={2}
                    className="!mb-2 !text-2xl !font-bold !tracking-tight !text-white sm:!text-3xl"
                  >
                    Create account
                  </Title>
                  <Text className="!text-base !text-slate-400">
                    Join as a pet owner or service provider.
                  </Text>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/30">
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ role: defaultRole }}
                    onFinish={onFinish}
                    size="large"
                    requiredMark={false}
                  >
                    <Form.Item
                      label={
                        <span className="font-semibold text-slate-300">
                          I am a
                        </span>
                      }
                      name="role"
                      className="[&_.ant-segmented]:!rounded-xl [&_.ant-segmented-item]:!rounded-lg [&_.ant-segmented]:!bg-slate-950 [&_.ant-segmented]:!p-1 [&_.ant-segmented-thumb]:!rounded-lg"
                    >
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
                      label={
                        <span className="font-semibold text-slate-300">
                          Email
                        </span>
                      }
                      name="email"
                      rules={[
                        { required: true, message: "Email required" },
                        { type: "email", message: "Invalid email" },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined className="text-slate-500" />}
                        placeholder="you@example.com"
                        className="!rounded-xl !border-slate-700 !bg-slate-950 !py-2.5"
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span className="font-semibold text-slate-300">
                          Password
                        </span>
                      }
                      name="password"
                      rules={[
                        { required: true, message: "Password required" },
                        { min: 6, message: "Min 6 characters" },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-slate-500" />}
                        placeholder="••••••••"
                        className="!rounded-xl !border-slate-700 !bg-slate-950 !py-2.5"
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span className="font-semibold text-slate-300">
                          Confirm password
                        </span>
                      }
                      name="confirm"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Confirm your password" },
                        ({ getFieldValue }) => ({
                          validator(_, v) {
                            if (!v || getFieldValue("password") === v) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match"),
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-slate-500" />}
                        placeholder="••••••••"
                        className="!rounded-xl !border-slate-700 !bg-slate-950 !py-2.5"
                      />
                    </Form.Item>
                    <Form.Item className="!mb-1">
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        className="!h-12 !rounded-xl !border-0 !bg-teal-500 !font-bold !text-base !text-white shadow-lg shadow-teal-500/25 hover:!bg-teal-400"
                      >
                        Create account
                      </Button>
                    </Form.Item>
                  </Form>
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 lg:text-left">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-teal-400 hover:text-teal-300"
                  >
                    Sign in
                  </Link>
                  <span className="mx-2 text-slate-700">·</span>
                  <Link
                    href="/"
                    className="font-medium text-slate-400 hover:text-white"
                  >
                    Home
                  </Link>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </ConfigProvider>
  );
}
