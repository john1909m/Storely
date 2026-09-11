import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Mail, Lock, User, Store, Eye, EyeOff, Check, Phone,
  Sparkles, Shield, Gift
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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

      await signup(signupData);
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
      return { score: 0, label: t('pages.signup.passwordStrength.labels.weak'), color: 'weak' };
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

    // ✅ Burgundy palette + semantic colors
    const colorMap = ['weak', 'fair', 'good', 'strong', 'veryStrong'];
    return { score, label: labels[score], color: colorMap[score] };
  };

  const strengthBarColor = (color) => {
    switch (color) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-orange-500';
      case 'good': return 'bg-yellow-500';
      case 'strong': return 'bg-emerald-500';
      case 'veryStrong': return 'bg-[#800020]';
      default: return 'bg-gray-300';
    }
  };

  const strengthTextColor = (color) => {
    switch (color) {
      case 'weak': return 'text-red-600';
      case 'fair': return 'text-orange-600';
      case 'good': return 'text-yellow-600';
      case 'strong': return 'text-emerald-600';
      case 'veryStrong': return 'text-[#800020]';
      default: return 'text-gray-500';
    }
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#800020] py-12">

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
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-[#a8002b]/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-[#800020]/40 rounded-full blur-[120px] pointer-events-none"></div>

      {/* ✅ Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/[0.04] pointer-events-none hidden lg:block"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-white/[0.03] pointer-events-none hidden lg:block"></div>

      {/* Home / Logo button */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-20 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 hover:border-white/25 transition-colors duration-200 flex items-center space-x-2 group"
        aria-label={t('pages.signup.homeLabel')}
      >
        <img
          src="Logo_new_w.png"
          alt={t('pages.signup.homeLabel')}
          className="h-6 w-6 object-contain"
        />
        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
          {t('pages.signup.homeLabel')}
        </span>
      </Link>

      {/* Main Card */}
      <div className="w-full max-w-2xl relative z-10">

        <div className="relative bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>

          <div className="p-8 md:p-10">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 rounded-2xl bg-[#800020] items-center justify-center shadow-lg mb-4">
                <Store className="h-7 w-7 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                {t('pages.signup.title')}
              </h1>
              <p className="text-gray-500 text-sm">
                {t('pages.signup.subtitle')}
              </p>
            </div>

            {/* Success Message */}
            {signupSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-xl mb-4 flex items-center space-x-2 text-sm">
                <Check className="h-4 w-4 flex-shrink-0" />
                <span>{t('pages.signup.success')}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('pages.signup.form.fullNameLabel')}
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                      focusedField === 'name' ? 'text-[#800020]' : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={signupSuccess}
                    className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      focusedField === 'name'
                        ? 'border-[#800020] ring-2 ring-[#800020]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50 disabled:bg-gray-50`}
                    placeholder={t('pages.signup.form.placeholders.fullName')}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('pages.signup.form.emailLabel')}
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
                    disabled={signupSuccess}
                    className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      focusedField === 'email'
                        ? 'border-[#800020] ring-2 ring-[#800020]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50 disabled:bg-gray-50`}
                    placeholder={t('pages.signup.form.placeholders.email')}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('pages.signup.form.phoneLabel')}
                </label>
                <div className="relative">
                  <Phone
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                      focusedField === 'phone' ? 'text-[#800020]' : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={signupSuccess}
                    className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      focusedField === 'phone'
                        ? 'border-[#800020] ring-2 ring-[#800020]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50 disabled:bg-gray-50`}
                    placeholder={t('pages.signup.form.placeholders.phone')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('pages.signup.form.passwordLabel')}
                </label>
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
                    disabled={signupSuccess}
                    className={`w-full pl-11 pr-11 py-3 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      focusedField === 'password'
                        ? 'border-[#800020] ring-2 ring-[#800020]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50 disabled:bg-gray-50`}
                    placeholder={t('pages.signup.form.placeholders.password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={signupSuccess}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#800020] transition-colors disabled:opacity-50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && !signupSuccess && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500">{t('pages.signup.passwordStrength.label')}</span>
                      <span className={`font-medium ${strengthTextColor(strength.color)}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${strengthBarColor(strength.color)}`}
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {!signupSuccess && (
                  <ul className="mt-3 space-y-1 text-xs">
                    {[
                      { ok: formData.password.length >= 8, label: t('pages.signup.passwordRequirements.atLeast8') },
                      { ok: /[A-Z]/.test(formData.password), label: t('pages.signup.passwordRequirements.oneUppercase') },
                      { ok: /[a-z]/.test(formData.password), label: t('pages.signup.passwordRequirements.oneLowercase') },
                      { ok: /[0-9]/.test(formData.password), label: t('pages.signup.passwordRequirements.oneNumber') },
                      { ok: /[!@#$%^&*()-+]/.test(formData.password), label: t('pages.signup.passwordRequirements.oneSpecial') },
                    ].map((req, i) => (
                      <li key={i} className={`flex items-center ${req.ok ? 'text-emerald-600' : 'text-gray-400'}`}>
                        <Check className={`h-3.5 w-3.5 mr-2 ${req.ok ? 'text-emerald-500' : 'text-gray-300'}`} />
                        {req.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('pages.signup.form.confirmPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                      focusedField === 'confirmPassword' ? 'text-[#800020]' : 'text-gray-400'
                    }`}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={signupSuccess}
                    className={`w-full pl-11 pr-11 py-3 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      focusedField === 'confirmPassword'
                        ? 'border-[#800020] ring-2 ring-[#800020]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50 disabled:bg-gray-50`}
                    placeholder={t('pages.signup.form.placeholders.confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={signupSuccess}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#800020] transition-colors disabled:opacity-50"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && !signupSuccess && (
                  <p className="mt-2 text-xs text-red-600">
                    {t('pages.signup.errors.passwordsDoNotMatch')}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || signupSuccess}
                  className="w-full py-3.5 bg-[#800020] text-white font-semibold rounded-xl hover:bg-[#6a001a] transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('pages.signup.submit.creating')}</span>
                    </>
                  ) : signupSuccess ? (
                    <>
                      <div className="h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('pages.signup.submit.redirecting')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('pages.signup.submit.button')}</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Benefits */}
            <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                <Gift className="h-4 w-4 mr-2 text-[#800020]" />
                {t('pages.signup.benefits.title')}
              </h3>
              <ul className="space-y-2 text-sm">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start text-gray-600">
                    <Check className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    {t(`pages.signup.benefits.items.${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {t('pages.signup.loginPrompt.text')}{' '}
                <Link
                  to="/login"
                  className="text-[#800020] hover:text-[#660019] font-semibold transition-colors"
                >
                  {t('pages.signup.loginPrompt.link')}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <Shield className="h-3 w-3 text-emerald-400" />
            <p className="text-xs text-white/75">
              {t('pages.signup.trust.securedBy')} • {t('pages.signup.trust.joinVendors')}
            </p>
            <Sparkles className="h-3 w-3 text-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;