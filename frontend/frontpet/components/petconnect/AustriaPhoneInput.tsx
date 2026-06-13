"use client";

import { Input, Space } from "antd";
import {
  AT_PHONE_PREFIX,
  toAustriaFullPhone,
  toAustriaLocalPart,
} from "@/lib/austria-phone";

type AustriaPhoneInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  size?: "large" | "middle" | "small";
  disabled?: boolean;
  placeholder?: string;
};

export default function AustriaPhoneInput({
  value,
  onChange,
  size = "middle",
  disabled,
  placeholder = "660 1234567",
}: AustriaPhoneInputProps) {
  const local = toAustriaLocalPart(value);

  const handleChange = (raw: string) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 12);
    onChange?.(toAustriaFullPhone(cleaned));
  };

  return (
    <Space.Compact className="!w-full">
      <Input
        size={size}
        value={AT_PHONE_PREFIX}
        readOnly
        aria-label="Austria country code"
        className="!w-[72px] !bg-slate-100 !text-center !font-semibold !text-slate-700"
      />
      <Input
        size={size}
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        inputMode="tel"
        autoComplete="tel-national"
        className="!flex-1"
      />
    </Space.Compact>
  );
}
