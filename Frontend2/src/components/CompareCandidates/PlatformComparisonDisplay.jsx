import React from 'react';
import { Award } from 'lucide-react';
import { useTheme } from '../../App';


const rankMap = {
  0: "unranked",
  1: "newbie",
  2: "pupil",
  3: "specialist",
  4: "expert",
  5: "candidate master",
  6: "master",
  7: "international master",
  8: "grandmaster",
  9: "international grandmaster",
  10: "legendary grandmaster"
};


const PlatformComparisonDisplay = ({ platform, data, candidate1, candidate2 }) => {
  const { isDarkMode } = useTheme();
  let platformName = "";
  switch (platform) {
    case 'leetcode':
      platformName = "LeetCode";
      break;
    case 'codechef':
      platformName = "CodeChef";
      break;
    case 'codeforces':
      platformName = "CodeForces";
      break;
    case 'github':
      platformName = "GitHub";
      break;
    case 'gfg':
      platformName = "GeeksforGeeks";
      break;
    default:
      platformName = platform;
  }

  // Function to determine if lower value is better for a given label.
  const isLowerBetter = (label) => {
    const lowerLabel = label.toLowerCase();
    return lowerLabel.includes('global rank') || lowerLabel.includes('anking');
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-2xl mb-6 transition-transform transform ${isDarkMode
          ? 'bg-gradient-to-br from-gray-800 to-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50'
        }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
          {platformName} Comparison
        </h3>
        {data?.platformWinner !== 'tie' ? (
          <div className="flex items-center space-x-2 animate-pulse">
            <Award className="h-6 w-6 text-yellow-500" />
            <span className="text-lg font-semibold text-green-600">
              Winner: {data?.platformWinner === 'candidate1' ? candidate1.username : candidate2.username}
            </span>
          </div>
        ) : (
          <span className="text-lg font-semibold text-gray-500">Tie</span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className={`text-xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {candidate1.username}
          </p>
          <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {data?.score1}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {platformName}
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Metrics
          </p>
        </div>
        <div className="text-center">
          <p className={`text-xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {candidate2.username}
          </p>
          <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {data?.score2}
          </p>
        </div>
      </div>
      <div className="space-y-1">
        {data?.metrics.map((metric, i) => {
          // Determine if lower is better for this metric.
          const lowerBetter = isLowerBetter(metric.label);

          let winner;
          if (lowerBetter) {
            winner = metric.candidate1 > metric.candidate2 ? 1 : metric.candidate1 < metric.candidate2 ? 0 : -1;
          } else {
            winner = metric.candidate1 > metric.candidate2 ? 0 : metric.candidate1 < metric.candidate2 ? 1 : -1;
          }
          return (
            <div
              key={i}
              className={`flex justify-between items-center py-1 ${isDarkMode ? 'border-t border-gray-600' : 'border-t border-gray-200'}`}
            >
              <div
                className={`w-1/3 text-right text-sm transition-colors ${winner === 0 ? 'font-bold text-green-600 animate-bounce' : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
              >
                {platform === "codeforces" && metric.label === "Rank Value" ? rankMap[metric.candidate1] : metric.candidate1.toLocaleString()}
              </div>
              <div className={`w-1/3 text-center text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.label}
              </div>
              <div
                className={`w-1/3 text-left text-sm transition-colors ${winner === 1 ? 'font-bold text-green-600 animate-bounce' : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
              >
                {platform === "codeforces" && metric.label === "Rank Value" ? rankMap[metric.candidate2] : metric.candidate2.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformComparisonDisplay;
