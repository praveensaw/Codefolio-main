import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useTheme } from "../App"
import axios from "axios"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../Context/AuthProvider"

const CodeforcesModal = ({ isModalOpen, setToast, setIsModalOpen }) => {
  const { currentUser } = useAuth()
  const { isDarkMode } = useTheme()
  const [username, setUsername] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [notValid, setNotValid] = useState("")
  const [verificationStep1, setVerificationStep1] = useState("")
  const [verificationStep2, setVerificationStep2] = useState("")
  const [verificationStep3, setVerificationStep3] = useState("")
  const [showRefresh, setShowRefresh] = useState(false)
  const [Problem, setProblem] = useState(0)
  const [Account, setAccount] = useState("")
  const [iShow, setIsShow] = useState(false)
  const [iShow2, setIsShow2] = useState(false)

  useEffect(() => {
    if (isVerifying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setVerificationStep1("Time's up! Click refresh to check submission.")
      setVerificationStep2("")
      setVerificationStep3("")
      setShowRefresh(true)
    }
  }, [isVerifying, timeLeft])

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}s`
  }

  const handleVerify = async () => {
    setAccount("")
    setVerificationStep1("")
    setVerificationStep2("")
    setVerificationStep3("")
    setNotValid("")
    setIsShow(true)
    if (username.trim() === "") {
      setNotValid("Please enter a valid username.")
      setToast({
        success: false,
        text: "Please enter a valid username."
      })
      setIsShow(false)
      return
    }

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/fetch-codeforces/${username}`
    )
    // console(response)
    if (response.data.success) {
      setToast({
        success: true,
        text: "CodeForces account found..!"
      })
      setProblem(response.data.data.submissions + 1)
      setIsVerifying(true)
      setAccount("")
      setVerificationStep1(
        `1) Visit Codeforces and solve problem number 2067A.`
      )
      setVerificationStep2("2) Click on the submit (make compile time error).")
      setVerificationStep3(
        "3)  Do this within time and click on refresh after time ends !"
      )
    } else {
      // console("hiii")
      setToast({
        success: false,
        text: "CodeForces account not found..!"
      })
      setAccount("Codeforces Account does not exist!")
    }
    setIsShow(false)
  }

  const handleRefresh = async () => {
    setToast({
      success: true,
      text: "Verification Started"
    })
    setIsShow2(true)
    setIsVerifying(true)
    setVerificationStep1("")
    setVerificationStep2("")
    setVerificationStep3("")
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/fetch-codeforces/${username}`
    )
    if (response.data.success) {
      if (response.data.data.submissions === Problem) {
        setVerificationStep1("Problem submitted successfully! 🎉")
        setToast({
          success: true,
          text: "Submission found"
        })
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/add-codeforces`,
            {
              username: username,
              email: currentUser?.email
            }
          )
          if (response.data) {
            setToast({
              success: true,
              text: "Verification Successfull"
            })
            setIsModalOpen(false)
            window.location.reload()
          } else {
            setIsShow2(false)
            setIsVerifying(false)
            setToast({
              success: false,
              text: "Verification Failed, try again later.."
            })
          }
        } catch (error) {
          setIsShow2(false)
          setIsVerifying(false)
          setToast({
            success: false,
            text: "Verification Failed, try again later.."
          })
        }
      } else {
        setIsShow2(false)
        setIsVerifying(false)
        setVerificationStep1("No submission found. Try again.")
        setToast({
          success: false,
          text: "Submission not found"
        })
      }
    }
    // setIsVerifying(false);
    // setShowRefresh(false);
    // setIsShow2(false);
    setIsModalOpen(false)
    window.location.reload()
  }

  return (
    <AnimatePresence>
      <ToastContainer position="top-right" autoClose={3000} />
      {isModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setIsModalOpen(false)}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={`relative w-full max-w-md p-6 rounded-2xl shadow-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className={`absolute right-4 top-4 p-1 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X
                  className={`h-5 w-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </button>
              <h3
                className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Add Codeforces Account
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Codeforces Username
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter your username"
                      disabled={isVerifying}
                    />
                    {iShow ? (
                      <svg
                        className="animate-spin h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : (
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={handleVerify}
                        disabled={isVerifying}
                      >
                        {isVerifying ? "Verifying..." : "Verify"}
                      </button>
                    )}
                  </div>
                  <p className="text-sm mt-2 text-red-500">{Account}</p>
                  <p className="text-sm mt-2 text-red-500">{notValid}</p>
                  <p className="text-sm mt-2 text-gray-500">
                    {verificationStep1}
                    {verificationStep1 !== "" && (
                      <a
                        href="https://codeforces.com/problemset/problem/2067/A"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Click here
                      </a>
                    )}
                  </p>
                  <p className="text-sm mt-2 text-gray-500">
                    {verificationStep2}
                  </p>
                  <p className="text-sm mt-2 text-gray-500">
                    {verificationStep3}
                  </p>
                  {isVerifying && (
                    <p className="text-red-500">
                      Time left: {formatTime(timeLeft)}
                    </p>
                  )}
                  {iShow2 ? (
                    <svg
                      className="animate-spin h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : showRefresh === true ? (
                    <button
                      onClick={handleRefresh}
                      className="mt-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Refresh
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CodeforcesModal
