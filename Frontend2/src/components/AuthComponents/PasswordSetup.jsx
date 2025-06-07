import React, { useState, useEffect } from 'react';
import { Lock, Shield, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PasswordSetup = () => {
    const [token, setToken] = useState('');
    const [isValid, setIsValidToken] = useState(null); // null = loading, true = valid, false = invalid
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // ✅ for disabling fields/buttons during submission
    const [message, setMessage] = useState(''); // ✅ to store error/success messages
    const navigate = useNavigate();
    const location = useLocation();

    const [requirements, setRequirements] = useState([
        { label: 'At least 8 characters', met: false },
        { label: 'Contains uppercase letter', met: false },
        { label: 'Contains number', met: false },
        { label: 'Contains special character', met: false },
        { label: 'Passwords match', met: false },
    ]);

    const validatePassword = (password, confirmPassword) => {
        const newRequirements = [
            { label: 'At least 8 characters', met: password.length >= 8 },
            { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
            { label: 'Contains number', met: /[0-9]/.test(password) },
            { label: 'Contains special character', met: /[!@#$%^&*]/.test(password) },
            { label: 'Passwords match', met: password === confirmPassword && password !== '' },
        ];
        setRequirements(newRequirements);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // ✅ disable inputs/buttons

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/final-register?token=${token}`, {
                password: formData.password,
            });

            if (res.data.success) {
                setIsSuccess(true);
                setMessage(res.data.message || 'Account verified!');
            } else {
                setMessage(res.data.message || 'Invalid or expired token.');
            }
        } catch (err) {
            setMessage('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false); // ✅ re-enable inputs/buttons
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const t = params.get('token');
        setToken(t);

        if (!t) {
            navigate('/', { replace: true });
            return;
        }

        const validateToken = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/check-token?token=${t}`);
                setIsValidToken(res.data.valid);
            } catch (err) {
                setIsValidToken(false);
            }
        };

        if (t) validateToken();
    }, [location]);

    if (isValid === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-indigo-900 text-white text-xl font-medium">
                <div className="animate-pulse">Verifying your token...</div>
            </div>
        );
    }

    if (isValid === false) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center p-6">
                <div className="max-w-md text-center bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <AlertTriangle className="h-12 w-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">404 - Invalid or Expired Link</h2>
                    <p className="text-gray-300 mb-6">The link you followed is no longer valid or has already been used.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 hover:scale-105 transform"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        validatePassword(
            name === 'password' ? value : formData.password,
            name === 'confirmPassword' ? value : formData.confirmPassword
        );
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-xl perspective-3d rotate-3d">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Registration Complete!</h2>
                        <p className="text-gray-300 mb-8">{message}</p>
                        <a
                            href="/"
                            className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:scale-105 transform"
                        >
                            Proceed to Login
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                        <Shield className="h-12 w-12 text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Set Your Password</h2>
                    <p className="text-gray-300">Create a strong password to secure your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-200">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-indigo-400" />
                            <input
                                type="password"
                                name="password"
                                required
                                disabled={isLoading}
                                className="pl-10 w-full px-4 py-2 bg-white/10 border border-gray-500/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-all disabled:opacity-50"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-200">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-indigo-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                disabled={isLoading}
                                className="pl-10 w-full px-4 py-2 bg-white/10 border border-gray-500/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-all disabled:opacity-50"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-200 mb-3">Password Requirements</h3>
                        <div className="space-y-2">
                            {requirements.map((requirement, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    {requirement.met ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className={`text-sm ${requirement.met ? 'text-green-400' : 'text-gray-400'}`}>
                                        {requirement.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !requirements.every((req) => req.met)}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
                    >
                        <span>{isLoading ? 'Registering...' : 'Complete Registration'}</span>
                        <CheckCircle2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </button>
                </form>
                {message && <p className="text-red-300 text-center mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default PasswordSetup;
