"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  Modal,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import dayjs from "dayjs";
import { api } from "@/lib/petconnect-api";
import { notifyError } from "@/lib/feedback";
import {
  hireStatusColor,
  type HireRequestRow,
} from "@/lib/hire-requests";

const { Title, Paragraph } = Typography;

export default function HireRequestsInner() {
  const searchParams = useSearchParams();
  const [hireHistory, setHireHistory] = useState<HireRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyHire, setHistoryHire] = useState<HireRequestRow | null>(null);

  const loadHireHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<HireRequestRow[]>("/hire-requests/mine");
      setHireHistory(data);
    } catch {
      setHireHistory([]);
      notifyError("Could not load hire requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHireHistory();
  }, [loadHireHistory]);

  const openHireHistory = useCallback(async (hire: HireRequestRow) => {
    setHistoryHire(hire);
    if (hire.status === "REJECTED" && hire.decidedByRole === "PROVIDER") {
      try {
        await api.patch(`/hire-requests/${hire.id}/mark-seen`);
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    const hireId = searchParams.get("viewHire");
    if (!hireId || hireHistory.length === 0) return;
    const match = hireHistory.find((h) => h.id === hireId);
    if (match) void openHireHistory(match);
  }, [hireHistory, openHireHistory, searchParams]);

  const historyCols: ColumnsType<HireRequestRow> = [
    {
      title: "Provider",
      render: (_, row) => row.provider.fullName,
    },
    {
      title: "Status",
      render: (_, row) => (
        <Tag color={hireStatusColor[row.status] ?? "default"}>
          {row.status}
        </Tag>
      ),
    },
    {
      title: "Your message",
      ellipsis: true,
      render: (_, row) => row.message?.trim() || "—",
    },
    {
      title: "Provider reply",
      ellipsis: true,
      render: (_, row) =>
        row.decidedByRole === "PROVIDER" && row.responseMessage?.trim()
          ? row.responseMessage
          : "—",
    },
    {
      title: "Date",
      render: (_, row) =>
        row.updatedAt
          ? dayjs(row.updatedAt).format("D MMM YYYY, h:mm A")
          : "—",
    },
    {
      title: "",
      render: (_, row) => (
        <Button size="small" onClick={() => void openHireHistory(row)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Hire requests</Title>
      <Paragraph type="secondary">
        Requests you&apos;ve sent to providers - track pending, approved, and
        declined requests in one place.
      </Paragraph>

      <Card>
        {hireHistory.length === 0 && !loading ? (
          <div className="py-6 text-center">
            <p className="text-slate-500">No hire requests yet.</p>
            <Link href="/owner/providers" className="mt-3 inline-block">
              <Button type="primary" className="!mt-3">
                Find a provider
              </Button>
            </Link>
          </div>
        ) : (
          <Table
            rowKey="id"
            loading={loading}
            columns={historyCols}
            dataSource={hireHistory}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
          />
        )}
      </Card>

      <Modal
        title={
          historyHire
            ? `Hire request · ${historyHire.provider.fullName}`
            : "Hire request"
        }
        open={!!historyHire}
        onCancel={() => setHistoryHire(null)}
        footer={
          <Button type="primary" onClick={() => setHistoryHire(null)}>
            Close
          </Button>
        }
        width={560}
      >
        {historyHire ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Status:</span>
              <Tag color={hireStatusColor[historyHire.status] ?? "default"}>
                {historyHire.status}
              </Tag>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Your message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                {historyHire.message?.trim() || "No message was included."}
              </p>
            </div>
            {historyHire.decidedByRole === "PROVIDER" &&
            historyHire.status === "REJECTED" ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                  Provider response
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-rose-900">
                  {historyHire.responseMessage?.trim() ||
                    "The provider declined without a message."}
                </p>
              </div>
            ) : null}
            <p className="text-xs text-slate-400">
              Sent{" "}
              {historyHire.createdAt
                ? dayjs(historyHire.createdAt).format("D MMM YYYY, h:mm A")
                : "—"}
              {historyHire.updatedAt &&
              historyHire.updatedAt !== historyHire.createdAt
                ? ` · Updated ${dayjs(historyHire.updatedAt).format("D MMM YYYY, h:mm A")}`
                : ""}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
