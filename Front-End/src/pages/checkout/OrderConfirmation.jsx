// src/pages/checkout/OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle, ShoppingBag, Home, Package,
  Truck, Clock, Loader2
} from 'lucide-react';
import { orderAPI } from '../../api/order.api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      // In a real app, you would fetch the order by ID
      // For now, simulate with localStorage data
      const orders = JSON.parse(localStorage.getItem('store_orders') || '[]');
      const foundOrder = orders.find(o => o.id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // Simulate order data
        setOrder({
          id: orderId,
          orderNumber: `ORD-${orderId}`,
          date: new Date().toISOString(),
          status: 'confirmed',
          items: JSON.parse(localStorage.getItem('store_cart') || '[]'),
          total: 452.76,
          shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          }
        });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number</span>
                    <span className="font-medium text-gray-900">{order?.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order?.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {order?.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">
                      ${order?.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                <div className="space-y-2">
                  <div className="text-gray-900">
                    {order?.shippingAddress?.street}
                  </div>
                  <div className="text-gray-600">
                    {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.zipCode}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order?.items?.map((item) => (
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
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">What's Next?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="font-medium text-gray-900 mb-2">Order Processing</div>
                <div className="text-sm text-gray-600">Your order is being prepared</div>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <div className="font-medium text-gray-900 mb-2">Shipping</div>
                <div className="text-sm text-gray-600">Track your package</div>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="font-medium text-gray-900 mb-2">Delivery</div>
                <div className="text-sm text-gray-600">Expected in 5-7 days</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-center font-medium flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/orders"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-center font-medium flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>View My Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;