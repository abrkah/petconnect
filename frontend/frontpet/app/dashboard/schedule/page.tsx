"use client";

import React, { useMemo, useState } from "react";

/**
 * TYPES
 */
type Branch = "kissil" | "gringase";

type User = {
  id: string;
  name: string;
  branch: Branch;
};

type ScheduleItem = {
  id: string;
  userId: string;
  date: string;
  startHour: number;
  endHour: number;
};

/**
 * HELPERS
 */
const getToday = () => new Date().toISOString().split("T")[0];

/**
 * USERS (12)
 */
const USERS: User[] = [
  { id: "u1", name: "Alice", branch: "kissil" },
  { id: "u2", name: "Bob", branch: "gringase" },
  { id: "u3", name: "Charlie", branch: "kissil" },
  { id: "u4", name: "David", branch: "gringase" },
  { id: "u5", name: "Emma", branch: "kissil" },
  { id: "u6", name: "Frank", branch: "gringase" },
  { id: "u7", name: "Grace", branch: "kissil" },
  { id: "u8", name: "Henry", branch: "gringase" },
  { id: "u9", name: "Ivy", branch: "kissil" },
  { id: "u10", name: "Jack", branch: "gringase" },
  { id: "u11", name: "Kate", branch: "kissil" },
  { id: "u12", name: "Leo", branch: "gringase" },
];

/**
 * MOCK SCHEDULE
 */
const SCHEDULE: ScheduleItem[] = [
  { id: "s1", userId: "u1", date: "2026-04-14", startHour: 7, endHour: 11 },
  { id: "s2", userId: "u2", date: "2026-04-14", startHour: 8, endHour: 14 },
  { id: "s3", userId: "u3", date: "2026-04-14", startHour: 9, endHour: 13 },
  { id: "s4", userId: "u4", date: "2026-04-14", startHour: 7, endHour: 10 },
  { id: "s5", userId: "u5", date: "2026-04-14", startHour: 10, endHour: 14 },
  { id: "s6", userId: "u6", date: "2026-04-14", startHour: 7, endHour: 9 },
  { id: "s7", userId: "u7", date: "2026-04-14", startHour: 11, endHour: 14 },
];

/**
 * MAIN PAGE
 */
export default function SchedulePage() {
  const today = getToday();

  /**
   * ADMIN FILTERS
   */
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    USERS.map((u) => u.id) // default = all users
  );

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const usersMap = useMemo(
    () => Object.fromEntries(USERS.map((u) => [u.id, u])),
    []
  );

  /**
   * FILTERED DATA
   */
  const filtered = useMemo(() => {
    return SCHEDULE.filter(
      (s) =>
        s.date === selectedDate &&
        selectedUsers.includes(s.userId)
    );
  }, [selectedDate, selectedUsers]);

  const kissil = USERS.filter(
    (u) => u.branch === "kissil" && selectedUsers.includes(u.id)
  );

  const gringase = USERS.filter(
    (u) => u.branch === "gringase" && selectedUsers.includes(u.id)
  );

  const getShift = (userId?: string) =>
    filtered.find((s) => s.userId === userId);

  const getHours = (s?: ScheduleItem) =>
    s ? s.endHour - s.startHour : 0;

  const kissilTotal = filtered
    .filter((s) => usersMap[s.userId]?.branch === "kissil")
    .reduce((a, b) => a + (b.endHour - b.startHour), 0);

  const gringaseTotal = filtered
    .filter((s) => usersMap[s.userId]?.branch === "gringase")
    .reduce((a, b) => a + (b.endHour - b.startHour), 0);

  const rows = Math.max(kissil.length, gringase.length);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Admin Schedule Dashboard
      </h1>

      {/* ADMIN FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">

        {/* DATE */}
        <input
          type="date"
          className="border p-2 rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {/* USERS SELECT */}
        <div className="flex flex-wrap gap-2">
          {USERS.map((u) => (
            <label
              key={u.id}
              className="text-sm flex items-center gap-1 border px-2 py-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(u.id)}
                onChange={() => toggleUser(u.id)}
              />
              {u.name}
            </label>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">

          {/* HEADER */}
          <thead>
            <tr className="bg-gray-100">
              <th colSpan={4} className="border p-2 bg-blue-100">
                🟦 Branch1 
              </th>
              <th colSpan={4} className="border p-2 bg-green-100">
                🟩 Branch 2
              </th>
            </tr>

            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Hrs</th>

              <th className="border p-2">User</th>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Hrs</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {Array.from({ length: rows }).map((_, i) => {
              const ku = kissil[i];
              const gu = gringase[i];

              const ks = getShift(ku?.id);
              const gs = getShift(gu?.id);

              return (
                <tr key={i}>

                  {/* KISSIL */}
                  <td className="border p-2 bg-blue-50 font-medium">
                    {ku?.name || ""}
                  </td>
                  <td className="border p-2 bg-blue-50 text-center">
                    {ks ? `${ks.startHour}:00` : "-"}
                  </td>
                  <td className="border p-2 bg-blue-50 text-center">
                    {ks ? `${ks.endHour}:00` : "-"}
                  </td>
                  <td className="border p-2 bg-blue-50 text-center font-bold">
                    {ks ? getHours(ks) : "-"}
                  </td>

                  {/* GRINGASE */}
                  <td className="border p-2 bg-green-50 font-medium">
                    {gu?.name || ""}
                  </td>
                  <td className="border p-2 bg-green-50 text-center">
                    {gs ? `${gs.startHour}:00` : "-"}
                  </td>
                  <td className="border p-2 bg-green-50 text-center">
                    {gs ? `${gs.endHour}:00` : "-"}
                  </td>
                  <td className="border p-2 bg-green-50 text-center font-bold">
                    {gs ? getHours(gs) : "-"}
                  </td>

                </tr>
              );
            })}

            {/* TOTAL */}
            <tr className="bg-gray-300 font-bold">
              <td className="p-2">TOTAL</td>
              <td />
              <td />
              <td className="text-center">{kissilTotal}h</td>

              <td />
              <td />
              <td />
              <td className="text-center">{gringaseTotal}h</td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  );
}