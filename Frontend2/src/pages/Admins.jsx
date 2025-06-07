import React, { useEffect, useState } from "react"
import {
    Shield,
    Search,
    MoreVertical,
    UserCheck,
    UserX,
    X,
    Lock
} from "lucide-react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../App";

function Admins() {
    const [admins, setAdmins] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [password, setPassword] = useState("")
    const [selectedAdmin, setSelectedAdmin] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const { isDarkMode } = useTheme();

    // Fetch admins from backend

    const fetchAdmins = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/get-admins`)
            setAdmins(response.data || [])
        } catch (error) {
            console.error("Error fetching admins:", error)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [])

    const openAccessModal = adminId => {
        setSelectedAdmin(adminId)
        setPassword("")
        setError("")
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedAdmin(null)
        setPassword("")
        setError("")
    }

    const handleAccessChange = async () => {
        setLoading(true)
        const correctPassword = "admin@123"

        if (password === correctPassword && selectedAdmin !== null) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/change-admin/status/${selectedAdmin}`)
                if (response.data.success) {
                    toast.success("Access changed !")
                }
            } catch (error) {
                console.error("Error fetching admins:", error)
            }
            fetchAdmins();
            closeModal()
        } else {
            toast.error("Failer to changed access !")
            setError("Incorrect password. Please try again.")
        }
        setLoading(false);
    }

    console.log(admins);

    const filteredAdmins = admins ? admins.filter(
        admin =>
            admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <Toaster position="top-right" />

            {/* Header */}
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow`}>
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Shield className={`h-8 w-8 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                            <h1 className={`ml-3 text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                All Admins and their access
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-gray-300" : "text-gray-400"} h-5 w-5`} />
                        <input
                            type="text"
                            placeholder="Search admins..."
                            className={`pl-10 pr-4 py-2 w-full rounded-lg border ${isDarkMode ? "bg-gray-800 text-white border-gray-700 focus:ring-indigo-400" : "border-gray-300 focus:ring-indigo-500"} focus:ring-2 focus:border-transparent`}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Admin List */}
                <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow overflow-hidden`}>
                    {/* Responsive table container */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                                <tr>
                                    {["Admin", "Company", "Status", "Joins", "Actions"].map(heading => (
                                        <th
                                            key={heading}
                                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={isDarkMode ? "bg-gray-800 divide-y divide-gray-700" : "bg-white divide-y divide-gray-200"}>
                                {filteredAdmins.map(admin => (
                                    <tr key={admin.id} className={`${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-700 font-medium text-sm">
                                                        {admin.firstName.split(" ").map(n => n[0]).join("")}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                                        {admin.firstName} {admin.lastName}
                                                    </div>
                                                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                        {admin.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                            {admin.company}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.isAuthorized
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {admin.isVerified ? "Authorized" : "Unauthorized"}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            {new Date(admin.createdAt).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    disabled={admin.email === "omkumavat2004@gmail.com"}
                                                    onClick={() => openAccessModal(admin._id)}
                                                    className={`flex items-center px-3 py-1 rounded ${admin.isVerified
                                                            ? "text-red-700 hover:text-red-900"
                                                            : "text-green-700 hover:text-green-900"
                                                        }`}
                                                >
                                                    {admin.isVerified ? (
                                                        <UserX className="h-4 w-4 mr-1" />
                                                    ) : (
                                                        <UserCheck className="h-4 w-4 mr-1" />
                                                    )}
                                                    {admin.isVerified ? "Revoke Access" : "Grant Access"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className={`relative ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-xl max-w-md w-full mx-4`}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <Lock className="h-5 w-5 text-indigo-600 mr-2" />
                                <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                    Confirm Access Change
                                </h3>
                            </div>
                            <button
                                onClick={closeModal}
                                className={`${isDarkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-400 hover:text-gray-500"}`}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Please enter your admin password to confirm this action.
                            </p>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? "bg-gray-700 text-white border-gray-600 focus:ring-indigo-400" : "border-gray-300 focus:ring-indigo-500"} focus:ring-2 focus:border-transparent`}
                            />
                            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        </div>
                        <div className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"} px-4 py-3 flex justify-end space-x-3 rounded-b-lg`}>
                            <button
                                onClick={closeModal}
                                className={`px-4 py-2 text-sm font-medium ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-500"}`}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                onClick={handleAccessChange}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {loading ? "Changing Access" : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}

export default Admins
