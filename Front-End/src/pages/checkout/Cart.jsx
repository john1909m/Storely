// src/pages/checkout/Cart.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus,
  ArrowLeft, Tag, Truck, Shield,
  Loader2
} from 'lucide-react';
import { productAPI } from '../../api/product.api';
import { storeAPI } from '../../api/store.api';

const Cart = () => {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);

  const getStoreIdToFilter = () => {
    if (storeData?.id) return storeData.id;
    if (storeName && !isNaN(Number(storeName))) return Number(storeName);
    return undefined;
  };

  useEffect(() => {
    loadCartData();
  }, [storeId]);

  const loadCartData = async () => {
    try {
      setIsLoading(true);

      // Resolve store if a storeName param was provided
      if (storeName) {
        if (!isNaN(Number(storeName))) {
          const storeResponse = await storeAPI.getById(Number(storeName));
          setStoreData(storeResponse);
        } else {
          const storeResponse = await storeAPI.getByName(storeName);
          setStoreData(storeResponse);
        }
      }

      // Load cart items from localStorage
      const cart = JSON.parse(localStorage.getItem('store_cart') || '[]');

      const filterId = getStoreIdToFilter();

      // Filter items for this store if filterId is provided
      const filteredCart = typeof filterId !== 'undefined'
        ? cart.filter(item => String(item.storeId) === String(filterId))
        : cart;

      setCartItems(filteredCart);
    } catch (error) {
      console.error('Error loading cart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (id, change) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedItems);
    saveCartToStorage(updatedItems);
  };

  const removeItem = (id) => {
    const filterId = getStoreIdToFilter();
    const updatedItems = cartItems.filter(item => !(item.id === id && (!filterId || String(item.storeId) === String(filterId))));
    setCartItems(updatedItems);
    saveCartToStorage(updatedItems);
  };

  const saveCartToStorage = (items) => {
    const allCartItems = JSON.parse(localStorage.getItem('store_cart') || '[]');
    const filterId = getStoreIdToFilter();
    // Remove items from this store if filterId present
    const otherItems = filterId ? allCartItems.filter(item => String(item.storeId) !== String(filterId)) : allCartItems;
    const updatedCart = [...otherItems, ...items];
    localStorage.setItem('store_cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
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
              <div className="h-12 w-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600">
                  {storeData ? `Items from ${storeData.storeName}` : 'Your shopping cart'}
                </p>
              </div>
            </div>
            <Link 
              to={storeId ? `/store/${storeId}` : '/'}
              className="text-indigo-600 hover:text-indigo-500 flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {storeId ? 'Back to Store' : 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
            <p className="text-gray-600 mb-8">Add items to your cart to proceed to checkout</p>
            <Link
              to={storeId ? `/store/${storeId}` : '/'}
              className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="h-32 w-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                        {item.imageUrl && item.imageUrl.startsWith('http') ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="text-5xl">{item.imageUrl || '📦'}</div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                          <div>
                            <div className="text-sm text-indigo-600 mb-1">{item.storeName || 'Store'}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            <div className="text-2xl font-bold text-gray-900 mb-4">
                              ${item.price?.toFixed(2) || '0.00'}
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
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            ${((item.price || 0) * item.quantity).toFixed(2)}
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
              </div>
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
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
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
                <button
                  onClick={handleCheckout}
                  className="block w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl mb-6"
                >
                  Proceed to Checkout
                </button>

                {/* Security Notice */}
                <div className="text-sm text-gray-500 text-center">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Your payment information is encrypted and secure
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;