// src/pages/vendor/Pricing.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Check, X, Zap, Shield,
  BarChart, Loader2, User, Mail,
  ArrowLeft, Sparkles, Award, ChevronRight,
  Calendar, CreditCard, Clock, Star,
  Rocket
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { pricingAPI } from '../../api/pricing.api';
import { vendorAPI } from '../../api/vendor.api';
import StoreFooter from '../../components/StoreFooter';
import Navbar from '../../components/Navbar';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [vendorData, setVendorData] = useState(null);

  const { vendor: authVendor, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const calculateOriginalPrice = (discountedPrice) => {
    return (discountedPrice / 0.65).toFixed(0);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const plansData = await pricingAPI.getPlans();

        let vendorApiData = null;
        if (isAuthenticated && authVendor?.id) {
          try {
            vendorApiData = await vendorAPI.getById(authVendor.id);
          } catch (err) {
            console.error('Error fetching vendor data:', err);
            vendorApiData = authVendor;
          }
        }

        const transformedPlans = plansData.map(plan => {
          let tier = 'basic';
          let description = 'Perfect for new vendors just getting started';

          if (plan.name.toLowerCase().includes('pro')) {
            tier = 'pro';
            description = 'Best for growing businesses';
          } else if (plan.name.toLowerCase().includes('business') || plan.name.toLowerCase().includes('enterprise')) {
            tier = 'business';
            description = 'For established businesses and teams';
          }

          const features = Array.isArray(plan.features)
            ? plan.features.map(feature => ({ included: true, text: feature }))
            : [
                { included: true, text: `${plan.productLimit || 50} Products` },
                { included: true, text: 'Basic Analytics' },
                { included: true, text: 'Store Customization' }
              ];

          return {
            id: plan.id.toString(),
            name: plan.name,
            description,
            price: {
              monthly: plan.price || 0,
              yearly: (plan.price || 0) * 10
            },
            features,
            isPopular: plan.popular || false,
            tier,
            productLimit: plan.productLimit,
            isActive: plan.isActive,
            durationInDays: plan.durationInDays
          };
        });

        const sortedPlans = [...transformedPlans].sort((a, b) => a.price.monthly - b.price.monthly);

        setPlans(sortedPlans);
        setVendorData(vendorApiData);

      } catch (err) {
        setError(err.message || 'Failed to load pricing data');
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchAllData();
    }
  }, [authLoading, isAuthenticated, authVendor?.id]);

  const handleChoosePlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=pricing');
      return;
    }

    const vendorToSend = vendorData || authVendor;

    const paymentData = {
      planData: plan,
      vendorData: vendorToSend,
      billingCycle,
      timestamp: Date.now()
    };

    localStorage.setItem('pending_payment', JSON.stringify(paymentData));
    navigate(`/vendor/payment?plan=${plan.id}&cycle=${billingCycle}`);
  };

  const handleGoBack = () => navigate(-1);

  // ✅ Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#800020]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2e000b]"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]"></div>
          <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="relative inline-block mb-4">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-white/20 border-t-white mx-auto"></div>
            <Rocket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-white" />
          </div>
          <p className="text-white/75 font-medium">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#800020] p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2e000b]"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]"></div>
          <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Pricing</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#800020] text-white rounded-xl hover:bg-[#6a001a] transition-colors duration-200 shadow-sm hover:shadow-md font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#800020] pt-20">

      {/* ✅ Layer 1: Base gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2e000b] pointer-events-none"></div>

      {/* ✅ Layer 2: Radial lights */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]"></div>
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]"></div>
      </div>

      {/* ✅ Layer 3: Grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
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
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)',
        }}
      ></div>

      {/* ✅ Layer 5: Grain */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* ✅ Decorative circles */}
      <div className="fixed top-1/4 -left-32 w-[500px] h-[500px] bg-[#a8002b]/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#800020]/40 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar />

      {/* Back button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        <button
          onClick={handleGoBack}
          className="group inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 hover:border-white/25 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4 text-white/80 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
          <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Back</span>
        </button>
      </div>

      {/* Hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-medium text-white/85 tracking-wide uppercase">
            Best Value for Vendors
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
          <span className="block text-white">Simple, Transparent</span>
          <span className="block mt-2 text-white/60">Pricing</span>
        </h1>

        <div className="w-16 h-1 bg-white/30 rounded-full mb-6 mx-auto"></div>

        <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Start selling for free, upgrade as you grow. Only pay subscription plan — no hidden fees.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/15 rounded-full p-1 mb-10">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`relative px-6 sm:px-8 py-2.5 rounded-full font-medium transition-colors duration-200 ${
              billingCycle === 'monthly'
                ? 'bg-white text-[#800020] shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`relative px-6 sm:px-8 py-2.5 rounded-full font-medium transition-colors duration-200 ${
              billingCycle === 'yearly'
                ? 'bg-white text-[#800020] shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              Save 16%
            </span>
          </button>
        </div>

        {/* Vendor info banner */}
        {isAuthenticated && (vendorData || authVendor) && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-white/60">Logged in as</p>
                    <p className="font-semibold text-white text-sm">
                      {vendorData?.name || authVendor?.name || authVendor?.email}
                    </p>
                  </div>
                </div>
                {(vendorData?.email || authVendor?.email) && (
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Mail className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">
                      {vendorData?.email || authVendor?.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💸</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Pricing Plans Available</h3>
            <p className="text-white/70 mb-6">Please check back later or contact support.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
              const originalPrice = calculateOriginalPrice(price);
              const isYearly = billingCycle === 'yearly';
              const yearlySavings = isYearly && plan.price.monthly > 0
                ? (plan.price.monthly * 12 - plan.price.yearly)
                : 0;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 overflow-hidden hover:-translate-y-1 transition-transform duration-300 ${
                    plan.isPopular ? 'lg:scale-[1.03] ring-2 ring-[#800020]/30' : ''
                  }`}
                >
                  {/* Top accent bar */}
                  <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>

                  {/* Popular badge */}
                  {plan.isPopular && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-[#800020] text-white px-3 py-1 rounded-full text-[11px] font-semibold shadow-md flex items-center space-x-1">
                        <Sparkles className="h-3 w-3" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}

                  <div className="p-7">
                    {/* Header */}
                    <div className="text-center mb-6 pt-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="text-gray-400 line-through text-sm mb-1">
                        {originalPrice} EGP <span className="text-xs">/month</span>
                      </div>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">
                          {price.toFixed(0)}
                        </span>
                        <span className="text-base text-gray-500 ml-1">EGP</span>
                        <span className="text-xs text-gray-400 ml-2">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="inline-block bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">
                          save 35% 🎉
                        </div>
                        {yearlySavings > 0 && (
                          <div className="text-emerald-600 font-medium text-xs mt-1.5">
                            + Save {yearlySavings.toFixed(0)} EGP annually
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2.5 mb-7">
                      {plan.features && plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          {feature.included ? (
                            <>
                              <div className="h-5 w-5 rounded-full bg-[#800020]/10 flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5">
                                <Check className="h-3 w-3 text-[#800020]" />
                              </div>
                              <span className="text-sm text-gray-600 leading-relaxed">{feature.text}</span>
                            </>
                          ) : (
                            <>
                              <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5">
                                <X className="h-3 w-3 text-gray-400" />
                              </div>
                              <span className="text-sm text-gray-400 leading-relaxed">{feature.text}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => handleChoosePlan(plan)}
                      className={`group/btn w-full py-3.5 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-1.5 ${
                        plan.isPopular
                          ? 'bg-[#800020] text-white hover:bg-[#6a001a] shadow-sm hover:shadow-md'
                          : 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <span>Choose Plan</span>
                      <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center">
                      <CreditCard className="h-3 w-3 mr-1" />
                      Secure checkout • 5-day money back
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {[
            {
              icon: <Zap className="h-6 w-6" />,
              title: 'No Setup Fees',
              description: 'Start selling immediately with zero upfront costs. Only pay when you are ready to sell.'
            },
            {
              icon: <BarChart className="h-6 w-6" />,
              title: 'Grow With You',
              description: 'Easily upgrade your plan as your business grows. No long-term contracts required.'
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: '5-Day Money Back',
              description: 'Try any paid plan risk-free. Get a full refund within 5 days if not satisfied.'
            }
          ].map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 p-7 text-center hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#800020]/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#800020] transition-colors duration-300">
                <div className="text-[#800020] group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-4 tracking-tight">
            <span className="block text-white">Frequently Asked</span>
            <span className="block mt-2 text-white/60">Questions</span>
          </h2>
          <div className="w-16 h-1 bg-white/30 rounded-full mb-10 mx-auto"></div>

          <div className="space-y-4">
            {[
              { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated.' },
              { q: 'Is there a limit on sales volume?', a: 'No, there are no limits on how much you can sell. All plans include unlimited sales volume.' },
              { q: 'Do you offer custom pricing for high-volume sellers?', a: 'Yes, our Business plan includes custom commission rates. Contact our sales team for enterprise pricing.' },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 p-6"
              >
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-start">
                  <span className="h-6 w-6 rounded-full bg-[#800020]/10 text-[#800020] flex items-center justify-center mr-2.5 text-xs font-bold flex-shrink-0 mt-0.5">
                    Q
                  </span>
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12 pt-8 border-t border-white/10">
          {[
            { icon: CreditCard, text: 'Secure Payments' },
            { icon: Clock, text: '24/7 Support' },
            { icon: Calendar, text: 'No Long-term Contracts' },
            { icon: Star, text: 'Trusted by 1000+ Vendors' },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
                <item.icon className="h-3.5 w-3.5 text-white/90" />
              </div>
              <span className="text-sm text-white/75 font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <StoreFooter />
    </div>
  );
};

export default Pricing;