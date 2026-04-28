"use client";

import React from "react";
import { Card, Progress, List, Avatar, Spin } from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useGetProfile } from "@/app/utils/store/server/profile/query";
import { useGetUserCourses } from "@/app/utils/store/server/training/query";


const TraineeDashboard = () => {
  const { data: user, isLoading: isLoadingProfile, error } = useGetProfile();
 
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const { data: courses, isLoading: isLoadingCourses } =
    useGetUserCourses(userId);

  if (isLoadingProfile || isLoadingCourses) return <Spin fullscreen />;
  if (error) return <p className="text-red-500">Failed to load profile.</p>;
  if (!user) return <p>No data found</p>;

  // Map course progress
  const progressMap = new Map(
    user.courseProgress?.map((p: any) => [p.courseId, p])
  );

  // Active courses with progress and first 5 lessons
  const activeCourses = (courses || []).map((course: any) => {
    const progress = progressMap.get(course.id);
    return {
      ...course,
      progress: progress?.progressPercent || 0,
      lessons: course.courseLessons?.slice(0, 5) || [], // first 5 lessons
    };
  });

  const completedCourses = activeCourses.filter(
    (c) => c.progress === 100
  ).length;
  const averageProgress =
    activeCourses.length === 0
      ? 0
      : Math.round(
          activeCourses.reduce((sum, c) => sum + c.progress, 0) /
            activeCourses.length
        );

  // Upcoming lessons: first lesson from each course (up to 5)
  const upcomingLessons = activeCourses
    .flatMap((course) => course.lessons)
    .slice(0, 5)
    .map((lesson: any) => ({
      course: activeCourses.find((c) => c.lessons.includes(lesson))?.title,
      lesson: lesson.title,
      description: lesson.description,
    }));

  return (
    <div className="p-3 sm:p-5 md:p-8 lg:p-10 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen space-y-10">
      {/* Greeting */}
      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 tracking-tight bg-gradient-to-r from-blue-500 to-green-400 text-transparent bg-clip-text">
        👋 Welcome Back, {user.name}!
      </div>

      {/* Active Courses */}
      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-gray-700 border-b border-blue-200 pb-2">
          🎓 Active Courses
        </h2>

        {activeCourses.length === 0 ? (
          <p className="text-gray-500">You are not enrolled in any courses.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {activeCourses.map((course, idx) => (
              <Card
                key={course.id || idx}
                title={
                  <div className="flex flex-wrap items-center gap-2 font-medium text-sm sm:text-base text-blue-600">
                    <BookOutlined /> {course.title}
                  </div>
                }
                className="rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 bg-white hover:bg-blue-50"
                styles={{ body: { paddingBottom: "1rem" } }}
              >
                <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3">
                  {course.overview}
                </p>

                {course.progress !== undefined ? (
                  <Progress
                    percent={course.progress}
                    strokeColor={{ "0%": "#34D399", "100%": "#10B981" }}
                    status="active"
                  />
                ) : (
                  <p className="text-gray-400 italic text-xs sm:text-sm">
                    Progress not available
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upcoming Lessons */}
        <Card
          title={
            <span className="flex items-center gap-2 text-sm sm:text-base font-semibold text-indigo-600">
              📅 Upcoming Lessons
            </span>
          }
          className="rounded-xl border border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 bg-white hover:bg-indigo-50"
        >
          <List
            itemLayout="horizontal"
            dataSource={upcomingLessons}
            renderItem={(item, idx) => (
              <List.Item key={idx}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: "#2563EB" }}
                      icon={<ClockCircleOutlined />}
                    />
                  }
                  title={
                    <span className="font-medium text-sm text-gray-800">
                      {item.lesson}
                    </span>
                  }
                  description={
                    <span className="text-gray-500 text-xs sm:text-sm">
                      {item.course}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Course Completion */}
        <Card
          title={
            <span className="flex items-center gap-2 text-sm sm:text-base font-semibold text-green-600">
              ✅ Course Completion Overview
            </span>
          }
          className="rounded-xl border border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 bg-white hover:bg-green-50"
        >
          <div className="flex flex-col items-center justify-center h-full space-y-4 py-6">
            <CheckCircleOutlined className="text-green-500 text-3xl sm:text-4xl" />
            <Progress
              type="circle"
              percent={averageProgress}
              strokeColor={{ "0%": "#34D399", "100%": "#059669" }}
              width={100}
            />
            <p className="text-gray-700 text-xs sm:text-sm text-center max-w-xs">
              You’ve completed{" "}
              <strong className="text-green-600">{completedCourses}</strong> out
              of{" "}
              <strong className="text-green-600">{activeCourses.length}</strong>{" "}
              courses.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default TraineeDashboard;
