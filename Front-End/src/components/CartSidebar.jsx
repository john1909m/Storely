// components/CartSidebar.jsx
import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ChevronRight, Package, Truck, Shield } from 'lucide-react';

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  cart, 
  store,
  formatPrice,
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) => {
  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const defaultFormatPrice = (price) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatPriceFunc = formatPrice || defaultFormatPrice;

  const handleCheckout = () => {
    // Save cart data for checkout page
    localStorage.setItem('checkout_cart', JSON.stringify({
      storeId: store?.id,
      storeName: store?.storeName,
      storeLogo: store?.logoUrl,
      items: cart,
      timestamp: new Date().toISOString()
    }));
    window.location.href = '/checkout'; // Redirect to checkout page
    
    onCheckout();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-50 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } shadow-2xl`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Your Shopping Cart</h2>
                  <p className="text-sm text-gray-300">Shopping at {store?.storeName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>{getItemCount()} items</span>
              <span>Total: {formatPriceFunc(getTotal())}</span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-24 w-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-6">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
                <p className="text-gray-600 mb-8 max-w-xs">
                  Add some amazing products from {store?.storeName} to get started
                </p>
                <button
                  onClick={onClose}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-sm hover:shadow"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="group">
                    <div className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="h-20 w-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                          {item.images && item.images[0] ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.productName || item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xl text-gray-400">
                              📦
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                {item.productName || item.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {formatPriceFunc(item.price)} each
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900 text-lg mb-1">
                                {formatPriceFunc(item.price * item.quantity)}
                              </div>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-sm text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                              >
                                <Minus className="h-4 w-4 text-gray-600" />
                              </button>
                              <span className="w-12 text-center font-medium text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                              >
                                <Plus className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                            <span className="text-xs text-gray-500">
                              {item.quantity > 1 ? `${item.quantity} units` : '1 unit'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 bg-white p-6">
              {/* Order Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPriceFunc(getTotal())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span className="text-2xl">{formatPriceFunc(getTotal())}</span>
                </div>
              </div>

              {/* Store Benefits */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4" />
                  <span>Free Returns</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">🔄</span>
                  <span>30-Day Policy</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
                >
                  <span>Proceed to Checkout</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Security Note */}
              <p className="text-xs text-gray-500 text-center mt-6">
                Your payment information is encrypted and secure. {store?.storeName} never stores your credit card details.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;