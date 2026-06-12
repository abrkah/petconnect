"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetUserProfileById } from "@/app/utils/store/server/profile/query";
import { useGetUserCourses } from "@/app/utils/store/server/training/query";
import { Spin } from "antd";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

const UserDetailPage: React.FC<UserDetailPageProps> = (props) => {
  // Unwrap params safely
  const params = React.use(props.params);
  const userId = params.id;

  const router = useRouter();

  const {
    data: user,
    isLoading: isLoadingProfile,
    error,
  } = useGetUserProfileById(userId);

  const { data: enrolledCourses, isLoading: isLoadingCourses } =
    useGetUserCourses(userId);

  if (isLoadingProfile || isLoadingCourses)
    return <Spin className="mx-auto mt-20" size="large" />;

  if (error)
    return (
      <p className="text-red-500 text-center mt-20">Failed to load profile.</p>
    );

  if (!user) return <p className="text-center mt-20">No data found</p>;

  const isTrainee = user.role?.name === "Trainee";
  const courseProgress = user.courseProgress ?? [];
  const progressMap = new Map(courseProgress.map((p: any) => [p.courseId, p]));

  const traineeCourses = (enrolledCourses || []).map((course: any) => {
    const progress = progressMap.get(course.id);
    return {
      courseId: course.id,
      courseTitle: course.title,
      totalLessons: progress?.totalLessons ?? 0,
      completedLessons: progress?.completedLessons ?? 0,
      progressPercent: progress?.progressPercent ?? 0,
      lastAccessed: progress?.lastAccessed ?? "N/A",
      isCompleted: (progress?.progressPercent ?? 0) === 100,
    };
  });

  const totalCourses = traineeCourses.length;
  const completedCourses = traineeCourses.filter((c) => c.isCompleted).length;
  const averageProgress =
    totalCourses === 0
      ? 0
      : Math.round(
          traineeCourses.reduce((sum, c) => sum + c.progressPercent, 0) /
            totalCourses
        );

  const preparedCourses = !isTrainee ? user.preparedCourses || [] : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* User Info */}
      <div className="flex flex-col sm:flex-row items-center bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-xl text-white shadow-lg mb-8 transition-all hover:shadow-2xl">
        {user.user_image && (
          <Image
            src={user.user_image}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0 border-2 border-white"
          />
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold">{user.name}</h1>
          <p className="text-sm sm:text-base">{user.email}</p>
          <p className="mt-2 text-sm sm:text-base italic">{user.role?.name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:bg-indigo-50 transition-colors">
          <p className="text-2xl font-bold text-indigo-600">
            {isTrainee ? totalCourses : preparedCourses.length}
          </p>
          <p className="text-gray-500 mt-1">
            {isTrainee ? "Total Courses" : "Prepared Courses"}
          </p>
        </div>
        {isTrainee && (
          <>
            <div className="bg-white shadow-md rounded-xl p-6 text-center hover:bg-green-50 transition-colors">
              <p className="text-2xl font-bold text-green-600">
                {completedCourses}
              </p>
              <p className="text-gray-500 mt-1">Completed</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 text-center hover:bg-yellow-50 transition-colors">
              <p className="text-2xl font-bold text-yellow-600">
                {averageProgress}%
              </p>
              <p className="text-gray-500 mt-1">Average Progress</p>
            </div>
          </>
        )}
      </div>

      {/* Courses Section */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
          {isTrainee ? "Enrolled Courses" : "Prepared Courses"}
        </h2>

        {(isTrainee ? traineeCourses : preparedCourses).length === 0 ? (
          <p className="text-gray-500">No courses available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(isTrainee ? traineeCourses : preparedCourses).map(
              (course: any) => (
                <div
                  key={course.courseId || course.id}
                  className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 truncate">
                    {course.courseTitle || course.title}
                  </h3>
                  {/* {course.thumbnail && (
                    <div className="relative w-full h-48 sm:h-52 mb-3 rounded overflow-hidden">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )} */}
                  <p className="text-sm sm:text-base mb-1">
                    {isTrainee
                      ? `Progress: ${course.progressPercent}%`
                      : course.overview}
                  </p>
                  {isTrainee && (
                    <>
                      <p className="text-sm sm:text-base mb-1">
                        Lessons: {course.completedLessons} /{" "}
                        {course.totalLessons}
                      </p>
                      <p className="text-sm sm:text-base text-gray-400">
                        Last accessed: {course.lastAccessed}
                      </p>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailPage;
