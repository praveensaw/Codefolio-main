import React from "react";
import { useTheme } from "../../App";

const PlatformComparisonDisplay2 = ({ platformComparisons, platform }) => {
  const { isDarkMode } = useTheme();
  const data = platformComparisons;

  if (!data) return <></>;

  return (
    <div className="items-center mb-2 mt-2">
      <div className="space-y-1">
        <div
          className={`flex justify-between items-center py-2 ${
            isDarkMode ? "border-t border-gray-600" : "border-t border-gray-200"
          }`}
        >
          <div
            className={`w-1/3 text-right text-sm transition-colors ${
              data?.score1 > data?.score2
                ? "font-bold text-green-600 animate-bounce"
                : isDarkMode
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            {data?.score1}
          </div>
          <div
            className={`w-1/3 text-center text-sm font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {platform}
          </div>
          <div
            className={`w-1/3 text-left text-sm transition-colors ${
              data?.score1 < data?.score2
                ? "font-bold text-green-600 animate-bounce"
                : isDarkMode
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            {data?.score2}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformComparisonDisplay2;
