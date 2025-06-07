import React from "react"
import { motion } from "framer-motion"

const ActivityCalender2 = ({ data, isDarkMode, text, selectedYear }) => {
  // console(isDarkMode)
  if(!text) text = "submission"

  const getIntensityColor = count => {
    if (count === 0)
      return isDarkMode
        ? "bg-gray-800 border-gray-700"
        : "bg-gray-200 border-gray-300"
    if (count <= 2) return "bg-green-200"
    if (count <= 5) return "bg-green-300"
    if (count <= 9) return "bg-green-400"
    return "bg-green-600"
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ]

  const generateFullYearData = () => {
    const fullYearData = {}

    for (let month = 0; month < 12; month++) {
      fullYearData[month] = []
      const daysInMonth = new Date(selectedYear, month + 1, 0).getDate()

      for (let day = 1; day <= daysInMonth; day++) {
        // Create a date string in the "YY-MM-DD" format, e.g. "24-03-16"
        const twoDigitYear = String(selectedYear).slice(-2)
        const dateString = `${twoDigitYear}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`

        // Find the matching day in the data array using the new date format
        const existingDay = data.find(d => d.date === dateString)
        fullYearData[month].push({
          date: dateString,
          count: existingDay ? existingDay.submissions : 0
        })
      }
    }
    return fullYearData
  }

  const groupedData = generateFullYearData()

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {months.map((month, monthIndex) => (
          <div key={monthIndex} className="flex flex-col items-center">
            <div className="text-sm font-semibold text-gray-500">{month}</div>
            <div className="grid grid-cols-7 gap-1 mt-2">
              {groupedData[monthIndex].map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.001 }}
                  className="group relative"
                >
                  <div
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(
                      day.count
                    )} transition-colors duration-200`}
                  />
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-7 py-1 rounded text-xs whitespace-nowrap ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-900"
                    } shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10`}
                  >
                    {day.count} {text} on {day.date}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityCalender2
