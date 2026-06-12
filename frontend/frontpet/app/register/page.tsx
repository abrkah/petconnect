"use client";

import { Suspense } from "react";
import { Spin } from "antd";
import RegisterInner from "./RegisterInner";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <RegisterInner />
    </Suspense>
  );
}
