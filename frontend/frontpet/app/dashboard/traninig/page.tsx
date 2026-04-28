"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { LuPlus } from "react-icons/lu";
import CourseCard from "./-components/coursecard";
import CourseCategorySidebar from "./-components/courseSidebar";
import { useTnaManagementStore } from "@/app/utils/uistate/fetures/training/managemnet";
import { useGetCourseManagement } from "@/app/utils/store/server/training/query";

interface Course {
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
}

export default function CourseDashboard() {
  const { setIsShowCourseSidebar } = useTnaManagementStore();
  const { data: coursesData = [], isLoading } = useGetCourseManagement();

  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Only runs in the browser
    setUserId(localStorage.getItem("userId"));
    setRole(localStorage.getItem("Role"));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <Spin size="large" />
        <span className="mt-3 text-gray-600">Loading courses...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 space-x-4">
        <Input
          placeholder="Search Course"
          prefix={<SearchOutlined />}
          className="w-32"
        />
        {role === "Admin" && (
          <Button
            size="large"
            type="primary"
            className="h-[50px]"
            icon={<LuPlus size={16} />}
            onClick={() => setIsShowCourseSidebar(true)}
          >
            <span className="hidden sm:block">Add Course</span>
          </Button>
        )}
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {coursesData.map((course: any) => {
          const transformedCourse: Course = {
            id: course.id,
            title: course.title,
            category: course.category || "Uncategorized",
            level:
              course.level?.name?.toUpperCase() === "BEGINNER"
                ? "BEGINNER"
                : course.level?.name?.toUpperCase() === "INTERMEDIATE"
                ? "INTERMEDIATE"
                : "ADVANCED",
            duration: `${course.courseLessons?.length || 0} lessons`,
            learners: course.enrolledUsers?.length || 0,
            imageUrl: course.thumbnail || "/chemist.jfif",
            badge: "CERTIFICATE",
            startDate: course.createdAt,
            price: course.price,
            profitPercent: course.profitPercent,
            startingCapital: course.startingCapital,
            hoursToFinish: course.hoursToFinish,
          };

          return <CourseCard key={course.id} item={transformedCourse} />;
        })}
      </div>

      <CourseCategorySidebar />
    </div>
  );
}
