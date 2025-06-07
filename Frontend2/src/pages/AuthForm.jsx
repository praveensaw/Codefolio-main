import React, { useState } from "react";
import Login from "../components/AuthComponents/Login";
import Signup from "../components/AuthComponents/Signup";
import { motion } from "framer-motion";

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center mt-10 p-4 bg-white relative">
            {/* Main Container */}
            <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Left Side - Text Section with Vertical Divider */}
                    <div className="lg:w-1/2 flex flex-col justify-center items-center p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <h2 className="text-4xl font-bold mb-4">Welcome to</h2>
                        <h2 className="text-4xl font-bold mb-4">CodeVerse</h2>
                        <h2 className="text-4xl font-bold mb-4">Admin</h2>
                        <h2 className="text-4xl font-bold mb-4">Dashboard</h2>
                        <p className="text-lg text-gray-600 text-center">
                            Join our community of coders and developers. Share your journey, skills,
                            and connect with like-minded people.
                        </p>
                    </div>

                    {/* Right Side - Auth Forms */}
                    <div className="lg:w-1/2 flex flex-col p-8">
                        {/* Form Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isLogin ? "Welcome back" : "Create an account"}
                            </h1>
                            <p className="mt-2 text-gray-600">
                                {isLogin
                                    ? "Please enter your details to sign in"
                                    : "Please enter your details to get started"}
                            </p>
                        </div>

                        {/* Auth Form */}
                        {isLogin ? (
                            <Login onSwitchToSignup={() => setIsLogin(false)} />
                        ) : (
                            <Signup onSwitchToLogin={() => setIsLogin(true)} />
                        )}
                    </div>
                </div>
            </div>

            {/* Below Section - Dummy Text and Images */}
            <div className="mt-24 max-w-4xl w-full text-center">
                <motion.div
                    className="absolute inset-x-0 bottom-0 pointer-events-none"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <svg
                        viewBox="0 0 1440 320"
                        className="w-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#f3f4f6"
                            fillOpacity="1"
                            d="M0,224L60,229.3C120,235,240,245,360,240C480,235,600,213,720,202.7C840,192,960,192,1080,202.7C1200,213,1320,235,1380,245.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                        ></path>
                    </svg>
                </motion.div>
            </div>
        </div>
    );
}

export default AuthForm;
