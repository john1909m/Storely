import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Eye, EyeOff, Loader2, Home, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useErrorHandler } from './../hooks/useErrorHandler';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const getDashboardPath = (userRole, userStore) => {
    if (userRole?.toUpperCase() === 'ADMIN') return '/admin/dashboard';
    if (userRole?.toUpperCase() === 'VENDOR') {
      return userStore?.id ? '/vendor/store' : '/vendor/create-store';
    }
    return '/';
  };

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
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const showLoading = isLoading || isRedirecting;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#800020]">

      {/* ✅ Layer 1: Base gradient (matches landing) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2e000b]"></div>

      {/* ✅ Layer 2: Radial lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]"></div>
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]"></div>
      </div>

      {/* ✅ Layer 3: Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      ></div>

      {/* ✅ Layer 4: Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)',
        }}
      ></div>

      {/* ✅ Layer 5: Grain */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* ✅ Decorative blurred circles */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#a8002b]/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#800020]/40 rounded-full blur-[120px] pointer-events-none"></div>

      {/* ✅ Decorative ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.04] pointer-events-none hidden lg:block"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/[0.03] pointer-events-none hidden lg:block"></div>

      {/* Home button */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-20 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 hover:border-white/25 transition-colors duration-200 flex items-center space-x-2 group"
        aria-label={t('pages.login.backToHomeAria')}
      >
        <Home className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
          {t('pages.login.homeLabel')}
        </span>
      </Link>

      {/* Login Card Container */}
      <div className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="relative bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>

          <div className="p-8">

            {/* Icon + Header */}
            <div className="text-center mb-7">
              <div className="inline-flex h-14 w-14 rounded-2xl bg-[#800020] items-center justify-center shadow-lg mb-4">
                <Sparkles className="h-7 w-7 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                {t('pages.login.welcomeBack')}
              </h1>
              <p className="text-gray-500 text-sm">
                {t('pages.login.subtitle')}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => setError('')}
                  className="text-red-500 hover:text-red-700 text-lg leading-none"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('pages.login.form.emailLabel')}
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-[#800020]' : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={showLoading}
                    className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      focusedField === 'email'
                        ? 'border-[#800020] ring-2 ring-[#800020]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50 disabled:bg-gray-50`}
                    placeholder={t('pages.login.form.emailPlaceholder')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('pages.login.form.passwordLabel')}
                  </label>
                  <Link
                    to="/reset-password"
                    className="text-sm text-[#800020] hover:text-[#660019] font-medium transition-colors"
                  >
                    {t('pages.login.form.forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-[#800020]' : 'text-gray-400'
                    }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={showLoading}
                    className={`w-full pl-11 pr-11 py-3 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      focusedField === 'password'
                        ? 'border-[#800020] ring-2 ring-[#800020]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50 disabled:bg-gray-50`}
                    placeholder={t('pages.login.form.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={showLoading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#800020] transition-colors disabled:opacity-50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={showLoading}
                className="w-full py-3.5 bg-[#800020] text-white font-semibold rounded-xl hover:bg-[#6a001a] transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-2"
              >
                {showLoading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>
                      {isRedirecting ? t('pages.login.button.redirecting') : t('pages.login.button.signingIn')}
                    </span>
                  </>
                ) : (
                  <>
                    <span>{t('pages.login.button.signIn')}</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </form>

            {/* Signup link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {t('pages.login.signupPrompt')}{' '}
                <Link
                  to="/signup"
                  className="text-[#800020] hover:text-[#660019] font-semibold transition-colors"
                >
                  {t('pages.login.createAccountLink')}
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex justify-center items-center space-x-3 text-xs text-gray-400">
                <Link to="/contact" className="hover:text-[#800020] transition-colors">
                  {t('pages.login.footer.support')}
                </Link>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <Link to="/pricing" className="hover:text-[#800020] transition-colors">
                  {t('pages.login.footer.pricing')}
                </Link>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <Link to="/privacy" className="hover:text-[#800020] transition-colors">
                  {t('pages.login.footer.privacy')}
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <Shield className="h-3 w-3 text-emerald-400" />
            <p className="text-xs text-white/75">
              {t('pages.login.trust.securedBy')} • {t('pages.login.trust.copyright', { year: new Date().getFullYear() })}
            </p>
            <Sparkles className="h-3 w-3 text-white/60" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;