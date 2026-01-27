// src/pages/checkout/Cart.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus,
  ArrowLeft, Tag, Truck, Shield
} from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones Premium',
      price: 129.99,
      quantity: 1,
      image: '🎧',
      store: 'TechGadget Store',
      stock: 42
    },
    {
      id: 2,
      name: 'Premium Smart Watch',
      price: 249.99,
      quantity: 1,
      image: '⌚',
      store: 'TechGadget Store',
      stock: 18
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      price: 29.99,
      quantity: 2,
      image: '👕',
      store: 'Fashion Hub',
      stock: 156
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          if (newQuantity < 1 || newQuantity > item.stock) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600">{cartItems.length} items in cart</p>
              </div>
            </div>
            <Link to="/store" className="text-indigo-600 hover:text-indigo-500 flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
                <p className="text-gray-600 mb-8">Add items to your cart to proceed to checkout</p>
                <Link
                  to="/store"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="h-32 w-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                        <div className="text-5xl">{item.image}</div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                          <div>
                            <div className="text-sm text-indigo-600 mb-1">{item.store}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            <div className="text-2xl font-bold text-gray-900 mb-4">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="h-10 w-10 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <div className="h-10 w-16 flex items-center justify-center font-semibold">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="h-10 w-10 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.stock} in stock
                            </div>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="h-5 w-5 text-gray-400" />
                        <label className="font-medium text-gray-900">Promo Code</label>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <button className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium">
                      Apply Code
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                    <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">Free Shipping</div>
                    <div className="text-xs text-gray-600">Over $50</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">Secure Checkout</div>
                    <div className="text-xs text-gray-600">SSL Protected</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                    <div className="h-8 w-8 text-purple-600 mx-auto mb-2">🔄</div>
                    <div className="text-sm font-medium text-gray-900">Easy Returns</div>
                    <div className="text-xs text-gray-600">30 Day Policy</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl mb-6"
              >
                Proceed to Checkout
              </Link>

              {/* Payment Methods */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-3">We accept</div>
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">💳</div>
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">🏦</div>
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">📱</div>
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">💰</div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="text-sm text-gray-500 text-center">
                <Shield className="h-4 w-4 inline mr-1" />
                Your payment information is encrypted and secure
              </div>

              {/* Continue Shopping */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <Link
                  to="/store"
                  className="block w-full py-3 bg-gray-100 text-gray-700 text-center rounded-xl hover:bg-gray-200 transition-all"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Save for Later */}
            {cartItems.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Save for Later</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-2xl">📚</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Programming Book Bundle</div>
                      <div className="text-lg font-bold text-gray-900">$49.99</div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;