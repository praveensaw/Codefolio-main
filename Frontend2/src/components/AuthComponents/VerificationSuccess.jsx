import React from 'react';
import { CheckCircle } from 'lucide-react';

const VerificationSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-64 animate-wave">
          <svg viewBox="0 0 1440 320" className="fill-white/5">
            <path d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-md w-full bg-white/10 glass-effect rounded-2xl shadow-2xl p-8 text-center perspective-3d rotate-3d">
        <div className="mb-6 animate-float">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Verification Email Sent!</h2>
        <p className="text-gray-300 mb-6">
          We've sent a verification link to your email address. Please check your inbox and click the
          link to complete your registration. After verification, an admin will review your account.
        </p>
        <div className="text-sm text-gray-400">
          Note: Admin verification is required before you can log in to your account.
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccess;