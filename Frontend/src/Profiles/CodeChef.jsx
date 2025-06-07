import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Trophy,
  Globe,
  Flag,
  Star,
  Award,
  PlusCircle,
  RefreshCwIcon,
  DeleteIcon,
  Brain,
  Target
} from "lucide-react"
import { useTheme } from "../App"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAuth } from "../Context/AuthProvider"
import CodeChefModal from "../components/CodeChefModal" // Fixed incorrect import name
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Loader from "../components/Loader"
import axios from "axios"
import { useParams } from "react-router-dom"
import RatingGraph2 from "../components/RatingGraph2"
import ActivityCalendar from "../components/ActivityCalender"
import DeleteModal from "../components/DeleteModal"
import codechef from "../../public/images/codechef.png"
import codechef2 from "../../public/images/codechef2.avif"

const CodeChef = () => {
  const { username } = useParams()
  const [isDeleteModal, setIsDeleteModal] = useState()
  const { currentUser, updateProfile } = useAuth()
  const [countryName, setcountryName] = useState("")
  const { isDarkMode } = useTheme()
  const [globalRank, setglobalRank] = useState(0)
  const [countryRank, setcountryRank] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [problemSolved, setproblemSolved] = useState("")
  const [hasAccount, setHasAccount] = useState(true)
  const [stars, setStars] = useState("")
  const [contestRating, setcontestRating] = useState(0)
  const [highestcontestRating, sethighestcontestRating] = useState(0)
  const [contestParticipation, setcontestParticipation] = useState([])
  const [submissionCalendar2025, setsubmissionCalendar2025] = useState([])
  const [submissionCalendar2024, setsubmissionCalendar2024] = useState([])
  const [submissionCalendar2023, setsubmissionCalendar2023] = useState([])
  const [submissionCalendar2022, setsubmissionCalendar2022] = useState([])
  const [selectedYear, setSelectedYear] = useState(2025)
  const [loading, setloading] = useState(true)
  const [ShowRefresh, setShowRefresh] = useState(false)
  const [ShowDelete, setShowDelete] = useState(false)
  const [codeusername, setUsernameCode] = useState("")
  const [hasFetchedUser, setHasFetchedUser] = useState(false)

  const setToast = msg => {
    if (msg.success) {
      toast.success(msg.text)
    } else {
      toast.error(msg.text)
    }
  }

  const selectedData =
    selectedYear === 2025
      ? submissionCalendar2025
      : selectedYear === 2024
      ? submissionCalendar2024
      : selectedYear === 2023
      ? submissionCalendar2023
      : selectedYear === 2022
      ? submissionCalendar2022
      : submissionCalendar2025

  const fetchCodeChefData = async () => {
    setloading(true)
    try {
      let response = null

      if (currentUser) {
        if (currentUser?.username === username) {
          if (currentUser?.CodeChef) {
            setShowRefresh(true)
            setShowDelete(true)
            //this is self account and logged in
            response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/server/codechef/fetch-codechef/${username}`
            )
          } else {
            //account not added
            // console(hasAccount)
            setHasAccount(false)
            return
          }
        } else {
          //not self account and logged in
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/server/codechef/fetch-codechef/${username}`
          )
          setShowRefresh(false)
          setShowDelete(false)
        }
      } else {
        //not self account and not logged in
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/codechef/fetch-codechef/${username}`
        )
        setShowRefresh(false)
        setShowDelete(false)
      }

      if (!response || !response.data) {
        window.location.href = "/"
        return
      }
      const data = response.data.data
      // console("LeetCode Data:", data)

      setUsernameCode(data.username)
      setStars(data.stars)
      setglobalRank(data.globalRank)
      setcountryName(data.countryName)
      setcountryRank(data.countryRank)
      setcontestRating(data.currentRating)
      sethighestcontestRating(data.highestRating)
      // setproblemSolved(data.problemSolved)
      setcontestParticipation(data.contests || [])

      // Parse submission calendars
      const parseSubmissions = submissions => {
        return (submissions || []).map(datao => ({
          // Extract the date part only from the full date string
          date: new Date(datao.date).toISOString().split("T")[0],
          value: datao.value
        }))
      }

      const parseSubmissions2 = submissions => {
        return (submissions || []).map(datao => {
          const parsedDate = new Date(
            datao.end_date.includes(" ")
              ? datao.end_date.replace(" ", "T")
              : datao.end_date
          )
          return {
            date: parsedDate.toISOString().split("T")[0],
            rating: datao.rating,
            rank: datao.rank,
            name: datao.name
          }
        })
      }

      setsubmissionCalendar2025(parseSubmissions(data.ActivityCalender2025))
      setsubmissionCalendar2024(parseSubmissions(data.ActivityCalender2024))
      setsubmissionCalendar2023(parseSubmissions(data.ActivityCalender2023))
      setsubmissionCalendar2022(parseSubmissions(data.ActivityCalender2022))
      setcontestParticipation(parseSubmissions2(data.contests) || [])

      setHasAccount(true)
    } catch (error) {
      window.location.href = "/"
      console.error("Error fetching LeetCode data:", error)
    } finally {
      setloading(false)
    }
  }

  const fetchCodeChefDataFromDB = async () => {
    try {
      let response = null

      // console(currentUser)
      if (currentUser) {
        if (currentUser?.username === username) {
          if (currentUser?.CodeChef) {
            setShowRefresh(true)
            setShowDelete(true)
            const codechefid = currentUser?.CodeChef
            response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/server/codechef/fetch-codechef-from-db/${codechefid}`
            )
          } else {
            // console(hasAccount)
            setHasAccount(false)
            return
          }
        } else {
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/server/codechef/fetch-codechef/${username}`
          )
          setShowRefresh(false)
          setShowDelete(false)
        }
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/codechef/fetch-codechef/${username}`
        )
        setShowRefresh(false)
        setShowDelete(false)
      }

      // console(response)
      if (!response || !response.data || response.status !== 200) {
        window.location.href = "/"
        return
      }

      const data = response.data.data
      // console("LeetCode Data:", data)

      setUsernameCode(data.username)
      setStars(data.stars)
      setglobalRank(data.globalRank)
      setcountryName(data.countryName)
      setcountryRank(data.countryRank)
      setcontestRating(data.currentRating)
      sethighestcontestRating(data.highestRating)
      // setproblemSolved(data.problemSolved)
      setcontestParticipation(data.contests || [])

      // Parse submission calendars
      const parseSubmissions = submissions => {
        return (submissions || []).map(datao => ({
          // Extract the date part only from the full date string
          date: new Date(datao.date).toISOString().split("T")[0],
          value: datao.value
        }))
      }

      const parseSubmissions2 = submissions => {
        return (submissions || []).map(datao => {
          // Handle date formats and parse the date correctly
          const parsedDate = new Date(
            datao.end_date.includes(" ")
              ? datao.end_date.replace(" ", "T")
              : datao.end_date
          )
          return {
            date: parsedDate.toISOString().split("T")[0],
            rating: datao.rating,
            rank: datao.rank,
            name: datao.name
          }
        })
      }

      setsubmissionCalendar2025(parseSubmissions(data.ActivityCalender2025))
      setsubmissionCalendar2024(parseSubmissions(data.ActivityCalender2024))
      setsubmissionCalendar2023(parseSubmissions(data.ActivityCalender2023))
      setsubmissionCalendar2022(parseSubmissions(data.ActivityCalender2022))
      setcontestParticipation(parseSubmissions2(data.contests) || [])
      // console(parseSubmissions2(data.contests))

      setHasAccount(true)
    } catch (error) {
      window.location.href = "/"
      console.error("Error fetching LeetCode data:", error)
    } finally {
      setloading(false)
    }
  }

  const deleteLeetCodeAccount = async () => {
    try {
      if (currentUser && currentUser.LeetCode) {
        const leetid = currentUser.LeetCode
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
    fetchCodeChefDataFromDB()
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
        className={`min-h-screen mt-10 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`relative py-20 px-5 overflow-hidden ${
            isDarkMode
              ? "bg-gray-900"
              : "bg-gradient-to-br from-sky-500 to-blue-600"
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={codechef2}
              alt="Coding Background"
              className={`w-full h-full object-cover ${
                isDarkMode ? "opacity-10" : "opacity-2"
              }`}
            />
          </div>
          <div className="container mx-auto relative z-10 mt-10">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="rounded-full bg-white p-1 py-3 mb-6"
              >
                <img src={codechef} className="h-12 w-25" alt="CodeChef"></img>
                {/* <ChefHat className="h-12 w-12 text-blue-600" /> */}
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-white text-center mb-6"
              >
                CodeChef Profile
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-white text-center max-w-3xl mb-8"
              >
                Track your progress and showcase your problem-solving skills
              </motion.p>
              {!hasAccount && (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Add CodeChef Account</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.section>
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
                  CodeChef UserId : {codeusername}
                </h2>

                {ShowRefresh && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={fetchCodeChefData}
                    className="flex justify-center items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors mx-auto w-fit"
                  >
                    <RefreshCwIcon className="h-5 w-5" />
                    <span>Refresh</span>
                  </motion.button>
                )}
              </div>
            </section>
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {[
                  {
                    icon: <Trophy />,
                    label: "Current Rating",
                    value: contestRating,
                    subtext: `${stars[0]}★`
                  },
                  {
                    icon: <Award />,
                    label: "Highest Rating",
                    value: highestcontestRating,
                    subtext: "Peak Performance"
                  },
                  {
                    icon: <Globe />,
                    label: "Global Rank",
                    value: `#${globalRank}`,
                    subtext: "Top 5%"
                  },
                  {
                    icon: <Flag />,
                    label: "Country Rank",
                    value: `#${countryRank}`,
                    subtext: countryName
                  }
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
                      <div className="text-orange-500">{stat.icon}</div>
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

              {/* Stars Section */}
              <div
                className={`p-6 rounded-xl mb-12 flex flex-col items-center ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                {/* Headline */}
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Stars Earned
                </h2>

                {/* Stars Wrapper - Centered Horizontally */}
                <div className="flex justify-center space-x-2 pb-4">
                  {[...Array(5)].map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-center flex-shrink-0 p-4 rounded-lg ${
                        index < parseInt(stars[0])
                          ? "bg-orange-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          index < parseInt(stars[0])
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
              <section
                className={`py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <h2
                  className={`text-3xl text-center font-bold mb-8 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Contest Ratings
                </h2>
                <RatingGraph2
                  data={contestParticipation}
                  isDarkMode={isDarkMode}
                />
              </section>

              <section
                className={`py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <h2
                  className={`text-3xl font-bold  text-center mb-8 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Activity Heatmap
                </h2>
                <div className="flex justify-between items-center px-4">
                  <select
                    value={selectedYear}
                    onChange={e => {
                      const year = parseInt(e.target.value)
                      // console("Year Selected:", year)
                      setSelectedYear(year)
                    }}
                    className="px-4 py-2 border rounded-lg text-gray-700 bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                  </select>
                </div>
                <ActivityCalendar
                  data={selectedData}
                  selectedYear={selectedYear}
                  isDarkMode={isDarkMode}
                />
              </section>
              {ShowDelete && (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setIsDeleteModal(true)}
                  className="flex justify-center items-center space-x-2 mt-10 px-6 py-3 bg-white text-red-600 rounded-full font-semibold hover:bg-blue-50 transition-colors mx-auto w-fit"
                >
                  <DeleteIcon className="h-5 w-5" />
                  <span>Remove CodeChef Account</span>
                </motion.button>
              )}
            </div>
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
          <CodeChefModal
            isModalOpen={isModalOpen}
            setToast={setToast}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {isDeleteModal && (
          <DeleteModal
            accid={currentUser.CodeChef}
            isDeleteModal={isDeleteModal}
            setIsDeleteModal={setIsDeleteModal}
            setToast={setToast}
            acc={"CodeChef"}
            id={currentUser._id}
          />
        )}
      </div>
      <Footer />
    </>
  )
}

export default CodeChef
