"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
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
import { motion } from "framer-motion";
import { BoltIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { loginApi, type UserRole } from "@/lib/petconnect-api";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { SparklesIcon } from "@heroicons/react/24/solid";
import MarketingNav from "@/components/MarketingNav";
import {
  formatLoginError,
  getLoginRoleHint,
  notifyError,
  notifySuccess,
} from "@/lib/feedback";

const { Title, Text } = Typography;

export default function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramRole = searchParams.get("role") as UserRole | null;

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const roleHint = submitError ? getLoginRoleHint(submitError) : null;

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
    role: UserRole;
  }) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const data = await loginApi(values.email, values.password, values.role);
      const {
        setToken,
        setUserId,
        setLoggedUserRole,
        setIsFirstLogin,
      } = useAuthenticationStore.getState();
      setToken(data.token);
      setUserId(data.id);
      setLoggedUserRole(data.role);
      setIsFirstLogin(data.isFirstLogin);
      localStorage.setItem("login", "true");
      notifySuccess("Welcome to PetConnect");
      const r = data.role;
      if (data.isFirstLogin) {
        router.replace(
          r === "OWNER" ? "/onboarding/owner" : "/onboarding/provider",
        );
        return;
      }
      router.replace(r === "OWNER" ? "/owner" : "/provider");
    } catch (e: unknown) {
      const msg = formatLoginError(e);
      setSubmitError(msg);
      notifyError(msg, "Sign in failed");
    } finally {
      setSubmitting(false);
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
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-200">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
        <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-teal-600/10 blur-[100px]" />

        <MarketingNav mode="auth" authPage="login" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-10 md:px-12 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 shadow-2xl shadow-black/40 ring-1 ring-white/5 lg:min-h-[560px] lg:flex-row"
          >
            <div className="relative flex flex-1 flex-col justify-between overflow-hidden border-b border-slate-800 bg-slate-900 px-8 py-10 lg:max-w-[46%] lg:border-b-0 lg:border-r lg:px-11 lg:py-12">
              <div className="pointer-events-none absolute -right-16 top-1/4 h-64 w-64 rounded-full bg-teal-600/10 blur-[80px]" />

              <div className="relative">
                <p className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
                  Secure sign-in
                </p>
                <h1 className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl">
                  Welcome back to{" "}
                  <span className="text-teal-400">calmer pet care</span>
                </h1>
                <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
                  Pick your role and jump into bookings, messaging, and health
                  records—all in one polished workspace.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300">
                    <ShieldCheckIcon className="h-4 w-4 text-teal-400" />
                    Role-aware access
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300">
                    <BoltIcon className="h-4 w-4 text-amber-400" />
                    Fast dashboard load
                  </span>
                </div>
              </div>

              <div className="relative mt-10 hidden items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:flex">
                <SparklesIcon className="h-6 w-6 shrink-0 text-amber-400" />
                <p className="text-sm leading-relaxed text-slate-400">
                  Demo:{" "}
                  <span className="font-mono text-[11px] text-slate-200">
                    seed-owner-0@petconnect.test
                  </span>{" "}
                  · password{" "}
                  <span className="font-mono text-[11px] text-slate-200">
                    SeedPass123!
                  </span>{" "}
                  after{" "}
                  <span className="font-mono text-[11px] text-slate-300">
                    npm run seed
                  </span>{" "}
                  on the API.
                </p>
              </div>
            </div>

            <div className="relative flex flex-1 flex-col justify-center bg-slate-950 px-6 py-10 sm:p-10 lg:p-12">
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
                    Sign in
                  </Title>
                  <Text className="!text-base !text-slate-400">
                    Choose your role and enter your credentials.
                  </Text>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/30">
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ role: defaultRole }}
                    onFinish={onFinish}
                    onValuesChange={() => setSubmitError(null)}
                    size="large"
                    requiredMark={false}
                  >
                    {submitError ? (
                      <Alert
                        type="error"
                        showIcon
                        closable
                        onClose={() => setSubmitError(null)}
                        message="Sign in failed"
                        description={
                          <div className="space-y-3">
                            <p className="mb-0 text-sm leading-relaxed">
                              {submitError}
                            </p>
                            {roleHint ? (
                              <Button
                                type="link"
                                size="small"
                                className="!h-auto !p-0 !text-teal-400 hover:!text-teal-300"
                                onClick={() => {
                                  form.setFieldValue("role", roleHint);
                                  setSubmitError(null);
                                }}
                              >
                                Switch to{" "}
                                {roleHint === "PROVIDER"
                                  ? "Service provider"
                                  : "Pet owner"}{" "}
                                and try again
                              </Button>
                            ) : null}
                          </div>
                        }
                        className="!mb-4 !rounded-xl !border-red-500/30 !bg-red-950/40 [&_.ant-alert-message]:!text-red-200 [&_.ant-alert-description]:!text-red-100/90"
                      />
                    ) : null}
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
                      rules={[{ required: true, message: "Password required" }]}
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
                        loading={submitting}
                        className="!h-12 !rounded-xl !border-0 !bg-teal-500 !font-bold !text-base !text-white shadow-lg shadow-teal-500/25 hover:!bg-teal-400"
                      >
                        Continue
                      </Button>
                    </Form.Item>
                  </Form>
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 lg:text-left">
                  No account?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-teal-400 hover:text-teal-300"
                  >
                    Register
                  </Link>
                  <span className="mx-2 text-slate-700">·</span>
                  <Link href="/" className="font-medium text-slate-400 hover:text-white">
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