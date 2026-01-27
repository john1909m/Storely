// src/pages/auth/OTPVerification.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, RotateCcw, CheckCircle } from 'lucide-react';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isVerified]);

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
    }
  };

  const handleResend = () => {
    setTimeLeft(120);
    // Simulate resend OTP
    console.log('Resending OTP...');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      const isValid = otp.join('') === '123456'; // Demo verification
      setIsVerified(isValid);
      setIsLoading(false);
    }, 1000);
  };

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
            <p className="text-sm text-gray-500 mt-2">
              demo@example.com
            </p>
          </div>

          {!isVerified ? (
            <>
              {/* OTP Inputs */}
              <form onSubmit={handleVerify} className="space-y-8">
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
                      className="h-16 w-16 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    Code expires in: <span className="font-semibold">{formatTime(timeLeft)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timeLeft > 0}
                    className={`text-sm ${
                      timeLeft > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-500'
                    }`}
                  >
                    <RotateCcw className="inline h-4 w-4 mr-1" />
                    Resend Code {timeLeft > 0 && `(${formatTime(timeLeft)})`}
                  </button>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={isLoading || otp.some(digit => !digit)}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>

              {/* Manual Entry */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-sm text-amber-800 text-center">
                  Demo code: <span className="font-mono font-bold">123456</span>
                </p>
              </div>
            </>
          ) : (
            // Verification Success
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Email Verified!
                </h3>
                <p className="text-gray-600">
                  Your email has been successfully verified.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-block w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Continue to Dashboard
              </Link>
            </div>
          )}

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