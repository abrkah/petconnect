"use client";

import { useMemo } from "react";

type PasswordStrengthProps = {
  password: string;
};

function scorePassword(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

const labels = ["", "Weak", "Fair", "Good", "Strong"];
const colors = [
  "bg-slate-700",
  "bg-red-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-teal-500",
];

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const score = useMemo(() => scorePassword(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={[
              "h-1 flex-1 rounded-full transition-all duration-300",
              score >= level ? colors[score] : "bg-slate-800",
            ].join(" ")}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Strength:{" "}
        <span
          className={
            score <= 1
              ? "text-red-400"
              : score === 2
                ? "text-amber-400"
                : "text-teal-400"
          }
        >
          {labels[score]}
        </span>
      </p>
    </div>
  );
}
