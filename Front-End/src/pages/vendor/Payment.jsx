// src/pages/vendor/Payment.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, CheckCircle, Shield,
  Lock, Calendar, FileText, Download
} from 'lucide-react';

const VendorPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get('plan') || 'professional';

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const plans = {
    professional: {
      name: 'Professional',
      price: 29,
      commission: '7%',
      features: ['3 Stores', 'Unlimited Products', 'Custom Domain', 'Advanced Analytics']
    },
    business: {
      name: 'Business',
      price: 99,
      commission: '5%',
      features: ['Unlimited Stores', 'API Access', 'White Label', 'Dedicated Support']
    }
  };

  const plan = plans[selectedPlan];

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    saveCard: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 2000);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Your {plan.name} plan has been activated. You can now access all premium features.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="font-semibold text-gray-900">{plan.name} Plan</div>
                <div className="text-gray-600">${plan.price}/month + {plan.commission} commission</div>
              </div>
            </div>
            <div className="mt-8">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <div className="mt-4 text-sm text-gray-500">Redirecting to dashboard...</div>
            </div>
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
              <p className="text-gray-600">Upgrade to {plan.name} plan</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-gray-600">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">💳</div>
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">🏦</div>
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">📱</div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Credit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, Amex</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-6 text-blue-500 font-bold">P</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">PayPal</div>
                      <div className="text-sm text-gray-600">Pay with PayPal</div>
                    </div>
                  </div>
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handleChange}
                        required
                        placeholder="1234 5678 9012 3456"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Card Holder Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="expiry"
                          value={paymentInfo.expiry}
                          onChange={handleChange}
                          required
                          placeholder="MM/YY"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <div className="relative">
                        <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handleChange}
                          required
                          placeholder="123"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Card */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveCard"
                      checked={paymentInfo.saveCard}
                      onChange={handleChange}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="ml-3 text-gray-700">
                      Save card for future payments
                    </label>
                  </div>

                  {/* Security Notice */}
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div className="text-sm text-green-800">
                        Your payment information is encrypted and secure. We never store your card details.
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        <span>Pay ${plan.price}.00</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center p-8">
                  <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <div className="text-2xl text-blue-500 font-bold">P</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pay with PayPal</h3>
                  <p className="text-gray-600 mb-8">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                  <button className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all">
                    Continue to PayPal
                  </button>
                </div>
              )}
            </div>

            {/* Invoice Preview */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Invoice Preview</h3>
                <button className="flex items-center text-indigo-600 hover:text-indigo-500">
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Plan Subscription</span>
                  <span className="font-medium">${plan.price}.00</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Setup Fee</span>
                  <span className="font-medium text-green-600">$0.00</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${(plan.price * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${(plan.price * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Plan Details */}
              <div className="mb-8">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl mb-4">
                  <div className="text-lg font-bold text-gray-900 mb-1">{plan.name} Plan</div>
                  <div className="text-gray-600">Monthly subscription</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Monthly Price</span>
                    <span className="font-medium">${plan.price}.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Commission Rate</span>
                    <span className="font-medium">{plan.commission}</span>
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Plan Includes</h3>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Billing Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Billing Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing Cycle</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Invoice</span>
                    <span className="font-medium">${plan.price}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto-renew</span>
                    <span className="font-medium text-green-600">Enabled</span>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Need Help?</div>
                    <div className="text-sm text-gray-600">
                      Read our <a href="#" className="text-indigo-600 hover:text-indigo-500">billing FAQ</a> or contact support
                    </div>
                  </div>
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