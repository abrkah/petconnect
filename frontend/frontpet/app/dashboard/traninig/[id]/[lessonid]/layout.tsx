"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb, Spin } from "antd";

interface TnaManagementLayoutProps {
  children: ReactNode;
}

interface CourseLesson {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  courseLessons: CourseLesson[];
}

const mockCourse: Course = {
  id: "1",
  title: "Organic Chemistry Basics",
  courseLessons: [
    {
      id: "101",
      title: "Introduction to Chemistry",
    },
    {
      id: "102",
      title: "Atomic Structure",
    },
  ],
};

const TnaManagementLayout: FC<TnaManagementLayoutProps> = ({ children }) => {
  const { id } = useParams() as { id: string };

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (id === mockCourse.id) {
        setCourse(mockCourse);
      } else {
        setCourse(null);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const generateBreadcrumbItems = () => {
    if (!course) return [];

    return [
      { title: "Training & Learning", href: "/tna/management" },
      { title: course.title, href: `/tna/management/${course.id}` },
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }



  return (
    <div className="min-h-screen ">
      <div className=" mx-auto">
        {/* Render nested route content (lesson page or children) */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default TnaManagementLayout;
