"use client";

import { useState } from "react";
import { Form, Input, Button, Select, message, Upload } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CameraOutlined,
  CheckCircleFilled,
  ArrowLeftOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Option } = Select;
const { TextArea } = Input;

// ─── Step indicators ──────────────────────────────────────────────
const STEPS = ["Welcome", "Complete Profile"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                ${i < current ? "bg-blue-600 border-blue-600 text-white" : i === current ? "bg-white border-blue-600 text-blue-600" : "bg-white border-gray-200 text-gray-400"}`}
            >
              {i < current ? <CheckCircleFilled /> : i + 1}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${i === current ? "text-blue-600" : i < current ? "text-blue-500" : "text-gray-400"}`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1.5 bg-gray-200 rounded-full mx-4 mt-1">
        <div
          className="h-1.5 bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Step 0: Welcome ──────────────────────────────────────────────
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-40 h-40 rounded-3xl overflow-hidden bg-white/60 backdrop-blur-sm shadow-xl border border-white/60 mb-6 flex items-center justify-center">
        <img src="/dogCat.png" alt="Pets" className="object-contain w-full h-full" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to PetConnect 🐾
      </h2>
      <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-3">
        We are glad you are here. Let us set up your profile so pet owners can find and book your services.
      </p>
      <Button
        type="primary"
        size="large"
        onClick={onNext}
        className="w-full rounded-lg font-semibold text-base bg-blue-600 border-blue-600 hover:bg-blue-700"
        style={{ height: "48px" }}
      >
        Get Started
      </Button>
    </div>
  );
}

