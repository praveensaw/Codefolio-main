import React from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Users, Star, TrendingUp, Zap } from "lucide-react"
import { useTheme } from "../App"
import ContestSection from "./ContestSection"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import { useAuth } from "../Context/AuthProvider"
import leetcode from "../../public//images/leetcode.png"
import geekforgeeks from "../../public/images/geekforgeeks.png"
import codechef from "../../public/images/codechef.png"
import codeforces from "../../public/images/codeforces.png"
import github from "../../public/images/github.png"
import home1 from '../../public/images/home1.avif'
import Developers from "../components/Developers"

const Home = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const { isDarkMode } = useTheme()

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`min-h-screen flex items-center justify-center text-white relative overflow-hidden ${
            isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-white-500"
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={home1}
              alt="Tech Background"
              className={`w-full h-full object-cover ${
                isDarkMode ? "opacity-100" : "opacity-100"
              }`}
            />
          </div>

          <div className="container mx-auto px-4 z-10 text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Unite Your Coding Journey
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-8"
            >
              One platform to showcase all your competitive programming and development profiles
            </motion.p>
            {!currentUser && (
              <motion.button
                onClick={() => navigate("/signup")}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-full font-bold text-lg transition-colors transform ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-black-700"
                    : "bg-white text-blue-600 hover:bg-gray-100"
                }`}
              >
                Get Started
              </motion.button>
            )}
          </div>
        </motion.section>
        <div className="py-1 -mt-5">
          <ContestSection />
        </div>

        {/* Platforms Section */}
        <section
          className={`py-20 -mt-5 -mb-10 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
        >
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ y: 20, opacity: 90 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              className={`text-4xl font-bold text-center -mt-10 mb-16 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Supported Platforms
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "LeetCode",
                  icon: leetcode,
                  description:
                    "Master algorithmic problems and prepare for technical interviews.",
                  stats: [
                    { label: "Problems", value: "3,300+" },
                    { label: "Difficulty Levels", value: "All" }
                  ]
                },
                {
                  title: "CodeForces",
                  icon: codeforces,
                  description:
                    "Participate in competitive programming contests.",
                  stats: [
                    { label: "Contests", value: "1000+" },
                    { label: "Global Rank", value: "Available" }
                  ]
                },
                {
                  title: "CodeChef",
                  icon: codechef,
                  description:
                    "Join coding competitions and learn from a vibrant community.",
                  stats: [
                    { label: "Monthly Contests", value: "3+" },
                    { label: "Difficulty Levels", value: "All" }
                  ]
                },
                {
                  title: "GeeksforGeeks",
                  icon: geekforgeeks,
                  description:
                    "Join coding competitions and learn from a vibrant community.",
                  stats: [
                    { label: "Monthly Contests", value: "3+" },
                    { label: "Difficulty Levels", value: "All" }
                  ]
                },
                {
                  title: "Github",
                  icon: github,
                  description:
                    "Collaborate, build, and share your projects with a global community.",
                  stats: [
                    { label: "Developers & Repositories", value: "100M+" },
                    {
                      label: "Tech Stacks & Open-Source Projects",
                      value: "All"
                    }
                  ]
                }
              ].map((platform, index) => (
                <PlatformCard
                  key={index}
                  {...platform}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className={`py-20 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ y: 0, opacity: 90 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              className={`text-4xl font-bold text-center mb-10 -mt-10 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Why Choose CodeVerse?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Star />,
                  title: "Unified Dashboard",
                  description: "Access all your coding profiles in one place."
                },
                {
                  icon: <TrendingUp />,
                  title: "Progress Tracking",
                  description: "Monitor your improvement across platforms."
                },
                {
                  icon: <Users />,
                  title: "Community Support",
                  description: "Connect with fellow programmers."
                },
                {
                  icon: <Zap />,
                  title: "Career Growth",
                  description: "Showcase your skills to potential employers."
                }
              ].map((benefit, index) => (
                <BenefitCard key={index} {...benefit} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>
        </section>

        <section>
          <Developers/>
        </section>
      </div>
      <Footer />
    </>
  )
}

const PlatformCard = ({ title, icon, description, stats, isDarkMode }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      rotateY: 5,
      z: 50,
      boxShadow: "0 20px 30px rgba(0,0,0,0.2)"
    }}
    className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-100 transform ${
      isDarkMode
        ? "bg-gray-800 text-white border border-white"
        : "bg-white text-gray-900"
    }`}
  >
    <div className="flex flex-row text-blue-500 mb-4 text-3xl">
      <img alt="icon" className="w-15 h-10" src={icon}></img>
      <h3 className="text-xl font-bold ml-4 mb-2">{title}</h3>
    </div>
    <p className={`mb-4 ${isDarkMode ? "text-white" : "text-gray-600"}`}>
      {description}
    </p>
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="font-bold">{stat.value}</div>
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
)

const BenefitCard = ({ icon, title, description, isDarkMode }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      rotateX: 5,
      rotateY: 5,
      z: 50
    }}
    className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
      isDarkMode
        ? "bg-gray-800 text-white border border-white"
        : "bg-gray-50 text-gray-900"
    }`}
  >
    <div className="text-blue-500 mb-4 text-3xl">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
      {description}
    </p>
  </motion.div>
)

export default Home
