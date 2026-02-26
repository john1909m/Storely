// src/pages/vendor/Pricing.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check, X, Zap, Shield,
  BarChart, Loader2, User, Mail, 
  ArrowLeft, Sparkles, Award, ChevronRight,
  Calendar, CreditCard, Clock, Star
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { pricingAPI } from '../../api/pricing.api';
import { vendorAPI } from '../../api/vendor.api';
import StoreFooter from '../../components/StoreFooter';
import Navbar from '../../components/Navbar';

// إضافة أنماط CSS للـ animations
const pricingStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes shine {
    0% { background-position: -100px; }
    40%, 100% { background-position: 200px; }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-shine {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    background-size: 200px 100%;
    animation: shine 3s infinite;
  }

  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .hover-glow:hover {
    box-shadow: 0 0 15px rgba(79, 70, 229, 0.3);
  }

  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
`;

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  
  const { vendor: authVendor, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // دالة مساعدة لحساب السعر الأصلي (الأعلى) من السعر الحالي
  const calculateOriginalPrice = (discountedPrice) => {
    return (discountedPrice / 0.65).toFixed(0);
  };

  // Fetch all data
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
          let tier = 'Basic';
          let color = 'from-blue-500 to-cyan-500';
          let description = '';
          let bgLight = 'bg-blue-50';
          
          if (plan.name.toLowerCase().includes('pro')) {
            tier = 'pro';
            color = 'from-indigo-500 to-purple-500';
            bgLight = 'bg-indigo-50';
            description = 'Best for growing businesses';
          } else if (plan.name.toLowerCase().includes('business') || plan.name.toLowerCase().includes('enterprise')) {
            tier = 'business';
            color = 'from-purple-500 to-pink-500';
            bgLight = 'bg-purple-50';
            description = 'For established businesses and teams';
          } else {
            description = 'Perfect for new vendors just getting started';
            bgLight = 'bg-blue-50';
          }
          
          const features = Array.isArray(plan.features) 
            ? plan.features.map(feature => ({
                included: true,
                text: feature
              }))
            : [
                { included: true, text: `${plan.productLimit || 50} Products` },
                { included: true, text: 'Basic Analytics' },
                { included: true, text: 'Store Customization' }
              ];
          
          return {
            id: plan.id.toString(),
            name: plan.name,
            description: description,
            price: { 
              monthly: plan.price || 0,
              yearly: (plan.price || 0) * 10
            },
            color: color,
            bgLight: bgLight,
            features: features,
            isPopular: plan.popular || false,
            tier: tier,
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
      billingCycle: billingCycle,
      timestamp: Date.now()
    };
    
    localStorage.setItem('pending_payment', JSON.stringify(paymentData));
    
    navigate(`/vendor/payment?plan=${plan.id}&cycle=${billingCycle}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-indigo-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Pricing</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* إضافة أنماط CSS */}
      <style>{pricingStyles}</style>
      
      {/* Navbar */}
      <Navbar />

      {/* زر العودة */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl" style={{ animation: 'float 3s ease-in-out 1s infinite' }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-20 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Award className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium">Best Value for Vendors</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-8 md:mb-10 px-4">
            Start selling for free, upgrade as you grow. Only pay subscription plan - no hidden fees.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 mb-8 md:mb-12 shadow-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white hover:text-indigo-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`relative px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                billingCycle === 'yearly'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white hover:text-indigo-100'
              }`}
            >
              Yearly 
              <span className="absolute -top-2 -right-2 bg-green-400 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse-slow">
                Save 16%
              </span>
            </button>
          </div>

          {/* Vendor Info Banner */}
          {isAuthenticated && (vendorData || authVendor) && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-indigo-200">Logged in as</p>
                      <p className="font-semibold text-white">
                        {vendorData?.name || authVendor?.name || authVendor?.email}
                      </p>
                    </div>
                  </div>
                  {(vendorData?.email || authVendor?.email) && (
                    <div className="flex items-center space-x-2 text-sm text-indigo-200">
                      <Mail className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{vendorData?.email || authVendor?.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 -mt-8">
        {/* Pricing Cards */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4 animate-float">💸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Pricing Plans Available</h3>
            <p className="text-gray-600 mb-6">Please check back later or contact support.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
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
                  className={`group bg-white rounded-3xl shadow-xl overflow-hidden border-2 relative hover-lift transition-all duration-500 ${
                    plan.isPopular
                      ? 'border-indigo-400 scale-105 lg:scale-110 z-10'
                      : 'border-gray-100 hover:border-indigo-200'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Popular Badge - FIXED POSITION */}
                  {plan.isPopular && (
                    <>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 whitespace-nowrap">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-b-full text-sm font-semibold shadow-xl flex items-center mt-3 space-x-1">
                          <Sparkles className="h-4 w-4" />
                          <span>Most Popular</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 pointer-events-none"></div>
                    </>
                  )}

                  <div className={`h-2 bg-gradient-to-r ${plan.color} ${plan.isPopular ? 'animate-shine' : ''}`}></div>

                  <div className="p-8 relative z-10">
                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="text-gray-400 line-through text-lg mb-1">
                        {originalPrice} EGP <span className="text-sm">/month</span>
                      </div>
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-gray-900">
                          {price.toFixed(0)}
                        </span>
                        <span className="text-lg text-gray-600 ml-1">EGP</span>
                        <span className="text-sm text-gray-500 ml-2">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      </div>
                      
                      {/* خصم إضافي */}
                      <div className="mt-3">
                        <div className="inline-block bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                          save 35% 🎉
                        </div>
                        {yearlySavings > 0 && (
                          <div className="text-green-600 font-medium text-xs mt-1">
                            + Save {yearlySavings.toFixed(0)} EGP annually
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {plan.features && plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          {feature.included ? (
                            <>
                              <div className={`h-5 w-5 rounded-full ${plan.bgLight} flex items-center justify-center mr-3 flex-shrink-0`}>
                                <Check className="h-3 w-3" style={{ color: plan.color.split(' ')[1].replace('from-', '') }} />
                              </div>
                              <span className="text-sm text-gray-700">{feature.text}</span>
                            </>
                          ) : (
                            <>
                              <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                                <X className="h-3 w-3 text-gray-400" />
                              </div>
                              <span className="text-sm text-gray-400">{feature.text}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleChoosePlan(plan)}
                      className={`w-full py-4 text-center font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group/btn ${
                        plan.isPopular
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                      }`}
                    >
                      <span>Choose Plan</span>
                      <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    {/* ضمان */}
                    <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center">
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
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-20">
          {[
            {
              icon: <Zap className="h-6 w-6 md:h-8 md:w-8" />,
              title: 'No Setup Fees',
              description: 'Start selling immediately with zero upfront costs. Only pay when you are ready to sell.',
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'bg-blue-50'
            },
            {
              icon: <BarChart className="h-6 w-6 md:h-8 md:w-8" />,
              title: 'Grow With You',
              description: 'Easily upgrade your plan as your business grows. No long-term contracts required.',
              color: 'from-green-500 to-emerald-500',
              bgColor: 'bg-green-50'
            },
            {
              icon: <Shield className="h-6 w-6 md:h-8 md:w-8" />,
              title: '5-Day Money Back',
              description: 'Try any paid plan risk-free. Get a full refund within 5 days if not satisfied.',
              color: 'from-purple-500 to-pink-500',
              bgColor: 'bg-purple-50'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-100 text-center hover:shadow-2xl transition-all duration-500 hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`h-16 w-16 md:h-20 md:w-20 ${item.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                  {item.icon}
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{item.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 md:space-y-6">
            {[
              {
                q: 'Can I switch plans later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated.'
              },
              {
                q: 'Is there a limit on sales volume?',
                a: 'No, there are no limits on how much you can sell. All plans include unlimited sales volume.'
              },
              {
                q: 'Do you offer custom pricing for high-volume sellers?',
                a: 'Yes, our Business plan includes custom commission rates. Contact our sales team for enterprise pricing.'
              },
            ].map((faq, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-indigo-200"
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 flex items-center">
                  <span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 text-sm flex-shrink-0">
                    Q
                  </span>
                  {faq.q}
                </h3>
                <p className="text-sm md:text-base text-gray-600 pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-gray-500">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm">Secure Payments</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm">24/7 Support</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">No Long-term Contracts</span>
          </div>
          
        </div>
      </div>
      
      <StoreFooter />
    </div>
  );
};

export default Pricing;