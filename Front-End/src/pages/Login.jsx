import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, role, store } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role) {
      console.log('Already authenticated - Role:', role, 'Store:', store, 'Has Store:', !!store);
      const from = location.state?.from?.pathname || getDashboardPath(role, store);
      console.log('Redirecting authenticated user to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, role, store, navigate, location]);

  // Helper to get dashboard path based on role and store existence
  const getDashboardPath = (userRole, store) => {
    switch (userRole?.toUpperCase()) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'VENDOR':
        // Check if vendor has store
        if (store) {
          return '/vendor/store';
        } else {
          return '/vendor/create-store';
        }
      case 'CUSTOMER':
        const lastStore = sessionStorage.getItem('lastVisitedStore');
        return lastStore ? `/store/${lastStore}` : '/';
      default:
        return '/';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await login(formData);
      
      // Debug logging
      console.log('Login successful - Role:', response.role);
      console.log('Login successful - Store:', response.store);
      console.log('Login successful - Full response:', response);
      
      // Wait a bit for auth store to update, then get latest values
      setTimeout(() => {
        // Get role and store from response (they should be set in auth store now)
        const userRole = response.role || role;
        const userStore = response.store || store;
        
        // Navigate to intended page or role-based dashboard
        const redirectPath = location.state?.from?.pathname || getDashboardPath(userRole, userStore);
        console.log('Redirecting to:', redirectPath, 'Role:', userRole, 'Has Store:', !!userStore);
        
        navigate(redirectPath, { replace: true });
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error on input change
  };

  const handleDemoLogin = async (role) => {
    setError('');
    // Demo login - adjust credentials based on your backend
    const demoCredentials = {
      email: `demo-${role.toLowerCase()}@storely.com`,
      password: 'demo123',
    };
    
    try {
      const response = await login(demoCredentials);
      navigate(getDashboardPath(response.role, response.store), { replace: true });
    } catch (err) {
      setError('Demo login failed. Please use regular login.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center space-x-2 text-gray-900">
          <Store className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold">Storely</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl mb-4">
              <Store className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your Storely vendor account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter your password"
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-sm text-gray-500">Or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-4">
            <button
              onClick={() => handleDemoLogin('vendor')}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 font-medium rounded-xl border border-blue-100 hover:border-blue-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Store className="h-5 w-5" />
              <span>Demo Vendor Account</span>
            </button>

            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-medium rounded-xl border border-purple-100 hover:border-purple-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <div className="h-5 w-5 flex items-center justify-center">
                👑
              </div>
              <span>Demo Admin Account</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-500 font-semibold"
              >
                Create vendor account
              </Link>
            </p>
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

export default Login;