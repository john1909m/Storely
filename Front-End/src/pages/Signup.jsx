import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, Store, Eye, EyeOff, Check, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import StoreFooter from '../components/StoreFooter';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signup, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // Only redirect if authenticated AND we're not in the middle of signup
  // This prevents auto-redirect after signup
  useEffect(() => {
    if (isAuthenticated && role && !signupSuccess) {
      const dashboardPath = role?.toUpperCase() === 'VENDOR' 
        ? '/vendor/dashboard' 
        : '/';
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, role, navigate, signupSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare signup payload with default VENDOR role
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        vendorDto: null, // Backend will create vendor automatically
        adminDto: null,
        customerDto: null,
      };

      const response = await signup(signupData);
      
      // Set signup success flag to prevent auto-redirect
      setSignupSuccess(true);
      
      // Show success message (optional)
      // You could add a success toast here
      
      // Redirect to login page after successful signup
      // The user needs to log in with their new credentials
      setTimeout(() => {
        navigate('/login', { 
          replace: true,
          state: { 
            message: 'Account created successfully! Please log in with your credentials.' 
          }
        });
      }, 500);
      
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError(''); // Clear error on input change
    setSignupSuccess(false); // Reset success flag if user starts typing again
  };

  const passwordStrength = (password) => {
    if (!password) return { score: 0, label: 'Weak' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return { score, label: labels[score] };
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center space-x-2 text-gray-900">
          <div className='h-16 w-16 flex items-center justify-centerrounded-full'>
               <img src="Logo.png" alt="Storely Logo" className=" text-indigo-600" />
            </div>
          <span className="text-2xl font-bold">Storely</span>
        </Link>
      </div>

      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl mb-4">
                <Store className="h-8 w-8 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Vendor Account
              </h1>
              <p className="text-gray-600">
                Join thousands of vendors selling on Storely
              </p>
            </div>

            {/* Success Message */}
            {signupSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
                Account created successfully! Redirecting to login...
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={signupSuccess}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={signupSuccess}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50"
                    placeholder="vendor@example.com"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    disabled={signupSuccess}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={signupSuccess}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={signupSuccess}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength */}
                {formData.password && !signupSuccess && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Password strength</span>
                      <span className={`font-medium ${
                        strength.score < 2 ? 'text-red-600' :
                        strength.score < 4 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          strength.score < 2 ? 'bg-red-500' :
                          strength.score < 4 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                
                {/* Password Requirements */}
                {!signupSuccess && (
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                      <Check className={`h-4 w-4 mr-2 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <Check className={`h-4 w-4 mr-2 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      One uppercase letter
                    </li>
                    <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <Check className={`h-4 w-4 mr-2 ${/[a-z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      One lowercase letter
                    </li>
                    <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <Check className={`h-4 w-4 mr-2 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      One number
                    </li>
                    <li className={`flex items-center ${/[!@#$%^&*()-+]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <Check className={`h-4 w-4 mr-2 ${/[!@#$%^&*()-+]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      One special character
                    </li>
                  </ul>
                )}
              </div>


              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={signupSuccess}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={signupSuccess}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && !signupSuccess && (
                  <p className="mt-2 text-sm text-red-600">
                    Passwords do not match
                  </p>
                )}
              </div>

              

              

              {/* Action Buttons */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || signupSuccess}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : signupSuccess ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Redirecting to Login...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Vendor Account</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Benefits */}
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-3">
                Why join Storely?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  No coding skills required - set up your store in minutes
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Get your own branded store URL
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  No bulk payment - pay only small monthly fee, no hidden charges
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  24/7 customer support
                </li>
              </ul>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-500 font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        
      </div>
      
    </div>
  );
};

export default Signup;