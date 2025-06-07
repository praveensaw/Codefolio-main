import React, { useState } from "react";
import { LogOut, Menu, ChevronDown, Sun, Moon, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../App";
import { useAuth } from "../Context/AuthProvider";

const Navbar = ({ toggleSidebar }) => {
  const { currentUser,logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const showBackButton = location.pathname !== "/dashboard";

  return (
    <nav
      className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        } shadow-md fixed w-full z-10`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-md ${isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1
              className={`text-2xl font-bold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
            >
              CodeVerse - Dashboard
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="transition-colors"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </motion.button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2"
            >
              <div
                className={`${isDarkMode ? "bg-indigo-500" : "bg-indigo-600"
                  } h-10 w-10 rounded-full flex items-center justify-center`}
              >
                <span className="text-white font-semibold">{currentUser.firstName[0].toUpperCase()}</span>
              </div>
            </button>

            {profileOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${isDarkMode ? "bg-gray-700" : "bg-white"
                  }`}
              >
                <button
                  onClick={() => {
                     logout();
                     navigate('/')
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm ${isDarkMode
                      ? "text-gray-200 hover:bg-gray-600"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <LogOut className="h-4 w-4 mr-2 text-red-500" />
                  <span className="text-red-500">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
