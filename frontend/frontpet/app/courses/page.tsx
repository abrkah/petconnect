"use client";

import React from "react";
import { Row, Col, Card, Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRightOutlined } from "@ant-design/icons";

const CoursesSection = () => {
  const router = useRouter();

  const courses = [
    {
      title: "Pet Health Management",
      image: "/trainer.jfif",
      description:
        "Keep track of vaccinations, appointments, and health updates for every pet in one intuitive interface.",
      link: "/courses/pet-health-management",
    },
    {
      title: "Booking & Care Assistance",
      image: "/trainer.jfif",
      description:
        "Book grooming, training, and vet visits quickly while staying connected with care providers.",
      link: "/courses/booking-care-assistance",
    },
  ];

  return (
    <section className="mt-24 mb-20 px-4">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-slate-950">
        Explore Our{" "}
        <span className="text-sky-600 underline decoration-wavy">
          Pet Services
        </span>
      </h2>

      <Row gutter={[32, 32]} justify="center">
        {courses.map((course, index) => (
          <Col xs={24} md={12} lg={10} key={index}>
            <Card
              variant="outlined"
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              styles={{ body: { padding: 0 } }}
            >
              <div className="md:flex">
                {/* Image Section */}
                <div className="md:w-1/2 w-full h-64 md:h-auto relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 w-full p-6 bg-white flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white w-full rounded-full"
                    onClick={() => router.push(course.link)}
                    aria-label={`Enroll in ${course.title}`}
                  >
                    Enroll Now
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
