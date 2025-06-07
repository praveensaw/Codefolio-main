import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSpring, animated } from "@react-spring/web"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Github,
  Users,
  Star,
  ExternalLink,
  Key,
  Activity,
  Calendar,
  PlusCircle,
  Brain,
  Trophy,
  Target,
  RefreshCwIcon,
  DeleteIcon,
  Award,
  Code
} from "lucide-react"
import { useTheme } from "../App"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import GitHubModal1 from "../components/GitHubModal1"
import GitHubModal2 from "../components/GitHubModal2"
import Loader from "../components/Loader"
import axios from "axios"
import { useAuth } from "../Context/AuthProvider"
import { useParams } from "react-router-dom"
import ActivityCalender2 from "../components/ActivityCalender2"
import DeleteModal from "../components/DeleteModal"
import github2 from '../../public/images/github2.avif'

const GitHub = () => {
  const { username } = useParams()
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const { currentUser, updateProfile } = useAuth()
  const [loading, setloading] = useState(true)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [token, setToken] = useState("")
  const [auth, setAuths] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showContributions, setShowContributions] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasFetchedUser, setHasFetchedUser] = useState(false)
  const [showRefresh, setShowRefresh] = useState(false)
  const [hasAccount, setHasAccount] = useState(false)
  const [ShowDelete, setShowDelete] = useState(false)
  const [repos, setRepos] = useState([])
  const [collaboratedRepos, setCollaboratedRepos] = useState([])
  const [submissionCalendar2025, setsubmissionCalendar2025] = useState([])
  const [submissionCalendar2024, setsubmissionCalendar2024] = useState([])
  const [submissionCalendar2023, setsubmissionCalendar2023] = useState([])
  const [submissionCalendar2022, setsubmissionCalendar2022] = useState([])
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [active_days, setActiveDays] = useState(0)
  const [starred_repos, setStarredRepos] = useState(0)
  const [url, setUrl] = useState("")
  const [avatar, setAvatar] = useState("")
  const [bio, setBio] = useState("")
  const [gitUsername, setGitUsername] = useState("")
  const [totalContributions, settotalContributions] = useState(0)
  const [selectedYear, setSelectedYear] = useState(2025)

  const { isDarkMode } = useTheme()

  const setToast = msg => {
    if (msg.success) {
      toast.success(msg.text)
    } else {
      toast.error(msg.text)
    }
  }

  const setToast2 = msg => {
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

  const getLanguageColor = lang => {
    const languageColors = {
      JavaScript: "#f0db4f",
      Python: "#306998",
      Java: "#b07219",
      Ruby: "#701516",
      "C++": "#f34b7d",
      "C#": "#178600",
      PHP: "#4F5D95",
      TypeScript: "#2b7489",
      // add more languages and colors as needed
      default: "#999"
    }
    return languageColors[lang] || languageColors.default
  }

  const fetchGitHubData = async () => {
    setloading(true)
    try {
      let response = null

      // console(currentUser)
      if (currentUser) {
        if (currentUser?.username === username) {
          if (currentUser?.Github) {
            setShowRefresh(true)
            setShowDelete(true)
            response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/server/github/fetch-git/${username}`
            )
            setShowContributions(response.data.data.auth)
          } else {
            // console(hasAccount)
            setHasAccount(false)
            return
          }
        } else {
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/server/github/fetch-git/${username}`
          )
          setShowRefresh(false)
          setShowDelete(false)
        }
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/github/fetch-git/${username}`
        )
        setShowRefresh(false)
        setShowDelete(false)
      }

      if (!response || !response.data) {
        window.location.href = "/"
        return
      }

      const data = response.data.data
      // console(data)
      setShowContributions(data.auth)
      setHasAccount(true)
      setAuths(data.auth)
      setAvatar(data.avatar)
      setUrl(data.url)
      setCollaboratedRepos(data.collaborated_repos)
      setRepos(data.repos)
      setActiveDays(data.active_days)
      setStarredRepos(data.starred_repos)
      setBio(data.bio)
      setFollowers(data.followers)
      setFollowing(data.following)
      settotalContributions(data.totalContributions)
      setsubmissionCalendar2022(data.submissions.submissionCalendar2022)
      setsubmissionCalendar2023(data.submissions.submissionCalendar2023)
      setsubmissionCalendar2024(data.submissions.submissionCalendar2024)
      setsubmissionCalendar2025(data.submissions.submissionCalendar2025)
      setGitUsername(data.username)
    } catch (error) {
      console.error("Error fetching GitHub data:", error)
      window.location.href = "/"
    } finally {
      setloading(false)
    }
  }

  const fetchGitHubDataFromDB = async () => {
    // setloading(true);
    try {
      let response = null

      // console(currentUser)
      if (currentUser) {
        if (currentUser?.username === username) {
          if (currentUser?.Github) {
            setShowRefresh(true)
            setShowDelete(true)
            const geetid = currentUser?.Github
            response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/server/github/fetch-git-from-db/${geetid}`
            )
            setShowContributions(response.data.data.auth)
          } else {
            // console(hasAccount)
            setHasAccount(false)
            return
          }
        } else {
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/server/github/fetch-git/${username}`
          )
          setShowRefresh(false)
          setShowDelete(false)
        }
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/github/fetch-git/${username}`
        )
        setShowRefresh(false)
        setShowDelete(false)
      }

      if (!response || !response.data) {
        window.location.href = "/"
        return
      }
      const data = response.data.data

      setAvatar(data.avatar)
      setUrl(data.url)
      setCollaboratedRepos(data.collaborated_repos)
      setRepos(data.repos)
      setAuths(data.auth)
      setActiveDays(data.active_days)
      setStarredRepos(data.starred_repos)
      setBio(data.bio)
      setFollowers(data.followers)
      setFollowing(data.following)
      settotalContributions(data.totalContributions)
      setsubmissionCalendar2022(data.submissions.submissionCalendar2022)
      setsubmissionCalendar2023(data.submissions.submissionCalendar2023)
      setsubmissionCalendar2024(data.submissions.submissionCalendar2024)
      setsubmissionCalendar2025(data.submissions.submissionCalendar2025)
      setGitUsername(data.username)
      setHasAccount(true)
    } catch (error) {
      console.error("Error fetching GitHub data:", error)
      window.location.href = "/"
    } finally {
      setloading(false)
    }
  }

  const deleteGitHubAccount = async () => {
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
    // setloading(true);
    try {
      if (!currentUser?._id) {
        // console("No valid user ID found")
        return
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/server/user/get-user/${currentUser._id}`
      )
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
    fetchGitHubDataFromDB()
  }, [currentUser])

  useEffect(() => {
    // // console("Year Selected:", selectedYear);
    // // console("Data for Selected Year:", selectedData);
  }, [selectedYear, selectedData])

  const cardAnimation = useSpring({
    from: { transform: "scale(0.9)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 }
  })

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
        className={`min-h-screen mt-14 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
          }`}
      >
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`relative py-20 px-5 overflow-hidden ${isDarkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-sky-500 to-blue-600"
            }`}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={github2}
              alt="GitHub Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex justify-center mb-6"
            >
              <Github className="h-16 w-16 text-white" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-center text-white"
            >
              GitHub Profile
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
                <span>Add GitHub Account</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-4 border-black"
                  />
                  <div className="text-xl text-white font-semibold">
                    {username}
                  </div>
                </div>
                {currentUser?.username === username &&
                  currentUser?.Github &&
                  !showContributions && (
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      onClick={() => setShowTokenModal(true)}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 mx-auto"
                    >
                      <Key className="h-5 w-5" />
                      <span>Add GitHub Token for More Stats</span>
                    </motion.button>
                  )}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Repository Section */}
        {hasAccount && (
          <div className="container mx-auto px-4 py-12">
            {showRefresh && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={fetchGitHubData}
                className="flex justify-center items-center -mt-4 space-x-2 px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors mx-auto w-fit"
              >
                <RefreshCwIcon className="h-5 w-5" />
                <span>Refresh</span>
              </motion.button>
            )}
            <h2
              className={`text-3xl font-bold text-center mt-2 mb-14 md:mb-0 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              GitHub Repositories
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {repos.map((repo, index) => (
                <animated.div
                  key={index}
                  style={cardAnimation}
                  className={`p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform ${isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{repo.name}</h3>
                    <div className="flex space-x-2">
                      <a
                        href={repo.git_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      {repo.live_link && (
                        <a
                          href={repo.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p
                    className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                  >
                    {repo.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {repo.languages && (
                      <div className="flex flex-wrap items-center gap-4">
                        {repo.languages.map((lang, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: getLanguageColor(lang),
                              }}
                            />
                            <span className="text-sm">{lang}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{repo.starred}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div className="flex -space-x-2">
                      {repo.collaborators.map((collaborator, i) => (
                        <img
                          key={i}
                          src={collaborator.avatar_col}
                          alt={collaborator.name}
                          title={collaborator.name}
                          className="w-8 h-8 rounded-full border-2 border-white hover:cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                </animated.div>
              ))}
            </motion.div>

            {/* Contribution Section */}
            {auth && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 mb-5"
              >
                <h2
                  className={`text-3xl font-bold text-center -mt-2 mb-14 md:mb-0 ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  GitHub Statistics
                </h2>
                <div
                  className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}
                >
                  <h2 className="text-2xl font-bold mb-6">Contributions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div
                      className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                    >
                      <Activity className="h-8 w-8 text-green-500 mb-2" />
                      <div className="text-2xl font-bold">
                        {totalContributions}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total Contributions
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                    >
                      <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{active_days}</div>
                      <div className="text-sm text-gray-500">Days Active</div>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                    >
                      <Star className="h-8 w-8 text-yellow-500 mb-2" />
                      <div className="text-2xl font-bold">{starred_repos}</div>
                      <div className="text-sm text-gray-500">
                        Starred Repositories
                      </div>
                    </div>
                  </div>

                  <h2
                    className={`text-3xl font-bold text-center mt-2 mb-14 md:mb-0 ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    Collaborated GitHub Repositories
                  </h2>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {collaboratedRepos.map((repo, index) => (
                      <animated.div
                        key={index}
                        style={cardAnimation}
                        className={`p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform ${isDarkMode ? "bg-gray-800" : "bg-white"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold">{repo.name}</h3>
                          <div className="flex space-x-2">
                            <a
                              href={repo.git_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-blue-500 transition-colors"
                            >
                              <Github className="h-5 w-5" />
                            </a>
                            {repo.live_link && (
                              <a
                                href={repo.live_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-blue-500 transition-colors"
                              >
                                <ExternalLink className="h-5 w-5" />
                              </a>
                            )}
                          </div>
                        </div>
                        <p
                          className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                        >
                          {repo.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          {repo.languages && (
                            <div className="flex flex-wrap items-center gap-4">
                              {repo.languages.map((lang, index) => (
                                <div key={index} className="flex items-center space-x-1">
                                  <span
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor: getLanguageColor(lang),
                                    }}
                                  />
                                  <span className="text-sm">{lang}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Starred Count Section */}
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{repo.starred}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <div className="flex -space-x-2">
                            {repo.collaborators.map((collaborator, i) => (
                              <img
                                key={i}
                                src={collaborator.avatar_col}
                                alt={collaborator.name}
                                title={collaborator.name}
                                className="w-8 h-8 rounded-full border-2 border-white hover:cursor-pointer"
                              />
                            ))}
                          </div>
                        </div>
                      </animated.div>
                    ))}
                  </motion.div>

                  <section
                    className={`py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"
                      }`}
                  >
                    <h2
                      className={`text-3xl font-bold text-center -mt-2 mb-14 md:mb-0 ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      Contribution Activity
                    </h2>
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center px-4">
                      <select
                        value={selectedYear}
                        onChange={e => {
                          const year = parseInt(e.target.value)
                          // console("Year Selected:", year)
                          // console("Year Selected:", selectedData)
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
                    <ActivityCalender2
                      data={selectedData}
                      selectedYear={selectedYear}
                      isDarkMode={isDarkMode}
                      text={"contributions"}
                    />
                  </section>
                </div>

                {ShowDelete && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setIsDeleteModal(true)}
                    className="flex justify-center items-center space-x-2 mt-10 px-6 py-3 bg-white text-red-600 rounded-full font-semibold hover:bg-blue-50 transition-colors mx-auto w-fit"
                  >
                    <DeleteIcon className="h-5 w-5" />
                    <span>Remove GitHub Account</span>
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Features Section for non-connected users */}
        {!hasAccount && (
          <section className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Github className="h-12 w-12 text-blue-500" />,
                    title: "GitHub Repositories",
                    description:
                      "Showcase your top repositories and projects with detailed statistics and insights."
                  },
                  {
                    icon: <Code className="h-12 w-12 text-blue-500" />,
                    title: "Code Contributions",
                    description:
                      "Track your commit history, pull requests, and contributions to open source projects."
                  },
                  {
                    icon: <Award className="h-12 w-12 text-blue-500" />,
                    title: "Community Recognition",
                    description:
                      "Earn badges and recognition for your impactful contributions to the GitHub community."
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
                  >
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {feature.title}
                    </h3>
                    <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

        )}

        {/* Modals */}
        {isModalOpen && (
          <GitHubModal1
            isModalOpen={isModalOpen}
            setToast={setToast}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {showTokenModal && (
          <GitHubModal2
            showTokenModal={showTokenModal}
            setToast2={setToast2}
            setShowTokenModal={setShowTokenModal}
          />
        )}

        {isDeleteModal && (
          <DeleteModal
            accid={currentUser.Github}
            isDeleteModal={isDeleteModal}
            setIsDeleteModal={setIsDeleteModal}
            setToast={setToast}
            acc={"Github"}
            id={currentUser._id}
          />
        )}
      </div>
      <Footer />
    </>
  )
}

export default GitHub
