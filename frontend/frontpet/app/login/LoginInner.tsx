"use client";

import { useState } from "react";
import { Alert, Button, Form, Input, Typography } from "antd";
import { ArrowRightOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BoltIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { loginApi } from "@/lib/petconnect-api";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import AuthPageShell from "@/components/auth/AuthPageShell";
import {
  formatLoginError,
  notifyError,
  notifySuccess,
} from "@/lib/feedback";
import {
  authErrorAlertClassName,
  authFormBoxClassName,
  authInputClassName,
  authLabelClassName,
  authPrimaryButtonClassName,
} from "@/lib/auth-page-theme";

const { Title, Text } = Typography;

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function LoginInner() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onFinish = async (values: { email: string; password: string }) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const data = await loginApi(values.email, values.password);
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
    <AuthPageShell
      authPage="login"
      badge="Secure sign-in"
      headline={
        <>
          Welcome back to{" "}
          <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
            calmer pet care
          </span>
        </>
      }
      description="Sign in with your email and password—we'll take you to the right dashboard automatically."
      features={[
        {
          icon: <ShieldCheckIcon className="h-4 w-4" />,
          label: "Secure access",
        },
        {
          icon: <BoltIcon className="h-4 w-4" />,
          label: "Fast dashboard load",
        },
      ]}
      sideNote={
        <div className="flex items-start gap-3">
          <SparklesIcon className="h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-sm leading-relaxed text-slate-400">
            Demo:{" "}
            <span className="font-mono text-xs text-slate-200">
              seed-owner-0@petconnect.test
            </span>{" "}
            · password{" "}
            <span className="font-mono text-xs text-slate-200">
              SeedPass123!
            </span>{" "}
            after{" "}
            <span className="font-mono text-xs text-slate-300">
              npm run seed
            </span>{" "}
            on the API.
          </p>
        </div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="mb-7 text-center lg:text-left">
          <Title
            level={2}
            className="!mb-1.5 !text-[1.65rem] !font-bold !tracking-tight !text-white sm:!text-3xl"
          >
            Sign in
          </Title>
          <Text className="!text-[15px] !text-slate-400">
            Enter your email and password to continue.
          </Text>
        </div>

        <div className={authFormBoxClassName}>
          <Form
            form={form}
            layout="vertical"
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
                  <p className="mb-0 text-sm leading-relaxed">{submitError}</p>
                }
                className={authErrorAlertClassName}
              />
            ) : null}

            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
              <Form.Item
                label={<span className={authLabelClassName}>Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Email required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-slate-500" />}
                  placeholder="you@example.com"
                  className={authInputClassName}
                />
              </Form.Item>
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
              <Form.Item
                label={<span className={authLabelClassName}>Password</span>}
                name="password"
                rules={[{ required: true, message: "Password required" }]}
                className="!mb-6"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-500" />}
                  placeholder="••••••••"
                  className={authInputClassName}
                />
              </Form.Item>
            </motion.div>

            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={submitting}
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  className={authPrimaryButtonClassName}
                >
                  Continue
                </Button>
              </Form.Item>
            </motion.div>
          </Form>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500 lg:text-left">
          No account?{" "}
          <Link
            href="/register"
            className="font-semibold text-teal-400 transition hover:text-teal-300"
          >
            Create one free
          </Link>
          <span className="mx-2 text-slate-700">·</span>
          <Link
            href="/"
            className="font-medium text-slate-400 transition hover:text-white"
          >
            Home
          </Link>
        </div>
      </motion.div>
    </AuthPageShell>
  );
}
