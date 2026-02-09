// components/ProductCard.jsx
import React, { useState } from 'react';
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
  Truck
} from 'lucide-react';

const ProductCard = ({ 
  product, 
  viewMode, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist, 
  onViewDetails 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const getDiscountPercentage = () => {
    if (product.originalPrice && product.price < product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return null;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    onAddToCart(product);
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const discount = getDiscountPercentage();
  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  const isOutOfStock = product.quantity <= 0;

  if (viewMode === 'list') {
    return (
      <div 
        className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-6">
          {/* Product Image Container */}
          <div className="relative flex-shrink-0">
            <div 
              className="relative h-40 w-40 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer group"
              onClick={onViewDetails}
            >
              {/* Product Image */}
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.productName || product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No image</p>
                  </div>
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {discount && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-lg shadow-lg backdrop-blur-sm">
                    SAVE {discount}%
                  </div>
                )}
                
                {isLowStock && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-lg shadow-lg backdrop-blur-sm">
                    SELLING FAST
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isAddingToCart
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow'
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <Check className="h-4 w-4" />
                    ADDED
                  </>
                ) : isOutOfStock ? (
                  'OUT OF STOCK'
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    ADD TO CART
                  </>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product);
                }}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isInWishlist
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            {/* Category and Rating */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                  {product.category?.categoryName || product.category?.name || 'Uncategorized'}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">4.8</span>
                  <span className="text-sm text-gray-500">(128)</span>
                </div>
              </div>
              
              {product.soldCount > 0 && (
                <div className="flex items-center gap-1 text-gray-500">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">{product.soldCount}+ sold</span>
                </div>
              )}
            </div>

            {/* Product Title */}
            <h3 
              className="text-xl font-bold text-gray-900 mb-3 cursor-pointer hover:text-indigo-600 transition-colors group"
              onClick={onViewDetails}
            >
              {product.productName || product.name}
              <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="h-4 w-4 inline" />
              </span>
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2">
              {product.description || 'Premium quality product with exceptional features and durability.'}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3 mb-6">
              {product.features?.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              )) || (
                <>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-gray-600">1 Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-gray-600">Fast Delivery</span>
                  </div>
                </>
              )}
            </div>

            {/* Price and Stock */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${(product.price || 0).toFixed(2)}
                  </span>
                  {discount && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ${(product.originalPrice || 0).toFixed(2)}
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        Save ${((product.originalPrice - product.price) || 0).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  product.quantity > 20 
                    ? 'bg-emerald-50 text-emerald-700'
                    : product.quantity > 0
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`h-2 w-2 rounded-full ${
                    product.quantity > 20 ? 'bg-emerald-500' :
                    product.quantity > 0 ? 'bg-amber-500' : 'bg-gray-400'
                  }`}></div>
                  {product.quantity > 20 ? 'In Stock' : 
                   product.quantity > 0 ? `${product.quantity} left` : 'Out of Stock'}
                </div>
              </div>

              {/* Additional Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onViewDetails}
                  className="px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-indigo-100 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Effects */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        {/* Main Image */}
        <div 
          className="h-full w-full cursor-pointer relative"
          onClick={onViewDetails}
        >
          {product.images && product.images[0] ? (
            <>
              <img 
                src={product.images[0]} 
                alt={product.productName || product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/0 to-white/0 group-hover:via-indigo-100/10 group-hover:to-indigo-100/5 transition-all duration-700" />
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">No image available</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount && (
            <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-xl shadow-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>{discount}% OFF</span>
              </div>
            </div>
          )}
          
          {isLowStock && (
            <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-xl shadow-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>LOW STOCK</span>
              </div>
            </div>
          )}
          
          {product.isFeatured && (
            <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-xl shadow-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span>FEATURED</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 transform group-hover:scale-110 ${
            isInWishlist
              ? 'bg-red-500/20 text-red-600 border border-red-200 shadow-lg'
              : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 border border-white/50'
          }`}
        >
          <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
        
        {/* Quick View Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onViewDetails}
        >
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h4 className="text-white text-lg font-bold mb-2 line-clamp-1">
              {product.productName || product.name}
            </h4>
            <p className="text-gray-200 text-sm line-clamp-2 mb-4">
              {product.description?.substring(0, 100) || 'Premium quality product'}
            </p>
            <button className="w-full px-4 py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <Eye className="h-5 w-5" />
              Quick View
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <div className="mb-3">
          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            {product.category?.categoryName || product.category?.name || 'Uncategorized'}
          </span>
        </div>

        {/* Title */}
        <h3 
          className="font-bold text-gray-900 mb-2 line-clamp-1 cursor-pointer group/title hover:text-indigo-600 transition-colors duration-300"
          onClick={onViewDetails}
        >
          {product.productName || product.name}
          <span className="inline-block ml-2 opacity-0 group-hover/title:opacity-100 transition-opacity">
            <Eye className="h-4 w-4 inline" />
          </span>
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description || 'Premium quality product with exceptional features'}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">4.8</span>
          <span className="text-sm text-gray-500">(128 reviews)</span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">
                ${(product.price || 0).toFixed(2)}
              </span>
              {discount && (
                <span className="text-sm text-gray-500 line-through">
                  ${(product.originalPrice || 0).toFixed(2)}
                </span>
              )}
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              product.quantity > 0
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full ${
                product.quantity > 0 ? 'bg-emerald-500' : 'bg-gray-400'
              }`}></div>
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            className={`relative px-5 py-3 rounded-xl font-medium transition-all duration-500 overflow-hidden group/btn ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAddingToCart
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isAddingToCart ? (
                <>
                  <Check className="h-5 w-5" />
                  ADDED
                </>
              ) : isOutOfStock ? (
                'SOLD OUT'
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  ADD
                </>
              )}
            </span>
            
            {/* Button Hover Effect */}
            {!isOutOfStock && !isAddingToCart && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover/btn:opacity-20 blur transition-opacity duration-500" />
              </>
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              <span>Free shipping</span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add RefreshCw import if not already imported
const RefreshCw = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

export default ProductCard;