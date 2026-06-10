"use client";

import { Suspense } from "react";
import { Spin } from "antd";
import OwnerMessagesInner from "./MessagesInner";

export default function OwnerMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Spin size="large" />
        </div>
      }
    >
      <OwnerMessagesInner />
    </Suspense>
  );
}
