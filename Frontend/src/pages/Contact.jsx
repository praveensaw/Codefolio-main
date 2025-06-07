import React, { useState } from 'react';
import contact from '../../public/images/contact.jpg';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useTheme } from '../App';
import contact2 from '../../public/images/contact2.avif'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Contact = () => {
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/server/contact`, formData);

            if (response.data.success) {
                toast.success("Message sent successfuly !")
                setFormData({
                    fullName: '',
                    email: '',
                    message: '',
                })
            } else {
                toast.error("Error sending message, try again later !")
            }
        } catch (error) {
            toast.error("Error sending message, try again later !")
        }
    };

    return (
        <>
            <Navbar />
            {/* Header Section */}
            <ToastContainer position="top-right" autoClose={3000} />
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`relative py-20 px-5 overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-sky-500 to-blue-600 text-black'}`}
            >
                <div className="absolute inset-0">
                    <img
                        src={contact2}
                        alt="Coding Background"
                        className={`w-full h-full object-cover ${isDarkMode ? 'opacity-100' : 'opacity-100'}`}
                    />
                </div>
                <div className="container mx-auto relative z-10 mt-10">
                    <div className="flex flex-col items-center">

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-6xl font-bold text-center mb-6 text-white"
                        >
                            Contact Us
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-center max-w-3xl mb-8 text-white"
                        >
                            "Get in Touch" – Reach out to us for inquiries, support, or collaboration
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* Intro Text */}
            <div className={`text-center w-full max-w-4xl mx-auto p-10 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <p>
                    "Contact Us" – Have a question or need assistance? We're here to help! Reach out via the form or email us directly, and we'll respond as soon as possible.
                </p>
            </div>

            {/* Contact Form & Information Section */}
            <div className={`flex items-center justify-center min-h-screen p-7 ${isDarkMode ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50 text-black'}`}>
                <div className={`w-full max-w-7xl rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>

                    {/* Left Section - Contact Information */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col items-center">
                        <img
                            src={contact}
                            alt="Contact Us"
                            className="w-full h-full object-cover rounded-lg mb-8"
                        />
                        <p className={`text-lg mb-8 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            Let's talk about your problem. We're here to help!
                        </p>
                        <div className="mb-8 text-center">
                            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>Our Location</h3>
                            <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Survey No. 27, Near Trimurti Chowk, Dhankawadi, Pune-411043, Maharashtra (India).</p>
                        </div>

                        <div className="text-center">
                            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>How Can We Help?</h3>
                            <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>balajisaw07@gmail.com</p>
                            <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>omkumavat2004@gmail.com</p>
                        </div>
                    </div>

                    {/* Right Section - Contact Form */}
                    <div className="w-full md:w-1/2 p-8">
                        <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Send us a Message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                                >
                                    Full Name
                                </label>
                                <input
                                required
                                    type="text"
                                    name="fullName"
                                    placeholder="Your Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg transition-all ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                                >
                                    Email
                                </label>
                                <input
                                required
                                    type="email"
                                    name="email"
                                    placeholder="example@mail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg transition-all ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="message"
                                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                                >
                                    Message
                                </label>
                                <textarea
                                required
                                    name="message"
                                    placeholder="Type your message here"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className={`w-full px-4 py-3 border rounded-lg transition-all ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center mt-8 pb-8">
                <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[900px] xl:w-[1100px] 2xl:w-[1400px] h-[300px] rounded-xl overflow-hidden shadow-lg border border-gray-300">
                    <iframe
                        className="w-full h-full rounded-xl"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=Pune institute of Computer technology Dhanakwadi&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    ></iframe>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Contact;
