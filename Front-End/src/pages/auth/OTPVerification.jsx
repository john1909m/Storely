// src/pages/auth/OTPVerification.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, RotateCcw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../../api/auth.api';

const OTPVerification = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const inputRefs = useRef([]);

  // Get email from sessionStorage
  const email = sessionStorage.getItem('resetEmail');

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (index, value) => {
    if (value.match(/^[0-9]$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (index < 5 && value) {
        inputRefs.current[index + 1].focus();
      }
      
      // Auto-submit when all digits are filled
      if (index === 5 && value && newOtp.every(digit => digit)) {
        handleVerify(newOtp.join(''));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (pastedData.match(/^[0-9]+$/)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      
      // Auto-submit if all digits are filled
      if (newOtp.every(digit => digit)) {
        handleVerify(newOtp.join(''));
      }
    }
  };

  const handleResend = async () => {
    if (!email) return;
    
    setResendDisabled(true);
    setError('');
    
    try {
      await authAPI.sendOtp(email);
      setTimeLeft(120);
      setOtp(['', '', '', '', '', '']);
      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
      setResendDisabled(false);
    }
  };

  const handleVerify = async (code) => {
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Store OTP in sessionStorage for reset password page
      // The actual verification will happen when resetting password
      sessionStorage.setItem('resetOtp', code);
      
      // Redirect to reset password page (verification happens there with backend)
      navigate('/reset-password');
      
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 6) {
      handleVerify(code);
    } else {
      setError('Please enter the complete 6-digit code');
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl mb-4">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email Verification
            </h1>
            <p className="text-gray-600">
              Enter the 6-digit code sent to your email
            </p>
            < span className="text-red-500 text-sm mt-1">
              if you didn't receive the code, check your spam folder
            </span>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              {email}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* OTP Inputs */}
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className="h-16 w-16 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none disabled:opacity-50"
                />
              ))}
            </div>

            {/* Timer and Resend */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                Code expires in: <span className="font-semibold text-indigo-600">{formatTime(timeLeft)}</span>
              </div>
              
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otp.some(digit => !digit)}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Having trouble?{' '}
            <Link to="/contact" className="text-indigo-600 hover:text-indigo-500">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;