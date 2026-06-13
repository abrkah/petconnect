"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Skeleton,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  UserCircleIcon,
  BriefcaseIcon,
  ChatBubbleLeftEllipsisIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/petconnect-api";
import { extractApiError, notifyError, notifySuccess } from "@/lib/feedback";
import AustriaPhoneInput from "@/components/petconnect/AustriaPhoneInput";
import { validateAustriaPhoneRule } from "@/lib/austria-phone";
import { PROVIDER_GENDER_OPTIONS } from "@/lib/provider-gender";
import {
  AVAILABILITY_TIME_OPTIONS,
  getAvailabilityOverlapMessage,
  type AvailabilitySlot,
} from "@/lib/availability";
import {
  profileFieldClass,
  profileInitials,
  ProfileSectionCard,
  ProfileStickySave,
} from "@/components/petconnect/profile-ui";

const services = [
  { value: "DOG_WALKING", label: "Dog walking" },
  { value: "VACCINATION", label: "Vaccination" },
  { value: "GENERAL_SERVICE", label: "General service" },
];

const GENDER_OPTIONS = [...PROVIDER_GENDER_OPTIONS];

const days = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

type ProviderProfileForm = {
  fullName: string;
  phoneNumber?: string;
  hourlyPayment: number;
  gender: string;
  serviceType: string;
  bio?: string;
};

function serviceLabel(value?: string) {
  return services.find((s) => s.value === value)?.label ?? "Provider";
}

