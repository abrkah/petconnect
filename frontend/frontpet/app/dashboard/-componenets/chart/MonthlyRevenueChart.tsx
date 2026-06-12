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

// Register the components with ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type MonthlyRevenueBarChartProps = {
  data: { month: string; revenue: number }[];
};

const MonthlyRevenueBarChart: React.FC<MonthlyRevenueBarChartProps> = ({
  data,
}) => {
  // Extract labels and data points
  const labels = data.map((item) => item.month);
  const revenues = data.map((item) => item.revenue);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue ($)",
        data: revenues,
        backgroundColor: "rgba(59, 130, 246, 0.7)", // Tailwind blue-500 with opacity
        borderRadius: 5,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y ?? 0;
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `$${value}`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default MonthlyRevenueBarChart;
