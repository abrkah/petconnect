
import { useTnaManagementCoursePageStore } from "@/app/utils/uistate/fetures/training/managemnet/coursePage"; 

const CourseOverview = () => {
  const { course } = useTnaManagementCoursePageStore();
  return (
    <>
      <div className="text-lg font-bold text-black mb-6">Overview</div>
      <div className="text-base text-gray-600">{course?.overview}</div>
    </>
  );
};

export default CourseOverview;
