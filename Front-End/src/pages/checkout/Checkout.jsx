// src/pages/checkout/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, Lock, Truck,
  MapPin, User, Mail, Phone,
  CheckCircle, Shield, Loader2,
  ShoppingBag, AlertCircle, Package, Palette, Ruler
} from 'lucide-react';
import { orderAPI } from '../../api/order.api';
import { customerAPI } from '../../api/customer.api';
import StoreFooter from '../../components/StoreFooter';
import { car } from '@cloudinary/url-gen/qualifiers/focusOn';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    whatsappNumber: '',
    address: '',
    city: '',
    country: 'Egypt'
  });
      const { handleError } = useErrorHandler();

  useEffect(() => {
    // Load cart data from localStorage
    const savedCart = localStorage.getItem('checkout_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && parsedCart.items.length > 0) {
          setCartData(parsedCart);
        } else {
          navigate(`/store/${parsedCart.storeName}`);
        }
      } catch (err) {
        handleError(err);
        navigate(`/store/${cartData?.storeName}`);
      }
    } else {
      navigate(`/store/${cartData?.storeName }`);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      await placeOrder();
    }
  };

  const placeOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required data
      if (!cartData || !cartData.storeId || !cartData.items || cartData.items.length === 0) {
        throw new Error('Cart data is invalid or empty');
      }

      // Step 1: Create customer first
      const customerData = {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phoneNumber: "+" + customerInfo.phoneNumber,
        whatsappNumber: "+" + customerInfo.whatsappNumber,
        address: customerInfo.address,
        city: customerInfo.city,
        storeIds: [cartData.storeId] // Associate customer with store
      };

      
      // Call customer API
      const customerResponse = await customerAPI.add(customerData);
      
      if (!customerResponse || !customerResponse.id) {
        throw new Error('Failed to create customer');
      }

      const customerId = customerResponse.id;

      // Step 2: Create order with customer ID and variant information
      const orderData = {
        storeId: cartData.storeId,
        customerId: customerId,
        items: cartData.items.map(item => ({
          productId: item.productId || item.id,
          price: item.price,
          quantity: item.quantity,
          // Include variant information if present
          color: item.color || null,
          size: item.size || null,
          variantId: item.variantId || null
        })),
      };

      
      // Call order API
      const orderResponse = await orderAPI.checkout(orderData);
      
      if (!orderResponse || !orderResponse.id) {
        throw new Error('Failed to create order');
      }

      const orderId = orderResponse.id;
      
      // Save order to localStorage for reference
      const userOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
      userOrders.push({
        id: orderId,
        orderNumber: orderResponse.orderNumber || `#${Date.now().toString().slice(-8)}`,
        ...orderData,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('user_orders', JSON.stringify(userOrders));
      
      // Clear cart from localStorage
      localStorage.removeItem('checkout_cart');
      
      // Clear store-specific cart
      if (cartData.storeName) {
        localStorage.removeItem(`cart_${cartData.storeName}`);
      }
      
      // Navigate to order confirmation with order details
      navigate(`/store/${cartData.storeName}`);

    } catch (error) {
      handleError(error);
      

      setTimeout(() => {
        handleError({message_en: error.message || 'An error occurred while placing your order. Please try again.'});
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cartData || !cartData.items) return 0;
    
    const subtotal = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return Math.round(subtotal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous errors when user starts typing
    if (error) setError(null);
  };

  // Format price in EGP
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-en', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getVariantDisplay = (item) => {
    if (item.color && item.size) {
      return `${item.color} / ${item.size}`;
    } else if (item.color) {
      return item.color;
    } else if (item.size) {
      return item.size;
    }
    return null;
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

  if (!cartData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
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
                <p className="text-gray-600">Complete your purchase from {cartData.storeName}</p>
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
        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-800 hover:text-red-900"
              >
                <span className="sr-only">Dismiss</span>
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        )}

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
                          First Name *
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
                          Last Name *
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
                          Phone Number * 
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="phoneNumber"
                            required
                            value={customerInfo.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="012 3456 7890"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Whatsapp Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="whatsappNumber"
                            required
                            value={customerInfo.whatsappNumber}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="012 3456 7890"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <textarea
                          name="address"
                          required
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="123 Main Street, Apartment 4B"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={customerInfo.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="Cairo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={customerInfo.country}
                          readOnly
                          className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Review Order'}
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h3>

                    {/* Order Items */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Order Items ({cartData.items.length})</h4>
                      <div className="space-y-4">
                        {cartData.items.map((item) => {
                          const variantDisplay = getVariantDisplay(item);
                          return (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  {item.imageUrls && item.imageUrls[0] ? (
                                    <img 
                                      src={item.imageUrls[0]} 
                                      alt={item.productName || item.name} 
                                      className="h-full w-full object-cover" 
                                    />
                                  ) : (
                                    <Package className="h-8 w-8 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{item.productName || item.name}</div>
                                  {variantDisplay && (
                                    <div className="flex items-center gap-2 mt-1">
                                      {item.color && (
                                        <div className="flex items-center text-xs text-indigo-600">
                                          <Palette className="h-3 w-3 mr-1" />
                                          {item.color}
                                        </div>
                                      )}
                                      {item.size && (
                                        <div className="flex items-center text-xs text-indigo-600">
                                          <Ruler className="h-3 w-3 mr-1" />
                                          {item.size}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  <div className="text-sm text-gray-600 mt-1">
                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                  </div>
                                </div>
                              </div>
                              <div className="font-semibold text-lg">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Customer Info Summary */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Shipping Information</h4>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="text-gray-900 font-medium mb-2">
                          {customerInfo.firstName} {customerInfo.lastName}
                        </div>
                        <div className="text-gray-600 mb-1">{customerInfo.address}</div>
                        <div className="text-gray-600 mb-1">{customerInfo.city}, {customerInfo.country}</div>
                        <div className="text-gray-600 mb-1">{customerInfo.phoneNumber}</div>
                        <div className="text-gray-600">{customerInfo.whatsappNumber}</div>
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
                        disabled={isLoading}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-6 w-6" />
                            <span>Place Order</span>
                          </>
                        )}
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
              <div className="flex items-center space-x-3 mb-6">
                {cartData.storeLogo ? (
                  <img src={cartData.storeLogo} alt={cartData.storeName} className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-gray-600" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{cartData.storeName}</h3>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Cost</span>
                  <span className="font-medium">
                    {formatPrice(cartData.shippingCost || 0)}
                  </span>
                </div>
                
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">{formatPrice(calculateTotal()+cartData.shippingCost)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">All prices in Egyptian Pound (EGP)</p>
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Estimated Delivery</div>
                    <div className="text-sm text-blue-700">2-4 business days within Egypt</div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              

              {/* API Flow Info */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Order Process</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</div>
                    <span>Create Customer Account</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">2</div>
                    <span>Create Order with Items & Variants</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">3</div>
                    <span>Send Order Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default Checkout;