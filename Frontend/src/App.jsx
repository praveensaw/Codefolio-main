import React, { createContext, useContext, useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
// import Signup2 from "./pages/Signup2"
import AuthForm from "./components/AuthComponents/AuthForm"
import About from "./pages/About"
import LeetCode from "./Profiles/LeetCode"
import CodeChef from "./Profiles/CodeChef"
import NotFound from "./components/NotFound"
import {
  ProtectedRoute,
  ProtectedRouteForLogin
} from "./Context/ProtectedRoute"
import GeeksforGeeks from "./Profiles/GeeksforGeeks"
import GitHub from "./Profiles/GitHub"
import Profile from "./pages/Profile"
import EditProfile from "./pages/EditProfile"
import Codeforces from "./Profiles/codeforces"
import { useAuth } from "./Context/AuthProvider"
import Contact from "./pages/Contact"
import Rules from "./pages/Rules"

// Create theme context
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {}
})

export const useTheme = () => useContext(ThemeContext)

function App() {
  const { currentUser } = useAuth()

  // Initialize theme based on localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("isDarkMode")
    return savedTheme ? JSON.parse(savedTheme) : false
  })

  // Update localStorage whenever isDarkMode changes
  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode))
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <main className="flex-grow pt-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/signup"
              element={
                <ProtectedRouteForLogin>
                  <AuthForm />
                </ProtectedRouteForLogin>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/user/:username/leetcode"
              element={
                <ProtectedRoute>
                  <LeetCode />
                </ProtectedRoute>
              }
            />
            <Route path="/docs" element={<Rules />} />
            <Route
              path="/user/:username/codechef"
              element={
                <ProtectedRoute>
                  <CodeChef />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:username/geeksforgeeks"
              element={
                <ProtectedRoute>
                  <GeeksforGeeks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:username/github"
              element={
                <ProtectedRoute>
                  <GitHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:username"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:username/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:username/codeforces"
              element={
                <ProtectedRoute>
                  <Codeforces />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
