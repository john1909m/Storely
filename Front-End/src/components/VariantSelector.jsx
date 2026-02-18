// components/VariantSelector.jsx
import React, { useState, useEffect } from 'react';
import { X, Check, Package, AlertCircle, ShoppingCart, Palette, Ruler } from 'lucide-react';

const VariantSelector = ({ product, onSelect, onClose, formatPrice }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product && product.variants) {
      // Extract unique colors
      const colors = [...new Set(product.variants
        .map(v => v.productColor)
        .filter(Boolean))];
      setUniqueColors(colors);
      
      // Set first color as default if available
      if (colors.length > 0 && !selectedColor) {
        setSelectedColor(colors[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    if (selectedColor && product?.variants) {
      // Get all sizes available for selected color
      const sizes = product.variants
        .filter(v => v.productColor === selectedColor && v.productSize)
        .map(v => v.productSize)
        .filter((v, i, a) => a.indexOf(v) === i); // Unique sizes
      
      setAvailableSizes(sizes);
      
      // Reset size selection if not available for this color
      if (selectedSize && !sizes.includes(selectedSize)) {
        setSelectedSize(null);
        setSelectedVariant(null);
      }
      
      // Find variant if only colors (no sizes)
      if (!product.variants.some(v => v.productSize)) {
        const variant = product.variants.find(v => v.productColor === selectedColor);
        setSelectedVariant(variant);
      }
    }
  }, [selectedColor, product]);

  useEffect(() => {
    if (selectedColor && selectedSize && product?.variants) {
      // Find variant with selected color and size
      const variant = product.variants.find(
        v => v.productColor === selectedColor && v.productSize === selectedSize
      );
      setSelectedVariant(variant);
    }
  }, [selectedColor, selectedSize, product]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      setError('Please select all options');
      return;
    }
    
    if (quantity > selectedVariant.quantity) {
      setError(`Only ${selectedVariant.quantity} units available`);
      return;
    }
    
    onSelect(selectedVariant, quantity);
  };

  const getAvailableStock = () => {
    return selectedVariant?.quantity || 0;
  };

  const defaultFormatPrice = (price) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const priceFormatter = formatPrice || defaultFormatPrice;

  const hasColors = uniqueColors.length > 0;
  const hasSizes = availableSizes.length > 0;

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
        <div className="h-20 w-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {product.imageUrls && product.imageUrls[0] ? (
            <img 
              src={product.imageUrls[0]} 
              alt={product.productName || product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-2xl">
              📦
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            {product.productName || product.name}
          </h4>
          <div className="text-xl font-bold text-indigo-600">
            {priceFormatter(product.price)}
          </div>
        </div>
      </div>

      {/* Color Selection */}
      {hasColors && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">
              Color <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {uniqueColors.map(color => {
              const isAvailable = product.variants.some(
                v => v.productColor === color && v.quantity > 0
              );
              const stockCount = product.variants
                .filter(v => v.productColor === color)
                .reduce((sum, v) => sum + (v.quantity || 0), 0);
              
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!isAvailable}
                  className={`
                    relative px-4 py-3 rounded-xl border-2 transition-all min-w-[100px]
                    ${selectedColor === color
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : isAvailable
                        ? 'border-gray-200 hover:border-indigo-300 text-gray-700'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="font-medium">{color}</div>
                    <div className="text-xs mt-1">
                      {isAvailable ? `${stockCount} left` : 'Out of stock'}
                    </div>
                  </div>
                  {selectedColor === color && (
                    <div className="absolute -top-2 -right-2 h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {hasSizes && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">
              Size <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map(size => {
              const variant = product.variants.find(
                v => v.productColor === selectedColor && v.productSize === size
              );
              const isAvailable = variant?.quantity > 0;
              
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!isAvailable}
                  className={`
                    relative px-4 py-3 rounded-xl border-2 transition-all min-w-[80px]
                    ${selectedSize === size
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : isAvailable
                        ? 'border-gray-200 hover:border-indigo-300 text-gray-700'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="font-medium">{size}</div>
                    <div className="text-xs mt-1">
                      {isAvailable ? `${variant?.quantity} left` : 'Out'}
                    </div>
                  </div>
                  {selectedSize === size && (
                    <div className="absolute -top-2 -right-2 h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Selected: {selectedColor} {selectedSize && `/ ${selectedSize}`}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {selectedVariant.quantity} units available
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {selectedVariant && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="h-12 w-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <span className="text-xl">-</span>
              </button>
              <span className="h-12 w-16 flex items-center justify-center font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(prev => Math.min(selectedVariant.quantity, prev + 1))}
                disabled={quantity >= selectedVariant.quantity}
                className="h-12 w-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <span className="text-xl">+</span>
              </button>
            </div>
            <span className="text-sm text-gray-600">
              Max: {selectedVariant.quantity}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || (selectedVariant && quantity > selectedVariant.quantity)}
          className={`
            flex-1 py-4 rounded-xl font-semibold text-lg transition-all
            flex items-center justify-center gap-3
            ${selectedVariant && quantity <= selectedVariant.quantity
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>
            {!selectedVariant 
              ? 'Select Options' 
              : `Add to Cart - ${priceFormatter(product.price * quantity)}`
            }
          </span>
        </button>
        
        <button
          onClick={onClose}
          className="flex-1 sm:flex-none px-8 py-4 border border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>

      {/* Stock Summary */}
      {selectedVariant && (
        <div className="text-center text-sm text-gray-500">
          <p>Total: {priceFormatter(product.price * quantity)}</p>
          {selectedVariant.quantity <= 5 && (
            <p className="text-amber-600 mt-2">
              Only {selectedVariant.quantity} left in stock - order soon
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VariantSelector;