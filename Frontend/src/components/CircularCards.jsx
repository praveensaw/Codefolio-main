import React from "react"
import { motion } from "framer-motion"

const CircularCards = ({
  percentage,
  color,
  size = 120,
  strokeWidth = 10,
  label,
  count,
  total,
  isDarkMode
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex flex-col items-center group">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDarkMode ? "#374151" : "#E5E7EB"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span
          className={`text-lg font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {Math.round(percentage)}%
        </span>
        <span
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {label}
        </span>
      </div>

      {/* Hover tooltip */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10`}
      >
        <div className="font-semibold">
          {count} / {total}
        </div>
        <div className="text-xs text-gray-500">problems solved</div>
      </div>
    </div>
  )
}

export default CircularCards
