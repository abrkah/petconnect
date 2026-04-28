"use client";

import React, { useState } from "react";
import { useGetProfile } from "@/app/utils/store/server/profile/query";
import { useGetUserCourses } from "@/app/utils/store/server/training/query";
import { Avatar, Spin, Button, Collapse, Tag, Card } from "antd";
import { useRouter } from "next/navigation";

const { Panel } = Collapse;

type BackendCourseProgress = {
  id: string;
  courseId: string;
  progressPercent: number;
  completedLessons?: number;
  totalLessons?: number;
  lastAccessed?: string;
};

type BackendUser = {
  id: string;
  name: string;
  email: string;
  role?: { name: string };
  user_image?: string | null;
  bio?: string | null;
  preparedCourses?: any[];
  courseProgress?: BackendCourseProgress[];
};

type CourseProgress = {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  lastAccessed: string;
  isCompleted: boolean;
};

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const { data: user, isLoading: isLoadingProfile, error } = useGetProfile();
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const { data: enrolledCourses, isLoading: isLoadingCourses } =
    useGetUserCourses(userId);

  if (isLoadingProfile || isLoadingCourses) return <Spin className="m-auto" />;
  if (error) return <p className="text-red-500">Failed to load profile.</p>;
  if (!user) return <p>No data found</p>;

  const isAdmin = user.role?.name === "Admin";
  const courseProgress = user.courseProgress ?? [];

  // Map progress by courseId
  const progressMap = new Map<string, BackendCourseProgress>(
    courseProgress.map((p) => [p.courseId, p])
  );

  const traineeCourses: CourseProgress[] = (enrolledCourses || []).map(
    (course: any) => {
      const progress = progressMap.get(course.id);
      return {
        courseId: course.id,
        courseTitle: course.title,
        totalLessons: progress?.totalLessons ?? 0,
        completedLessons: progress?.completedLessons ?? 0,
        progressPercent: progress?.progressPercent ?? 0,
        lastAccessed: progress?.lastAccessed ?? "",
        isCompleted: (progress?.progressPercent ?? 0) === 100,
      };
    }
  );

  const totalCourses = traineeCourses.length;
  const completedCourses = traineeCourses.filter((c) => c.isCompleted).length;
  const averageProgress =
    totalCourses === 0
      ? 0
      : Math.round(
          traineeCourses.reduce((sum, c) => sum + c.progressPercent, 0) /
            totalCourses
        );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div className="flex items-center gap-6">
          <Avatar
            size={96}
            src={user?.user_image || undefined}
            className="border-4 border-blue-500"
          >
            {!user?.user_image && user?.name
              ? user.name.charAt(0).toUpperCase()
              : null}
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-gray-600 text-sm">{user?.email}</p>
            {user?.bio && (
              <p className="mt-2 text-gray-700 italic max-w-md">{user?.bio}</p>
            )}
          </div>
        </div>


       {!isAdmin  &&(<button
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition"
          onClick={() => router.push("/dashboard/settings")}
        >
          Edit Profile
        </button>)}
      </div>

      {/* Admin View */}
      {isAdmin && user.preparedCourses && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
            Prepared Courses
          </h2>
          <Collapse accordion>
            {user.preparedCourses.map((course, idx) => (
              <Panel
                key={course.id}
                header={
                  <div className="flex justify-between items-center w-full">
                    <span>
                      {idx + 1}. {course.title}
                    </span>
                    <Tag color="blue" className="uppercase font-medium">
                      {course.level?.name || "Beginner"}
                    </Tag>
                  </div>
                }
              >
                <Card>
                  <p>{course.overview}</p>
                  <p>
                    <strong>Price:</strong> {course.price}
                  </p>
                  <p>
                    <strong>Hours to finish:</strong> {course.hoursToFinish}
                  </p>
                  <p>
                    <strong>Starting Capital:</strong> {course.startingCapital}
                  </p>
                  <p>
                    <strong>Profit %:</strong> {course.profitPercent}
                  </p>
                </Card>
              </Panel>
            ))}
          </Collapse>
        </section>
      )}

      {/* Trainee View */}
      {!isAdmin && (
        <>
          {/* Stats Summary */}
          <div className="flex justify-around text-center mb-10">
            <div>
              <h3 className="text-4xl font-extrabold text-blue-600">
                {totalCourses}
              </h3>
              <p className="text-gray-600">Total Courses</p>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-green-600">
                {completedCourses}
              </h3>
              <p className="text-gray-600">Completed</p>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-purple-600">
                {averageProgress}%
              </h3>
              <p className="text-gray-600">Average Progress</p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
              My Courses
            </h2>

            {traineeCourses.length === 0 ? (
              <p className="text-gray-700">
                You are not enrolled in any courses yet.
              </p>
            ) : (
              <ul className="space-y-6">
                {traineeCourses.map((course, idx) => (
                  <li
                    key={course.courseId}
                    className="p-5 border rounded-lg shadow-sm hover:shadow-lg transition flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                          idx % 3 === 0
                            ? "bg-blue-500"
                            : idx % 3 === 1
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <Avatar
                        size={48}
                        src={user.user_image || undefined}
                        className="border border-gray-300"
                      >
                        {!user.user_image && user.name
                          ? user.name.charAt(0).toUpperCase()
                          : null}
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {course.courseTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Last accessed:{" "}
                          <time dateTime={course.lastAccessed}>
                            {course.lastAccessed
                              ? new Date(
                                  course.lastAccessed
                                ).toLocaleDateString()
                              : "N/A"}
                          </time>
                        </p>
                        <p className="mt-1 text-gray-700">
                          {course.completedLessons} of {course.totalLessons}{" "}
                          lessons completed
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-64">
                      <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            course.isCompleted ? "bg-green-500" : "bg-blue-500"
                          } transition-all duration-500`}
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                      <span
                        className={`font-semibold ${
                          course.isCompleted
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {course.progressPercent}%
                      </span>
                      {course.isCompleted && (
                        <span className="inline-block px-3 py-1 text-xs font-bold text-green-800 bg-green-100 rounded-full uppercase tracking-wide">
                          Completed ✓
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
