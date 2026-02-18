// src/pages/vendor/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, CheckCircle, Shield,
  Lock, Calendar, FileText, Download, Loader2,
  AlertCircle, Store, User, Mail, Phone, Calendar as CalendarIcon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { pricingAPI } from '../../api/pricing.api';
import { vendorAPI } from '../../api/vendor.api';

const VendorPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vendor: authVendor, isAuthenticated } = useAuth();
  
  // Parse URL parameters
  const queryParams = new URLSearchParams(location.search);
  const planId = queryParams.get('plan');
  const billingCycle = queryParams.get('cycle') || 'monthly';

  const [plan, setPlan] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingStorage, setCheckingStorage] = useState(true);

  // الخطوة 1: نقرأ من localStorage أول حاجة
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedPayment = localStorage.getItem('pending_payment');
        if (savedPayment) {
          const parsed = JSON.parse(savedPayment);
          console.log('Found in localStorage:', parsed);
          
          // بنستخدم البيانات من localStorage
          if (parsed.planData) setPlan(parsed.planData);
          if (parsed.vendorData) setVendorData(parsed.vendorData);
        }
      } catch (err) {
        console.error('Error reading localStorage:', err);
      } finally {
        setCheckingStorage(false);
      }
    };

    loadFromStorage();
  }, []); // شغال مرة واحدة

  // الخطوة 2: بعد ما نقرأ من localStorage، نتحقق من الـ URL
  useEffect(() => {
    // مستنيين чтение من localStorage يخلص
    if (checkingStorage) return;

    // Check authentication first
    if (!isAuthenticated) {
      navigate('/login?redirect=pricing');
      return;
    }

    // لو البيانات موجودة من localStorage، نستخدمها ونخلص
    if (plan && vendorData) {
      console.log('Using data from localStorage');
      setIsLoading(false);
      return;
    }

    // لو مفيش planId في الـ URL، نروح للـ pricing
    if (!planId) {
      console.log('No plan ID, redirecting to pricing');
      navigate('/vendor/pricing');
      return;
    }

    // لو وصلنا هنا، معناه إننا محتاجين نجيب البيانات من API
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching from API - planId:', planId);

        // Fetch plan from API
        const planResult = await pricingAPI.getPlanById(planId);
        
        if (!planResult) {
          throw new Error('Plan not found');
        }
        
        setPlan(planResult);
        
        // Vendor data from auth
        if (authVendor) {
          setVendorData(authVendor);
        }
        
        // Save to localStorage for next time
        localStorage.setItem('pending_payment', JSON.stringify({
          planData: planResult,
          vendorData: authVendor,
          billingCycle: billingCycle,
          timestamp: Date.now()
        }));
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [checkingStorage, planId, isAuthenticated, authVendor, plan, vendorData]);

  const formatCurrency = (amount) => {
    const numericAmount = Number(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericAmount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVendorName = () => {
    return vendorData?.name || vendorData?.vendorName || vendorData?.fullName || 'Not provided';
  };

  const getVendorEmail = () => {
    return vendorData?.email || 'Not provided';
  };

  const getVendorPhone = () => {
    return vendorData?.phoneNumber || vendorData?.phone || 'Not provided';
  };

  const getVendorId = () => {
    return vendorData?.id || vendorData?.vendorId || 'N/A';
  };

  // Show loading state
  if (isLoading || checkingStorage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center h-20 w-20 bg-red-50 rounded-full mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Loading Data</h1>
            <p className="text-gray-600 mb-8">{error || 'Failed to load payment details'}</p>
            <button
              onClick={() => navigate('/vendor/pricing')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              Back to Pricing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <button onClick={() => navigate('/vendor/pricing')} className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
              </div>
              <p className="text-gray-600">Review your plan and vendor information</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Plan Summary Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-xl">
                  <span className="text-indigo-700 font-semibold capitalize">{billingCycle} Billing</span>
                </div>
              </div>

              {/* Plan Details */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{plan?.name} Plan</h3>
                  </div>
                  {plan?.isPopular && (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/80 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">{billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Price</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(plan?.price[billingCycle] || 0)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {billingCycle === 'yearly' && 'billed annually'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">What's included:</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {plan?.features && Array.isArray(plan.features) ? (
                    plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature.text || feature}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{plan?.productLimit || 50} Products</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Basic Analytics</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Store Customization</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">24/7 Support</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Plan Subscription</span>
                    <span className="font-medium">{formatCurrency(plan?.price[billingCycle] || 0)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Setup Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span>Total Today</span>
                    <span className="text-indigo-600">{formatCurrency((plan?.price[billingCycle] || 0))}</span>
                  </div>
                </div>
              </div>

              {/* Next Billing Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Next billing date:</span>{' '}
                      {formatDate(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      You can cancel anytime before the next billing cycle
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Information Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vendor Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Vendor Details */}
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">{getVendorName()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <Mail className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-900">{getVendorEmail()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <Phone className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{getVendorPhone()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <Store className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Vendor ID</p>
                      <p className="font-medium text-gray-900">#{getVendorId()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm text-green-900 font-medium">Account verified and ready for subscription</p>
                    <p className="text-xs text-green-700 mt-1">Your vendor account is active and eligible for plan upgrade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Summary</h2>

              {/* Quick Summary */}
              <div className="mb-8">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl mb-4">
                  <div className="text-lg font-bold text-gray-900 mb-1">{plan?.name} Plan</div>
                  <div className="text-sm text-gray-600 capitalize">{billingCycle} subscription</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(plan?.price[billingCycle])}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-indigo-600">{formatCurrency((plan?.price[billingCycle] || 0))}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => alert('Payment integration coming soon!')}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Lock className="h-5 w-5" />
                  <span>Proceed to Payment</span>
                </button>
                
                <button
                  onClick={() => navigate('/vendor/pricing')}
                  className="w-full py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Change Plan
                </button>
              </div>

              {/* Security Note */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Secure SSL encrypted checkout
                </p>
              </div>

              {/* Need Help */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Need Help?</div>
                    <p className="text-sm text-gray-600">
                      Questions about billing? Visit our{' '}
                      <a href="/help" className="text-indigo-600 hover:text-indigo-500">help center</a>{' '}
                      or{' '}
                      <a href="/contact" className="text-indigo-600 hover:text-indigo-500">contact support</a>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-xs text-green-700 font-medium">30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPayment;