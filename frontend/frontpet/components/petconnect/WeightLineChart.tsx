"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export function WeightLineChart({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Weight",
            data: values,
            borderColor: "#0d9488",
            backgroundColor: "rgba(13,148,136,0.15)",
            tension: 0.3,
            fill: true,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } },
      }}
    />
  );
}
