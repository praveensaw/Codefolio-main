import React, { useState } from "react";
import { Mail, User, Building, ArrowRight, CheckCircle } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Signup = ({ onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sentVerification, setSentVerification] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!company.trim()) newErrors.company = "Company name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    return newErrors;
  };

  const handleSignup = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const toastId = toast.loading("Signing In...");

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/admin/register-verify`,
        {
          firstName,
          lastName,
          company,
          email,
        }
      );

      if (response.data.success) {
        toast.success(`${response.data.message}`, { id: toastId });
        setSentVerification(true);
      } else {
        toast.error(err.response?.data?.message || "Something went wrong", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (sentVerification) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="mx-auto text-green-500" size={48} />
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-gray-600">
          We've sent you a verification link. Click the link to complete your signup.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex gap-4">
        <div className="w-1/2 space-y-2">
          <label className="text-sm font-medium text-gray-700">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              disabled={loading}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
            />
          </div>
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="w-1/2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              disabled={loading}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
            />
          </div>
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Company Name</label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            disabled={loading}
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter company name"
          />
        </div>
        {errors.company && (
          <p className="text-sm text-red-500">{errors.company}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            disabled={loading}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <button
        onClick={handleSignup}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        disabled={loading}
      >
        {loading ? "Signing Up..." : (
          <>
            <span>Signup</span>
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      <button
        onClick={onSwitchToLogin}
        type="button"
        disabled={loading}
        className="mt-8 flex items-center justify-center text-blue-600 hover:text-blue-700"
      >
        Already have an account
        <span className="ml-1 font-semibold flex items-center">
          Sign In <ArrowRight className="h-4 w-4 ml-1" />
        </span>
      </button>
    </div>
  );
};

export default Signup;
