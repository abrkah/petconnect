import { useQuery } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { requestHeader } from "@/components/helpers/requestHeader";
import { CourseLesson } from "@/app/types/tenant-management/training";
import { ApiResponse } from "@/app/types/commons/responseType";
import { CourseLessonMaterial } from "@/app/types/tenant-management/training";
import { CourseLessonMaterialRequestBody } from "./interface";

// Fetch all courses
const getCourses = async () => {
  const response = await crudRequest({
    url: `${FIKAT_URL}/learning/course`,
    method: "GET",
    headers: requestHeader(),
  });
  return response;
};

// Fetch a single course by ID
const getCourseById = async (id: string) => {
  const response = await crudRequest({
    url: `${FIKAT_URL}/learning/course/${id}`,
    method: "GET",
    headers: requestHeader(),
  });
  return response;
};

export const useGetCourseManagement = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
};

export const useGetCourseById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id && enabled,
  });
};

// Fetch function to get course lessons by courseId
const getCourseLessons = async (courseId: string): Promise<CourseLesson[]> => {
  return await crudRequest({
    url: `${FIKAT_URL}/course-lessons/${courseId}`,
    method: "GET",
    headers: requestHeader(),
  });
};

// React Query hook to use in components
export const useGetCourseLessons = (courseId: string) => {
  return useQuery({
    queryKey: ["course-lessons", courseId],
    queryFn: () => getCourseLessons(courseId),
    enabled: !!courseId, // ensures the query runs only when courseId is available
  });
};

// Fetch all levels
const getLevels = async () => {
  const response = await crudRequest({
    url: `${FIKAT_URL}/level`, // Adjust path if your API uses a different route
    method: "GET",
    headers: requestHeader(),
  });
  return response;
};
export const useGetLevels = () => {
  return useQuery({
    queryKey: ["levels"],
    queryFn: getLevels,
  });
};
// ... other imports and code ...


const getCourseMaterialById = async (id: string) => {
  return await crudRequest({
    url: `${FIKAT_URL}/course-materials/${id}`,
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetLessonMaterial = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["course-material", id],
    queryFn: () => getCourseMaterialById(id),
    enabled: !!id && enabled,
  });
};

export const useGetLessonMaterialByOrder = (
  courseLessonId: string,
  order: number,
  enabled = true
) => {
  return useQuery({
    queryKey: ["course-material-by-lesson", courseLessonId, order],
    queryFn: () => getCourseMaterialByLessonAndOrder(courseLessonId, order),
    enabled: !!courseLessonId && order !== undefined && enabled,
  });
};
const getCourseMaterialByLessonAndOrder = async (
  courseLessonId: string,
  order: number
) => {
  return await crudRequest({
    url: `${FIKAT_URL}/course-materials/by-lesson/${courseLessonId}?order=${order}`,
    method: "GET",
    headers: requestHeader(),
  });
};
const getCourseEnrollments = async (): Promise<
  { course: string; enrollments: number }[]
> => {
  return await crudRequest({
    url: `${FIKAT_URL}/learning/enrollments`, // your backend API endpoint to get courses + enrollments
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetCourseEnrollments = () =>
  useQuery({
    queryKey: ["courses", "enrollments"],
    queryFn: getCourseEnrollments,
  });

  // API call
const getUserCourses = async (userId: string): Promise<any> => {
  return await crudRequest({
    url: `${FIKAT_URL}/payments/user/${userId}/courses`, // match your Nest route
    method: "GET",
    headers: requestHeader(),
  });
};

// Hook
export const useGetUserCourses = (userId: string) =>
  useQuery({
    queryKey: ["user", userId, "courses"], // cache per user
    queryFn: () => getUserCourses(userId),
    enabled: !!userId, // only fetch if userId is truthy
  });
