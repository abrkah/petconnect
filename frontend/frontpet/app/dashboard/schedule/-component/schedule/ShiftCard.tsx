"use client";

// 🎨 COLOR LOGIC
const getColor = (role: string) => {
  switch (role) {
    case "kitchen":
      return "bg-green-300";
    case "service":
      return "bg-yellow-300";
    case "bar":
      return "bg-blue-300";
    default:
      return "bg-gray-200";
  }
};

export default function ShiftCard({ shift }: any) {
  return (
    <div
      className={`p-2 rounded text-sm ${getColor(shift.role)}`}
    >
      <p className="font-semibold">{shift.user.name}</p>
      <p>
        {shift.startTime} - {shift.endTime}
      </p>
      <p className="text-xs opacity-70">{shift.role}</p>
    </div>
  );
}