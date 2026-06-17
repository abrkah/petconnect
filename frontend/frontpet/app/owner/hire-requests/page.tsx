"use client";

import { Suspense } from "react";
import { Spin } from "antd";
import HireRequestsInner from "./HireRequestsInner";

export default function OwnerHireRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Spin size="large" />
        </div>
      }
    >
      <HireRequestsInner />
    </Suspense>
  );
}
