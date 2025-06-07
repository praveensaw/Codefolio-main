import React, { useState, useEffect } from "react";
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, XCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../App";

const Signup2 = ({ onSwitchToLogin }) => {
  // Steps: "initial" (collect name & email), "otp" (verify OTP), "password" (set password)
  const [signupStep, setSignupStep] = useState("initial");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // Use 5-digit OTP instead of 4; store each digit separately.
  const [otp, setOtp] = useState(Array(5).fill(""));
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpAttempts, setOtpAttempts] = useState(3);
  const [timer, setTimer] = useState(120); // in seconds (2 minutes)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [disablf, setDisablef] = useState(false);
  const navigate = useNavigate();
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  // Countdown timer effect for OTP step.
  const {isDarkMode}=useTheme();
  useEffect(() => {
    let interval = null;
    if (signupStep === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [signupStep, timer]);

  // Helpers to format timer as mm:ss.
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const validateUsername = username => {
    // Regex: only lowercase letters and underscores allowed.
    const usernameRegex = /^[a-z_]+$/
    return usernameRegex.test(username)
  }

  // Validation functions for each step.
  const validateInitialStep = () => {
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    if (!username.trim()) {
      newErrors.username = "User Name is required";
    }

    if (!validateUsername(username.trim())) {
      newErrors.username = "User Name only allows lowercase and underscore";
    }

    if (!usernameAvailable || checkingUsername) {
      newErrors.username = "Enter the correct username";
    }
    if (!email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    return newErrors;
  };

  const validateOtpStep = () => {
    const newErrors = {};
    if (otp.some((digit) => digit.trim() === "")) {
      newErrors.otp = "Please enter the complete 5-digit code";
    }
    return newErrors;
  };

  const validatePasswordStep = () => {
    const newErrors = {};
    const commonPasswords = ['password', '123456', '12345678', 'qwerty', 'abc123'];

    if (!password) {
      newErrors.password = "New Password is required";
    } else {
      // Check for minimum length
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      }
      // Check if password is too common
      if (commonPasswords.includes(password.toLowerCase())) {
        newErrors.password = "Password is too easy";
      }
      // Regex validations for character requirements
      const uppercaseRegex = /[A-Z]/;
      const lowercaseRegex = /[a-z]/;
      const digitRegex = /[0-9]/;
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

      if (!uppercaseRegex.test(password)) {
        newErrors.password = "Password must include at least one uppercase letter";
      }
      if (!lowercaseRegex.test(password)) {
        newErrors.password = "Password must include at least one lowercase letter";
      }
      if (!digitRegex.test(password)) {
        newErrors.password = "Password must include at least one digit";
      }
      if (!specialCharRegex.test(password)) {
        newErrors.password = "Password must include at least one special character";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // Generate a random 5-digit OTP (as a string) and store it.
  const generateOtp = () => {
    const otpValue = Math.floor(10000 + Math.random() * 90000).toString();
    setGeneratedOtp(otpValue);
    // Set the otp input fields to empty
    setOtp(Array(5).fill(""));
    return otpValue;
  };

  // Handle initial step continue:
  const handleInitialContinue = async () => {
    const validationErrors = validateInitialStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setDisablef(true);
    const otpValue = generateOtp();
    try {
      // Call your backend endpoint, e.g., /api/send-otp
      await axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/server/user/email/email-otp`, {
          email: email,
          name: fullName,
          otp: otpValue
        })
      toast.success("OTP has been sent to your email");
      setTimer(120);
      setOtpAttempts(3);
      setSignupStep("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
      setDisablef(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Auto-focus next input if a digit is entered.
      if (value && index < 4) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpVerify = () => {

    if (timer <= 0) {
      toast.error("OTP expired. Please try again.");
      setFullName("");
      setEmail("")
      setSignupStep("initial");
      return;
    }

    const validationErrors = validateOtpStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const enteredOtp = otp.join("");
    if (enteredOtp === generatedOtp) {
      toast.success("OTP verified successfully");
      setSignupStep("password");
    } else {
      const attemptsLeft = otpAttempts - 1;
      setOtpAttempts(attemptsLeft);
      if (attemptsLeft > 0) {
        toast.error(`Incorrect OTP. You have ${attemptsLeft} attempt(s) left.`);
      } else {
        toast.error("No attempts left. Please try again.");
        setSignupStep("initial");
      }
    }
  };

  const handleCreateAccount = async () => {
    const validationErrors = validatePasswordStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setDisablef(true);
    try {
      // Call your backend to create account, e.g., /api/create-account
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/server/user/sign-up`,
        {
          username: username,
          name: fullName,
          email: email,
          password: password
        }
      )

      if (response.data.success) {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/server/user/email/email-signup`,
          {
            username: username,
            name: fullName,
            email: email
          }
        );
        setLoading(false);
        toast.success("Signup successful! Proceed to login...");
        onSwitchToLogin()
      } else {
        setLoading(false);
        toast.error("Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Account creation error:", error);
      toast.error("Failed to create account. Please try again.");
    }
  };

  useEffect(() => {
    if (!username) {
      setUsernameAvailable(null)
      return
    }
    setCheckingUsername(true)

    const handler = setTimeout(() => {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/server/user/check-username/${username}`
        )
        .then(response => {
          setUsernameAvailable(response.data.available)
          setCheckingUsername(false)
        })
        .catch(err => {
          console.error(err)
          setUsernameAvailable(false)
          setCheckingUsername(false)
        })
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [username])

  const labelClass = isDarkMode
  ? "text-sm font-medium text-gray-300"
  : "text-sm font-medium text-gray-700";

const inputClass = isDarkMode
  ? "w-full pl-10 pr-4 py-3 border-2 border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
  : "w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";

const otpInputClass = isDarkMode
  ? "w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
  : "w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-200 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";

const buttonClass = "w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors";

  const renderSignupStep = () => {
    switch (signupStep) {
      case "initial":
        return (
          <div className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className={labelClass}>User Name</label>
              <div className="relative">
                <User className="absolute left-3 top-7 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  disabled={disablf}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  placeholder="Enter your user name"
                />
                <div className="absolute right-3 -mt-6 transform -translate-y-1/2">
                  {checkingUsername ? (
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
                  ) : usernameAvailable === true ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : usernameAvailable === false ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : null}
                </div>
                <p className="text-red-500 w-full pl-10 text-sm">
                  Username will not change; it must be unique.
                </p>
              </div>
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  disabled={disablf}
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  disabled={disablf}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleInitialContinue}
              className={`${buttonClass} flex items-center justify-center space-x-2`}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        );

      case "otp":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Enter Verification Code</h3>
              <p className="text-gray-500 mt-2">
                We've sent a code to your email
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Time remaining: {formatTime(timer)}
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={otpInputClass}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-sm text-red-500 text-center">{errors.otp}</p>
            )}
            <button
              onClick={handleOtpVerify}
              className={`${buttonClass} flex items-center justify-center space-x-2`}
            >
              <span>Verify OTP</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        );

      case "password":
        return (
          <div className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label className={labelClass}>New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  disabled={disablf}
                  type={showNewPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showNewPassword ? (
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  disabled={disablf}
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleCreateAccount}
              className={buttonClass}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      {renderSignupStep()}

      {signupStep === "initial" && (
        <>
          {/* Divider */}
          <div className="mt-8 flex items-center">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
            <div className="px-4 text-sm text-gray-500">or</div>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
          </div>

          {/* Switch to Login */}
          <button
            onClick={onSwitchToLogin}
            className="mt-8 flex items-center justify-center text-blue-600 hover:text-blue-700"
          >
            Already have an account?
            <span className="ml-1 font-semibold flex items-center">
              Sign in <ArrowRight className="h-4 w-4 ml-1" />
            </span>
          </button>
        </>
      )}
    </>
  );


}

export default Signup2;
