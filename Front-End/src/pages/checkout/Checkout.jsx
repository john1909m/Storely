// src/pages/checkout/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, Lock, Truck,
  MapPin, User, Mail, Phone,
  CheckCircle, Shield, Loader2
} from 'lucide-react';
import { orderAPI } from '../../api/order.api';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
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

  useEffect(() => {
    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('store_cart') || '[]');
    setCartItems(cart);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setIsLoading(true);
      try {
        // Create order
        const orderData = {
          customerInfo,
          items: cartItems,
          total: calculateTotal(),
          shippingAddress: {
            street: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            zipCode: customerInfo.zipCode,
            country: customerInfo.country
          },
          status: 'pending'
        };

        const response = await orderAPI.add(orderData);
        
        if (response && response.id) {
          // Clear cart
          localStorage.removeItem('store_cart');
          
          // Navigate to order confirmation
          navigate(`/order-confirmation/${response.id}`);
        } else {
          throw new Error('Failed to create order');
        }
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to place order. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    return subtotal + shipping + tax;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing your order...</p>
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
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
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
                <span className="ml-2 text-sm font-medium">Customer Info</span>
              </div>
              <div className={`h-1 w-8 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Review & Confirm</span>
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
              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="firstName"
                            required
                            value={customerInfo.firstName}
                            onChange={handleInputChange}
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
                            name="lastName"
                            required
                            value={customerInfo.lastName}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={customerInfo.email}
                            onChange={handleInputChange}
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
                            name="phone"
                            required
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="(123) 456-7890"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          required
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="123 Main Street"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={customerInfo.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={customerInfo.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          required
                          value={customerInfo.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                      Review Order
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h3>

                    {/* Order Items */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-4">
                              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded" />
                                ) : (
                                  <div className="text-lg">📦</div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Shipping Information</h4>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="text-gray-900">{customerInfo.firstName} {customerInfo.lastName}</div>
                        <div className="text-gray-600">{customerInfo.address}</div>
                        <div className="text-gray-600">{customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}</div>
                        <div className="text-gray-600">{customerInfo.email}</div>
                        <div className="text-gray-600">{customerInfo.phone}</div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="mb-8">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="terms"
                          required
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 mt-1"
                        />
                        <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                          I agree to the Terms of Service and Privacy Policy. 
                          I understand that this order is subject to vendor approval and shipping times.
                        </label>
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
                        className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="h-6 w-6" />
                        <span>Place Order</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cartItems.length})</span>
                  <span className="font-medium">
                    ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 50 ? 'FREE' : '$9.99'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ${(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Estimated Delivery</div>
                    <div className="text-sm text-blue-700">5-7 business days</div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="text-center text-sm text-gray-500">
                <Shield className="h-4 w-4 inline mr-1" />
                Secure SSL encrypted payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;