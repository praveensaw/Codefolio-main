import React from "react"
import { motion } from "framer-motion"
import { ListChecks, GitFork } from "lucide-react"

const CombinedActivityCalender = ({ data, isDarkMode, selectedYear }) => {
  const getIntensityColor = (submissions, contributions) => {
    const total = submissions + contributions
    if (total === 0)
      return isDarkMode
        ? "bg-gray-800 border-gray-700"
        : "bg-gray-200 border-gray-300"
    if (total <= 2) return "bg-green-200 border-green-300"
    if (total <= 5) return "bg-green-300 border-green-400"
    if (total <= 9) return "bg-green-400 border-green-500"
    return "bg-green-600 border-green-700"
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
        const dateString = `${selectedYear}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`
        const existingDay = data.find(d => d.date === dateString)

        fullYearData[month].push({
          date: dateString,
          submissions: existingDay ? existingDay.submissions ?? 0 : 0,
          contributions: existingDay ? existingDay.contributions ?? 0 : 0
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
              {groupedData[monthIndex].map(day => (
                <motion.div
                  key={day.date}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.001 }}
                  className={`w-4 h-4 rounded-sm border cursor-pointer relative group ${getIntensityColor(
                    day.submissions,
                    day.contributions
                  )}`}
                >
                  {/* Tooltip */}
                  <div
                    className={`absolute top-20 left-8/10 -translate-x-1/2 px-3 py-1 rounded text-xs whitespace-nowrap ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-900"
                    } shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10`}
                  >
                    <p className="flex items-center gap-1">
                      <ListChecks className="h-3 w-3" /> {day.submissions}{" "}
                      submissions
                    </p>

                    <p className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" /> {day.contributions}{" "}
                      contributions
                    </p>
                    <p>{day.date}</p>
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

export default CombinedActivityCalender
