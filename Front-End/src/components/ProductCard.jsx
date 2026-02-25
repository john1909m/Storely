// components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Eye, 
  Star, 
  Heart, 
  Zap, 
  Check,
  TrendingUp,
  Package,
  Shield,
  Truck,
  RefreshCw,
  Palette,
  Ruler,
  ChevronRight,
  Info
} from 'lucide-react';

// ✨ إضافة أنماط CSS للـ animations
const fadeInStyles = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-scale {
    animation: fadeInScale 0.5s ease-out forwards;
  }
  
  .animate-slide-up {
    animation: slideUp 0.3s ease-out forwards;
  }
`;

const ProductCard = ({ 
  product, 
  viewMode, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist, 
  onViewDetails,
  formatPrice,
  colors = { primary: '#4f46e5', secondary: '#9333ea', primaryLight: '#e0e7ff' } // 🎨 ألوان افتراضية
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cardLoaded, setCardLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✨ تأثير ظهور البطاقة
  useEffect(() => {
    setTimeout(() => {
      setCardLoaded(true);
    }, 100);
  }, []);

  // 🎨 دالة لتوليد style object للتدرجات
  const getGradientStyle = (fromColor, toColor) => {
    return {
      background: `linear-gradient(to right, ${fromColor}, ${toColor})`
    };
  };

  const getDiscountPercentage = () => {
    if (product.oldPrice && product.price < product.oldPrice) {
      return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    }
    return null;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    
    // If product has variants, show quick add modal on mobile
    if (isMobile && product.hasVariants) {
      setShowQuickAdd(true);
      setIsAddingToCart(false);
      return;
    }
    
    onAddToCart(product);
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const defaultFormatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const priceFormatter = formatPrice || defaultFormatPrice;

  const discount = getDiscountPercentage();
  const totalStock = product.totalStock || product.quantity || 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;
  const isOutOfStock = totalStock <= 0;
  const hasVariants = product.hasVariants || (product.variants && product.variants.length > 0);
  const variantCount = product.variantCount || product.variants?.length || 0;

  // Mobile Quick Add Modal
  const QuickAddModal = () => {
    if (!showQuickAdd) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowQuickAdd(false)}
        />
        
        {/* Modal Content */}
        <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl animate-slide-up sm:animate-fade-in-scale">
          {/* Handle Bar for Mobile */}
          <div className="sm:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
          
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-100">
                  {product.imageUrls && product.imageUrls[0] ? (
                    <img 
                      src={product.imageUrls[0]} 
                      alt={product.productName || product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 line-clamp-1">
                    {product.productName || product.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {variantCount} variants available
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>
            
            {/* Variants Summary */}
            <div className="space-y-4 mb-6">
              <div 
                className="rounded-xl p-4"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Info className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.primary }}>
                      This product has multiple options
                    </p>
                    <p className="text-xs mt-1" style={{ color: colors.primary, opacity: 0.7 }}>
                      Select color and size on the product page
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowQuickAdd(false);
                    onViewDetails();
                  }}
                  className="flex-1 py-4 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all"
                  style={getGradientStyle(colors.primary, colors.secondary)}
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setShowQuickAdd(false);
                    onToggleWishlist(product);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isInWishlist
                      ? 'text-red-600'
                      : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}
                  style={isInWishlist ? { backgroundColor: colors.primaryLight, borderColor: colors.primary } : {}}
                >
                  <Heart className={`h-6 w-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
            
            {/* Price Info */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Starting from</span>
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {priceFormatter(product.price)}
                  </span>
                  {discount && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {priceFormatter(product.oldPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Grid View
  if (viewMode === 'grid' && isMobile) {
    return (
      <>
        <style>{fadeInStyles}</style>
        <div 
          className={`group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${
            cardLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ 
            transition: 'all 0.5s ease-out',
            borderColor: isHovered ? colors.primary : undefined 
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Product Image */}
            <div 
              className="h-full w-full cursor-pointer"
              onClick={onViewDetails}
            >
              {product.imageUrls && product.imageUrls[0] ? (
                <img 
                  src={product.imageUrls[0]} 
                  alt={product.productName || product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Package className="h-10 w-10 text-gray-300" />
                </div>
              )}
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount && (
                <div 
                  className="px-2 py-1 text-white text-xs font-bold rounded-lg shadow-lg"
                  style={getGradientStyle(colors.primary, colors.secondary)}
                >
                  -{discount}%
                </div>
              )}
              
              {hasVariants && (
                <div 
                  className="px-2 py-1 text-white text-xs font-medium rounded-lg shadow-lg flex items-center gap-1"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <Palette className="h-3 w-3" />
                  <span>Variants</span>
                </div>
              )}
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-sm transition-all ${
                isInWishlist
                  ? 'text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-white'
              }`}
              style={isInWishlist ? { backgroundColor: colors.primary } : {}}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
            
            {/* Stock Indicator */}
            {!isOutOfStock && isLowStock && (
              <div className="absolute bottom-2 left-2 right-2">
                <div 
                  className="text-white text-xs px-2 py-1 rounded-lg text-center"
                  style={{ backgroundColor: colors.secondary, opacity: 0.9 }}
                >
                  Only {totalStock} left
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3">
            {/* Category */}
            <div className="mb-1">
              <span className="text-xs text-gray-500">
                {product.category?.categoryName || product.category?.name || 'Product'}
              </span>
            </div>

            {/* Title */}
            <h3 
              className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm leading-tight cursor-pointer"
              onClick={onViewDetails}
              style={{ color: isHovered ? colors.primary : undefined }}
            >
              {product.productName || product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-lg font-bold text-gray-900">
                {priceFormatter(product.price)}
              </span>
              {discount && (
                <span className="text-xs text-gray-500 line-through">
                  {priceFormatter(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-600">(128)</span>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400'
                  : isAddingToCart
                  ? 'text-white'
                  : 'text-white hover:opacity-90 active:scale-95'
              }`}
              style={!isOutOfStock && !isAddingToCart 
                ? getGradientStyle(colors.primary, colors.secondary)
                : isAddingToCart
                ? { backgroundColor: '#10b981' }
                : {}
              }
            >
              {isAddingToCart ? (
                <>
                  <Check className="h-4 w-4" />
                  Added!
                </>
              ) : isOutOfStock ? (
                'Out of Stock'
              ) : hasVariants ? (
                <>
                  <Palette className="h-4 w-4" />
                  Select Options
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Quick Add Modal */}
        <QuickAddModal />
      </>
    );
  }

  // Desktop Grid View
  if (viewMode === 'grid') {
    return (
      <>
        <style>{fadeInStyles}</style>
        <div 
          className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 ${
            cardLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ 
            transition: 'all 0.5s ease-out',
            borderColor: isHovered ? colors.primary : undefined,
            boxShadow: isHovered ? `0 20px 25px -5px ${colors.primary}20, 0 10px 10px -5px ${colors.primary}10` : undefined
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            {/* Main Image */}
            <div 
              className="h-full w-full cursor-pointer relative"
              onClick={onViewDetails}
            >
              {product.imageUrls && product.imageUrls[0] ? (
                <img 
                  src={product.imageUrls[0]} 
                  alt={product.productName || product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-300" />
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4 transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                <button
                  onClick={onViewDetails}
                  className="w-full py-2.5 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Quick View
                </button>
              </div>
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount && (
                <div 
                  className="px-2.5 py-1.5 text-white text-xs font-bold rounded-lg shadow-lg"
                  style={getGradientStyle(colors.primary, colors.secondary)}
                >
                  -{discount}%
                </div>
              )}
              
              {hasVariants && (
                <div 
                  className="px-2.5 py-1.5 text-white text-xs font-medium rounded-lg shadow-lg flex items-center gap-1"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <Palette className="h-3 w-3" />
                  <span>{variantCount} variants</span>
                </div>
              )}
              
              {product.isFeatured && (
                <div 
                  className="px-2.5 py-1.5 text-white text-xs font-medium rounded-lg shadow-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  Featured
                </div>
              )}
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`absolute top-3 right-3 p-2.5 rounded-lg backdrop-blur-sm transition-all transform hover:scale-110 ${
                isInWishlist
                  ? 'text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-white'
              }`}
              style={isInWishlist ? { backgroundColor: colors.primary } : {}}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
            
            {/* Stock Indicator */}
            {!isOutOfStock && isLowStock && (
              <div className="absolute bottom-3 left-3 right-3">
                <div 
                  className="text-white text-xs px-2 py-1.5 rounded-lg text-center font-medium"
                  style={{ backgroundColor: colors.secondary }}
                >
                  Only {totalStock} left in stock
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Category */}
            <div className="mb-2">
              <span 
                className="inline-flex px-2 py-1 rounded-md text-xs"
                style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
              >
                {product.category?.categoryName || product.category?.name || 'Product'}
              </span>
            </div>

            {/* Title */}
            <h3 
              className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer transition-colors text-sm leading-relaxed"
              onClick={onViewDetails}
              style={{ color: isHovered ? colors.primary : undefined }}
            >
              {product.productName || product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-600"></span>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {priceFormatter(product.price)}
                  </span>
                  {discount && (
                    <span className="text-xs text-gray-500 line-through">
                      {priceFormatter(product.oldPrice)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {totalStock} available
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`p-2.5 rounded-lg transition-all ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isAddingToCart
                    ? 'text-white'
                    : 'text-white hover:opacity-90 hover:shadow-lg'
                }`}
                style={!isOutOfStock && !isAddingToCart 
                  ? getGradientStyle(colors.primary, colors.secondary)
                  : isAddingToCart
                  ? { backgroundColor: '#10b981' }
                  : {}
                }
              >
                {isAddingToCart ? (
                  <Check className="h-5 w-5" />
                ) : isOutOfStock ? (
                  <span className="text-xs px-2">Out</span>
                ) : hasVariants ? (
                  <Palette className="h-5 w-5" />
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // List View (Desktop Only - optimized for all screens)
  return (
    <>
      <style>{fadeInStyles}</style>
      <div 
        className={`group bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 transition-all duration-300 ${
          cardLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ 
          transition: 'all 0.5s ease-out',
          borderColor: isHovered ? colors.primary : undefined
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Product Image */}
          <div className="relative w-full sm:w-40 lg:w-48 flex-shrink-0">
            <div 
              className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
              onClick={onViewDetails}
            >
              {product.imageUrls && product.imageUrls[0] ? (
                <img 
                  src={product.imageUrls[0]} 
                  alt={product.productName || product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-300" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {discount && (
                  <div 
                    className="px-2 py-1 text-white text-xs font-bold rounded-lg"
                    style={getGradientStyle(colors.primary, colors.secondary)}
                  >
                    -{discount}%
                  </div>
                )}
                {hasVariants && (
                  <div 
                    className="px-2 py-1 text-white text-xs font-medium rounded-lg"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    {variantCount} variants
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="px-2 py-1 rounded-md text-xs"
                    style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
                  >
                    {product.category?.categoryName || product.category?.name || 'Product'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">4.8</span>
                  </div>
                </div>
                
                <h3 
                  className="text-base sm:text-lg font-bold text-gray-900 mb-2 cursor-pointer transition-colors line-clamp-2"
                  onClick={onViewDetails}
                  style={{ color: isHovered ? colors.primary : undefined }}
                >
                  {product.productName || product.name}
                </h3>
              </div>
              
              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product);
                }}
                className={`self-start p-2 rounded-lg transition-all ${
                  isInWishlist
                    ? 'text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                style={isInWishlist ? { backgroundColor: colors.primary } : {}}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description || 'Premium quality product with exceptional features and durability.'}
            </p>

            {/* Price and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {priceFormatter(product.price)}
                  </span>
                  {discount && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        {priceFormatter(product.oldPrice)}
                      </span>
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-lg"
                        style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
                      >
                        Save {priceFormatter(product.oldPrice - product.price)}
                      </span>
                    </>
                  )}
                </div>
                
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  !isOutOfStock
                    ? isLowStock
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${
                    !isOutOfStock
                      ? isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                      : 'bg-gray-400'
                  }`} />
                  {isOutOfStock ? 'Out of Stock' : `${totalStock} in stock`}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={onViewDetails}
                  className="flex-1 sm:flex-none px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:text-white transition-all font-medium text-sm flex items-center justify-center gap-2"
                  style={{ 
                    borderColor: isHovered ? colors.primary : undefined,
                    backgroundColor: isHovered ? colors.primary : undefined,
                    color: isHovered ? 'white' : undefined
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Details</span>
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isAddingToCart
                      ? 'text-white'
                      : 'text-white hover:opacity-90 hover:shadow-lg'
                  }`}
                  style={!isOutOfStock && !isAddingToCart 
                    ? getGradientStyle(colors.primary, colors.secondary)
                    : isAddingToCart
                    ? { backgroundColor: '#10b981' }
                    : {}
                  }
                >
                  {isAddingToCart ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added!</span>
                    </>
                  ) : isOutOfStock ? (
                    'Out of Stock'
                  ) : hasVariants ? (
                    <>
                      <Palette className="h-4 w-4" />
                      <span>Select</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" style={{ color: colors.primary }} />
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="h-3 w-3" style={{ color: colors.secondary }} />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" style={{ color: colors.primary }} />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;