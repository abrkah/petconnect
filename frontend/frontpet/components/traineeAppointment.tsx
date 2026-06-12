"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  message,
  Spin,
  Tag,
  Collapse,
  Typography,
} from "antd";
import dayjs from "dayjs";

import { useCreateConsultancy } from "@/app/utils/store/server/consultancy/mutation";
import { useGetConsultancyByUserId } from "@/app/utils/store/server/consultancy/query";
import { useGetProfile } from "@/app/utils/store/server/profile/query";

const { Panel } = Collapse;
const { Paragraph, Text } = Typography;

const ConsultancyAppointmentPage = () => {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const { data: userAppointments, isLoading } = useGetConsultancyByUserId(
    userId || ""
  );
  const { mutate: createAppointment, isPending: isSubmitting } =
    useCreateConsultancy();
  const { data: user, isLoading: isLoadingProfile, error } = useGetProfile();

  const handleFinish = (values: any) => {
    if (!userId) return message.error("User ID not found!");
    if (!user) return message.error("User profile not loaded!");

    const payload = {
      ...values,
      userId,
      name: user.name,
      email: user.email,
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
    };

    createAppointment(payload, {
      onSuccess: () => {
        message.success("Appointment booked successfully");
        form.resetFields();
      },
      onError: () => {
        message.error("Failed to book appointment");
      },
    });
  };

  const getStatusColor = (status: string) => {
    if (status === "Approved") return "green";
    if (status === "Rejected") return "red";
    return "gold"; // Pending
  };

  return (
    <div className="max-w-7xl mx-auto my-2 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointments Section */}
        <div className="md:col-span-1 bg-green-50 border border-green-300 p-6 rounded-xl shadow h-fit">
          <h3 className="text-xl font-semibold text-green-800 mb-4">
            Your Existing Appointments
          </h3>
          {isLoading ? (
            <Spin />
          ) : userAppointments && userAppointments.length > 0 ? (
            <Collapse accordion>
              {userAppointments.map((appointment: any, index: number) => {
                const color = getStatusColor(appointment.status || "Pending");
                return (
                  <Panel
                    key={appointment.id || index}
                    header={
                      <div className="flex justify-between items-center w-full gap-2">
                        <Text strong className="flex-shrink-0 min-w-[70px]">
                          App #{index + 1}
                        </Text>
                        <p className="flex-1 text-sm truncate">
                          <strong className="text-green-800">Date:</strong>{" "}
                          <span className="font-medium">
                            {appointment.date}
                          </span>
                        </p>
                        <Tag
                          color={color}
                          className="uppercase font-medium flex-shrink-0"
                        >
                          {appointment.status || "Pending"}
                        </Tag>
                      </div>
                    }
                  >
                    <div className="space-y-1 text-gray-700">
                      <p>
                        <strong className="text-green-800">Time:</strong>{" "}
                        <span className="font-medium">{appointment.time}</span>
                      </p>
                      <p>
                        <strong className="text-green-800">Topic:</strong>{" "}
                        <span className="font-medium">{appointment.topic}</span>
                      </p>

                      {appointment.notes && (
                        <Paragraph className="mt-2 italic text-gray-600">
                          <strong>Notes:</strong> {appointment.notes}
                        </Paragraph>
                      )}
                    </div>
                  </Panel>
                );
              })}
            </Collapse>
          ) : (
            <p className="text-gray-600 italic">No appointments found.</p>
          )}
        </div>

        {/* Booking Form */}
        <div className="md:col-span-2 bg-white border border-gray-200 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
            Book Consultancy Appointment
          </h2>

          {/* Show profile info above the form */}
          {user && (
            <div className="mb-4 p-3 bg-gray-50 border rounded-lg text-gray-700">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark="optional"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Preferred Date"
                name="date"
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker className="w-full" placeholder="Select date" />
              </Form.Item>

              <Form.Item
                label="Preferred Time"
                name="time"
                rules={[{ required: true, message: "Please select a time" }]}
              >
                <TimePicker className="w-full" placeholder="Select time" />
              </Form.Item>
            </div>

            <Form.Item
              label="Consultancy Topic"
              name="topic"
              rules={[{ required: true, message: "Please describe the topic" }]}
            >
              <Input.TextArea
                placeholder="Briefly describe the consultancy topic"
                rows={4}
              />
            </Form.Item>

            <Form.Item label="Additional Notes" name="notes">
              <Input.TextArea placeholder="Any other information" rows={2} />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                loading={isSubmitting}
              >
                Submit Appointment
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyAppointmentPage;
