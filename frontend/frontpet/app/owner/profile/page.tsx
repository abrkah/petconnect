"use client";

import { useEffect, useMemo, useState } from "react";
import { Form, Input, Skeleton } from "antd";
import {
  UserCircleIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";
import AustriaPhoneInput from "@/components/petconnect/AustriaPhoneInput";
import {
  validateAustriaPhoneRule,
  validateRequiredAustriaPhoneRule,
} from "@/lib/austria-phone";
import {
  profileFieldClass,
  profileInitials,
  ProfileSectionCard,
  ProfileStickySave,
} from "@/components/petconnect/profile-ui";

type OwnerProfileForm = {
  fullName: string;
  phoneNumber: string;
  city: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
};

export default function OwnerProfilePage() {
  const [form] = Form.useForm<OwnerProfileForm>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const watched = Form.useWatch([], form);

  const completion = useMemo(() => {
    const fields = [
      watched?.fullName,
      watched?.phoneNumber,
      watched?.city,
      watched?.address,
      watched?.emergencyContactName,
      watched?.emergencyContactPhone,
      watched?.notes,
    ];
    const filled = fields.filter((v) => String(v ?? "").trim()).length;
    return Math.round((filled / fields.length) * 100);
  }, [watched]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<OwnerProfileForm>("/owner/profile");
        form.setFieldsValue({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          city: data.city ?? "",
          address: data.address ?? "",
          emergencyContactName: data.emergencyContactName ?? "",
          emergencyContactPhone: data.emergencyContactPhone ?? "",
          notes: data.notes ?? "",
        });
      } catch (err) {
        notifyError(extractApiError(err, "Could not load profile"));
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const save = async (v: OwnerProfileForm) => {
    setSaving(true);
    try {
      await api.patch("/owner/profile", v);
      notifySuccess("Your profile was updated successfully");
    } catch (err) {
      notifyError(extractApiError(err, "Could not save profile"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <Skeleton.Node active className="!h-44 !w-full !rounded-3xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton active paragraph={{ rows: 5 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  const displayName = watched?.fullName?.trim() || "Pet owner";
  const displayCity = watched?.city?.trim();

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-teal-200/40 bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 px-6 py-8 text-white shadow-xl shadow-teal-900/20 sm:px-8">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/15 text-2xl font-bold tracking-tight ring-2 ring-white/25 backdrop-blur-sm">
              {profileInitials(displayName)}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-100/90">
                Pet owner profile
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {displayName}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-teal-50/90">
                {displayCity ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                    <MapPinIcon className="h-4 w-4" aria-hidden />
                    {displayCity}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                  <CheckCircleIcon className="h-4 w-4" aria-hidden />
                  {completion}% complete
                </span>
              </div>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-teal-50/90">
            Keep your details current so providers can reach you quickly and
            care for your pets with confidence.
          </p>
        </div>
      </section>

      <Form
        id="owner-profile-form"
        form={form}
        layout="vertical"
        onFinish={save}
        requiredMark={false}
        className="space-y-6"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileSectionCard
            icon={UserCircleIcon}
            title="Personal details"
            description="How caregivers identify and contact you."
          >
            <Form.Item
              name="fullName"
              label={<span className="font-medium text-slate-700">Full name</span>}
              rules={[{ required: true, message: "Enter your name" }]}
            >
              <Input size="large" className={profileFieldClass} placeholder="Alex Rivera" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label={<span className="font-medium text-slate-700">Phone (Austria)</span>}
              rules={[{ validator: validateRequiredAustriaPhoneRule }]}
            >
              <AustriaPhoneInput size="large" placeholder="660 1234567" />
            </Form.Item>
          </ProfileSectionCard>

          <ProfileSectionCard
            icon={MapPinIcon}
            title="Location"
            description="Helps match you with nearby providers."
          >
            <Form.Item
              name="city"
              label={<span className="font-medium text-slate-700">City</span>}
              rules={[{ required: true, message: "Enter your city" }]}
            >
              <Input size="large" className={profileFieldClass} placeholder="Vienna" />
            </Form.Item>
            <Form.Item
              name="address"
              label={
                <span className="font-medium text-slate-700">
                  Home address <span className="text-slate-400">(optional)</span>
                </span>
              }
            >
              <Input
                size="large"
                className={profileFieldClass}
                placeholder="Street, building, postal code"
              />
            </Form.Item>
          </ProfileSectionCard>
        </div>

        <ProfileSectionCard
          icon={ShieldCheckIcon}
          title="Emergency contact"
          description="Someone we can reach if you are unavailable during a visit."
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <Form.Item
              name="emergencyContactName"
              label={<span className="font-medium text-slate-700">Contact name</span>}
              className="!mb-0"
            >
              <Input size="large" className={profileFieldClass} placeholder="Jordan Lee" />
            </Form.Item>
            <Form.Item
              name="emergencyContactPhone"
              label={<span className="font-medium text-slate-700">Contact phone</span>}
              rules={[{ validator: validateAustriaPhoneRule }]}
              className="!mb-0"
            >
              <AustriaPhoneInput size="large" placeholder="660 1234567" />
            </Form.Item>
          </div>
        </ProfileSectionCard>

        <ProfileSectionCard
          icon={ChatBubbleLeftEllipsisIcon}
          title="Notes for providers"
          description="Share preferences, pet context, or access instructions."
        >
          <Form.Item
            name="notes"
            label={
              <span className="font-medium text-slate-700">
                Provider notes <span className="text-slate-400">(optional)</span>
              </span>
            }
            className="!mb-0"
          >
            <Input.TextArea
              rows={4}
              className={`${profileFieldClass} !resize-none`}
              placeholder="I have two dogs and prefer morning walks on weekdays."
            />
          </Form.Item>
        </ProfileSectionCard>

        <ProfileStickySave
          formId="owner-profile-form"
          hint="Changes apply to future bookings"
          label="Save profile"
          loading={saving}
        />
      </Form>
    </div>
  );
}
