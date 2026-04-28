"use client";

import React, { useState } from "react";
import { Button, Card, Modal, message } from "antd";
import {
  BankOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  RiseOutlined,
  StarOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTnaManagementCoursePageStore } from "@/app/utils/uistate/fetures/training/managemnet/coursePage";
import { initializeChapaPayment } from "@/app/utils/chapa";
// import { useGetUserById } from "@/app/utils/store/server/user/mutation";

interface CourseCardProps {
  item: {
    id: string;
    title: string;
    category: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    duration: string;
    learners: number;
    imageUrl: string;
    badge: "DIPLOMA" | "CERTIFICATE";
    startDate?: string;

    price?: number | string;
    profitPercent?: number | string;
    startingCapital?: number | string;
    hoursToFinish?: number;
  };
}

const levelColors: Record<string, string> = {
  BEGINNER: "bg-purple-100 text-purple-700",
  INTERMEDIATE: "bg-green-100 text-green-700",
  ADVANCED: "bg-yellow-100 text-yellow-700",
};

const CourseCard: React.FC<CourseCardProps> = ({ item }) => {
  const userId = localStorage.getItem("userId");
  // const { data: userData = [], isLoading } = useGetUserById(userId);
  // console.log("userData", userData);
  const { setModalOpen, setSelectedCourse } = useTnaManagementCoursePageStore();

  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const openModal = () => {
    setIsModalVisible(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handlePay = async (id: string) => {
   const [first_name, ...lastNameParts] = formData.fullName.split(" ");
   const last_name = lastNameParts.join(" ") || "-";

   try {
     await initializeChapaPayment({
       amount: item.price?.toString() ?? "0",
       email: formData.email,
       first_name,
       last_name,
       phone: formData.phoneNumber,
       selectedCourse: id,
     });
   } catch (err) {
     message.error("Payment initialization failed.");
     console.error(err);
   }
 };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300 max-w-sm">
        <div className="relative">
          <img
            src={
              item.imageUrl ||
              "https://via.placeholder.com/400x200.png?text=No+Image"
            }
            alt={item.title || "Course Image"}
            className="w-full h-44 object-cover"
          />
          <div className="absolute top-2 right-2 bg-white border border-gray-300 text-gray-800 text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
            {item.badge}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4 ">
          {/* Level and Price */}
          <div className="flex justify-between items-center text-xs text-gray-500 w-full">
            <div
              className={`flex items-center gap-1 text-xs font-semibold py-1 rounded-full ${
                levelColors[item.level] || "bg-gray-200 text-gray-700"
              }`}
            >
              <StarOutlined />
              <span>{item.level} LEVEL</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarOutlined />
              <span className="font-semibold text-green-700">
                Price: ${item.price ?? "N/A"}
              </span>
            </div>
          </div>

          {/* Category and Profit */}
          <div className="flex justify-between items-center text-xs text-gray-500 w-full">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <TagOutlined />
              <span>{item.category || "Uncategorized"}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <RiseOutlined />
              <span className="font-semibold text-emerald-700">
                Profit:{" "}
                {item.profitPercent != null ? `${item.profitPercent}%` : "N/A"}
              </span>
            </div>
          </div>

          {/* Title and Capital */}
          <div className="flex justify-between items-center text-xs text-gray-500 w-full">
            <div className="text-base font-semibold text-gray-800 flex items-center gap-1">
              <StarOutlined />
              {item.title}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <BankOutlined />
              <span className="font-semibold text-purple-700">
                Capital: ${item.startingCapital ?? "N/A"}
              </span>
            </div>
          </div>

          {/* Duration and Hours */}
          <div className="flex justify-between items-center text-xs text-gray-500 w-full">
            <div className="flex items-center gap-1 font-medium text-gray-600">
              <FieldTimeOutlined />
              <span>Duration: {item.duration}</span>
            </div>
            <div className="flex items-center gap-1 font-medium text-gray-600">
              <ClockCircleOutlined />
              <span>Hours: {item.hoursToFinish ?? "N/A"}</span>
            </div>
          </div>

          {/* Lessons and Learners */}
          <div className="flex justify-between items-center text-xs text-gray-500 w-full">
            <div className="flex items-center gap-1 font-medium text-gray-600">
              <ClockCircleOutlined />
              <span>{item.duration}</span>
            </div>
            <div className="flex items-center gap-1 font-medium text-gray-600">
              <UserOutlined />
              <span>{item.learners} learners</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {typeof window !== "undefined" &&
            localStorage.getItem("Role") === "Trainee" ? (
              <>
                <Button
                  onClick={openModal}
                  className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Enroll Now
                </Button>

                <Button
                  block
                  type="primary"
                  className="w-1/2"
                  onClick={() => router.push(`traninig/${item.id}`)}
                >
                  Start Learning
                </Button>
              </>
            ) : (
              <Button
                block
                type="primary"
                className="w-1/2"
                onClick={() => router.push(`traninig/${item.id}`)}
              >
                View
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        centered
        width={550}
      >
        <Card
          title={
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Payment Details
            </h2>
          }
          className="shadow-none bg-transparent"
          styles={{ body: { paddingTop: 0 } }}
        >
          <div className="bg-white transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-5 rounded-full border-4 border-blue-600 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
              </div>
              <span className="text-base font-medium text-gray-700">
                Pay with Chapa
              </span>
            </div>

            <p className="text-xl font-semibold text-gray-900 mb-4">
              Payer Information
            </p>

            <div className="space-y-5 mb-6">
              {[
                { label: "Full Name", name: "fullName", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone Number", name: "phoneNumber", type: "tel" },
              ].map((field, index) => (
                <div key={index}>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-start text-sm mb-6">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-gray-700">
                I agree to the{" "}
                <span className="text-blue-600 underline cursor-pointer">
                  Terms & Conditions
                </span>
              </label>
            </div>

            <Button
              block
              size="large"
              onClick={() => handlePay(item?.id)}
              className="bg-[#3b36ff] hover:bg-blue-700 text-white font-semibold text-base py-2.5 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-[1.02] border border-transparent"
            >
              Pay {item.price ?? "0"} ETB
            </Button>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default CourseCard;
