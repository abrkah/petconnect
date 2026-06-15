"use client";

import { Suspense } from "react";
import { Skeleton } from "antd";
import ProviderDashboardInner from "./ProviderDashboardInner";

export default function ProviderDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton active paragraph={{ rows: 1 }} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        </div>
      }
    >
      <ProviderDashboardInner />
    </Suspense>
  );
}
