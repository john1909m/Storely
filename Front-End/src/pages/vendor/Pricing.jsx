// src/pages/vendor/Pricing.jsx (Vision Pro AR Style)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check, X, Zap, Shield,
  BarChart, Loader2, User, Mail, 
  ArrowLeft, Sparkles, Award, ChevronRight,
  Calendar, CreditCard, Clock, Star,
   Rocket, Globe, Eye
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { pricingAPI } from '../../api/pricing.api';
import { vendorAPI } from '../../api/vendor.api';
import StoreFooter from '../../components/StoreFooter';
import Navbar from '../../components/Navbar';

// Vision Pro AR Styles
const pricingStyles = `
  @keyframes float-3d {
    0%, 100% {
      transform: translateZ(0px) translateY(0px) rotateX(0deg) rotateY(0deg);
    }
    25% {
      transform: translateZ(50px) translateY(-20px) rotateX(5deg) rotateY(5deg);
    }
    50% {
      transform: translateZ(100px) translateY(-40px) rotateX(10deg) rotateY(10deg);
    }
    75% {
      transform: translateZ(50px) translateY(-20px) rotateX(5deg) rotateY(5deg);
    }
  }

  @keyframes float-particle {
    0% {
      transform: translateZ(0px) translateY(0px);
      opacity: 0;
    }
    50% {
      transform: translateZ(100px) translateY(-100px);
      opacity: 1;
    }
    100% {
      transform: translateZ(200px) translateY(-200px);
      opacity: 0;
    }
  }

  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.1;
      transform: scale(1);
    }
    50% {
      opacity: 0.15;
      transform: scale(1.1);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-float-3d {
    animation: float-3d 6s ease-in-out infinite;
  }

  .animate-float-particle {
    animation: float-particle 5s linear infinite;
  }

  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .perspective-2000 {
    perspective: 2000px;
  }

  .transform-gpu {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-5px) translateZ(20px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 30px rgba(79, 70, 229, 0.3);
  }

  .hover-glow:hover {
    box-shadow: 0 0 30px rgba(79, 70, 229, 0.3);
  }

  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }

  .glass-3d {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.05);
    transform-style: preserve-3d;
  }

  .glass-3d::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
    border-radius: inherit;
    transform: translateZ(-1px);
  }
`;

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  
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
          let tier = 'Basic';
          let color = 'from-blue-400 to-cyan-400';
          let description = '';
          let bgLight = 'bg-blue-400/10';
          let borderColor = 'border-blue-400/20';
          let textColor = 'text-blue-400';
          
          if (plan.name.toLowerCase().includes('pro')) {
            tier = 'pro';
            color = 'from-indigo-400 to-purple-400';
            bgLight = 'bg-indigo-400/10';
            borderColor = 'border-indigo-400/20';
            textColor = 'text-indigo-400';
            description = 'Best for growing businesses';
          } else if (plan.name.toLowerCase().includes('business') || plan.name.toLowerCase().includes('enterprise')) {
            tier = 'business';
            color = 'from-purple-400 to-pink-400';
            bgLight = 'bg-purple-400/10';
            borderColor = 'border-purple-400/20';
            textColor = 'text-purple-400';
            description = 'For established businesses and teams';
          } else {
            description = 'Perfect for new vendors just getting started';
            bgLight = 'bg-blue-400/10';
            borderColor = 'border-blue-400/20';
            textColor = 'text-blue-400';
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
            borderColor: borderColor,
            textColor: textColor,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950/100 to-purple-950/60 flex items-center justify-center">
        <div className="text-center relative">
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => (
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
          
          <div className="relative z-10">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-400/30 border-t-indigo-400 mx-auto mb-4"></div>
              <Rocket className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-gray-300 font-medium">Loading pricing plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950/100 to-purple-950/60 flex items-center justify-center">
        <div className="text-center max-w-md glass-3d rounded-3xl p-8">
          <div className="text-red-400 text-5xl mb-4 animate-float-3d">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Pricing</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-xl hover:shadow-2xl transition-all transform-gpu hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950/100 to-purple-950/60">
      <style>{pricingStyles}</style>
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* 3D Grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg) scale(2)',
          transformOrigin: 'top',
        }}></div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
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

      <Navbar />

      {/* Back Button - 3D Style */}
      <div className="container mx-auto px-4 pt-6 relative z-10">
        <button
          onClick={handleGoBack}
          className="group inline-flex items-center space-x-2 px-4 py-2.5 glass-3d rounded-xl transition-all transform-gpu hover:scale-105 hover:translate-z-10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-gray-300">Back</span>
        </button>
      </div>

      {/* Hero Section - 3D */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-16 md:py-20 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-3d px-4 py-2 rounded-full mb-6 transform-gpu hover:scale-105 transition-all duration-300">
            <Award className="h-4 w-4 text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Best Value for Vendors</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Simple, Transparent
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 md:mb-10 px-4">
            Start selling for free, upgrade as you grow. Only pay subscription plan - no hidden fees.
          </p>
          
          {/* Billing Toggle - 3D */}
          <div className="inline-flex items-center glass-3d rounded-full p-1 mb-8 md:mb-12 shadow-2xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 transform-gpu ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-lg scale-105'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`relative px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 transform-gpu ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-lg scale-105'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly 
              <span className="absolute -top-2 -right-2 bg-green-400 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse shadow-lg">
                Save 16%
              </span>
            </button>
          </div>

          {/* Vendor Info Banner - 3D */}
          {isAuthenticated && (vendorData || authVendor) && (
            <div className="max-w-2xl mx-auto">
              <div className="glass-3d rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-400">Logged in as</p>
                      <p className="font-semibold text-white">
                        {vendorData?.name || authVendor?.name || authVendor?.email}
                      </p>
                    </div>
                  </div>
                  {(vendorData?.email || authVendor?.email) && (
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
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

      <div className="container mx-auto px-4 py-16 md:py-20 -mt-8 relative z-10">
        {/* Pricing Cards */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4 animate-float-3d">💸</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Pricing Plans Available</h3>
            <p className="text-gray-400 mb-6">Please check back later or contact support.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto perspective-2000">
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
                  className="group relative transform-gpu transition-all duration-500"
                  style={{
                    transform: `perspective(1000px) translateZ(${hoveredPlan === index ? 50 : 0}px)`,
                    zIndex: hoveredPlan === index ? 20 : 1,
                  }}
                  onMouseEnter={() => setHoveredPlan(index)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  <div className={`glass-3d rounded-3xl overflow-hidden relative hover-lift ${
                    plan.isPopular ? 'border-indigo-400/50 scale-105 lg:scale-110' : ''
                  }`}>
                    
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/0 to-purple-400/0 group-hover:via-indigo-400/10 group-hover:to-purple-400/10 transition-all duration-500 blur-xl ${
                      hoveredPlan === index ? 'opacity-100' : 'opacity-0'
                    }`}></div>

                    {/* Popular Badge - 3D */}
                    {plan.isPopular && (
                      <>
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                          <div className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-2xl flex items-center space-x-1 transform-gpu hover:scale-110 transition-all duration-300">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            <span>Most Popular</span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className={`h-2 bg-gradient-to-r ${plan.color}`}></div>

                    <div className="p-8 relative z-10">
                      {/* Plan Header */}
                      <div className="text-center mb-6">
                        <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                          hoveredPlan === index ? plan.textColor : 'text-white'
                        }`}>
                          {plan.name}
                        </h3>
                        <p className="text-sm text-gray-400">{plan.description}</p>
                      </div>

                      {/* Price - 3D */}
                      <div className="text-center mb-6">
                        <div className="text-gray-500 line-through text-lg mb-1">
                          {originalPrice} EGP <span className="text-sm">/month</span>
                        </div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold text-white">
                            {price.toFixed(0)}
                          </span>
                          <span className="text-lg text-gray-400 ml-1">EGP</span>
                          <span className="text-sm text-gray-500 ml-2">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                        </div>
                        
                        {/* Discount Badge - 3D */}
                        <div className="mt-3">
                          <div className="inline-block bg-green-400/20 text-green-400 px-3 py-1.5 rounded-full text-sm font-medium border border-green-400/30">
                            save 35% 🎉
                          </div>
                          {yearlySavings > 0 && (
                            <div className="text-green-400 font-medium text-xs mt-1">
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
                                <div className={`h-5 w-5 rounded-full ${plan.bgLight} border ${plan.borderColor} flex items-center justify-center mr-3 flex-shrink-0 transform-gpu group-hover:scale-110 transition-transform`}>
                                  <Check className={`h-3 w-3 ${plan.textColor}`} />
                                </div>
                                <span className="text-sm text-gray-300">{feature.text}</span>
                              </>
                            ) : (
                              <>
                                <div className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 flex-shrink-0">
                                  <X className="h-3 w-3 text-gray-600" />
                                </div>
                                <span className="text-sm text-gray-600">{feature.text}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* CTA Button - 3D */}
                      <button
                        onClick={() => handleChoosePlan(plan)}
                        className={`group/btn relative w-full py-4 text-center font-semibold rounded-xl overflow-hidden transform-gpu hover:scale-105 transition-all duration-300 ${
                          plan.isPopular
                            ? 'bg-gradient-to-r from-indigo-400 to-purple-400'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        
                        <div className="relative z-10 flex items-center justify-center space-x-2">
                          <span className={plan.isPopular ? 'text-white' : 'text-gray-300'}>Choose Plan</span>
                          <ChevronRight className={`h-4 w-4 group-hover/btn:translate-x-1 transition-transform ${
                            plan.isPopular ? 'text-white' : 'text-gray-400'
                          }`} />
                        </div>
                      </button>

                      {/* Guarantee */}
                      <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center">
                        <CreditCard className="h-3 w-3 mr-1 text-gray-600" />
                        Secure checkout • 5-day money back
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Value Props - 3D */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-20">
          {[
            {
              icon: <Zap className="h-6 w-6 md:h-8 md:w-8" />,
              title: 'No Setup Fees',
              description: 'Start selling immediately with zero upfront costs. Only pay when you are ready to sell.',
              color: 'from-blue-400 to-cyan-400',
              bgColor: 'bg-blue-400/10',
              borderColor: 'border-blue-400/20',
              textColor: 'text-blue-400'
            },
            {
              icon: <BarChart className="h-6 w-6 md:h-8 md:w-8" />,
              title: 'Grow With You',
              description: 'Easily upgrade your plan as your business grows. No long-term contracts required.',
              color: 'from-green-400 to-emerald-400',
              bgColor: 'bg-green-400/10',
              borderColor: 'border-green-400/20',
              textColor: 'text-green-400'
            },
            {
              icon: <Shield className="h-6 w-6 md:h-8 md:w-8" />,
              title: '5-Day Money Back',
              description: 'Try any paid plan risk-free. Get a full refund within 5 days if not satisfied.',
              color: 'from-purple-400 to-pink-400',
              bgColor: 'bg-purple-400/10',
              borderColor: 'border-purple-400/20',
              textColor: 'text-purple-400'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="group glass-3d rounded-xl md:rounded-2xl p-6 md:p-8 text-center hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`h-16 w-16 md:h-20 md:w-20 ${item.bgColor} border ${item.borderColor} rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <div className={item.textColor}>
                  {item.icon}
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{item.title}</h3>
              <p className="text-sm md:text-base text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>

        {/* FAQ - 3D */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
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
                className="group glass-3d rounded-xl md:rounded-2xl p-5 md:p-6 hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3 flex items-center">
                  <span className="h-6 w-6 rounded-full bg-indigo-400/20 text-indigo-400 flex items-center justify-center mr-2 text-sm flex-shrink-0 border border-indigo-400/30">
                    Q
                  </span>
                  {faq.q}
                </h3>
                <p className="text-sm md:text-base text-gray-400 pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges - 3D */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12 pt-8 border-t border-white/10">
          {[
            { icon: CreditCard, text: 'Secure Payments', color: 'blue' },
            { icon: Clock, text: '24/7 Support', color: 'purple' },
            { icon: Calendar, text: 'No Long-term Contracts', color: 'green' },
            { icon: Star, text: 'Trusted by 1000+ Vendors', color: 'yellow' },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-gray-400 group">
              <div className={`h-8 w-8 rounded-lg bg-${item.color}-400/10 border border-${item.color}-400/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <item.icon className={`h-4 w-4 text-${item.color}-400`} />
              </div>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      
      <StoreFooter />
    </div>
  );
};

export default Pricing;