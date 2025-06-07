import React, { useState } from "react";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../App";

function Login({ onSwitchToSignup }) {
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setLoading(true);
    // Display a loading toast and capture its id
    const toastId = toast.loading("Signing In...");
    try {
      // Replace this with your actual login endpoint.
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/server/user/login`,
        {
          email,
          password,
        }
      );
      toast.success("Login successful!", { id: toastId });
      login(response.data.user);
      navigate(`/user/${response.data.user.username}/edit`);
    } catch (error) {
      console.error("Login error:", error);
      setServerError("Login failed. Please check your credentials and try again.");
      toast.error("Login failed. Please check your credentials and try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Define dark/light mode classes for reuse

  // Container for the form
  const formContainerClass = isDarkMode
    ? "bg-gray-800 text-white"
    : "bg-white text-gray-900";

  // Label
  const labelClass = isDarkMode
    ? "text-sm font-medium text-gray-300"
    : "text-sm font-medium text-gray-700";

  // Input for email; also applies to text inputs
  const inputClass = isDarkMode
    ? "w-full pl-10 pr-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-700 bg-gray-700 text-white"
    : "w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100";

  // Input for password (with extra right padding for the toggle button)
  const passwordInputClass = isDarkMode
    ? "w-full pl-10 pr-10 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-700 bg-gray-700 text-white"
    : "w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100";

  // Button class
  const buttonClass = "w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors";

  // Divider line (we slightly change the border color in dark mode)
  const dividerLineClass = isDarkMode ? "border-t border-gray-600" : "border-t border-gray-200";

  return (
    <>
      <Toaster position="top-right" />

      <form onSubmit={handleSubmit} className={`space-y-6 p-6 rounded-lg shadow-md ${formContainerClass}`}>
        {/* Email Field */}
        <div className="space-y-2">
          <label className={labelClass}>Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={inputClass}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className={labelClass}>Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={passwordInputClass}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={loading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Server Error Display */}
        {serverError && (
          <p className="text-sm text-red-500">{serverError}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={buttonClass}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Divider */}
        <div className="mt-8 flex items-center">
          <div className={`flex-1 ${dividerLineClass}`}></div>
          <div className="px-4 text-sm text-gray-500">or</div>
          <div className={`flex-1 ${dividerLineClass}`}></div>
        </div>

        {/* Switch to Signup */}
        <button
          onClick={onSwitchToSignup}
          type="button"
          disabled={loading}
          className="mt-8 flex items-center justify-center text-blue-600 hover:text-blue-700"
        >
          Don't have an account?
          <span className="ml-1 font-semibold flex items-center">
            Sign up <ArrowRight className="h-4 w-4 ml-1" />
          </span>
        </button>
      </form>
    </>
  );
}

export default Login;
