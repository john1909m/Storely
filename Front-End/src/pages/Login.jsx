import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Eye, EyeOff, Loader2, Home, Sparkles, Layers, Shield, Zap, Compass } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useErrorHandler } from './../hooks/useErrorHandler';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
  const { t } = useTranslation();

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

  // Styles for 3D animations
  const styles = `
    @keyframes float-3d {
      0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
      25% { transform: translateY(-20px) rotateX(5deg) rotateY(5deg); }
      75% { transform: translateY(20px) rotateX(-5deg) rotateY(-5deg); }
    }

    @keyframes float-particle {
      0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100vh) translateX(100px) scale(0); opacity: 0; }
    }

    @keyframes pulse-slow {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.2); opacity: 0.5; }
    }

    @keyframes glow-pulse {
      0%, 100% { filter: brightness(1) blur(20px); }
      50% { filter: brightness(1.5) blur(30px); }
    }

    .animate-float-3d {
      animation: float-3d 8s ease-in-out infinite;
      transform-style: preserve-3d;
    }

    .animate-float-particle {
      animation: float-particle 8s linear infinite;
    }

    .animate-pulse-slow {
      animation: pulse-slow 4s ease-in-out infinite;
    }

    .animate-glow-pulse {
      animation: glow-pulse 3s ease-in-out infinite;
    }

    .animation-delay-2000 {
      animation-delay: 2s;
    }

    .perspective-1000 {
      perspective: 1000px;
    }

    .perspective-2000 {
      perspective: 2000px;
    }

    .transform-gpu {
      transform: translateZ(0);
      backface-visibility: hidden;
    }

    .transform-style-3d {
      transform-style: preserve-3d;
    }

    .hover-lift-3d {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .hover-lift-3d:hover {
      transform: translateY(-5px) translateZ(20px) rotateX(2deg);
      box-shadow: 0 30px 40px -20px rgba(79, 70, 229, 0.3);
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .glass-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .text-shadow-3d {
      text-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.3);
    }

    .grid-3d {
      background-image: 
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 50px 50px;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div 
        className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden"
        onMouseMove={(e) => {
          setMousePosition({
            x: (e.clientX / window.innerWidth - 0.5) * 20,
            y: (e.clientY / window.innerHeight - 0.5) * 20,
          });
        }}
      >
        {/* 3D Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-indigo-950/100 to-purple-950/60">
          {/* Floating orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-3d"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
          
          {/* 3D Grid */}
          <div className="absolute inset-0 opacity-20 grid-3d" style={{
            transform: `perspective(500px) rotateX(60deg) scale(2)`,
            transformOrigin: 'top',
          }}></div>
          
          {/* Floating particles */}
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Home button with 3D effect */}
        <Link 
          to="/" 
          className="fixed top-4 left-4 z-20 glass-card px-5 py-2.5 rounded-full shadow-2xl hover:shadow-3d transition-all duration-300 flex items-center space-x-2 border border-white/10 hover:border-blue-400/50 group transform-gpu hover:scale-105"
          style={{
            transform: `perspective(1000px) rotateY(${mousePosition.x * 0.2}deg) rotateX(${-mousePosition.y * 0.2}deg)`,
          }}
          aria-label={t('pages.login.backToHomeAria')}
        >
          <Home className="h-5 w-5 text-blue-400 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium text-gray-300 group-hover:text-white">{t('pages.login.homeLabel')}</span>
        </Link>

        {/* Login Card */}
        <div className="w-full max-w-md relative z-10 perspective-2000">
          <div 
            className="relative transform-gpu transition-all duration-500"
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg)`,
            }}
          >
            <div className="relative glass-card rounded-3xl shadow-2xl p-8 border border-white/10 overflow-hidden">
              {/* 3D Lighting */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
              
              {/* Floating particles on hover */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float-3d"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
              </div>
              
              {/* Icon with 3D effect */}
              <div className="text-center mb-6 relative">
                <div className="inline-block p-4 rounded-3xl mb-4 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity animate-glow-pulse"></div>
                  <div className="relative h-20 w-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-2xl transform-gpu group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-2 text-shadow-3d">{t('pages.login.welcomeBack')}</h1>
                <p className="text-blue-100/70">{t('pages.login.subtitle')}</p>
              </div>

              {/* 3D Corner decoration */}
              <div className="absolute top-4 right-4 opacity-20">
                <Layers className="h-8 w-8 text-blue-400" />
              </div>

              {/* Error Message with 3D style */}
              {error && (
                <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 text-lg">×</button>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1.5">
                    {t('pages.login.form.emailLabel')}
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                      focusedField === 'email' ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      onMouseEnter={() => setHoveredField('email')}
                      onMouseLeave={() => setHoveredField(null)}
                      required
                      disabled={showLoading}
                      className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-400 ${
                        focusedField === 'email' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                      } disabled:opacity-50`}
                      placeholder={t('pages.login.form.emailPlaceholder')}
                      style={{
                        transform: hoveredField === 'email' ? 'translateZ(20px)' : 'translateZ(0)',
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-blue-200">
                      {t('pages.login.form.passwordLabel')}
                    </label>
                    
                  </div>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                      focusedField === 'password' ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      onMouseEnter={() => setHoveredField('password')}
                      onMouseLeave={() => setHoveredField(null)}
                      required
                      disabled={showLoading}
                      className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-400 ${
                        focusedField === 'password' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                      } disabled:opacity-50`}
                      placeholder={t('pages.login.form.passwordPlaceholder')}
                      style={{
                        transform: hoveredField === 'password' ? 'translateZ(20px)' : 'translateZ(0)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={showLoading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button with 3D effect */}
                <button
                  type="submit"
                  disabled={showLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl hover:shadow-3d disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  {showLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin relative z-10" />
                      <span className="relative z-10">
                        {isRedirecting ? t('pages.login.button.redirecting') : t('pages.login.button.signingIn')}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">{t('pages.login.button.signIn')}</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center relative z-10">
                <p className="text-sm text-gray-400">
                  {t('pages.login.signupPrompt')}{' '}
                  <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    {t('pages.login.createAccountLink')}
                  </Link>
                </p>
              </div>

              {/* Footer with 3D style */}
              <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
                <div className="flex justify-center space-x-4 text-xs text-gray-400">
                  <Link to="/contact" className="hover:text-blue-400 transition-colors">{t('pages.login.footer.support')}</Link>
                  <span>•</span>
                  <Link to="/pricing" className="hover:text-blue-400 transition-colors">{t('pages.login.footer.pricing')}</Link>
                  <span>•</span>
                  <Link to="/privacy" className="hover:text-blue-400 transition-colors">{t('pages.login.footer.privacy')}</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Trust badge with 3D effect */}
          <div className="mt-6 text-center relative z-10">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full border border-white/10">
              <Shield className="h-3 w-3 text-blue-400" />
              <p className="text-xs text-gray-400">
                {t('pages.login.trust.securedBy')} • {t('pages.login.trust.copyright', { year: new Date().getFullYear() })}
              </p>
              <Zap className="h-3 w-3 text-purple-400" />
            </div>
          </div>

          {/* 3D Stats decoration */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-30">
            <Compass className="h-12 w-12 text-blue-400 animate-float-3d" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;