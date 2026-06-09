"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Typography,
  Table,
  Spin,
  Empty,
  Space,
  message,
  Tag,
  Skeleton,
} from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import {
  ArrowRightOutlined,
  PlusOutlined,
  CalendarOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  HeartIcon,
  CalendarDaysIcon,
  BeakerIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/petconnect-api";
import { WeightLineChart } from "@/components/petconnect/WeightLineChart";
import { serviceTypeIcon } from "@/lib/service-icons";
import type { ColumnsType } from "antd/es/table";

const { Paragraph } = Typography;

type Pet = { id: string; name: string; breed: string; age: number };
type WRec = { id: string; weight: number; recordDate: string };
type Vac = {
  id: string;
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate?: string | null;
};
type Booking = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  timeSlot?: string | null;
  serviceType: string;
  provider: { fullName: string };
  pet: { id: string; name: string };
};

type OwnerProfile = { fullName?: string | null };

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function statusTag(status: string) {
  const s = status?.toUpperCase() ?? "";
  if (s === "CONFIRMED")
    return <Tag color="success">Confirmed</Tag>;
  if (s === "PENDING")
    return <Tag color="warning">Pending</Tag>;
  if (s === "COMPLETED")
    return <Tag color="default">Completed</Tag>;
  if (s === "CANCELLED") return <Tag color="error">Cancelled</Tag>;
  return <Tag>{status}</Tag>;
}

