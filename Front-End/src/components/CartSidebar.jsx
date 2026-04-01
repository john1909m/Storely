// components/CartSidebar.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, Trash2, Plus, Minus, ChevronRight, Package, 
  Truck, Shield, CreditCard, Clock, CheckCircle, AlertCircle, Heart, Tag, Gift
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CartSidebar = ({ 
  isOpen, onClose, cart = [], store, formatPrice, onUpdateQuantity, 
  onRemoveItem, onCheckout, themeType = 'CLASSIC', colors = { primary: '#4f46e5', secondary: '#9333ea', primaryLight: '#e0e7ff' }, t
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [showCheckoutAnimation, setShowCheckoutAnimation] = useState(false);
  const [savedForLater, setSavedForLater] = useState([]);

  useEffect(() => {
    if (store?.storeName) {
      const saved = localStorage.getItem(`saved_${store.storeName}`);
      if (saved) setSavedForLater(JSON.parse(saved));
    }
  }, [store?.storeName]);

  useEffect(() => {
    if (store?.storeName && savedForLater.length > 0) {
      localStorage.setItem(`saved_${store.storeName}`, JSON.stringify(savedForLater));
    }
  }, [savedForLater, store?.storeName]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => { setIsExiting(false); onClose(); }, 300);
  };

  const getGradientStyle = (fromColor, toColor) => ({
    background: `linear-gradient(135deg, ${fromColor}, ${toColor})`
  });

  // Safe calculations with default empty array
  const getTotal = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getItemCount = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const defaultFormatPrice = (price) => new Intl.NumberFormat('en-EG', {
    style: 'currency', currency: 'EGP', minimumFractionDigits: 0, maximumFractionDigits: 2
  }).format(price);
  const formatPriceFunc = formatPrice || defaultFormatPrice;

  const handleRemoveItem = (itemId) => {
    setRemovingItemId(itemId);
    setTimeout(() => {
      onRemoveItem(itemId);
      if (store?.storeName) {
        const cartKey = `cart_${store.storeName}`;
        const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
        localStorage.setItem(cartKey, JSON.stringify(existingCart.filter(item => item.id !== itemId)));
      }
      setRemovingItemId(null);
    }, 300);
  };

  const handleSaveForLater = (item) => {
    onRemoveItem(item.id);
    setSavedForLater(prev => [...prev, item]);
  };

  const handleMoveToCart = (item) => {
    setSavedForLater(prev => prev.filter(i => i.id !== item.id));
    onUpdateQuantity(item.id, 1);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) { handleRemoveItem(itemId); return; }
    onUpdateQuantity(itemId, newQuantity);
    if (store?.storeName) {
      const cartKey = `cart_${store.storeName}`;
      const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      localStorage.setItem(cartKey, JSON.stringify(existingCart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )));
    }
  };

  const handleCheckout = () => {
    setShowCheckoutAnimation(true);
    const checkoutData = {
      storeId: store?.id, storeName: store?.storeName, storeLogo: store?.storeLogoUrl,
      shippingCost: store?.shippingCost || 0,
      items: (cart || []).map(item => ({
        id: item.id, productId: item.id, productName: item.productName || item.name,
        price: item.price, quantity: item.quantity, imageUrls: item.imageUrls,
        color: item.selectedColor || null, size: item.selectedSize || null, variantId: item.variantId || null
      })),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('checkout_cart', JSON.stringify(checkoutData));
    setTimeout(() => { window.location.href = '/checkout'; if (onCheckout) onCheckout(); }, 500);
  };

  const getVariantDisplay = (item) => {
    if (item.color && item.size) return `${item.color} / ${item.size}`;
    if (item.color) return item.color;
    if (item.size) return item.size;
    return null;
  };

  // Theme-specific styles
  const getHeaderStyle = () => {
    if (themeType === 'MODERN') {
      return {
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        boxShadow: '0 0 40px rgba(0,0,0,0.3)'
      };
    }
    if (themeType === 'MINIMAL') {
      return {
        background: '#111827',
        boxShadow: 'none'
      };
    }
    return {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    };
  };

  const getButtonStyle = () => {
    if (themeType === 'MODERN') {
      return `w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500`;
    }
    if (themeType === 'MINIMAL') {
      return `w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 group`;
    }
    return `w-full py-4 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group`;
  };

  return (
    <>
      {isOpen && (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] z-50 transform transition-all duration-500 ease-out shadow-2xl ${
        isOpen && !isExiting ? 'translate-x-0' : 'translate-x-full'
      } ${themeType === 'MODERN' ? 'bg-[#181818]' : themeType === 'MINIMAL' ? 'bg-white' : 'bg-white'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 text-white relative overflow-hidden" style={getHeaderStyle()}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl float-animation"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${themeType === 'MODERN' ? 'bg-white/10 backdrop-blur-sm' : 'bg-white/10'}`}>
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{t('cart.title')}</h2>
                    <p className="text-sm text-white/80 flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {t('cart.shoppingAt')} {store?.storeName}
                    </p>
                  </div>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-all hover:scale-110 text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className={`flex items-center justify-between text-sm text-white/90 rounded-xl p-3 ${themeType === 'MODERN' ? 'bg-white/10 backdrop-blur-sm' : 'bg-white/10'}`}>
                <span className="flex items-center gap-1"><Package className="h-4 w-4" />{getItemCount()} {getItemCount() === 1 ? t('cart.item') : t('cart.items')}</span>
                <span className="font-semibold flex items-center gap-1"><CreditCard className="h-4 w-4" />{t('cart.total')}: {formatPriceFunc(getTotal())}</span>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {!cart || cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className={`h-32 w-32 rounded-3xl flex items-center justify-center mb-6 float-animation ${themeType === 'MODERN' ? 'bg-white/5' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
                  <ShoppingBag className={`h-16 w-16 ${themeType === 'MODERN' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${themeType === 'MODERN' ? 'text-white' : 'text-gray-900'}`}>{t('cart.empty')}</h3>
                <p className={`mb-8 max-w-xs ${themeType === 'MODERN' ? 'text-gray-400' : 'text-gray-600'}`}>{t('cart.emptyMessage', { storeName: store?.storeName })}</p>
                <button onClick={handleClose} className="inline-flex items-center px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-lg" style={themeType === 'MINIMAL' ? { backgroundColor: '#111827' } : getGradientStyle(colors.primary, colors.secondary)}>
                  {t('cart.continueShopping')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={item.id} className={`cart-item-enter ${removingItemId === item.id ? 'cart-item-exit' : ''}`} style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className={`group ${themeType === 'MODERN' ? 'bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10' : themeType === 'MINIMAL' ? 'bg-gray-50 rounded-xl' : 'bg-white rounded-2xl border border-gray-100'} p-4 transition-all hover:shadow-lg`}>
                      <div className="flex items-start gap-4">
                        <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 group">
                          {item.imageUrls && item.imageUrls[0] ? (
                            <img src={item.imageUrls[0]} alt={item.productName || item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xl text-gray-400">📦</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className={`font-semibold mb-1 line-clamp-1 ${themeType === 'MODERN' ? 'text-white' : 'text-gray-900'}`}>
                                {item.productName || item.name}
                              </h4>
                              {getVariantDisplay(item) && (
                                <p className="text-xs mb-1 flex items-center gap-1" style={{ color: colors.primary }}>
                                  <Tag className="h-3 w-3" />
                                  {getVariantDisplay(item)}
                                </p>
                              )}
                              <p className={`text-sm ${themeType === 'MODERN' ? 'text-gray-400' : 'text-gray-600'}`}>{formatPriceFunc(item.price)} {t('cart.each')}</p>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold text-lg mb-1 ${themeType === 'MODERN' ? 'text-white' : 'text-gray-900'}`}>{formatPriceFunc(item.price * item.quantity)}</div>
                              <button onClick={() => handleRemoveItem(item.id)} className="text-sm text-gray-400 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-2 rounded-lg p-1 ${themeType === 'MODERN' ? 'bg-white/10' : 'bg-gray-100'}`}>
                              <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all hover:scale-110 ${themeType === 'MODERN' ? 'bg-white/20 text-white' : 'bg-white border border-gray-200'}`}>
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className={`w-12 text-center font-medium ${themeType === 'MODERN' ? 'text-white' : 'text-gray-900'}`}>{item.quantity}</span>
                              <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all hover:scale-110 ${themeType === 'MODERN' ? 'bg-white/20 text-white' : 'bg-white border border-gray-200'}`}>
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button onClick={() => handleSaveForLater(item)} className="text-xs text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
                              <Heart className="h-3 w-3" />
                              {t('cart.saveForLater')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {savedForLater.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${themeType === 'MODERN' ? 'text-white' : 'text-gray-900'}`}>
                      <Clock className="h-4 w-4" style={{ color: colors.primary }} />
                      {t('cart.savedForLater')} ({savedForLater.length})
                    </h3>
                    <div className="space-y-2">
                      {savedForLater.map((item) => (
                        <div key={item.id} className={`p-3 flex items-center justify-between rounded-xl ${themeType === 'MODERN' ? 'bg-white/5' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-200">
                              {item.imageUrls && item.imageUrls[0] ? (
                                <img src={item.imageUrls[0]} alt={item.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">📦</div>
                              )}
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${themeType === 'MODERN' ? 'text-white' : 'text-gray-900'}`}>{item.productName || item.name}</p>
                              <p className="text-xs text-gray-500">{formatPriceFunc(item.price)}</p>
                            </div>
                          </div>
                          <button onClick={() => handleMoveToCart(item)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                            {t('cart.moveToCart')}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.length > 0 && (
            <div className={`border-t p-6 shadow-lg ${themeType === 'MODERN' ? 'border-white/10 bg-[#181818]' : 'border-gray-100 bg-white'}`}>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className={themeType === 'MODERN' ? 'text-gray-400' : 'text-gray-600'}>{t('cart.subtotal')}</span>
                  <span className={`font-semibold ${themeType === 'MODERN' ? 'text-white' : 'text-gray-900'}`}>{formatPriceFunc(getTotal())}</span>
                </div>
                <div className={`flex justify-between items-center py-2 border-b border-gray-100 ${themeType === 'MODERN' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>{t('cart.total')}</span>
                  <span className="text-2xl" style={{ color: colors.primary }}>{formatPriceFunc(getTotal())}</span>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={handleCheckout} className={getButtonStyle()} style={themeType !== 'MINIMAL' && themeType !== 'MODERN' ? getGradientStyle(colors.primary, colors.secondary) : {}}>
                  {showCheckoutAnimation ? (
                    <div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>{t('cart.processing')}</span></div>
                  ) : (<><span>{t('cart.proceedToCheckout')}</span><ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>)}
                </button>
                <button onClick={handleClose} className={`w-full py-3 border-2 rounded-xl transition-all font-medium flex items-center justify-center gap-2 group ${themeType === 'MODERN' ? 'border-white/20 text-white hover:border-indigo-500' : 'border-gray-200 text-gray-700 hover:border-indigo-300'}`}>
                  <span>{t('cart.continueShopping')}</span><ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;