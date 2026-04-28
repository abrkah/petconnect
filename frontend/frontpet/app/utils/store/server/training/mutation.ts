import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleSuccessMessage } from "@/app/utils/showSuccessmessage";
import { requestHeader } from "@/components/helpers/requestHeader";
import { CourseLesson } from "@/app/types/tenant-management/training";
import axios from "axios";

// Payload type for course creation
interface CoursePayload {
  title: string;
  overview: string;
  thumbnail: string;
  preparedBy: string;
  isDraft: boolean;
}

const setCourseManagement = async (data: any) => {
  try {
    const response = await axios.post(`${FIKAT_URL}/learning/course`, data, {
      headers: {
        ...requestHeader(),
        "Content-Type": "multipart/form-data", // Axios will set boundary
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const useSetCourseManagement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setCourseManagement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("course"),
      });
      handleSuccessMessage("POST");
    },
  });
};

// Payload type for lesson
interface LessonPayload extends Partial<CourseLesson> {
  courseId: string;
}

const setCourseLesson = async (id: string, data: LessonPayload[]) => {
  return await crudRequest({
    url: `${FIKAT_URL}/course-lessons/${id}`, // <-- inject id here dynamically
    method: "POST",
    headers: requestHeader(),
    data,
  });
};
export const useSetCourseLesson = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessons: Omit<LessonPayload, "courseId">[]) => {
      // add courseId if needed or just send lessons directly
      return setCourseLesson(id, lessons);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("lesson"),
      });
      handleSuccessMessage("POST");
    },
  });
};
const createCourseMaterial = async (payload: any) => {
  return crudRequest({
    url: `${FIKAT_URL}/course-materials/create`,
    method: "POST",
    headers: requestHeader(),
    data: payload,
  });
};

export const useCreateCourseMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => createCourseMaterial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("course"),
      });
      handleSuccessMessage("POST");
    },
  });
};

const deleteCourseLesson = async (id: string[]) => {
  return await crudRequest({
    url: `${FIKAT_URL}/learning/course/lesson`,
    method: "DELETE",
    headers: requestHeader(),
    data: { id },
  });
};

export const useDeleteCourseLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourseLesson,
    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("lesson"),
      });
      const method = variables?.method?.toUpperCase();
      handleSuccessMessage(method);
    },
  });
};
