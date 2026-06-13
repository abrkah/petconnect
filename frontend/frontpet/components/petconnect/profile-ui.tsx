import type { ComponentType, ReactNode } from "react";
import { Button } from "antd";

export function profileInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PC"
  );
}

export function ProfileSectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_40px_-16px_rgba(15,23,42,0.12)]">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5 sm:px-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="space-y-1 px-6 py-6 sm:px-8">{children}</div>
    </section>
  );
}

export const profileFieldClass =
  "!rounded-xl !border-slate-200 hover:!border-teal-300 focus:!border-teal-500";

export function ProfileStickySave({
  hint,
  label,
  loading,
  formId,
}: {
  hint: string;
  label: string;
  loading?: boolean;
  formId: string;
}) {
  return (
    <div className="sticky bottom-4 z-10 flex justify-end">
      <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-3 shadow-lg shadow-slate-900/10 backdrop-blur-md">
        <span className="hidden text-sm text-slate-500 sm:inline">{hint}</span>
        <Button
          type="primary"
          htmlType="submit"
          form={formId}
          size="large"
          loading={loading}
          className="!h-11 !rounded-xl !border-0 !bg-teal-600 !px-8 !font-semibold shadow-md shadow-teal-900/20 hover:!bg-teal-500"
        >
          {label}
        </Button>
      </div>
    </div>
  );
}
