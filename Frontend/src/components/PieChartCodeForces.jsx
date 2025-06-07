import React from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

export function PieChartCodeForces({ problemsSolvedByRating, isDarkTheme }) {
  // Process the data for the pie chart
  const data = {
    labels: problemsSolvedByRating.map(([rating]) => `${rating} Rating`),
    datasets: [
      {
        data: problemsSolvedByRating.map(([, problems]) => problems.length),
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)", // Blue for 800
          "rgba(75, 192, 192, 0.8)", // Teal for 900
          "rgba(255, 159, 64, 0.8)", // Orange for 1100
          "rgba(255, 99, 132, 0.8)" // Red for 1400
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderWidth: 1
      }
    ]
  }

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 14
          },
          padding: 20,
          usePointStyle: true,
          color: isDarkTheme ? "#e5e7eb" : "#374151"
        }
      },
      tooltip: {
        callbacks: {
          label: context => {
            const label = context.label || ""
            const value = context.raw || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} problems (${percentage}%)`
          }
        },
        backgroundColor: isDarkTheme
          ? "rgba(17, 24, 39, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: isDarkTheme ? "#e5e7eb" : "#374151",
        bodyColor: isDarkTheme ? "#e5e7eb" : "#374151",
        borderColor: isDarkTheme ? "#4b5563" : "#e5e7eb",
        borderWidth: 1
      }
    },
    responsive: true,
    maintainAspectRatio: false
  }

  return (
    <div
      className={`${
        isDarkTheme ? "bg-gray-800" : "bg-white"
      } p-6 rounded-xl shadow-sm`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          isDarkTheme ? "text-gray-100" : "text-gray-800"
        }`}
      >
        Problems Solved by Rating
      </h3>
      <div className="h-[400px] relative">
        <Pie data={data} options={options} />
      </div>
      <div
        className={`mt-4 grid grid-cols-2 gap-4 text-sm ${
          isDarkTheme ? "text-gray-300" : "text-gray-600"
        }`}
      >
        <div>
          <span className="font-medium">Total Problems: </span>
          {problemsSolvedByRating.reduce(
            (acc, [, problems]) => acc + problems.length,
            0
          )}
        </div>
        <div>
          <span className="font-medium">Ratings Covered: </span>
          {problemsSolvedByRating.length}
        </div>
      </div>
    </div>
  )
}
