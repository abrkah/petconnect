"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Button, Typography, message, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import dayjs from "dayjs";
import { api } from "@/lib/petconnect-api";

const { Title, Paragraph } = Typography;

type Hire = {
  id: string;
  status: string;
  message?: string;
  petIds?: string[] | null;
  owner: { fullName: string; id: string };
};

type Managed = {
  pet: { id: string; name: string; breed: string };
};

export default function ProviderDashboardPage() {
  const [managed, setManaged] = useState<Managed[]>([]);
  const [hires, setHires] = useState<Hire[]>([]);
  const [bookingsCount, setBookingsCount] = useState(0);

  const load = async () => {
    try {
      const { data: m } = await api.get<Managed[]>("/pets/managed");
      setManaged(m);
    } catch {
      setManaged([]);
    }
    try {
      const { data: h } = await api.get<Hire[]>("/hire-requests/mine");
      setHires(h.filter((x) => x.status === "PENDING"));
    } catch {
      setHires([]);
    }
    try {
      const { data: b } = await api.get<unknown[]>("/bookings/mine");
      setBookingsCount(b.length);
    } catch {
      setBookingsCount(0);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const hireCols: ColumnsType<Hire> = [
    { title: "Owner", render: (_, r) => r.owner?.fullName },
    { title: "Pets", render: (_, r) => (r.petIds || []).length },
    {
      title: "Message",
      dataIndex: "message",
      ellipsis: true,
    },
    {
      title: "",
      render: (_, r) => (
        <>
          <Button
            size="small"
            type="primary"
            className="mr-2"
            onClick={async () => {
              try {
                await api.patch(`/hire-requests/${r.id}`, { status: "APPROVED" });
                message.success("Approved");
                load();
              } catch {
                message.error("Failed");
              }
            }}
          >
            Approve
          </Button>
          <Button
            danger
            size="small"
            onClick={async () => {
              try {
                await api.patch(`/hire-requests/${r.id}`, { status: "REJECTED" });
                message.success("Rejected");
                load();
              } catch {
                message.error("Failed");
              }
            }}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Provider dashboard</Title>
      <Paragraph type="secondary">
        Summary of pets you manage, pending hire requests, and bookings.
      </Paragraph>
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <div className="text-slate-500 text-sm">Pets managed</div>
            <div className="text-2xl font-semibold text-teal-700">{managed.length}</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div className="text-slate-500 text-sm">Pending hire requests</div>
            <div className="text-2xl font-semibold text-amber-700">{hires.length}</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div className="text-slate-500 text-sm">Bookings (all)</div>
            <div className="text-2xl font-semibold text-slate-800">{bookingsCount}</div>
          </Card>
        </Col>
      </Row>

      <Card title="Pending hire requests" className="mb-6">
        {hires.length === 0 ? (
          <p className="text-slate-500">No pending requests.</p>
        ) : (
          <Table rowKey="id" columns={hireCols} dataSource={hires} pagination={false} />
        )}
      </Card>

      <Title level={5}>Pets you manage</Title>
      {managed.length === 0 ? (
        <Card>
          <p className="text-slate-600">You do not have any pets yet.</p>
          <p className="text-sm text-slate-500">
            Owners send hire requests after messaging you. Approve a request to see pets here.
          </p>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {managed.map((m) => (
            <Col xs={24} sm={12} md={8} key={m.pet.id}>
              <Card
                title={m.pet.name}
                extra={<Tag>{m.pet.breed}</Tag>}
              >
                <Link href={`/provider/pets/${m.pet.id}`}>
                  <Button type="primary">Open records</Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
