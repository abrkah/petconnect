"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, Col, Row, Tag, Typography, Spin } from "antd";
import Link from "next/link";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/petconnect-api";
import MarketingNav from "@/components/MarketingNav";

const { Title, Paragraph } = Typography;

type Provider = {
  id: string;
  fullName: string;
  hourlyPayment: string | number;
  bio?: string;
  serviceType: string;
};

export default function PublicProvidersPage() {
  const [list, setList] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get<Provider[]>(
        `${getApiBaseUrl()}/provider/directory`,
      );
      setList(data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-slate-50">
      <MarketingNav mode="landing" />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Title level={2}>Service providers</Title>
        <Paragraph type="secondary">
          Browse pet care professionals on PetConnect. Sign in as a pet owner to
          book or message a provider.
        </Paragraph>
        {loading ? (
          <div className="py-16 text-center">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]} className="mt-6">
            {list.map((p) => (
              <Col xs={24} md={12} key={p.id}>
                <Card
                  title={p.fullName}
                  extra={<Tag>{p.serviceType.replace(/_/g, " ")}</Tag>}
                >
                  <p className="mb-2 text-sm text-slate-600">{p.bio || "—"}</p>
                  <p className="font-medium text-teal-700">
                    €{Number(p.hourlyPayment).toFixed(2)} / hr
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/login?role=OWNER" className="font-semibold text-teal-700">
            Sign in as pet owner
          </Link>{" "}
          to book a provider.
        </p>
      </div>
    </div>
  );
}
