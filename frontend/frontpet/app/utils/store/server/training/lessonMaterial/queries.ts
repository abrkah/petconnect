import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { requestHeader } from "@/components/helpers/requestHeader";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/app/types/commons/responseType";
import { CourseLessonMaterial } from "@/app/types/tenant-management/training";
import { CourseLessonMaterialRequestBody } from "../interface";

const getCoursesLessonMaterial = async (
  data: Partial<CourseLessonMaterialRequestBody>
) => {
  return await crudRequest({
    url: `${FIKAT_URL}/learning/course/lesson/material`,
    method: "POST",
    headers: requestHeader(),
    data,
  });
};

export const useGetCourseLessonsMaterial = (
  data: Partial<CourseLessonMaterialRequestBody>,
  isKeepData: boolean = true,
  isEnabled: boolean = true
) => {
  return useQuery<ApiResponse<CourseLessonMaterial>>({
    queryKey:
      Object.keys(data).length > 0
        ? ["course-lesson-material", data]
        : ["course-lesson-material"],
    queryFn: () => getCoursesLessonMaterial(data),
    keepPreviousData: isKeepData,
    enabled: isEnabled,
  });
};
