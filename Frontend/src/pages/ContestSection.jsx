import { useState, useEffect } from "react"
import axios from "axios"
import { useTheme } from "../App"

const ContestCard = ({ contest, isDarkMode, type }) => {
  function handleNavi() {
    if (type === "CodeForces") {
      window.location.href = "https://codeforces.com/contests"
    } else {
      window.location.href = "https://www.codechef.com/contests"
    }
  }
  return (
    <div
      className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 relative border ${
        isDarkMode
          ? "border-gray-500 bg-gray-800 text-white"
          : "border-gray-700 bg-white text-black"
      }`}
    >
      <p className="text-center mb-4">
        <span className="font-bold">
          {contest.contest_name || contest.name}
        </span>
      </p>
      <p className="text-center mb-2">
        <span className="font-bold">Start Time: </span>
        {new Date(
          contest.contest_start_date_iso || contest.startTime
        ).toLocaleString()}
      </p>
      <p className="text-center mb-4">
        <span className="font-bold">Duration: </span>
        {contest.contest_duration
          ? `${Math.floor(contest.contest_duration / 60)} hours`
          : `${Math.floor(contest.duration / 3600)} hours ${(contest.duration %
              3600) /
              60} minutes`}
      </p>
      <div className="text-center">
        <button
          onClick={handleNavi}
          className={`px-4 py-2 rounded-2xl border ${
            isDarkMode
              ? "dark:bg-gray-800 border-gray-400 hover:bg-gray-700 text-white"
              : "bg-gray-200 border-black hover:bg-gray-300"
          } transition-all`}
        >
          Enter Contest
        </button>
      </div>
      <div
        className={`absolute inset-0 rounded-xl blur-lg opacity-50 ${
          isDarkMode
            ? "dark:bg-gradient-to-r from-blue-500 to-black-500"
            : "bg-gradient-to-r from-blue-400 to-blue-600"
        } z-[-1]`}
      ></div>
    </div>
  )
}

const ContestSection = () => {
  const [codeforcesData, setCodeforcesData] = useState([])
  const [codechefData, setCodechefData] = useState([])
  const [loading, setLoading] = useState(true)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const fetchContests = async () => {
      try {
        // Fetch Codeforces contests
        const codeforcesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/contestfetch`
        )
        if (codeforcesResponse.data.success) {
          setCodeforcesData(codeforcesResponse.data.contest)
        }
        // console(codeforcesResponse.data.contest)

        // Fetch CodeChef contests
        const codechefResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/codechef/contestfetch`
        )
        if (codechefResponse.data.success) {
          setCodechefData(codechefResponse.data.contests)
        }
      } catch (error) {
        console.error("Failed to fetch contests", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContests()
  }, [])

  if (loading) {
    return (
      <div className="text-center font-extrabold text-4xl">Loading ...</div>
    )
  }

  return (
    <div
      className={`min-h-screen py-10 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2 className="text-3xl font-bold text-center mb-8">Upcoming Contests</h2>

      {/* Codeforces Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-center mb-6">
          Codeforces Contests
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
          {codeforcesData.map((contest, index) => (
            <ContestCard
              key={`cf-${index}`}
              contest={contest}
              type={"CodeForces"}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>

      {/* CodeChef Section */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-6">
          CodeChef Contests
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
          {codechefData.map((contest, index) => (
            <ContestCard
              key={`cc-${index}`}
              contest={contest}
              type={"CodeChef"}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContestSection
