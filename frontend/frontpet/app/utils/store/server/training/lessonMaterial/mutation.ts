import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { requestHeader } from "@/components/helpers/requestHeader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleSuccessMessage } from "@/app/utils/showSuccessmessage";
import { CourseLessonMaterial } from "@/app/types/tenant-management/training";

// Mutation function to update course lesson materials
const setCourseLessonMaterial = async (
  items: Partial<CourseLessonMaterial>[]
) => {
  return await crudRequest({
    url: `${FIKAT_URL}/learning/course/lesson/material`,
    method: "PUT",
    headers: requestHeader(),
    data: { items },
  });
};

// Mutation function to delete course lesson materials
const deleteCourseLessonMaterial = async (id: string[]) => {
  return await crudRequest({
    url: `${FIKAT_URL}/learning/course/lesson/material`,
    method: "DELETE",
    headers: requestHeader(),
    data: { id },
  });
};

// Hook to update course lesson materials
export const useSetCourseLessonMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setCourseLessonMaterial,
    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries("course-lesson-material");
      const method = variables?.method?.toUpperCase();
      handleSuccessMessage(method);
    },
  });
};

// Hook to delete course lesson materials
export const useDeleteCourseLessonMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourseLessonMaterial,
    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries("course-lesson-material");
      const method = variables?.method?.toUpperCase();
      handleSuccessMessage(method);
    },
  });
};
