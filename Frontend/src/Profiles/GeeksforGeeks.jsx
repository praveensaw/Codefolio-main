import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Trophy,
  Star,
  Award,
  Zap,
  Target,
  PlusCircle,
  Brain,
  RefreshCwIcon,
  DeleteIcon
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useTheme } from "../App"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import GeeksforGeeksModal from "../components/GeeksforGeeksModal"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../Context/AuthProvider"
import axios from "axios"
import Loader from "../components/Loader"
import { useParams } from "react-router-dom"
import DeleteModal from "../components/DeleteModal"
import geeksforgeeks from "../../public/images/geekforgeeks.png"
import geeksforgeeks2 from "../../public/images/geeksforgeeks2.avif"

const GeeksforGeeks = () => {
  const { username } = useParams()
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [usernameGFG, setUsernameGFG] = useState("")
  const { isDarkMode } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { currentUser, updateProfile } = useAuth()
  const [showRefresh, setShowRefresh] = useState(false)
  const [ShowDelete, setShowDelete] = useState(false)
  const [hasAccount, setHasAccount] = useState(true)
  const [circularData, setcircularData] = useState([])
  const [streak, setstreak] = useState(0)
  const [contestRating, setcontestRating] = useState([])
  const [stars, setStars] = useState(0)
  const [education, seteducation] = useState("")
  const [rank, setrank] = useState(0)
  const [skills, setskills] = useState([])
  const [problemNames, setproblemNames] = useState([])
  const [difficultyLevels, setdifficultyLevels] = useState([])
  const [hasFetchedUser, setHasFetchedUser] = useState(false)

  const setToast = msg => {
    if (msg.success) {
      toast.success(msg.text)
    } else {
      toast.error(msg.text)
    }
  }
  const getDifficultyColor = difficulty => {
    switch (difficulty.toLowerCase()) {
      case "school":
        return "#22C55E" // Green-500
      case "basic":
        return "#3B82F6" // Blue-500
      case "easy":
        return "#EAB308" // Yellow-500
      case "medium":
        return "#F97316" // Orange-500
      case "hard":
        return "#EF4444" // Red-500
      default:
        return "#6B7280" // Gray-500
    }
  }

  const fetchGFGData = async () => {
    try {
      setLoading(true)
      let response = null

      if (currentUser) {
        if (currentUser?.username === username) {
          if (currentUser?.GeeksforGeeks) {
            setShowRefresh(true)
            setShowDelete(true)
            //this is self account and logged in
            response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/server/gfg/fetch-gfg/${username}`
            )
          } else {
            setHasAccount(false)
            return
          }
        } else {
          //not self account and logged in
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/server/gfg/fetch-gfg/${username}`
          )
          setShowRefresh(false)
          setShowDelete(false)
        }
      } else {
        //not self account and not logged in
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/gfg/fetch-gfg/${username}`
        )
        setShowRefresh(false)
        setShowDelete(false)
      }

      if (!response || !response.data || response.status !== 200) {
        window.location.href = "/"
        return
      }

      const data = response.data.data
      // console("GFG Data:", data)

      setUsernameGFG(data.username)
      setStars(data.stars)
      seteducation(data.education)
      const number = data.rank.match(/\d+/)[0]
      setrank(number)
      const languages = data.skills.split(",").map(lang => lang.trim())
      setskills(languages)
      setcontestRating(data.contestRating)
      const result = data.streak.split("/")[0]
      setstreak(result)
      setproblemNames(data.problemNames)
      const coloredLevels = data.difficultyLevels.map(level => ({
        ...level,
        color: getDifficultyColor(level.difficulty)
      }))
      setdifficultyLevels(coloredLevels)

      setHasAccount(true)
    } catch (error) {
      window.location.href = "/"
      console.error("Error fetching LeetCode data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGFGCodeDataFromDB = async () => {
    try {
      let response = null

      // console(currentUser)
      if (currentUser) {
        if (currentUser?.username === username) {
          if (currentUser?.GeeksforGeeks) {
            setShowRefresh(true)
            setShowDelete(true)
            const gfgid = currentUser?.GeeksforGeeks
            // console("1212", gfgid)
            response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/server/gfg/fetch-gfg-db/${gfgid}`
            )
          } else {
            // console(hasAccount)
            setHasAccount(false)
            return
          }
        } else {
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/server/gfg/fetch-gfg/${username}`
          )
          setShowRefresh(false)
          setShowDelete(false)
        }
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/gfg/fetch-gfg/${username}`
        )
        setShowRefresh(false)
        setShowDelete(false)
      }

      // // console(response)
      if (!response || !response.data || response.status !== 200) {
        window.location.href = "/"
        return
      }
      const data = response.data.data
      // console("LeetCode Data:", data)

      setUsernameGFG(data.username)
      setStars(data.stars)
      seteducation(data.education)
      const number = data.rank.match(/\d+/)[0]
      setrank(number)
      const languages = data.skills.split(",").map(lang => lang.trim())
      setskills(languages)
      setcontestRating(data.contestRating)
      const result = data.streak.split("/")[0]
      setstreak(result)
      setproblemNames(data.problemNames)

      const coloredLevels = data.difficultyLevels.map(level => ({
        ...level,
        color: getDifficultyColor(level.difficulty)
      }))
      // console(coloredLevels)
      setdifficultyLevels(coloredLevels)

      setHasAccount(true)
    } catch (error) {
      window.location.href = "/"
      console.error("Error fetching LeetCode data:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteLeetCodeAccount = async () => {
    try {
      if (currentUser && currentUser.GeeksforGeeks) {
        const leetid = currentUser.GeeksforGeeks
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/server/leetcode/delete-leetcode/${leetid}`
        )
      }
    } catch (error) {
      console.error("Error deleting LeetCode data:", error)
    }
  }

  const fetchUpdatedUser = async () => {
    try {
      if (!currentUser?._id) {
        // console("No valid user ID found")
        return
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/server/user/get-user/${currentUser._id}`
      )
      // console("111", response.data?.data)
      if (response.status === 200 && response.data?.data) {
        await updateProfile(response.data.data)
      } else {
        // console("Invalid response received")
      }
    } catch (error) {
      console.error("Unable to fetch user", error)
    }
  }

  useEffect(() => {
    if (!hasFetchedUser && currentUser) {
      setHasFetchedUser(true)
      fetchUpdatedUser()
    }
    fetchGFGCodeDataFromDB()
  }, [currentUser])

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1 -translate-y-1/2">
        <Loader />
        <p className="relative right-1/2">
          Wait upto minute, it needs some time...!
        </p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Hero Section */}
        <div className="relative py-20 px-4">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={geeksforgeeks2}
              alt="GeeksForGeeks Background"
              className={`w-full h-full object-cover ${
                isDarkMode ? "opacity-100" : "opacity-100"
              }`}
            />
          </div>
          <div className="container mt-10 mx-auto relative z-10">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="rounded-full bg-white px-4 py-3 mb-6"
              >
                <img
                  src={geeksforgeeks}
                  alt="geeksforgeeks"
                  className="h-12 w-25"
                ></img>
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl text-green-500 md:text-5xl font-bold mb-6"
              >
                GeeksForGeeks Profile
              </motion.h1>
              {!hasAccount ? (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Add GeeksForGeeks Account</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-xl text-green-500 font-semibold"
                ></motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {hasAccount ? (
          <>
            <section
              className={`py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="container mx-auto px-4">
                <h2
                  className={`text-3xl text-center font-bold mb-8 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  GeeksForGeeks UserId : {usernameGFG}
                </h2>

                {showRefresh && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={fetchGFGData}
                    className="flex justify-center items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors mx-auto w-fit"
                  >
                    <RefreshCwIcon className="h-5 w-5" />
                    <span>Refresh</span>
                  </motion.button>
                )}
              </div>
            </section>
            <div className="container mx-auto px-4 py-12">
              {/* Profile Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                {[
                  {
                    icon: <Trophy />,
                    label: "Contest Rating",
                    value: `${contestRating[2]}`
                  },
                  {
                    icon: <Trophy />,
                    label: "Coding Score",
                    value: `${contestRating[0]}`
                  },
                  {
                    icon: <Star />,
                    label: "Problem Solved",
                    value: `${contestRating[1]}`,
                    subtext: "Rising Star"
                  },
                  {
                    icon: <Award />,
                    label: "Institute Rank",
                    value: `${rank}`,
                    subtext: education
                  },
                  { icon: <Zap />, label: "Max Streak", value: `${streak}` }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl shadow-lg ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-green-500">{stat.icon}</div>
                      <div>
                        <div className="text-sm text-gray-500">
                          {stat.label}
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-gray-500">
                          {stat.subtext}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Problem Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-2xl font-bold mb-4">Problems Solved</h2>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={difficultyLevels}
                          cx="50%"
                          cy="40%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="solved"
                        >
                          {difficultyLevels.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={getDifficultyColor(entry.difficulty)}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDarkMode ? "white" : "black",
                            color: isDarkMode ? "black" : "white", // Text color inside tooltip
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "10px"
                          }}
                          itemStyle={{
                            color: isDarkMode ? "black" : "white" // Text color for items inside tooltip
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 -mt-12">
                      {difficultyLevels.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">
                            {item.difficulty}: {item.solved}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Language Distribution */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-2xl font-bold mb-6">Language Usage</h2>
                  <div className="space-y-4">
                    {skills.map((lang, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{lang}</span>
                          {/* <span>{lang.prcentage}</span> */}
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            // animate={{ width: `${lang.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-green-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Last Solved Problems */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <h2 className="text-2xl font-bold mb-6">Solved DSA Problems</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {problemNames.map((problem, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-200 ${
                            isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-50"
                          } transition-colors`}
                        >
                          <td className="py-3 px-4">{problem}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
            {ShowDelete && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setIsDeleteModal(true)}
                className="flex justify-center items-center space-x-2 mt-10 mb-5 px-6 py-4 bg-white text-red-600 rounded-full font-semibold hover:bg-blue-50 transition-colors mx-auto w-fit"
              >
                <DeleteIcon className="h-5 w-5" />
                <span>Remove GeeksForGeeks Account</span>
              </motion.button>
            )}
          </>
        ) : (
          <>
            <section
              className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: <Brain className="h-12 w-12 text-blue-500" />,
                      title: "2500+ Problems",
                      description:
                        "Access a vast collection of coding problems across various difficulty levels"
                    },
                    {
                      icon: <Trophy className="h-12 w-12 text-blue-500" />,
                      title: "Weekly Contests",
                      description:
                        "Participate in weekly coding competitions and improve your ranking"
                    },
                    {
                      icon: <Target className="h-12 w-12 text-blue-500" />,
                      title: "Interview Preparation",
                      description:
                        "Practice problems frequently asked in technical interviews"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-xl shadow-lg ${
                        isDarkMode ? "bg-gray-900" : "bg-gray-50"
                      }`}
                    >
                      <div className="mb-4">{feature.icon}</div>
                      <h3
                        className={`text-xl font-bold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {isModalOpen && (
          <GeeksforGeeksModal
            isModalOpen={isModalOpen}
            setToast={setToast}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {isDeleteModal && (
          <DeleteModal
            accid={currentUser.GeeksforGeeks}
            isDeleteModal={isDeleteModal}
            setIsDeleteModal={setIsDeleteModal}
            setToast={setToast}
            acc={"GeeksforGeeks"}
            id={currentUser._id}
          />
        )}
      </div>
      <Footer />
    </>
  )
}

export default GeeksforGeeks