export default function ProviderProfilePage() {
  const [form] = Form.useForm<ProviderProfileForm>();
  const [slotForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSlots, setSavingSlots] = useState(false);

  const watched = Form.useWatch([], form);
  const slotCount = Form.useWatch(["slots"], slotForm)?.length ?? 0;

  const completion = useMemo(() => {
    const fields = [
      watched?.fullName,
      watched?.phoneNumber,
      watched?.hourlyPayment,
      watched?.gender,
      watched?.serviceType,
      watched?.bio,
    ];
    const filled = fields.filter((v) => String(v ?? "").trim()).length;
    return Math.round((filled / fields.length) * 100);
  }, [watched]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<
          ProviderProfileForm & { availabilities?: AvailabilitySlot[] }
        >("/provider/profile");
        form.setFieldsValue({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          hourlyPayment: data.hourlyPayment,
          gender: data.gender,
          serviceType: data.serviceType,
          bio: data.bio,
        });

        const slots = (data.availabilities ?? []).map(
          ({ dayOfWeek, startTime, endTime }) => ({
            dayOfWeek,
            startTime,
            endTime,
          }),
        );
        slotForm.setFieldsValue({
          slots: slots.length
            ? slots
            : [{ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }],
        });
      } catch (err) {
        notifyError(extractApiError(err, "Could not load profile"));
      } finally {
        setLoading(false);
      }
    })();
  }, [form, slotForm]);

  const saveProfile = async (v: ProviderProfileForm) => {
    setSavingProfile(true);
    try {
      await api.patch("/provider/profile", v);
      notifySuccess("Your profile was updated successfully");
    } catch (err) {
      notifyError(extractApiError(err, "Could not save profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  const saveSlots = async (v: {
    slots?: { dayOfWeek: number; startTime: string; endTime: string }[];
  }) => {
    const slots = v.slots ?? [];
    const overlapMessage = getAvailabilityOverlapMessage(slots);
    if (overlapMessage) {
      notifyError(overlapMessage);
      return;
    }

    setSavingSlots(true);
    try {
      await api.put("/provider-availability/me", { slots });
      slotForm.setFieldsValue({ slots });
      notifySuccess("Weekly availability was saved");
    } catch (err) {
      notifyError(extractApiError(err, "Could not save availability"));
    } finally {
      setSavingSlots(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <Skeleton.Node active className="!h-44 !w-full !rounded-3xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  }

  const displayName = watched?.fullName?.trim() || "Provider";
  const displayService = serviceLabel(watched?.serviceType);
  const displayRate = watched?.hourlyPayment;

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
                Provider profile
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {displayName}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-teal-50/90">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                  <BriefcaseIcon className="h-4 w-4" aria-hidden />
                  {displayService}
                </span>
                {displayRate != null && displayRate !== "" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                    <CurrencyEuroIcon className="h-4 w-4" aria-hidden />
                    €{displayRate}/hr
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
            Pet owners discover you through this profile. Keep your services,
            rates, and availability up to date.
          </p>
        </div>
      </section>

      <Form
        id="provider-profile-form"
        form={form}
        layout="vertical"
        onFinish={saveProfile}
        requiredMark={false}
        className="space-y-6"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileSectionCard
            icon={UserCircleIcon}
            title="Personal details"
            description="How pet owners recognize and contact you."
          >
            <Form.Item
              name="fullName"
              label={<span className="font-medium text-slate-700">Full name</span>}
              rules={[{ required: true, message: "Enter your name" }]}
            >
              <Input size="large" className={profileFieldClass} placeholder="Dr. Maya Chen" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label={
                <span className="font-medium text-slate-700">
                  Phone <span className="text-slate-400">(optional)</span>
                </span>
              }
              rules={[{ validator: validateAustriaPhoneRule }]}
            >
              <AustriaPhoneInput size="large" placeholder="660 1234567" />
            </Form.Item>
          </ProfileSectionCard>

          <ProfileSectionCard
            icon={BriefcaseIcon}
            title="Professional info"
            description="Your rate, service, and how you present yourself."
          >
            <Form.Item
              name="hourlyPayment"
              label={<span className="font-medium text-slate-700">Hourly rate (€)</span>}
              rules={[{ required: true, message: "Enter your hourly rate" }]}
            >
              <InputNumber min={0} size="large" className="!w-full" />
            </Form.Item>
            <Form.Item
              name="gender"
              label={<span className="font-medium text-slate-700">Gender</span>}
              rules={[{ required: true, message: "Select gender" }]}
            >
              <Select
                size="large"
                options={GENDER_OPTIONS}
                placeholder="Select gender"
                className={profileFieldClass}
              />
            </Form.Item>
            <Form.Item
              name="serviceType"
              label={<span className="font-medium text-slate-700">Primary service</span>}
              rules={[{ required: true, message: "Select a service" }]}
            >
              <Select
                size="large"
                options={services}
                placeholder="Select service"
                className={profileFieldClass}
              />
            </Form.Item>
          </ProfileSectionCard>
        </div>

        <ProfileSectionCard
          icon={ChatBubbleLeftEllipsisIcon}
          title="Introduction"
          description="A short bio pet owners see when browsing providers."
        >
          <Form.Item
            name="bio"
            label={
              <span className="font-medium text-slate-700">
                Bio <span className="text-slate-400">(optional)</span>
              </span>
            }
            className="!mb-0"
          >
            <Input.TextArea
              rows={4}
              className={`${profileFieldClass} !resize-none`}
              placeholder="Tell owners about your experience, certifications, and approach to pet care."
            />
          </Form.Item>
        </ProfileSectionCard>

        <ProfileStickySave
          formId="provider-profile-form"
          hint="Updates your public provider listing"
          label="Save profile"
          loading={savingProfile}
        />
      </Form>

      <Form
        id="provider-availability-form"
        form={slotForm}
        layout="vertical"
        onFinish={saveSlots}
        initialValues={{
          slots: [{ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }],
        }}
        className="space-y-6"
      >
        <ProfileSectionCard
          icon={CalendarDaysIcon}
          title="Weekly availability"
          description="Pet owners see these windows before they book. Add all times you are available."
        >
          <Form.List name="slots">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                {fields.map(({ key, name, ...rest }) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Form.Item
                        {...rest}
                        name={[name, "dayOfWeek"]}
                        label={
                          <span className="font-medium text-slate-700">Day</span>
                        }
                        rules={[{ required: true, message: "Pick a day" }]}
                        className="!mb-3 min-w-0 flex-1"
                      >
                        <Select
                          size="large"
                          options={days}
                          className={profileFieldClass}
                        />
                      </Form.Item>
                      <button
                        type="button"
                        onClick={() => remove(name)}
                        className="mt-[30px] flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50"
                        aria-label="Remove time slot"
                      >
                        <MinusCircleOutlined />
                      </button>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                      <Form.Item
                        {...rest}
                        name={[name, "startTime"]}
                        label={
                          <span className="font-medium text-slate-700">Start</span>
                        }
                        rules={[{ required: true, message: "Start time" }]}
                        className="!mb-0"
                      >
                        <Select
                          size="large"
                          options={AVAILABILITY_TIME_OPTIONS}
                          placeholder="Start"
                          showSearch
                          optionFilterProp="label"
                          className={profileFieldClass}
                        />
                      </Form.Item>
                      <span className="pb-2 text-slate-400">–</span>
                      <Form.Item
                        {...rest}
                        name={[name, "endTime"]}
                        label={
                          <span className="font-medium text-slate-700">End</span>
                        }
                        dependencies={[[name, "startTime"]]}
                        className="!mb-0"
                        rules={[
                          { required: true, message: "End time" },
                          ({ getFieldValue }) => ({
                            validator(_, endTime) {
                              const startTime = getFieldValue([
                                "slots",
                                name,
                                "startTime",
                              ]);
                              if (!startTime || !endTime || endTime > startTime) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("End must be after start"),
                              );
                            },
                          }),
                        ]}
                      >
                        <Select
                          size="large"
                          options={AVAILABILITY_TIME_OPTIONS}
                          placeholder="End"
                          showSearch
                          optionFilterProp="label"
                          className={profileFieldClass}
                        />
                      </Form.Item>
                    </div>
                  </div>
                ))}
                <Button
                  type="dashed"
                  size="large"
                  onClick={() =>
                    add({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" })
                  }
                  icon={<PlusOutlined />}
                  className="!rounded-xl !border-teal-200 !text-teal-700 hover:!border-teal-400 hover:!text-teal-800"
                >
                  Add time window
                </Button>
              </div>
            )}
          </Form.List>
        </ProfileSectionCard>

        <ProfileStickySave
          formId="provider-availability-form"
          hint={
            slotCount
              ? `${slotCount} window${slotCount === 1 ? "" : "s"} configured`
              : "Add at least one availability window"
          }
          label="Save availability"
          loading={savingSlots}
        />
      </Form>
    </div>
  );
}
