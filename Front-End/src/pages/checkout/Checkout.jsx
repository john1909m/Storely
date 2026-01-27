// src/pages/checkout/Checkout.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, Lock, Truck,
  MapPin, User, Mail, Phone,
  CheckCircle, Shield
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [saveInfo, setSaveInfo] = useState(true);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const orderSummary = {
    items: 3,
    subtotal: 409.97,
    shipping: 9.99,
    tax: 32.80,
    total: 452.76
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    setTimeout(() => {
      navigate('/order-confirmation');
    }, 1000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleShippingSubmit} className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h3>
            
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="123 Main Street"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.zipCode}
                  onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="10001"
                />
              </div>
            </div>

            {/* Shipping Method */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Shipping Method</h4>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    defaultChecked
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-gray-900">Standard Shipping</div>
                    <div className="text-sm text-gray-600">5-7 business days</div>
                  </div>
                  <div className="font-semibold">$9.99</div>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-gray-900">Express Shipping</div>
                    <div className="text-sm text-gray-600">2-3 business days</div>
                  </div>
                  <div className="font-semibold">$19.99</div>
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="saveInfo"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="saveInfo" className="ml-3 text-gray-700">
                Save shipping information for next time
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Continue to Payment
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h3>

            {/* Payment Method Selection */}
            <div className="space-y-4 mb-8">
              <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-4 flex items-center space-x-3 flex-1">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Credit / Debit Card</div>
                    <div className="text-sm text-gray-600">Pay with your card</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">💳</div>
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">🏦</div>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-4 flex items-center space-x-3 flex-1">
                  <div className="h-6 w-6 text-blue-500">P</div>
                  <div>
                    <div className="font-medium text-gray-900">PayPal</div>
                    <div className="text-sm text-gray-600">Pay with your PayPal account</div>
                  </div>
                </div>
              </label>
            </div>

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardName}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.expiry}
                      onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        placeholder="123"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div className="text-sm text-green-800">
                  Your payment information is encrypted and secure. We never store your card details.
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Review Order
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h3>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Order Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items (3)</span>
                  <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${orderSummary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Shipping Address</h4>
              <div className="space-y-1">
                <div className="text-gray-900">{shippingInfo.firstName} {shippingInfo.lastName}</div>
                <div className="text-gray-600">{shippingInfo.address}</div>
                <div className="text-gray-600">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</div>
                <div className="text-gray-600">{shippingInfo.country}</div>
                <div className="text-gray-600">{shippingInfo.email}</div>
                <div className="text-gray-600">{shippingInfo.phone}</div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Payment Method</h4>
              <div className="flex items-center space-x-3">
                {paymentMethod === 'card' ? (
                  <>
                    <CreditCard className="h-6 w-6 text-gray-400" />
                    <div>
                      <div className="text-gray-900">Credit Card</div>
                      <div className="text-sm text-gray-600">
                        **** **** **** {paymentInfo.cardNumber?.slice(-4) || '3456'}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-6 w-6 text-blue-500">P</div>
                    <div className="text-gray-900">PayPal</div>
                  </>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 mt-1"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                I agree to the <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>. 
                I understand that this order is subject to vendor approval and shipping times.
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-6 w-6" />
                <span>Place Order</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-600">Complete your purchase</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Shipping</span>
              </div>
              <div className={`h-1 w-8 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
              <div className={`h-1 w-8 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              {renderStep()}
            </div>

            {/* Security Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-green-600" />
                <span>SSL Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Lock className="h-5 w-5 text-blue-600" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-3xl">🎧</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Wireless Headphones</div>
                    <div className="text-sm text-gray-600">Qty: 1</div>
                  </div>
                  <div className="font-semibold">$129.99</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-3xl">⌚</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Smart Watch</div>
                    <div className="text-sm text-gray-600">Qty: 1</div>
                  </div>
                  <div className="font-semibold">$249.99</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-3xl">👕</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Cotton T-Shirt</div>
                    <div className="text-sm text-gray-600">Qty: 2</div>
                  </div>
                  <div className="font-semibold">$59.98</div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${orderSummary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Estimated Delivery</div>
                    <div className="text-sm text-blue-700">5-7 business days</div>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="mt-6 text-center">
                <Link to="/contact" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Need help? Contact support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;