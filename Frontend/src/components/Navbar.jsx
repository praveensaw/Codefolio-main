import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Menu,
  X,
  Home,
  Info,
  Code,
  LogIn,
  Moon,
  Sun,
  Settings,
  Github,
  Edit3,
  LogOut,
  Award,
  Contact,
  ClipboardMinus
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../App" // Ensure correct path
import { useAuth } from "../Context/AuthProvider"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import leetcode from '../../public//images/leetcode.png'
import geekforgeeks from '../../public/images/geekforgeeks.png'
import codechef from '../../public/images/codechef.png';
import codeforces from '../../public/images/codeforces.png';
import github from '../../public/images/github.png';

const Navbar = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  // const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // setLoading(true);
    if (currentUser && currentUser._id) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
    // setLoading(false);
  }, [currentUser])

  const handleLogOut = async () => {
    // setLoading(true);
    try {
      toast.success("LogOut Successfuly..")
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate a delay
      await logout()
      navigate("/")
      setIsLoggedIn(false)
      window.location.reload()
    } catch (error) {
      toast.error("Failed to LogOut, try again later..")
      console.error("Error during logout:", error)
    } finally {
      // setLoading(false);
    }
  }

  return (
    <nav
      className={`fixed w-full z-50 shadow-lg transition-colors duration-300 ${isDarkMode
        ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
        : "bg-gradient-to-r from-sky-500 via-blue-500 to-blue-600 text-white"
        }`}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Code className="h-8 w-8 text-white" />
            </motion.div>
            <span className="text-white font-bold text-xl transition-colors queen">
              CodeVerse
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" />
            <NavLink
              to="/about"
              icon={<Info className="h-5 w-5" />}
              text="About"
              onClick={() => window.scrollTo(0, 0)}
            />

            <NavLink
              onClick={() => window.scrollTo(0, 0)}
              to="/contact"
              icon={<Contact className="h-5 w-5" />}
              text="Contact"
            />

            <NavLink
              onClick={() => window.scrollTo(0, 0)}
              to="/docs"
              icon={<ClipboardMinus className="h-5 w-5" />}
              text="Docs"
            />

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="text-white hover:text-sky-200 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://admin-codeverse.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => window.scrollTo(0, 0)}
                className="bg-white text-sky-600 px-4 py-2 rounded-full font-medium hover:bg-sky-50 transition-colors flex items-center space-x-1"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login</span>
              </a>
            </motion.div>


            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDrawerOpen(true)}
                className="relative"
              >
                <img
                  src={currentUser.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white hover:border-sky-200 transition-colors"
                />
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  onClick={() => window.scrollTo(0, 0)}
                  to="/signup"
                  className="bg-white text-sky-600 px-4 py-2 rounded-full font-medium hover:bg-sky-50 transition-colors flex items-center space-x-1"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="text-white hover:text-sky-200 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-sky-200 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/" text="Home" isDarkMode={isDarkMode} />
              <MobileNavLink to="/about" text="About" isDarkMode={isDarkMode} />
              <MobileNavLink to="/contact" text="Contact" isDarkMode={isDarkMode} />
              <MobileNavLink to="/docs" text="Docs" isDarkMode={isDarkMode} />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="https://admin-codeverse.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => window.scrollTo(0, 0)}
                  className="bg-white text-sky-600 px-4 py-2 rounded-full font-medium hover:bg-sky-50 transition-colors flex items-center space-x-1"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Admin Login</span>
                </a>
              </motion.div>

              {isLoggedIn && (
                <button
                  onClick={() => {
                    setIsDrawerOpen(true)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${isDarkMode
                    ? "text-white hover:bg-gray-700"
                    : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                    } transition-colors duration-200`}
                >
                  Profile
                </button>
              )}
              {!isLoggedIn && (
                 <motion.div
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 <Link
                   onClick={() => window.scrollTo(0, 0)}
                   to="/signup"
                   className="bg-white text-sky-600 px-4 py-2 rounded-full font-medium hover:bg-sky-50 transition-colors flex items-center space-x-1"
                 >
                   <LogIn className="h-4 w-4" />
                   <span>Login</span>
                 </Link>
               </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className={`fixed right-0 top-0 h-full w-80 ${isDarkMode ? "bg-gray-900" : "bg-white"
                } shadow-2xl z-50 overflow-y-auto`}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                  >
                    Profile
                  </h2>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className={`p-2 rounded-full ${isDarkMode
                      ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                      } transition-colors`}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 mb-8">
                  <img
                    src={currentUser.profilePicture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-sky-500"
                  />
                  <div>
                    <h3
                      className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                    >
                      {currentUser.username}
                    </h3>
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      {currentUser.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      icon: <Award />,
                      text: "My Profile",
                      link: `/user/${currentUser.username}`
                    },
                    {
                      icon: leetcode,
                      text: "LeetCode",
                      link: `/user/${currentUser.username}/leetcode`
                    },
                    {
                      icon: codeforces,
                      text: "CodeForces",
                      link: `/user/${currentUser.username}/codeforces`
                    },
                    {
                      icon: codechef,
                      text: "CodeChef",
                      link: `/user/${currentUser.username}/codechef`
                    },
                    {
                      icon: geekforgeeks,
                      text: "GeeksforGeeks",
                      link: `/user/${currentUser.username}/geeksforgeeks`
                    },
                    {
                      icon: github,
                      text: "GitHub",
                      link: `/user/${currentUser.username}/github`
                    },
                    {
                      icon: <Edit3 />,
                      text: "Edit Profile",
                      link: `/user/${currentUser.username}/edit`
                    },
                  ].map((item, index) => (
                    <Link
                      key={index}
                      to={item.link}
                      onClick={() => setIsDrawerOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${isDarkMode
                        ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                        : "hover:bg-sky-50 text-gray-700 hover:text-sky-600"
                        } transition-colors`}
                    >
                      {
                        typeof item.icon === "string" ? (
                          <>
                            <img
                              src={item.icon}
                              className="h-8 w-10"
                            ></img>
                          </>
                        ) : (
                          <span>{item.icon}</span>
                        )
                      }

                      <span>{item.text}</span>
                    </Link>
                  ))}
                  <Link
                    onClick={handleLogOut}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${isDarkMode
                      ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                      : "hover:bg-sky-50 text-red-700 hover:text-sky-600"
                      } transition-colors`}
                  >
                    {<LogOut />}
                    <span>LogOut</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

const NavLink = ({ to, icon, text }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to={to}
      onClick={() => window.scrollTo(0, 0)}
      className="text-white hover:text-sky-200 flex items-center space-x-1 transition-colors duration-200"
    >
      {icon}
      <span>{text}</span>
    </Link>
  </motion.div>
);

const MobileNavLink = ({ to, text, isDarkMode }) => (
  <Link
    to={to}
    onClick={() => window.scrollTo(0, 0)}
    className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode
      ? "text-white hover:bg-gray-700"
      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
      } transition-colors duration-200`}
  >
    {text}
  </Link>
);


export default Navbar
