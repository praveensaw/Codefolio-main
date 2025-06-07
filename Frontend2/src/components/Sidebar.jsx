import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, BarChart2 } from "lucide-react";
import { useTheme } from "../App";

const Sidebar = ({ isOpen }) => {
  const { isDarkMode } = useTheme();
  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/compare", icon: BarChart2, label: "Compare Candidates" },
    { path: "/dashboard/all-coders", icon: Users, label: "All Coders" },
    { path: "/dashboard/all-admins", icon: Users, label: "All Admins" },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 overflow-hidden ${
        isOpen ? "w-64" : "w-0"
      } ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
    >
      <div className="py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${
                isActive
                  ? isDarkMode
                    ? "bg-indigo-700 text-indigo-300"
                    : "bg-indigo-50 text-indigo-600"
                  : isDarkMode
                  ? "text-gray-300"
                  : "text-gray-700"
              } ${isActive && !isOpen ? "py-0" : ""}`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className={`ml-4 ${!isOpen && "hidden"}`}>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
