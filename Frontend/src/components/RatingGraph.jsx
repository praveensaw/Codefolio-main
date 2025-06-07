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

const RatingGraph = ({ data, isDarkMode }) => {
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
              border: "none",
              borderRadius: "0.5rem",
              color: isDarkMode ? "#FFFFFF" : "#000000"
            }}
          />
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

export default RatingGraph
