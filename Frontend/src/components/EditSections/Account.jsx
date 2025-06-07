import { Pencil, Save } from "lucide-react"
import React, { useState } from "react"
import { useAuth } from "../../Context/AuthProvider"
import axios from "axios"
import { useTheme } from "../../App"
import { ToastContainer, toast } from "react-toastify"

const Account = () => {
  const { isDarkMode } = useTheme()
  const { currentUser, updateProfile } = useAuth()
  const [loading,setLoading]=useState(false);

  const [fields, setFields] = useState({
    linkedin: currentUser?.userProfile?.linkedin,
    github: currentUser?.userProfile?.github,
    leetcode: currentUser?.userProfile?.leetcode,
    twitter: currentUser?.userProfile?.twitter,
    codeforces: currentUser?.userProfile?.codeforces,
    codechef: currentUser?.userProfile?.codechef,
    geeksforgeeks: currentUser?.userProfile?.geeksforgeeks
  })

  const [editMode, setEditMode] = useState(false)

  const handleChange = (field, value) => {
    setFields(prev => ({ ...prev, [field]: value }))
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
      if (response.status === 200 && response.data?.data) {
        await updateProfile(response.data.data)
      } else {
        // console("Invalid response received")
      }
    } catch (error) {
      console.error("Unable to fetch user", error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    const id = currentUser._id
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/server/user/edituser/${id}`,
      fields
    )
    if (response.data.success) {
      await fetchUpdatedUser()
      toast.success("Profile updated successfully ..!")
      setEditMode(false)
      // console("User updated successfully")
    } else {
      toast.success("Failed to update Profile ..!")
    }
    setLoading(false);
  }

  return (
    <>
      <div
        className={`rounded-xl shadow-sm p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <h3
          className={`text-lg font-semibold mb-6 ${isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
        >
          Accounts Information
        </h3>
        {/* <button
          onClick={() => (editMode ? setEditMode(false) : setEditMode(true))}
          className={`p-2 ${
            isDarkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Pencil size={18} />
        </button> */}
        <div className="space-y-6">
          {/* LinkedIn Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              LinkedIn Profile
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="text"
                value={fields.linkedin}
                onChange={e => handleChange("linkedin", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>
          {/* X (Twitter) Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              X (Twitter) Profile
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="text"
                value={fields.twitter}
                onChange={e => handleChange("twitter", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>
          {/* GitHub Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              GitHub Profile
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="text"
                value={fields.github}
                onChange={e => handleChange("github", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>
          {/* LeetCode Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              LeetCode Profile
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="text"
                value={fields.leetcode}
                onChange={e => handleChange("leetcode", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>
          {/* CodeChef Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              CodeChef Profile
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="text"
                value={fields.codechef}
                onChange={e => handleChange("codechef", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>
          {/* CodeForces Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              CodeForces Profile
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="text"
                value={fields.codeforces}
                onChange={e => handleChange("codeforces", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>
          {/* GeeksforGeeks Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              GeeksforGeeks Profile
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="text"
                value={fields.geeksforgeeks}
                onChange={e => handleChange("geeksforgeeks", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>
          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              disabled={loading}
              onClick={handleSave}
              className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 flex items-center space-x-2"
            >
              <Save size={18} />
              <span>Save Accounts Info</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Account
