import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

// Custom tooltip component
const CustomTooltip = ({ active, payload, isDarkMode }) => {
  if (active && payload && payload.length) {
    // Access the original data point from payload[0].payload
    const { date, rating, rank } = payload[0].payload

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
          border: "none",
          borderRadius: "0.5rem",
          padding: "8px",
          color: isDarkMode ? "#FFFFFF" : "#000000"
        }}
      >
        <p>Date: {date || "N/A"}</p>
        <p>Rating: {typeof rating === "string" ? rating : "N/A"}</p>
        <p>Rank: {rank || "N/A"}</p>
      </div>
    )
  }
  return null
}

const RatingGraph2 = ({ data = [], isDarkMode }) => {
  // Validate that data is an array
  if (!Array.isArray(data)) {
    console.error("Invalid data format, expected an array")
    return null
  }

  // Calculate minimum and maximum ratings for the YAxis domain
  const minRating = Math.min(...data.map(item => item.rating))
  const maxRating = Math.max(...data.map(item => item.rating))

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#374151" : "#E5E7EB"}
          />
          <XAxis
            dataKey="date"
            stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
            tick={{ fill: isDarkMode ? "#9CA3AF" : "#6B7280" }}
          />
          <YAxis
            stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
            tick={{ fill: isDarkMode ? "#9CA3AF" : "#6B7280" }}
            // Ensure all data fits comfortably
            domain={[minRating - 50, maxRating + 50]}
          />
          {/* Use the custom tooltip */}
          <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: "#3B82F6", r: 4 }}
            activeDot={{ r: 6, fill: "#2563EB" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RatingGraph2
