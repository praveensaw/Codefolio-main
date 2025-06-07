import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LogIn, Mail, Lock } from "lucide-react"
import Loader from "../components/Loader"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../Context/AuthProvider"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useTheme } from "../App"

const Login = () => {
  const { isDarkMode } = useTheme()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({}) // Stores validation & server errors
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    let isValid = true
    const newErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/server/user/login`,
        {
          email,
          password
        }
      )

      const data = await response.data.user
      // console(data)
      if (!response.data.success) {
        toast.error("Login failed, try again later..")
      } else {
        toast.success("Login Successful..")
        login(data)
        localStorage.setItem("Users", JSON.stringify(data))
        navigate("/")
      }
    } catch (error) {
      setErrors({ server: "Wrong email or password" })
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] w-7 mx-auto ml-200 mt-12 mb-10">
        <Loader />
      </div>
    )
  }
  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen flex items-center justify-center px-4 mt-16 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 opacity-10 animate-pulse" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <LogIn
                className={`h-12 w-12 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </motion.div>

            <h2
              className={`text-3xl font-bold text-center mb-8 ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </motion.div>

              {errors.server && (
                <p className="text-red-500 text-center text-sm mt-2">
                  {errors.server}
                </p>
              )}

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}

export default Login
