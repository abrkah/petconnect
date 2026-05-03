"use client";

import { Suspense } from "react";
import { Spin } from "antd";
import OwnerPetHubInner from "./PetHubInner";

export default function OwnerPetHubPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Spin size="large" />
        </div>
      }
    >
      <OwnerPetHubInner />
    </Suspense>
  );
}