export default function OwnerHomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [weights, setWeights] = useState<WRec[]>([]);
  const [vacs, setVacs] = useState<Vac[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(false);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const reloadBookings = async () => {
    try {
      const { data: b } = await api.get<Booking[]>("/bookings/mine");
      setBookings(b);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const [petRes, profileRes, bookingRes] = await Promise.all([
          api.get<Pet[]>("/pets/mine"),
          api
            .get<OwnerProfile>("/owner/profile")
            .catch(() => ({ data: {} as OwnerProfile })),
          api.get<Booking[]>("/bookings/mine"),
        ]);
        if (!ok) return;
        setPets(petRes.data);
        setOwnerName(profileRes.data.fullName?.trim() || null);
        setBookings(bookingRes.data);

        const firstId = petRes.data[0]?.id ?? null;
        setSelectedPetId(firstId);
      } catch {
        if (ok) setPets([]);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPetId) {
      setWeights([]);
      setVacs([]);
      return;
    }
    let ok = true;
    setHealthLoading(true);
    (async () => {
      try {
        const [wRes, vRes] = await Promise.all([
          api.get<WRec[]>(`/weight-record/pet/${selectedPetId}`).catch(() => ({ data: [] })),
          api
            .get<Vac[]>(`/vaccination-record/pet/${selectedPetId}`)
            .catch(() => ({ data: [] })),
        ]);
        if (!ok) return;
        setWeights(wRes.data);
        setVacs(vRes.data.slice(0, 8));
      } finally {
        if (ok) setHealthLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, [selectedPetId]);

  const focusPet = pets.find((p) => p.id === selectedPetId) ?? pets[0];

  const wLabels = weights.map((w) => dayjs(w.recordDate).format("MMM 'YY"));
  const wVals = weights.map((w) => w.weight);

  const upcomingBookingCount = useMemo(
    () =>
      bookings.filter((b) =>
        ["PENDING", "CONFIRMED"].includes(String(b.status).toUpperCase()),
      ).length,
    [bookings],
  );

  const vaccinesDueSoon = useMemo(() => {
    const now = dayjs();
    return vacs.filter((v) => {
      if (!v.nextDueDate) return false;
      const due = dayjs(v.nextDueDate);
      return due.diff(now, "day") >= 0 && due.diff(now, "day") <= 45;
    }).length;
  }, [vacs]);

  const displayedBookings = useMemo(() => bookings.slice(0, 6), [bookings]);

  const bookingCols: ColumnsType<Booking> = [
    {
      title: "Provider",
      render: (_, r) => (
        <span className="font-medium text-slate-800">{r.provider?.fullName}</span>
      ),
    },
    {
      title: "Pet",
      render: (_, r) => r.pet?.name,
    },
    {
      title: "Service",
      align: "center",
      render: (_, r) => serviceTypeIcon(r.serviceType),
    },
    {
      title: "Status",
      render: (_, r) => statusTag(r.status),
    },
    {
      title: "Date",
      render: (_, r) => dayjs(r.startDate).format("D MMM YYYY"),
    },
    {
      title: "Time",
      render: (_, r) => r.timeSlot?.trim() || dayjs(r.startDate).format("HH:mm"),
    },
    {
      title: "",
      width: 100,
      render: (_, r) => (
        <Button
          danger
          size="small"
          className="!rounded-lg"
          onClick={async () => {
            try {
              await api.delete(`/bookings/${r.id}`);
              message.success("Booking cancelled");
              await reloadBookings();
            } catch {
              message.error("Could not cancel");
            }
          }}
        >
          Cancel
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton.Node active className="!h-40 !w-full !rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  const surfaceCard =
    "overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_40px_-16px_rgba(15,23,42,0.12)]";

  return (
    <div className="space-y-8 pb-4">
      {/* Hero */}
      <section
        className={ `relative overflow-hidden rounded-3xl border border-teal-200/40 bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 px-6 py-8 text-white shadow-xl shadow-teal-900/25 sm:px-8 sm:py-10`}
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-4h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h4v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-100 ring-1 ring-white/20 backdrop-blur-sm">
              <SparklesIcon className="h-4 w-4" aria-hidden />
              Your overview
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {greeting()}
              {ownerName ? `, ${ownerName.split(" ")[0]}` : ""}
            </h2>
            <p className="text-base leading-relaxed text-teal-50/95 sm:text-lg">
              Track weight, vaccinations, and bookings in one calm workspace —
              tailored for busy pet parents.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/owner/pets">
              <Button
                size="large"
                icon={<PlusOutlined />}
                className="!h-12 !rounded-2xl !border-0 !bg-white !px-5 !font-semibold !text-teal-800 shadow-lg hover:!bg-teal-50"
              >
                My pets
              </Button>
            </Link>
            <Link href="/owner/providers">
              <Button
                size="large"
                ghost
                icon={<CalendarOutlined />}
                className="!h-12 !rounded-2xl !border-white/40 !font-semibold !text-white hover:!border-white hover:!bg-white/10"
              >
                Book care
              </Button>
            </Link>
            <Link href="/owner/messages">
              <Button
                size="large"
                ghost
                icon={<MessageOutlined />}
                className="!h-12 !rounded-2xl !border-white/40 !font-semibold !text-white hover:!border-white hover:!bg-white/10"
              >
                Messages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div
          className={`${surfaceCard} group flex gap-4 p-5 transition hover:border-teal-200/80 hover:shadow-[0_20px_50px_-24px_rgba(13,148,136,0.35)]`}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-600/30">
            <HeartIcon className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pets
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
              {pets.length}
            </p>
            <Link
              href="/owner/pets"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              Manage <ArrowRightOutlined className="text-xs" />
            </Link>
          </div>
        </div>

        <div
          className={`${surfaceCard} group flex gap-4 p-5 transition hover:border-teal-200/80 hover:shadow-[0_20px_50px_-24px_rgba(13,148,136,0.35)]`}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
            <CalendarDaysIcon className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Active bookings
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
              {upcomingBookingCount}
            </p>
            <Link
              href="/owner/bookings"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              View schedule <ArrowRightOutlined className="text-xs" />
            </Link>
          </div>
        </div>

        <div
          className={`${surfaceCard} group flex gap-4 p-5 transition hover:border-teal-200/80 hover:shadow-[0_20px_50px_-24px_rgba(13,148,136,0.35)]`}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-600/25">
            <BeakerIcon className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Vaccines due (45d)
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
              {!focusPet ? "—" : vaccinesDueSoon}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {focusPet ? `For ${focusPet.name}` : "Add a pet to track"}
            </p>
          </div>
        </div>
      </section>

      {/* Pet focus */}
      {pets.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-slate-600">Focus:</span>
          {pets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPetId(p.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedPetId === p.id
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50/80"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          bordered={false}
          className={`${surfaceCard} [&_.ant-card-head]:!border-slate-100`}
          title={
            <span className="text-base font-semibold text-slate-900">
              Weight trend
              {focusPet ? (
                <span className="ml-2 font-normal text-slate-500">· {focusPet.name}</span>
              ) : null}
            </span>
          }
          extra={
            <Link
              href={focusPet ? `/owner/pets/${focusPet.id}` : "/owner/pets"}
              className="text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              Pet hub <ArrowRightOutlined className="text-xs" />
            </Link>
          }
        >
          {healthLoading ? (
            <div className="flex min-h-[220px] items-center justify-center py-8">
              <Spin />
            </div>
          ) : !focusPet ? (
            <Empty description="Add a pet to track weight" />
          ) : weights.length === 0 ? (
            <Empty description="No weight entries yet — add them from the pet hub." />
          ) : (
            <div className="max-w-xl pt-1">
              <WeightLineChart labels={wLabels} values={wVals} />
            </div>
          )}
        </Card>

        <Card
          bordered={false}
          className={`${surfaceCard} [&_.ant-card-head]:!border-slate-100`}
          title={
            <span className="text-base font-semibold text-slate-900">
              Vaccinations
            </span>
          }
          extra={
            <Link
              href={
                focusPet ? `/owner/pets/${focusPet.id}?tab=vaccination` : "/owner/pets"
              }
              className="text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              Manage <ArrowRightOutlined className="text-xs" />
            </Link>
          }
        >
          {healthLoading ? (
            <div className="flex min-h-[220px] items-center justify-center py-8">
              <Spin />
            </div>
          ) : !focusPet ? (
            <Empty description="Add a pet to list vaccines" />
          ) : vacs.length === 0 ? (
            <Empty description="No vaccination records yet." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {vacs.map((v) => (
                <li
                  key={v.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3.5 first:pt-1"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                      <BeakerIcon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="font-semibold text-slate-900">{v.vaccineName}</span>
                  </div>
                  <span className="tabular-nums text-sm text-slate-500">
                    {dayjs(v.vaccinationDate).format("D MMM YYYY")}
                    {v.nextDueDate ? (
                      <span className="ml-2 rounded-lg bg-slate-100 px-2 py-0.5 text-slate-700">
                        Next {dayjs(v.nextDueDate).format("D MMM")}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card
        bordered={false}
        className={`${surfaceCard} [&_.ant-card-head]:!border-slate-100`}
        title={
          <span className="text-base font-semibold text-slate-900">Bookings</span>
        }
        extra={
          <Space wrap>
            <Link href="/owner/providers">
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                className="!rounded-xl !font-semibold"
              >
                New booking
              </Button>
            </Link>
            <Link href="/owner/bookings">
              <Button type="link" className="!font-semibold !text-teal-700">
                View all
              </Button>
            </Link>
          </Space>
        }
      >
        {displayedBookings.length === 0 ? (
          <Empty description="No bookings yet">
            <Link href="/owner/providers">
              <Button type="primary" icon={<PlusOutlined />} className="!rounded-xl">
                Find a provider
              </Button>
            </Link>
          </Empty>
        ) : (
          <div className="-mx-1 overflow-x-auto">
            <Table
              rowKey="id"
              size="middle"
              pagination={false}
              columns={bookingCols}
              dataSource={displayedBookings}
              scroll={{ x: 720 }}
              className="[&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!border-slate-100 [&_.ant-table-thead>tr>th]:!bg-slate-50/80 [&_.ant-table-thead>tr>th]:!text-xs [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!uppercase [&_.ant-table-thead>tr>th]:!tracking-wide [&_.ant-table-tbody>tr>td]:!border-slate-100 [&_.ant-table-tbody>tr:hover>td]:!bg-teal-50/40"
            />
          </div>
        )}
      </Card>

      <Paragraph type="secondary" className="!mb-0 text-center text-xs sm:text-sm">
        Tip: open{" "}
        <Link href="/owner/pets" className="font-semibold text-teal-700">
          My pets
        </Link>{" "}
        for full health history and notes.
      </Paragraph>
    </div>
  );
}
