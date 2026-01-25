import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, Store, Eye, EyeOff, Check } from 'lucide-react';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Signup data:', formData);
      setIsLoading(false);
      navigate('/dashboard'); // Redirect after successful signup
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
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
          <Store className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold">Storely</span>
        </Link>
      </div>

      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-100">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
              style={{ width: currentStep === 1 ? '50%' : '100%' }}
            ></div>
          </div>

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

            {/* Steps Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  {currentStep > 1 ? <Check className="h-5 w-5" /> : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">Account Details</span>
              </div>
              <div className={`h-1 w-12 mx-2 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Store Setup</span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 ? (
                /* Step 1: Account Details */
                <>
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
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
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
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="vendor@example.com"
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
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength */}
                    {formData.password && (
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
                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                      <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                        <Check className={`h-4 w-4 mr-2 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                        At least 8 characters
                      </li>
                      <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                        <Check className={`h-4 w-4 mr-2 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                        One uppercase letter
                      </li>
                      <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                        <Check className={`h-4 w-4 mr-2 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                        One number
                      </li>
                    </ul>
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
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </>
              ) : (
                /* Step 2: Store Setup */
                <>
                  {/* Store Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name
                    </label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="My Awesome Store"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Your store URL will be: storely.com/{formData.storeName.toLowerCase().replace(/\s+/g, '-') || 'your-store'}
                    </p>
                  </div>

                  {/* Store Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What are you selling?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Fashion', 'Electronics', 'Home & Living', 'Food', 'Art', 'Other'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`py-3 rounded-xl border transition-all ${
                            formData.storeType === type
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData({...formData, storeType: type})}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
                        required
                      />
                      <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                        I agree to Storely's{' '}
                        <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                          Privacy Policy
                        </Link>
                        . I understand that Storely charges a 5% commission on sales.
                      </label>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="promoCode"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter promo code if you have one"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                {currentStep === 2 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{currentStep === 1 ? 'Processing...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{currentStep === 1 ? 'Continue to Store Setup' : 'Create Account'}</span>
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
                  No monthly fees - pay only 5% commission on sales
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Get your own branded store URL
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Integrated payment processing
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

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500 space-x-4">
          <Link to="/privacy" className="hover:text-gray-700">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-gray-700">
            Terms of Service
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-gray-700">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;