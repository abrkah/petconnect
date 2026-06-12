"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { BreadcrumbProps } from "antd/lib/breadcrumb";
import { useParams } from "next/navigation";

import { Breadcrumb, Spin } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

interface TnaManagementLayoutProps {
  children: ReactNode;
}

interface CourseLessonMaterial {
  id: string;
  title: string;
}

interface CourseLesson {
  id: string;
  title: string;
  courseLessonMaterials: CourseLessonMaterial[];
}

interface Course {
  id: string;
  title: string;
  courseLessons: CourseLesson[];
  category: string;
  duration: string;
  learners: number;
  imageUrl: string;
}

const mockCourse: Course = {
  id: "1",
  title: "Organic Chemistry Basics",
  category: "Chemistry",
  duration: "2 - 3 hrs",
  learners: 1234,
  imageUrl: "/chemist.jfif",
  courseLessons: [
    {
      id: "l1",
      title: "Introduction to Chemistry",
      courseLessonMaterials: [
        { id: "m1", title: "Atoms & Molecules" },
        { id: "m2", title: "Periodic Table" },
      ],
    },
    {
      id: "l2",
      title: "Chemical Reactions",
      courseLessonMaterials: [
        { id: "m3", title: "Reaction Types" },
        { id: "m4", title: "Balancing Equations" },
      ],
    },
  ],
};

const TnaManagementLayout: FC<TnaManagementLayoutProps> = ({ children }) => {
  const { id, lessonId, materialId } = useParams() as {
    id: string;
    lessonId?: string;
    materialId?: string;
  };

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [breadcrumbItems, setBreadcrumbItems] = useState<
    BreadcrumbProps["items"]
  >([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (id === mockCourse.id) {
        setCourse(mockCourse);
      } else {
        setCourse(null);
      }
      setLoading(false);
    }, 1200);
  }, [id]);

  useEffect(() => {
    if (course) {
      const bItems: BreadcrumbProps["items"] = [
        { title: "Training & Learning", href: "/tna/management" },
      ];

      if (lessonId) {
        const lesson = course.courseLessons.find((l) => l.id === lessonId);
        if (lesson) {
          bItems.push({
            title: course.title,
            href: `/tna/management/${course.id}`,
          });
          if (materialId) {
            const material = lesson.courseLessonMaterials.find(
              (m) => m.id === materialId
            );
            if (material) {
              bItems.push({ title: lesson.title });
              bItems.push({ title: material.title });
            } else {
              bItems.push({ title: lesson.title });
            }
          }
        } else {
          bItems.push({ title: course.title });
        }
      } else {
        bItems.push({ title: course.title });
      }

      setBreadcrumbItems(bItems);
    }
  }, [course, lessonId, materialId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

 

  return (
    <div className="  p-0 min-h-screen ">
      <div className=" mx-auto">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default TnaManagementLayout;

