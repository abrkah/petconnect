"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type CourseEnrollmentsBarChartProps = {
  data: { course: string; enrollments: number }[];
};

const CourseEnrollmentsBarChart: React.FC<CourseEnrollmentsBarChartProps> = ({
  data,
}) => {
  const labels = data.map((item) => item.course);
  const enrollments = data.map((item) => item.enrollments);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Enrollments",
        data: enrollments,
        backgroundColor: "rgba(139, 92, 246, 0.7)", // Tailwind violet-600 with opacity
        borderRadius: 5,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.parsed.y ?? 0;
            return `${val.toLocaleString()} enrollments`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default CourseEnrollmentsBarChart;
