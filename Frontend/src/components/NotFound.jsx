import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Home, AlertCircle } from "lucide-react"
import { useTheme } from "../App"
import Navbar from "./Navbar"
import Footer from "./Footer"

const NotFound = () => {
  const { isDarkMode } = useTheme()

  return (
    <>
      <Navbar />

      <div
        className={`min-h-screen flex items-center justify-center p-4 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <AlertCircle className="h-32 w-32 text-red-500" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3"
              >
                <span className="text-gray-900 font-bold text-xl">404</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-lg mb-8 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Oops! The page you're looking for doesn't exist.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/"
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
            >
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          <div className="absolute inset-0 -z-10 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 0.5,
                  scale: 1,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight
                }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: Math.random() * 2
                }}
                className={`absolute h-2 w-2 rounded-full ${
                  isDarkMode ? "bg-blue-500" : "bg-blue-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default NotFound
