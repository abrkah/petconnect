"use client";

import ShiftCard from "./ShiftCard";

// ✅ SAMPLE DATA
const sampleShifts = [
  {
    id: "1",
    date: "2026-04-03",
    user: { name: "John" },
    startTime: "09:00",
    endTime: "17:00",
    role: "kitchen",
  },
  {
    id: "2",
    date: "2026-04-03",
    user: { name: "Anna" },
    startTime: "12:00",
    endTime: "20:00",
    role: "service",
  },
  {
    id: "3",
    date: "2026-04-04",
    user: { name: "Lisa" },
    startTime: "08:00",
    endTime: "16:00",
    role: "kitchen",
  },
  {
    id: "4",
    date: "2026-04-04",
    user: { name: "Tom" },
    startTime: "14:00",
    endTime: "22:00",
    role: "bar",
  },
];

// 🧠 GROUP BY DATE
const groupByDate = (shifts: any[]) => {
  return shifts.reduce((acc: any, shift) => {
    if (!acc[shift.date]) acc[shift.date] = [];
    acc[shift.date].push(shift);
    return acc;
  }, {});
};

// ⏱️ CALCULATE TOTAL HOURS
const calculateHours = (shifts: any[]) => {
  return shifts.reduce((total, shift) => {
    const start = parseInt(shift.startTime.split(":")[0]);
    const end = parseInt(shift.endTime.split(":")[0]);
    return total + (end - start);
  }, 0);
};

export default function ScheduleGrid() {
  const grouped = groupByDate(sampleShifts);

  return (
    <div className="grid grid-cols-3 gap-6">
      {Object.entries(grouped).map(([date, shifts]: any) => (
        <div key={date} className="border rounded p-4 bg-gray-50">
          
          {/* Header */}
          <h2 className="font-bold mb-3">
            {new Date(date).toDateString()}
          </h2>

          {/* Shifts */}
          <div className="space-y-2">
            {shifts.map((shift: any) => (
              <ShiftCard key={shift.id} shift={shift} />
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 text-sm font-semibold">
            Total Hours: {calculateHours(shifts)}h
          </div>

        </div>
      ))}
    </div>
  );
}