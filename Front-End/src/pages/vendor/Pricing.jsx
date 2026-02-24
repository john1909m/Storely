// src/pages/vendor/Pricing.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check, X, Star, Users, Zap, Shield,
  BarChart, Globe, CreditCard, Tag, Loader2, User, Mail, Phone, Store
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { pricingAPI } from '../../api/pricing.api';
import { vendorAPI } from '../../api/vendor.api';
import StoreFooter from '../../components/StoreFooter';
import { subscriptionAPI } from './../../api/subscription.api';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [featuresComparison, setFeaturesComparison] = useState([]);
  const [error, setError] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  
  const { vendor: authVendor, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // دالة مساعدة لحساب السعر الأصلي (الأعلى) من السعر الحالي
  // بافتراض أن السعر الحالي هو السعر بعد الخصم بنسبة 35%
  const calculateOriginalPrice = (discountedPrice) => {
    // إذا كان السعر المخفّض هو 65% من السعر الأصلي، فإن:
    // originalPrice = discountedPrice / 0.65
    return (discountedPrice / 0.65).toFixed(0); // نعيده كعدد صحيح
  };

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch plans from API
        const plansData = await pricingAPI.getPlans();
        
        // Fetch vendor data if authenticated
        let vendorApiData = null;
        if (isAuthenticated && authVendor?.id) {
          try {
            vendorApiData = await vendorAPI.getById(authVendor.id);
          } catch (err) {
            console.error('Error fetching vendor data:', err);
            vendorApiData = authVendor;
          }
        }
        
        // Transform plans data
        const transformedPlans = plansData.map(plan => {
          let tier = 'Basic';
          let color = 'from-blue-500 to-cyan-500';
          let description = '';
          
          
          if (plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('pro')) {
            tier = 'pro';
            color = 'from-indigo-500 to-purple-500';
            description = 'Best for growing businesses';
            
          } else if (plan.name.toLowerCase().includes('basic') || plan.name.toLowerCase().includes('enterprise')) {
            tier = 'Basic';
            color = 'from-purple-500 to-pink-500';
            description = 'For established businesses and teams';
            
          } else {
            description = '';
            
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
            features: features,
            isPopular: plan.popular || false,
            tier: tier,
            productLimit: plan.productLimit,
            isActive: plan.isActive,
            durationInDays: plan.durationInDays
          };
        });
        
        // ترتيب الخطط تصاعدياً حسب السعر الشهري
        const sortedPlans = [...transformedPlans].sort((a, b) => {
          const priceA = a.price.monthly;
          const priceB = b.price.monthly;
          return priceA - priceB; // ترتيب تصاعدي (من الأقل للأعلى)
        });
        
        setPlans(sortedPlans);
        setVendorData(vendorApiData);
        
        // Generate features comparison
        const comparison = generateFeaturesComparison(sortedPlans);
        setFeaturesComparison(comparison);
        
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

  const generateFeaturesComparison = (plans) => {
    const basicPlan = plans.find(p => p.tier === 'Starter') || plans[0];
    const proPlan = plans.find(p => p.tier === 'Basic') || plans.find(p => p.name.toLowerCase().includes('basic')) || plans[1];
    const businessPlan = plans.find(p => p.tier === 'Pro') || plans.find(p => p.name.toLowerCase().includes('pro')) || plans[2];
    
    return [
      { 
        name: 'Plan Name', 
        starter: basicPlan?.name || 'Starter', 
        pro: proPlan?.name || 'Basic', 
        business: businessPlan?.name || 'Pro' 
      },
      { 
        name: 'Monthly Price', 
        starter: `${basicPlan?.price.monthly || 0} EGP`, 
        pro: `${proPlan?.price.monthly || 29} EGP`, 
        business: `${businessPlan?.price.monthly || 99} EGP` 
      },
      
      { 
        name: 'Product Limit', 
        starter: basicPlan?.productLimit, 
        pro: proPlan?.productLimit === 0 ? 'Unlimited' : proPlan?.productLimit || 'Unlimited', 
        business: businessPlan?.productLimit === 0 ? 'Unlimited' : businessPlan?.productLimit || 'Unlimited' 
      },
      
      { 
        name: 'Advanced Analytics', 
        starter: basicPlan?.tier === 'Starter' ? false : true, 
        pro: proPlan?.tier === 'Basic' ? false : false, 
        business: businessPlan?.tier === 'Pro' ? true : false 
      },
      
      { 
        name: 'Priority Support', 
        starter: false, 
        pro: true, 
        business: true
      },
    ];
  };

  const handleChoosePlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=pricing');
      return;
    }
    
    // Use vendorData if available, otherwise fallback to authVendor
    const vendorToSend = vendorData || authVendor;
    
    // Save to localStorage before navigation
    const paymentData = {
      planData: plan,
      vendorData: vendorToSend,
      billingCycle: billingCycle,
      timestamp: Date.now()
    };
    
    localStorage.setItem('pending_payment', JSON.stringify(paymentData));
    
    navigate(`/vendor/payment?plan=${plan.id}&cycle=${billingCycle}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pricing plans...</p>
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
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Start selling for free, upgrade as you grow. Only pay subscription plan - no hidden fees.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full p-1 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white hover:text-indigo-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white hover:text-indigo-100'
              }`}
            >
              Yearly <span className="text-green-300 ml-1">Save 16%</span>
            </button>
          </div>

          {/* Vendor Info Banner */}
          {isAuthenticated && (vendorData || authVendor) && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex items-center justify-center space-x-4">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left text-white">
                  <p className="text-sm opacity-90">Logged in as</p>
                  <p className="font-semibold">{vendorData?.name || authVendor?.name || authVendor?.email}</p>
                </div>
                {(vendorData?.email || authVendor?.email) && (
                  <div className="hidden sm:flex items-center space-x-2 text-sm opacity-75">
                    <Mail className="h-4 w-4" />
                    <span>{vendorData?.email || authVendor?.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-8">
        {/* Pricing Cards */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Pricing Plans Available</h3>
            <p className="text-gray-600 mb-6">Please check back later or contact support.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {plans.map((plan, index) => {
                const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
                // --- التعديل هنا: حساب السعر الأصلي (الأعلى) ---
                const originalPrice = calculateOriginalPrice(price);
                // ------------------------------------------------
                const isYearly = billingCycle === 'yearly';
                const yearlySavings = isYearly && plan.price.monthly > 0 
                  ? (plan.price.monthly * 12 - plan.price.yearly) 
                  : 0;

                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-3xl shadow-2xl overflow-hidden border relative ${
                      plan.isPopular
                        ? 'border-indigo-300'
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.isPopular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/20">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-b-3xl text-sm font-semibold shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className={`h-2 bg-gradient-to-r ${plan.color}`}></div>

                    <div className="p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>

                      {/* Price - تم تعديل هذا القسم */}
                      <div className="text-center mb-8">
                        {/* عرض السعر الأصلي مشطوباً */}
                        <div className="text-red-700 line-through text-xl">
                          {originalPrice} EGP /month
                        </div>
                        <div className="flex items-baseline justify-center mt-1">
                          <span className="text-5xl font-bold text-gray-900">
                            {price.toFixed(0)}
                          </span>
                          <span className="text-lg text-gray-600 ml-1">EGP</span>
                          <span className="text-gray-600 ml-2">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                        </div>
                        {/* عرض نسبة الخصم */}
                        <div className="text-green-600 font-medium mt-2">
                         save 35% 🎉
                        </div>
                        {yearlySavings > 0 && (
                          <div className="text-green-600 font-medium text-sm">
                            بالإضافة إلى توفير {yearlySavings.toFixed(0)} EGP سنوياً
                          </div>
                        )}
                      </div>
                      {/* -------------------------- */}

                      {/* Features */}
                      <div className="space-y-4 mb-8">
                        {plan.features && plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            {feature.included ? (
                              <Check className="h-5 w-5 text-green-500 mr-3" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mr-3" />
                            )}
                            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleChoosePlan(plan)}
                        className="block w-full py-4 text-center font-semibold rounded-xl transition-all cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                      >
                        Choose Plan
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Features Comparison Table */}
            
          </>
        )}

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Setup Fees</h3>
            <p className="text-gray-600">
              Start selling immediately with zero upfront costs. Only pay when you are ready to sell.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Grow With You</h3>
            <p className="text-gray-600">
              Easily upgrade your plan as your business grows. No long-term contracts required.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">5-Day Money Back</h3>
            <p className="text-gray-600">
              Try any paid plan risk-free. Get a full refund within 5 days if not satisfied.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
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
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        
      </div>
      <StoreFooter />
    </div>
  );
};

export default Pricing;