"use client";

import React, { useState } from "react";
import { Avatar, Tooltip, Pagination, Card, DatePicker } from "antd";
import dayjs from "dayjs";

interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  topic: string;
  status: string;
  user: {
    name: string;
    user_image?: string | null;
  };
}

interface Props {
  appointments: Appointment[];
}

const CalendarAppointments: React.FC<Props> = ({ appointments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const pageSize = 12;

  // Filter by selected date (or show all if no date is selected)
  const filteredAppointments = selectedDate
    ? appointments.filter((appt) =>
        dayjs(appt.date).isSame(selectedDate, "day")
      )
    : appointments;

  // Sort appointments: upcoming first
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return dayjs(a.date + " " + a.time).diff(dayjs(b.date + " " + b.time));
  });

  // Paginated data
  const paginatedData = sortedAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card
      title={
        <div className="flex justify-between">
          <span className="font-semibold text-lg">Schedule</span>
          <DatePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setCurrentPage(1); // reset page when filter changes
            }}
            allowClear
          />
        </div>
      }
      className="shadow-lg"
      
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <Tooltip key={item.id} title={`${item.topic} • ${item.time}`}>
              <div
                className={`p-3 rounded-lg text-white text-sm font-medium flex items-center gap-2 shadow transition hover:scale-[1.02] cursor-pointer ${
                  item.status === "Approved"
                    ? "bg-green-500"
                    : item.status === "Rejected"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                {item.user.user_image ? (
                  <Avatar size={24} src={item.user.user_image} />
                ) : (
                  <Avatar size={24}>{item.user.name.charAt(0)}</Avatar>
                )}

                <div className="flex-1 flex flex-col overflow-hidden">
                  <span className="font-semibold truncate" title={item.topic}>
                    {item.topic}
                  </span>
                  <span
                    className="text-[11px] text-gray-100 truncate"
                    title={`${item.user.name} • ${item.email}`}
                  >
                    {item.user.name} • {item.email}
                  </span>
                  <span className="text-[10px] text-gray-200 mt-1">
                    {dayjs(item.date).format("MMM D, YYYY")} • {item.time}
                  </span>
                </div>
              </div>
            </Tooltip>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-sm py-8">
            No appointments found for this date
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={sortedAppointments.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </Card>
  );
};

export default CalendarAppointments;
