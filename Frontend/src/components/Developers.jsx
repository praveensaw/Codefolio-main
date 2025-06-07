import React from "react";
import { Github, Linkedin, Code } from "lucide-react";
import om from "../../public/images/om.jpg";
import balaji from "../../public/images/balaji.jpg";
import { useTheme } from "../App";

const Developers = () => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`min-h-screen py-24 -mt-20 px-4 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-5xl font-bold text-center mb-4 ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Our Developers
        </h2>
        <p
          className={`text-center mb-16 max-w-2xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Meet the talented developers behind this project. We're passionate
          about creating exceptional web experiences that make a difference.
        </p>

        {/* Responsive container: vertical stack on mobile, horizontal on larger screens */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-8 sm:gap-16 px-4">
          {/* Developer 1 */}
          <div className="group w-full sm:w-[300px] mx-auto sm:mx-0">
            <div
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={om}
                  alt="Developer 1"
                  className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3
                  className={`text-lg font-bold mb-1 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Om Kumavat
                </h3>
                <p
                  className={`text-sm mb-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Pune Institute of Computer Technology
                </p>
                <p className="text-md font-semibold text-blue-500 mb-4">
                  Full Stack Developer & ML Enthusiast
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.github.com/omkumavat"
                    className="transition-transform hover:scale-110"
                  >
                    <div className="bg-gray-900 text-white p-2 rounded-full">
                      <Github className="w-4 h-4" />
                    </div>
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.linkedin.com/in/om-kumavat-a34296258/"
                    className="transition-transform hover:scale-110"
                  >
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <Linkedin className="w-4 h-4" />
                    </div>
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://codefolio-platform.vercel.app/user/omkumavat"
                    className="transition-transform hover:scale-110"
                  >
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <Code className="w-4 h-4" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Developer 2 */}
          <div className="group w-full sm:w-[300px] mx-auto sm:mx-0">
            <div
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={balaji}
                  alt="Developer 2"
                  className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3
                  className={`text-lg font-bold mb-1 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Balaji Saw
                </h3>
                <p
                  className={`text-sm mb-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Pune Institute of Computer Technology
                </p>
                <p className="text-md font-semibold text-blue-500 mb-4">
                  Full Stack Developer & ML Enthusiast
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/balajisaw07"
                    className="transition-transform hover:scale-110"
                  >
                    <div className="bg-gray-900 text-white p-2 rounded-full">
                      <Github className="w-4 h-4" />
                    </div>
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.linkedin.com/in/balaji-s-922165258/"
                    className="transition-transform hover:scale-110"
                  >
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <Linkedin className="w-4 h-4" />
                    </div>
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://codefolio-platform.vercel.app/user/balajisaw"
                    className="transition-transform hover:scale-110"
                  >
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <Code className="w-4 h-4" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Developers;
