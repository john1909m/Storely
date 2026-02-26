import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Eye, EyeOff, Loader2, Home, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useErrorHandler } from './../hooks/useErrorHandler';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, role, store } = useAuth();
  const { handleError } = useErrorHandler();

  // Helper to get dashboard path based on role and store existence
  const getDashboardPath = (userRole, userStore) => {
    if (userRole?.toUpperCase() === 'ADMIN') return '/admin/dashboard';
    if (userRole?.toUpperCase() === 'VENDOR') {
      return userStore?.id ? '/vendor/store' : '/vendor/create-store';
    }
    return '/';
  };

  // Handle redirect after authentication
  useEffect(() => {
    if (isAuthenticated && role) {
      const from = location.state?.from?.pathname || getDashboardPath(role, store);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, role, store, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsRedirecting(true);
    
    try {
      const response = await login(formData);
      const userRole = response.role;
      const userStore = response.store;
      const redirectPath = location.state?.from?.pathname || getDashboardPath(userRole, userStore);
      
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
        setIsRedirecting(false);
      }, 100);
      
    } catch (err) {
      console.error('Login error:', err);
      handleError(err);
      setIsRedirecting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const showLoading = isLoading || isRedirecting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* خلفية بسيطة مع عناصر ناعمة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-1000"></div>
      </div>

      {/* زر العودة */}
      <Link 
        to="/" 
        className="fixed top-4 left-4 z-20 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-gray-200/50 hover:border-indigo-300 group"
        aria-label="Back to home"
      >
        <Home className="h-5 w-5 text-indigo-600 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">Home</span>
      </Link>

      {/* بطاقة تسجيل الدخول */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
          
          {/* أيقونة جميلة */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to continue your journey
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 text-lg">×</button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                  focusedField === 'email' ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={showLoading}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                    focusedField === 'email' ? 'border-indigo-300 bg-white shadow-md' : 'border-gray-200'
                  } disabled:opacity-50`}
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                  focusedField === 'password' ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={showLoading}
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                    focusedField === 'password' ? 'border-indigo-300 bg-white shadow-md' : 'border-gray-200'
                  } disabled:opacity-50`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={showLoading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            

            {/* Submit Button */}
            <button
              type="submit"
              disabled={showLoading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
            >
              {showLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{isRedirecting ? 'Redirecting...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Create account
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <Link to="/contact" className="hover:text-indigo-600">Support</Link>
              <span>•</span>
              <Link to="/pricing" className="hover:text-indigo-600">Pricing</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-indigo-600">Privacy</Link>
            </div>
          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Secured by Storely • © 2026
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Login;