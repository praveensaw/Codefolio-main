import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import React, { useState } from "react"
import { useAuth } from "../Context/AuthProvider"
import { useTheme } from "../App"
import axios from "axios"

const GitHubModal2 = ({ showTokenModal, setToast2, setShowTokenModal }) => {
  const { currentUser } = useAuth()
  const { isDarkMode } = useTheme()
  const [token, setToken] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [notValid, setNotValid] = useState("")

  const handleTokenSubmit = async () => {
    setIsVerifying(true)
    setNotValid("")
    if (!currentUser) {
      return
    }
    if (token.trim() === "") {
      setIsVerifying(false)
      setNotValid("Please enter a valid Token of your account.")
      setToast2({
        success: false,
        text: "Please enter a valid Token of your account."
      })
      return
    }
    setToast2({
      success: true,
      text: "Verifying your GitHub Account Token..."
    })

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/server/github/add-github-advanced`,
        {
          pat: token,
          username: currentUser?.username
        }
      )

      if (response.data.success) {
        setToast2({
          success: true,
          text: "Your GitHub Token has been added successfully."
        })
        setShowTokenModal(false)
        window.location.reload()
      } else {
        setIsVerifying(false)
        setToast2({
          success: false,
          text: "Failed to add your GitHub Token. Please try again."
        })
      }
    } catch (error) {
      setIsVerifying(false)
      setToast2({
        success: false,
        text: "Failed to add your GitHub Token. Please try again."
      })
    }
  }

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
            onClick={() => setShowTokenModal(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-2xl p-8 max-w-md w-full`}
          >
            <button
              onClick={() => setShowTokenModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Add GitHub Token</h2>
            <p
              className={`mb-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Add your GitHub personal access token to see contribution
              statistics and more.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Personal Access Token
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="Enter your token"
                />
              </div>
              <button
                onClick={handleTokenSubmit}
                disabled={isVerifying}
                className={`w-full py-2 rounded-lg ${
                  isVerifying
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors`}
              >
                {isVerifying ? "Verifying..." : "Add Token"}
              </button>
              {notValid && (
                <p className="text-red-500 text-sm mt-2">{notValid}</p>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  )
}

export default GitHubModal2
