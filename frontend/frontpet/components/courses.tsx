"use client";

import React from "react";
import { Row, Col, Card, Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";

const CoursesSection = () => {
  const courses = [
    {
      title: "Pet Health Tracker",
      image: "/trainer.jfif",
      description:
        "Monitor vaccinations, weight updates, and wellness notes for every pet in your household.",
      link: "/courses/pet-health-tracker",
    },
    {
      title: "Appointment Booking",
      image: "/trainer.jfif",
      description:
        "Schedule grooming, vet visits, and training sessions with trusted providers in just a few clicks.",
      link: "/courses/appointment-booking",
    },
  ];

  return (
    <section
      className="relative w-full border border-slate-200 rounded-2xl overflow-hidden pb-20 pt-24 px-6 md:px-12 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(14,165,233,0.2)] hover:-translate-y-1 bg-white"
    >
      <Row gutter={[24, 24]} className="flex items-start">
        {courses.map((course, index) => (
          <Col xs={24} md={12} key={index}>
            <Card className="rounded-lg shadow-lg h-full flex md:flex-row hover:shadow-xl transition-shadow duration-300">
              <div className="flex">
                {/* Image Section (on the left) */}
                <div className="flex justify-center items-center w-1/3">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={300} // Increased width
                    height={300} // Increased height
                    className="rounded-l-lg object-cover"
                  />
                </div>

                {/* Content Section (on the right) */}
                <div className="w-2/3 flex flex-col flex-grow p-4">
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <p className="text-gray-600 mt-2 flex-grow">
                    {course.description}
                  </p>
                  <Button
                    type="primary"
                    className="mt-4 bg-sky-600 hover:bg-sky-700 transition-colors duration-300"
                    onClick={() => router.push(course.link)}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default CoursesSection;
