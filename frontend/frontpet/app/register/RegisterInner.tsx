"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Form, Input, Typography } from "antd";
import { ArrowRightOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BoltIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { signupApi, type UserRole } from "@/lib/petconnect-api";
import AuthPageShell from "@/components/auth/AuthPageShell";
import PasswordStrength from "@/components/auth/PasswordStrength";
import RoleSelector from "@/components/auth/RoleSelector";
import {
  formatRegisterError,
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

export default function RegisterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramRole = searchParams.get("role") as UserRole | null;

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

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
    setSubmitError(null);
    if (values.password !== values.confirm) {
      const msg = "Passwords do not match.";
      setSubmitError(msg);
      notifyError(msg);
      return;
    }
    setSubmitting(true);
    try {
      await signupApi({
        email: values.email,
        password: values.password,
        role: values.role,
      });
      notifySuccess("Account created. Please sign in.");
      router.replace("/login");
    } catch (e: unknown) {
      const msg = formatRegisterError(e);
      setSubmitError(msg);
      notifyError(msg, "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      authPage="register"
      badge="Free to join"
      headline={
        <>
          Create your{" "}
          <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
            PetConnect account
          </span>
        </>
      }
      description="Choose owner or provider, then set up your profile and start managing pets, bookings, and care in one place."
      features={[
        {
          icon: <ShieldCheckIcon className="h-4 w-4" />,
          label: "Owner or provider",
        },
        {
          icon: <BoltIcon className="h-4 w-4" />,
          label: "Guided onboarding",
        },
      ]}
      sideNote={
        <p className="text-sm leading-relaxed text-slate-400">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-semibold text-teal-400 underline decoration-teal-500/30 underline-offset-2 transition hover:text-teal-300"
          >
            Sign in
          </Link>{" "}
          with your email and password.
        </p>
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
            Create account
          </Title>
          <Text className="!text-[15px] !text-slate-400">
            Join as a pet owner or service provider.
          </Text>
        </div>

        <div className={authFormBoxClassName}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ role: defaultRole }}
            onFinish={onFinish}
            onValuesChange={(changed) => {
              setSubmitError(null);
              if ("password" in changed) {
                setPassword(String(changed.password ?? ""));
              }
            }}
            size="large"
            requiredMark={false}
          >
            {submitError ? (
              <Alert
                type="error"
                showIcon
                closable
                onClose={() => setSubmitError(null)}
                message="Registration failed"
                description={
                  <p className="mb-0 text-sm leading-relaxed">
                    {submitError}
                    {submitError.includes("already exists") ? (
                      <>
                        {" "}
                        <Link
                          href="/login"
                          className="font-semibold text-teal-400 hover:text-teal-300"
                        >
                          Sign in
                        </Link>
                      </>
                    ) : null}
                  </p>
                }
                className={authErrorAlertClassName}
              />
            ) : null}

            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
              <Form.Item
                label={<span className={authLabelClassName}>I am a</span>}
                name="role"
                className="!mb-5"
              >
                <RoleSelector />
              </Form.Item>
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
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

            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
              <Form.Item
                label={<span className={authLabelClassName}>Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Password required" },
                  { min: 6, message: "Min 6 characters" },
                ]}
                className="!mb-1"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-500" />}
                  placeholder="••••••••"
                  className={authInputClassName}
                />
              </Form.Item>
              <PasswordStrength password={password} />
            </motion.div>

            <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
              <Form.Item
                label={<span className={authLabelClassName}>Confirm password</span>}
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
                className="!mb-6 !mt-4"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-500" />}
                  placeholder="••••••••"
                  className={authInputClassName}
                />
              </Form.Item>
            </motion.div>

            <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
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
                  Create account
                </Button>
              </Form.Item>
            </motion.div>
          </Form>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-slate-600 lg:text-left">
          By creating an account you agree to use PetConnect responsibly and
          keep your pet data secure.
        </p>

        <div className="mt-5 text-center text-sm text-slate-500 lg:text-left">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-teal-400 transition hover:text-teal-300"
          >
            Sign in
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
