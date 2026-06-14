"use client";

import { motion } from "framer-motion";
import {
  HomeModernIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { UserRole } from "@/lib/petconnect-api";

type RoleSelectorProps = {
  value?: UserRole;
  onChange?: (role: UserRole) => void;
};

const roles: {
  value: UserRole;
  label: string;
  description: string;
  icon: typeof HomeModernIcon;
}[] = [
  {
    value: "OWNER",
    label: "Pet owner",
    description: "Book care & track health",
    icon: HomeModernIcon,
  },
  {
    value: "PROVIDER",
    label: "Service provider",
    description: "Manage clients & schedule",
    icon: BriefcaseIcon,
  },
];

export default function RoleSelector({ value = "OWNER", onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {roles.map((role) => {
        const selected = value === role.value;
        const Icon = role.icon;
        return (
          <motion.button
            key={role.value}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange?.(role.value)}
            className={[
              "group relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200",
              selected
                ? "border-teal-500/60 bg-teal-500/10 shadow-lg shadow-teal-500/10 ring-1 ring-teal-400/30"
                : "border-slate-700/80 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-900/80",
            ].join(" ")}
            aria-pressed={selected}
          >
            {selected ? (
              <CheckCircleIcon className="absolute right-3 top-3 h-5 w-5 text-teal-400" />
            ) : null}
            <span
              className={[
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                selected
                  ? "bg-teal-500/20 text-teal-300"
                  : "bg-slate-800 text-slate-400 group-hover:text-slate-300",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span
                className={[
                  "block text-sm font-semibold",
                  selected ? "text-white" : "text-slate-200",
                ].join(" ")}
              >
                {role.label}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                {role.description}
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
