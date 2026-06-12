import { create, StateCreator } from "zustand";
import {
  Course,
  CourseLesson,
  CourseLessonMaterial,
} from "@/app/types/training/course";

type TnaManagementCoursePageState = {
  isShowAddLesson: boolean;
  course: Course | null;
  selectedCourse: string | null;
  myCourse: Course | null;
  refetchCourse: any;
  lessonId: string | null;

  isShowLessonMaterial: boolean;
  lesson: CourseLesson | null;
  lessonMaterial: CourseLessonMaterial | null;
  activeKey: string | string[] | undefined;

  isModalOpen: boolean;
};

type TnaManagementCoursePageAction = {
  setIsShowAddLesson: (isShowAddLesson: boolean) => void;
  setCourse: (course: Course | null) => void;
  setSelectedCourse: (selectedCourse: string | null) => void;
  setMyCourse: (course: Course | null) => void;
  setRefetchCourse: (refetch: any) => void;
  setLessonId: (lessonId: string | null) => void;

  setIsShowLessonMaterial: (isShowLessonMaterial: boolean) => void;
  setLesson: (lesson: CourseLesson | null) => void;
  setLessonMaterial: (lessonMaterial: CourseLessonMaterial | null) => void;
  setActiveKey: (activeKey: string | string[] | undefined) => void;

  setModalOpen: (isModalOpen: boolean) => void;
};

const tnaManagementCoursePageSlice: StateCreator<
  TnaManagementCoursePageState & TnaManagementCoursePageAction
> = (set) => ({
  isShowAddLesson: false,
  setIsShowAddLesson: (isShowAddLesson) => set({ isShowAddLesson }),

  course: null,
  setCourse: (course) => set({ course }),

  selectedCourse: null,
  setSelectedCourse: (selectedCourse) => set({ selectedCourse }),

  myCourse: null,
  setMyCourse: (course) => set({ myCourse: course }),

  refetchCourse: null,
  setRefetchCourse: (refetch) => set({ refetchCourse: refetch }),

  lessonId: null,
  setLessonId: (lessonId) => set({ lessonId }),

  isShowLessonMaterial: false,
  setIsShowLessonMaterial: (isShowLessonMaterial) =>
    set({ isShowLessonMaterial }),

  lesson: null,
  setLesson: (lesson) => set({ lesson }),

  lessonMaterial: null,
  setLessonMaterial: (lessonMaterial) => set({ lessonMaterial }),

  activeKey: undefined,
  setActiveKey: (activeKey) => set({ activeKey }),

  isModalOpen: false,
  setModalOpen: (isModalOpen) => set({ isModalOpen }),
});

export const useTnaManagementCoursePageStore = create<
  TnaManagementCoursePageState & TnaManagementCoursePageAction
>(tnaManagementCoursePageSlice);
