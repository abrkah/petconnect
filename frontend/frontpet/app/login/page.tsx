"use client";

import { Suspense } from "react";
import LoginInner from "./LoginInner";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-11 w-11 animate-spin rounded-full border-2 border-teal-500 border-t-transparent"
              aria-hidden
            />
            <p className="text-sm font-medium text-slate-400">
              Loading sign-in…
            </p>
          </div>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}