// ─── Step 1: Complete Provider Profile ───────────────────────────
function CompleteProfileStep({ onFinish }: { onFinish: () => void }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const uploadProps: UploadProps = {
    showUploadList: false,
    beforeUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhoto(e.target?.result as string);
      reader.readAsDataURL(file);
      return false;
    },
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    const phone = form.getFieldValue("phoneNumber");
    if (!phone) { form.validateFields(["phoneNumber"]); return; }
    setSendingOtp(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSendingOtp(false);
    setOtpSent(true);
    startCountdown();
    message.success("OTP sent to your phone number!");
  };

  const handleVerifyOtp = async () => {
    const otp = form.getFieldValue("otp");
    if (!otp || otp.length < 4) { message.error("Please enter the OTP"); return; }
    setVerifyingOtp(true);
    await new Promise((r) => setTimeout(r, 1000));
    setVerifyingOtp(false);
    setOtpVerified(true);
    message.success("Phone number verified!");
  };

  const handleSubmit = async (values: object) => {
    if (!otpVerified) { message.error("Please verify your phone number first."); return; }
    setLoading(true);
    console.log("Provider profile:", values);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onFinish();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Complete Your Profile</h2>
      <p className="text-gray-500 text-sm mb-6">Step 1 of 1 — Tell us about yourself.</p>

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>

        {/* Profile photo — circular for providers */}
        <div className="flex justify-center mb-6">
          <Upload {...uploadProps}>
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-300 bg-white/70 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-white/90 transition-all overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <>
                  <CameraOutlined className="text-blue-400 text-2xl mb-1" />
                  <span className="text-xs text-blue-400 font-medium text-center leading-tight px-1">Upload Photo</span>
                </>
              )}
            </div>
          </Upload>
        </div>

        {/* Full Name */}
        <Form.Item
          label={<span className="text-sm font-medium text-gray-700">Full Name</span>}
          name="fullName"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="e.g. John Smith"
            size="large"
            className="rounded-xl bg-white"
          />
        </Form.Item>

        {/* Gender + Service Type */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Gender</span>}
            name="gender"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select placeholder="Select" size="large">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
              <Option value="prefer_not">Prefer not to say</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Service Type</span>}
            name="serviceType"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select placeholder="Select" size="large">
              <Option value="DOG_WALKING">Dog Walking</Option>
              <Option value="VACCINATION">Vaccination</Option>
              <Option value="GENERAL_SERVICE">General Service</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Hourly Rate */}
        <Form.Item
          label={<span className="text-sm font-medium text-gray-700">Hourly Rate</span>}
          name="hourlyPayment"
          rules={[{ required: true, message: "Please enter your hourly rate" }]}
        >
          <Input
            prefix={<DollarOutlined className="text-gray-400" />}
            placeholder="e.g. 25"
            size="large"
            className="rounded-xl bg-white"
            suffix={<span className="text-gray-400 text-sm">/ hr</span>}
            type="number"
            min={0}
          />
        </Form.Item>

        {/* Phone + OTP */}
        <Form.Item
          label={<span className="text-sm font-medium text-gray-700">Phone Number</span>}
          name="phoneNumber"
          rules={[{ required: true, message: "Please enter your phone number" }]}
        >
          <div className="flex gap-2">
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="+43 1234567890"
              size="large"
              className="rounded-xl bg-white flex-1"
              disabled={otpVerified}
            />
            <Button
              size="large"
              onClick={handleSendOtp}
              loading={sendingOtp}
              disabled={otpVerified || countdown > 0}
              className="rounded-xl font-semibold border-blue-600 text-blue-600 hover:bg-blue-50"
              style={{ minWidth: "110px" }}
            >
              {otpVerified ? "Verified" : countdown > 0 ? `Resend (${countdown}s)` : otpSent ? "Resend OTP" : "Send OTP"}
            </Button>
          </div>
        </Form.Item>

        {otpSent && !otpVerified && (
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Enter OTP</span>}
            name="otp"
          >
            <div className="flex gap-2">
              <Input
                placeholder="Enter the code sent to your phone"
                size="large"
                className="rounded-xl bg-white flex-1"
                maxLength={6}
              />
              <Button
                size="large"
                type="primary"
                onClick={handleVerifyOtp}
                loading={verifyingOtp}
                className="rounded-xl font-semibold bg-blue-600 border-blue-600 hover:bg-blue-700"
                style={{ minWidth: "90px" }}
              >
                Verify
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Check your SMS for a verification code.</p>
          </Form.Item>
        )}

        {otpVerified && (
          <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-green-50 border border-green-200">
            <CheckCircleFilled className="text-green-500" />
            <span className="text-sm text-green-700 font-medium">Phone number verified successfully</span>
          </div>
        )}

        {/* Bio — optional */}
        <Form.Item
          label={
            <span className="text-sm font-medium text-gray-700">
              Short Introduction{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </span>
          }
          name="bio"
        >
          <TextArea
            placeholder="Tell pet owners about yourself, your experience, and why you love working with animals..."
            rows={3}
            className="rounded-xl bg-white resize-none"
            maxLength={300}
            showCount
          />
        </Form.Item>

        <Form.Item className="mb-0 mt-2">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="w-full rounded-lg font-semibold text-base bg-blue-600 border-blue-600 hover:bg-blue-700"
            style={{ height: "48px" }}
          >
            Finish Setup
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

// ─── Main Provider Onboarding Page ────────────────────────────────
export default function ProviderOnboardingPage() {
  const [step, setStep] = useState(0);

  const handleFinish = () => {
    message.success("Setup complete! Redirecting to your dashboard...");
    // TODO: router.push("/provider/dashboard")
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(160deg, #e8f0fe 0%, #dbeafe 60%, #bfdbfe 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-25 bg-blue-400 pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-56 h-56 rounded-full opacity-20 bg-blue-700 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full opacity-10 bg-blue-400 pointer-events-none" />

      {/* Navbar */}
      <div className="relative z-10 p-6 flex items-center">
        <img src="/logo.png" alt="PetConnect Logo" className="w-8 h-8 object-cover rounded-full" />
        <span className="text-xl font-bold text-gray-800 ml-2">PetConnect</span>
      </div>

      {/* Centered card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl p-10 bg-white/70 backdrop-blur-sm shadow-xl border border-white/60">

          {/* Back button — above step bar */}
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 mb-5 transition-colors group"
            >
              <ArrowLeftOutlined className="text-xs group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
          )}

          {step > 0 && <StepBar current={step} />}

          {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
          {step === 1 && <CompleteProfileStep onFinish={handleFinish} />}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-6 text-center text-xs text-blue-400">
        © 2024 PetConnect. All rights reserved.
      </div>
    </div>
  );
}
