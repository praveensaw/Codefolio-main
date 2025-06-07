import React, { useState, useEffect } from "react";
import axios from "axios";
import { Code, Users, Code2, GitPullRequest } from "lucide-react";
import { useTheme } from "../App";

const Dashboard = () => {
  const {isDarkMode}=useTheme();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard/stats/getstats`
        );
        const data = response.data;
        setStats([
          {
            title: "Total Candidates",
            value: data.totalCandidates,
            icon: Users,
            color: "bg-blue-500",
          },
          {
            title: "LeetCode Accounts",
            value: data.totalLeetcode,
            icon: Code2,
            color: "bg-green-500",
          },
          {
            title: "CodeForces Accounts",
            value: data.totalCodeforces,
            icon: Code2,
            color: "bg-red-500",
          },
          {
            title: "CodeChef Accounts",
            value: data.totalCodechef,
            icon: Code2,
            color: "bg-purple-500",
          },
          {
            title: "GFG Accounts",
            value: data.totalGFG,
            icon: Code2,
            color: "bg-indigo-500",
          },
          {
            title: "GitHub Accounts",
            value: data.totalGitHub,
            icon: GitPullRequest,
            color: "bg-yellow-500",
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <Code
            className={`h-12 w-12 animate-spin ${
              isDarkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          />
          <p className={`mt-0 text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Retrieving Stats, please wait...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-md p-6 transition-colors duration-300 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
