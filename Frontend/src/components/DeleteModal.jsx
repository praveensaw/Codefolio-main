import axios from "axios"
import React, { useState } from "react"

const DeleteModal = ({
  isDeleteModal,
  setIsDeleteModal,
  setToast,
  id,
  accid,
  acc
}) => {
  const [password, setPassword] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  // If modal is not active, don't render anything.
  if (!isDeleteModal) return null

  const handleVerify = async () => {
    if (!password) {
      setToast({ success: false, text: "Enter a valid Password!" })
      return
    }

    try {
      setIsVerifying(true)
      // Verify the password
      const verifyResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/server/user/verify-pass`,
        {
          password,
          id
        }
      )

      if (verifyResponse.data.success) {
        // Map account type to its deletion endpoint
        const endpoints = {
          LeetCode: `${import.meta.env.VITE_BACKEND_URL}/server/leetcode/delete-leetcode`,
          CodeForces:
            `${import.meta.env.VITE_BACKEND_URL}/server/codeforces/delete-codeforces`,
          CodeChef: `${import.meta.env.VITE_BACKEND_URL}/server/codechef/delete-codechef`,
          GeeksforGeeks:
            `${import.meta.env.VITE_BACKEND_URL}/server/gfg/delete-geeksforgeeks`,
          Github: `${import.meta.env.VITE_BACKEND_URL}/server/github/delete-github`
        }

        const endpoint = endpoints[acc] || endpoints.Github
        const deleteResponse = await axios.delete(`${endpoint}/${accid}`)

        if (deleteResponse.data.success) {
          setToast({
            success: true,
            text: `${acc} account deleted successfully`
          })
          setIsDeleteModal(false)
          window.location.reload()
        } else {
          setToast({ success: false, text: `Failed to delete ${acc} account` })
        }
      } else {
        setToast({ success: false, text: "Password is incorrect" })
      }
    } catch (error) {
      console.error("Error during verification/deletion:", error)
      setToast({ success: false, text: "An error occurred. Please try again." })
    } finally {
      setIsVerifying(false)
      setPassword("")
    }
  }

  // Close the modal when clicking on the backdrop
  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      setIsDeleteModal(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-md mx-auto p-6 transform transition-all duration-1000 ease-in-out smooth">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Verify Password
          </h2>
          <button
            onClick={() => setIsDeleteModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Enter Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your password"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsDeleteModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isVerifying}
            onClick={handleVerify}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
