import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Trophy,
  Flag,
  Award,
  PlusCircle,
  RefreshCwIcon,
  DeleteIcon,
  Brain,
  Target,
  Badge
} from "lucide-react"
import CodeforcesGraph from "../components/codeforcesgraph"
import { useTheme } from "../App"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAuth } from "../Context/AuthProvider"
import CodeforcesModal from "../components/CodeforcesModal"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Loader from "../components/Loader"
import axios from "axios"
import { useParams } from "react-router-dom"
import ActivityCalendar from "../components/ActivityCalender"
import { PieChartCodeForces } from "../components/PieChartCodeForces"
import DeleteModal from "../components/DeleteModal"
import codeforces from "../../public/images/codeforces.png"
import codeforces2 from "../../public/images/codeforces2.avif"

const Codeforces = () => {
  const { username } = useParams()
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const { currentUser, updateProfile } = useAuth()
  const { isDarkMode } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasAccount, setHasAccount] = useState(false)
  const [loading, setloading] = useState(true)
  const [ShowRefresh, setShowRefresh] = useState(false)
  const [ShowDelete, setShowDelete] = useState(false)
  const [hasFetchedUser, setHasFetchedUser] = useState(false)

  // Codeforces specific states
  const [cfUsername, setCfUsername] = useState("")
  const [rating, setRating] = useState(0)
  const [maxRating, setMaxRating] = useState(0)
  const [rank, setRank] = useState("")
  const [maxRank, setMaxRank] = useState("")
  const [countryName, setCountryName] = useState("")
  const [problemsSolved, setProblemsSolved] = useState(0)
  const [problemsSolvedByRating, setProblemSolvedByRating] = useState([])
  const [selectedYear, setSelectedYear] = useState(2025)
  const [organization, setOrganization] = useState("")
  const [contestParticipation, setContestParticipation] = useState([])
  const [submissionCalendar2025, setSubmissionCalendar2025] = useState([])
  const [submissionCalendar2024, setSubmissionCalendar2024] = useState([])
  const [submissionCalendar2023, setSubmissionCalendar2023] = useState([])
  const [submissionCalendar2022, setSubmissionCalendar2022] = useState([])

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

  const setToast = msg => {
    if (msg.success) {
      toast.success(msg.text)
    } else {
      toast.error(msg.text)
    }
  }

  const fetchCodeforcesData = async () => {
    setloading(true)
    try {
      let response = null

      if (currentUser) {
        if (currentUser?.username === username) {
          if (currentUser?.CodeForces) {
            setShowRefresh(true)
            setShowDelete(true)
            response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/fetch/${username}`
            )
          } else {
            // Account not added
            // console(hasAccount)
            setHasAccount(false)
            return
          }
        } else {
          // Not self account and logged in
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/fetch/${username}`
          )
          setShowRefresh(false)
          setShowDelete(false)
        }
      } else {
        // Not self account and not logged in
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/fetch/${username}`
        )
        setShowRefresh(false)
        setShowDelete(false)
      }

      if (!response || !response.data || response.status !== 200) {
        window.location.href = "/"
        return
      }

      const data = response.data.data
      // console("Codeforces Data:", data)

      setCfUsername(data?.username)
      setMaxRating(data?.maxRating)
      setRating(data?.currentRating)
      setRank(data?.rank || "Unranked")
      setMaxRank(data?.maxRank || "Unranked")
      setOrganization(data?.organization)
      setCountryName(data?.country)
      setProblemsSolved(data?.problemSolved)
      setProblemSolvedByRating(data?.problemsSolvedByRating)
      setSubmissionCalendar2025(data.submissions.submissionCalendar2025)
      setSubmissionCalendar2024(data.submissions.submissionCalendar2024)
      setSubmissionCalendar2023(data.submissions.submissionCalendar2023)
      setSubmissionCalendar2022(data.submissions.submissionCalendar2022)
      setContestParticipation(data.contests)

      setHasAccount(true)
    } catch (error) {
      window.location.href = "/"
      console.error("Error fetching Codeforces data:", error)
    } finally {
      setloading(false)
    }
  }

  const fetchCodeforcesDatafromDB = async () => {
    try {
      let response = null

      if (currentUser) {
        if (currentUser?.username === username) {
          if (currentUser?.CodeForces) {
            setShowRefresh(true)
            setShowDelete(true)
            const codeforcesid = currentUser?.CodeForces
            response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/fetch-codeforces-from-db/${codeforcesid}`
            )
          } else {
            // Account not added
            // console(hasAccount)
            setHasAccount(false)
            return
          }
        } else {
          // Not self account and logged in
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/fetch/${username}`
          )
          setShowRefresh(false)
          setShowDelete(false)
        }
      } else {
        // Not self account and not logged in
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/fetch/${username}`
        )
        setShowRefresh(false)
        setShowDelete(false)
      }

      if (!response || !response.data || response.status !== 200) {
        window.location.href = "/"
        return
      }

      const data = response.data.data
      // console("Codeforces Data:", data)

      setCfUsername(data?.username)
      setMaxRating(data?.maxRating)
      setRating(data?.currentRating)
      setRank(data?.rank || "Unranked")
      setMaxRank(data?.maxRank || "Unranked")
      setOrganization(data?.organization)
      setCountryName(data?.country)
      setProblemsSolved(data?.problemSolved)
      setProblemSolvedByRating(data?.problemsSolvedByRating)
      setSubmissionCalendar2025(data.submissions.submissionCalendar2025)
      setSubmissionCalendar2024(data.submissions.submissionCalendar2024)
      setSubmissionCalendar2023(data.submissions.submissionCalendar2023)
      setSubmissionCalendar2022(data.submissions.submissionCalendar2022)
      setContestParticipation(data.contests)

      setHasAccount(true)
    } catch (error) {
      window.location.href = "/"
      console.error("Error fetching Codeforces data:", error)
    } finally {
      setloading(false)
    }
  }

  const deleteCodeforcesAccount = async () => {
    setloading(true)
    try {
      if (currentUser && currentUser.CodeForces) {
        const cfId = currentUser.CodeForces
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/delete-codeforces/${cfId}`
        )
        setToast("Codeforces account removed successfully")
        fetchUpdatedUser()
      }
    } catch (error) {
      console.error("Error deleting Codeforces data:", error)
      setToast("Failed to remove Codeforces account", "error")
    } finally {
      setloading(false)
    }
  }

  const fetchUpdatedUser = async () => {
    try {
      if (!currentUser?._id) return

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/server/user/get-user/${currentUser._id}`
      )
      if (response.status === 200 && response.data?.data) {
        await updateProfile(response.data.data)
      }
    } catch (error) {
      console.error("Unable to fetch user", error)
      setToast("Failed to update user data", "error")
    }
  }

  useEffect(() => {
    if (!hasFetchedUser && currentUser) {
      setHasFetchedUser(true)
      fetchUpdatedUser()
    }
    fetchCodeforcesDatafromDB()
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
            isDarkMode ? "bg-gray-900" : "bg-gradient-to-br to-indigo-600"
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={codeforces2}
              alt="Coding Background"
              className={`w-full h-full object-cover ${
                isDarkMode ? "opacity-100" : "opacity-100"
              }`}
            />
          </div>
          <div className="container mx-auto relative z-10 mt-10">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="rounded-full bg-white px-4 py-4 mb-6"
              >
                <img
                  src={codeforces}
                  alt="codeforces"
                  className="h-12 w-25"
                ></img>
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-white text-center mb-6"
              >
                Codeforces Profile
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-white text-center max-w-3xl mb-8"
              >
                Track your competitive programming journey
              </motion.p>
              {!hasAccount && (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Add Codeforces Account</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.section>
        {/* change */}
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
                  Codeforces Handle: {cfUsername}
                </h2>

                {ShowRefresh && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={fetchCodeforcesData}
                    className="flex justify-center items-center space-x-2 px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-colors mx-auto w-fit"
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
                    value: rating || "",
                    subtext: rank
                  },
                  {
                    icon: <Award />,
                    label: "Max Rating",
                    value: maxRating || "",
                    subtext: maxRank
                  },
                  {
                    icon: <Badge />,
                    label: "Rank",
                    value: rank ? rank : "",
                    subtext: "Codeforces Title"
                  },
                  {
                    icon: <Flag />,
                    label: "Country",
                    value: countryName || ""
                  },
                  {
                    icon: <Badge />,
                    label: "Organization",
                    value: organization ? organization : ""
                  }
                ].map(
                  (stat, index) =>
                    stat.value !== "" && (
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
                          <div className="text-indigo-500">{stat.icon}</div>
                          <div>
                            <div className="text-sm text-gray-500">
                              {stat.label}
                            </div>
                            <div className="text-2xl font-bold">
                              {stat.value}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stat.subtext}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                )}
              </div>
              <div
                className={`p-6 rounded-xl mb-12 text-center ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <h2 className="text-2xl font-bold mb-6">
                  Problem Solving Stats
                </h2>

                {/* Flexbox container to center everything */}
                <div className="flex flex-wrap justify-center gap-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center justify-center w-40 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md"
                  >
                    <div className="text-3xl font-bold text-indigo-500">
                      {problemsSolved}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Solved
                    </div>
                  </motion.div>
                </div>
              </div>

              <div>
                {problemsSolvedByRating && (
                  <PieChartCodeForces
                    problemsSolvedByRating={problemsSolvedByRating}
                    isDarkTheme={isDarkMode}
                  />
                )}
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
                <CodeforcesGraph
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
                {/* <SubmissionCalendar handle={cfUsername} isDarkMode={isDarkMode} selectedYear={selectedYear} /> */}
              </section>

              {ShowDelete && (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setIsDeleteModal(true)}
                  className="flex justify-center items-center space-x-2 mt-10 px-6 py-3 bg-white text-red-600 rounded-full font-semibold hover:bg-indigo-50 transition-colors mx-auto w-fit"
                >
                  <DeleteIcon className="h-5 w-5" />
                  <span>Remove Codeforces Account</span>
                </motion.button>
              )}
            </div>
          </>
        ) : (
          <section
            className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Brain className="h-12 w-12 text-blue-500" />,
                    title: "Competitive Programming",
                    description:
                      "Participate in regular contests and improve your problem-solving skills"
                  },
                  {
                    icon: <Trophy className="h-12 w-12 text-blue-500" />,
                    title: "Global Rankings",
                    description:
                      "Compete with programmers worldwide and climb the global leaderboard"
                  },
                  {
                    icon: <Target className="h-12 w-12 text-blue-500" />,
                    title: "Advanced Problems",
                    description:
                      "Challenge yourself with complex algorithmic problems"
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
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {isModalOpen && (
          <CodeforcesModal
            isModalOpen={isModalOpen}
            setToast={setToast}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {isDeleteModal && (
          <DeleteModal
            accid={currentUser.CodeForces}
            isDeleteModal={isDeleteModal}
            setIsDeleteModal={setIsDeleteModal}
            setToast={setToast}
            acc={"CodeForces"}
            id={currentUser._id}
          />
        )}
      </div>
      <Footer />
    </>
  )
}

export default Codeforces
