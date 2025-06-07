import React from "react";
import { useTheme } from "../../App";

const PlatformComparisonDisplay3 = ({ candidate1, candidate2, metric }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="items-center mb-4 mt-2">
      <div className="space-y-1">
        <div
          className={`flex justify-between items-center py-2 ${
            isDarkMode ? "border-t border-gray-600" : "border-t border-gray-200"
          }`}
        >
          <div
            className={`w-1/3 text-right text-sm transition-colors ${
              candidate1 > candidate2
                ? "font-bold text-green-600 animate-bounce"
                : isDarkMode
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            {candidate1}
          </div>
          <div
            className={`w-1/3 text-center text-sm font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {metric}
          </div>
          <div
            className={`w-1/3 text-left text-sm transition-colors ${
              candidate1 < candidate2
                ? "font-bold text-green-600 animate-bounce"
                : isDarkMode
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            {candidate2}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformComparisonDisplay3;
