import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Mail, Lock, User, Store, Eye, EyeOff, Check, Phone,
  Sparkles, Shield, Zap, Layers, Compass, Star, Gift, Rocket
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
  const { t } = useTranslation();

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

  // Only redirect if authenticated AND we're not in the middle of signup
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
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        vendorDto: null,
        adminDto: null,
        customerDto: null,
      };

      const response = await signup(signupData);
      setSignupSuccess(true);
      
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
    setError('');
    setSignupSuccess(false);
  };

  const passwordStrength = (password) => {
    if (!password) {
      return { score: 0, label: t('pages.signup.passwordStrength.labels.weak'), color: 'red' };
    }
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const labels = [
      t('pages.signup.passwordStrength.labels.weak'),
      t('pages.signup.passwordStrength.labels.fair'),
      t('pages.signup.passwordStrength.labels.good'),
      t('pages.signup.passwordStrength.labels.strong'),
      t('pages.signup.passwordStrength.labels.veryStrong'),
    ];
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    return { score, label: labels[score], color: colors[score] };
  };

  const strength = passwordStrength(formData.password);

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

        {/* Logo with 3D effect */}
        <Link 
          to="/" 
          className="fixed top-4 left-4 z-20 glass-card px-5 py-2.5 rounded-full shadow-2xl hover:shadow-3d transition-all duration-300 flex items-center space-x-2 border border-white/10 hover:border-blue-400/50 group transform-gpu hover:scale-105"
          style={{
            transform: `perspective(1000px) rotateY(${mousePosition.x * 0.2}deg) rotateX(${-mousePosition.y * 0.2}deg)`,
          }}
        >
          <img src="Logo_new_w.png" alt={t('pages.signup.homeLabel')} className="h-10 w-10 scale-125" />
          <span className="text-xl font-bold text-white ml-2">{t('pages.signup.homeLabel')}</span>
          <Sparkles className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link> 

        {/* Main Card */}
        <div className="w-full max-w-2xl relative z-10 perspective-2000">
          <div 
            className="relative transform-gpu transition-all duration-500"
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg)`,
            }}
          >
            <div className="relative glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/10">
              {/* 3D Lighting */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
              
              {/* Floating particles on hover */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float-3d"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
              </div>

              <div className="p-8 md:p-10 relative z-10">
                {/* Header with 3D icon */}
                <div className="text-center mb-8">
                  <div className="inline-block p-4 rounded-3xl mb-4 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity animate-glow-pulse"></div>
                    <div className="relative h-20 w-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-2xl transform-gpu group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Store className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-white mb-2 text-shadow-3d">
                    {t('pages.signup.title')}
                  </h1>
                  <p className="text-blue-100/70">
                    {t('pages.signup.subtitle')}
                  </p>
                </div>

                {/* 3D Corner decoration */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Layers className="h-8 w-8 text-blue-400" />
                </div>

                {/* Success Message */}
                {signupSuccess && (
                  <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-4 flex items-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>{t('pages.signup.success')}</span>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      {t('pages.signup.form.fullNameLabel')}
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                        focusedField === 'name' ? 'text-blue-400' : 'text-gray-400'
                      }`} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        onMouseEnter={() => setHoveredField('name')}
                        onMouseLeave={() => setHoveredField(null)}
                        required
                        disabled={signupSuccess}
                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-400 ${
                          focusedField === 'name' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                        } disabled:opacity-50`}
                        placeholder={t('pages.signup.form.placeholders.fullName')}
                        style={{
                          transform: hoveredField === 'name' ? 'translateZ(20px)' : 'translateZ(0)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      {t('pages.signup.form.emailLabel')}
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
                        disabled={signupSuccess}
                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-400 ${
                          focusedField === 'email' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                        } disabled:opacity-50`}
                        placeholder={t('pages.signup.form.placeholders.email')}
                        style={{
                          transform: hoveredField === 'email' ? 'translateZ(20px)' : 'translateZ(0)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      {t('pages.signup.form.phoneLabel')}
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                        focusedField === 'phone' ? 'text-blue-400' : 'text-gray-400'
                      }`} />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        onMouseEnter={() => setHoveredField('phone')}
                        onMouseLeave={() => setHoveredField(null)}
                        required
                        disabled={signupSuccess}
                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-400 ${
                          focusedField === 'phone' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                        } disabled:opacity-50`}
                        placeholder={t('pages.signup.form.placeholders.phone')}
                        style={{
                          transform: hoveredField === 'phone' ? 'translateZ(20px)' : 'translateZ(0)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      {t('pages.signup.form.passwordLabel')}
                    </label>
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
                        disabled={signupSuccess}
                        className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-400 ${
                          focusedField === 'password' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                        } disabled:opacity-50`}
                        placeholder={t('pages.signup.form.placeholders.password')}
                        style={{
                          transform: hoveredField === 'password' ? 'translateZ(20px)' : 'translateZ(0)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={signupSuccess}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength with 3D style */}
                    {formData.password && !signupSuccess && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">{t('pages.signup.passwordStrength.label')}</span>
                          <span className={`font-medium text-${strength.color}-400`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 bg-gradient-to-r from-${strength.color}-400 to-${strength.color}-500`}
                            style={{ width: `${(strength.score / 4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Password Requirements with 3D checkmarks */}
                    {!signupSuccess && (
                      <ul className="mt-3 space-y-1 text-sm">
                        <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-400' : 'text-gray-400'}`}>
                          <Check className={`h-4 w-4 mr-2 ${formData.password.length >= 8 ? 'text-green-400' : 'text-gray-600'}`} />
                          {t('pages.signup.passwordRequirements.atLeast8')}
                        </li>
                        <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`}>
                          <Check className={`h-4 w-4 mr-2 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-gray-600'}`} />
                          {t('pages.signup.passwordRequirements.oneUppercase')}
                        </li>
                        <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`}>
                          <Check className={`h-4 w-4 mr-2 ${/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-gray-600'}`} />
                          {t('pages.signup.passwordRequirements.oneLowercase')}
                        </li>
                        <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`}>
                          <Check className={`h-4 w-4 mr-2 ${/[0-9]/.test(formData.password) ? 'text-green-400' : 'text-gray-600'}`} />
                          {t('pages.signup.passwordRequirements.oneNumber')}
                        </li>
                        <li className={`flex items-center ${/[!@#$%^&*()-+]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`}>
                          <Check className={`h-4 w-4 mr-2 ${/[!@#$%^&*()-+]/.test(formData.password) ? 'text-green-400' : 'text-gray-600'}`} />
                          {t('pages.signup.passwordRequirements.oneSpecial')}
                        </li>
                      </ul>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      {t('pages.signup.form.confirmPasswordLabel')}
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                        focusedField === 'confirmPassword' ? 'text-blue-400' : 'text-gray-400'
                      }`} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        onMouseEnter={() => setHoveredField('confirmPassword')}
                        onMouseLeave={() => setHoveredField(null)}
                        required
                        disabled={signupSuccess}
                        className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-400 ${
                          focusedField === 'confirmPassword' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                        } disabled:opacity-50`}
                        placeholder={t('pages.signup.form.placeholders.confirmPassword')}
                        style={{
                          transform: hoveredField === 'confirmPassword' ? 'translateZ(20px)' : 'translateZ(0)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={signupSuccess}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && !signupSuccess && (
                      <p className="mt-2 text-sm text-red-400">
                        {t('pages.signup.errors.passwordsDoNotMatch')}
                      </p>
                    )}
                  </div>

                  {/* Submit Button with 3D effect */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading || signupSuccess}
                      className="w-full py-4 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl hover:shadow-3d disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      {isLoading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                          <span className="relative z-10">{t('pages.signup.submit.creating')}</span>
                        </>
                      ) : signupSuccess ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                          <span className="relative z-10">{t('pages.signup.submit.redirecting')}</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">{t('pages.signup.submit.button')}</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Benefits with 3D style */}
                <div className="mt-8 p-6 glass-card rounded-2xl border border-white/10">
                  <h3 className="font-semibold text-white mb-3 flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-blue-400" />
                    {t('pages.signup.benefits.title')}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-gray-300">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      {t('pages.signup.benefits.items.0')}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      {t('pages.signup.benefits.items.1')}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      {t('pages.signup.benefits.items.2')}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      {t('pages.signup.benefits.items.3')}
                    </li>
                  </ul>
                </div>

                {/* Login Link */}
                <div className="mt-8 text-center">
                  <p className="text-gray-400">
                    {t('pages.signup.loginPrompt.text')}{' '}
                    <Link
                      to="/login"
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      {t('pages.signup.loginPrompt.link')}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust badge with 3D effect */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full border border-white/10">
              <Shield className="h-3 w-3 text-blue-400" />
              <p className="text-xs text-gray-400">
                {t('pages.signup.trust.securedBy')} • {t('pages.signup.trust.joinVendors')}
              </p>
              <Rocket className="h-3 w-3 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;