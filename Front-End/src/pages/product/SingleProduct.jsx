// pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../../api/product.api';
import { storeAPI } from '../../api/store.api';
import { Palette, Ruler, Check, AlertCircle } from 'lucide-react';
import StoreFooter from '../../components/StoreFooter';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const ProductDetail = () => {
  const { storeName, productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Variant selection states
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantQuantity, setVariantQuantity] = useState(0);
  const [uniqueColors, setUniqueColors] = useState([]);
    const { handleError } = useErrorHandler();

  useEffect(() => {
    fetchProductData();
  }, [storeName, productId]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
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
        setVariantQuantity(0);
      }
      
      // Find variant if only colors (no sizes)
      if (!product.variants.some(v => v.productSize)) {
        const variant = product.variants.find(v => v.productColor === selectedColor);
        setSelectedVariant(variant);
        setVariantQuantity(variant?.quantity || 0);
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
      setVariantQuantity(variant?.quantity || 0);
    }
  }, [selectedColor, selectedSize, product]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      
      // Fetch store first
      const storeData = await storeAPI.getByName(storeName);
      if (!storeData) throw new Error('Store not found');
      setStore(storeData);

      // Fetch product
      const productData = await productAPI.getById(productId, storeData.id);
      if (!productData || productData.storeId !== storeData.id) {
        throw new Error('Product not found in this store');
      }
      setProduct(productData);

    } catch (err) {
      handleError(err);
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableStock = () => {
    if (product?.variants && product.variants.length > 0) {
      if (selectedVariant) {
        return selectedVariant.quantity || 0;
      }
      return 0;
    }
    return product?.quantity || 0;
  };

  const handleAddToCart = () => {
    const cartKey = `cart_${storeName}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    // Create cart item with variant information
    const cartItem = {
      id: product.id,
      productName: product.productName || product.name,
      price: product.price || 0,
      imageUrls: product.imageUrls || [],
      quantity: quantity,
      addedAt: new Date().toISOString()
    };

    // Add variant information if product has variants
    if (product?.variants && product.variants.length > 0) {
      if (selectedColor) {
        cartItem.selectedColor = selectedColor;
        cartItem.color = selectedColor;
      }
      if (selectedSize) {
        cartItem.selectedSize = selectedSize;
        cartItem.size = selectedSize;
      }
      if (selectedVariant) {
        cartItem.variantId = selectedVariant.id;
      }
    }
    
    const existingItemIndex = existingCart.findIndex(item => {
      if (product?.variants && product.variants.length > 0) {
        // For variant products, match by variant combination
        return item.id === product.id && 
               item.selectedColor === selectedColor &&
               item.selectedSize === selectedSize;
      }
      // For simple products, just match by id
      return item.id === product.id;
    });
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }
    
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    
    // Show success message
    const variantText = selectedColor && selectedSize 
      ? ` (${selectedColor} / ${selectedSize})`
      : selectedColor 
        ? ` (${selectedColor})`
        : '';
    
    
    handleError({message_en: `Added ${quantity} ${quantity > 1 ? 'items' : 'item'}${variantText} to cart!`})
    
    // Navigate to cart or stay on page
    navigate(`/store/${storeName}?addedToCart=true`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(price || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This product does not exist or has been removed.'}</p>
          <button
            onClick={() => navigate(`/store/${storeName}`)}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const availableStock = getAvailableStock();
  const isOutOfStock = hasVariants ? availableStock <= 0 : (product.quantity || 0) <= 0;
  const totalStock = hasVariants 
    ? product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
    : product.quantity || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/store/${storeName}`)}
          className="mb-6 flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
        >
          <span>←</span>
          <span>Back to {store?.storeName}</span>
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
                {product.imageUrls && product.imageUrls[selectedImageIndex] ? (
                  <img 
                    src={product.imageUrls[selectedImageIndex]} 
                    alt={product.productName || product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-6xl">📦</div>
                )}
              </div>
              
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {product.imageUrls.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index 
                          ? 'border-indigo-600' 
                          : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.productName} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-3">
                    {product.categoryName || product.category?.name || 'Uncategorized'}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.productName || product.name}
                  </h1>
                </div>
                
              </div>

              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatPrice(product.price || 0)}
                </div>
                {product.oldPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                      {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Variant Selection */}
              {hasVariants && (
                <div className="mb-8 space-y-6">
                  {/* Color Selection */}
                  {uniqueColors.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="h-5 w-5 text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">Color:</label>
                        <span className="text-sm font-semibold text-indigo-600">{selectedColor || 'Select'}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {uniqueColors.map(color => {
                          const isAvailable = product.variants.some(
                            v => v.productColor === color && v.quantity > 0
                          );
                          return (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              disabled={!isAvailable}
                              className={`px-4 py-2 rounded-xl border-2 transition-all ${
                                selectedColor === color
                                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                  : isAvailable
                                    ? 'border-gray-200 hover:border-gray-300 text-gray-700'
                                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                              }`}
                            >
                              {color}
                              {!isAvailable && (
                                <span className="ml-2 text-xs">(Out)</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {availableSizes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Ruler className="h-5 w-5 text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">Size:</label>
                        <span className="text-sm font-semibold text-indigo-600">{selectedSize || 'Select'}</span>
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
                              className={`px-4 py-2 rounded-xl border-2 transition-all ${
                                selectedSize === size
                                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                  : isAvailable
                                    ? 'border-gray-200 hover:border-gray-300 text-gray-700'
                                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                              }`}
                            >
                              {size}
                              {!isAvailable && (
                                <span className="ml-2 text-xs">(Out)</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Stock Info */}
                  {selectedVariant && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Selected: {selectedColor} {selectedSize && `/ ${selectedSize}`}
                          </p>
                          <p className="text-sm text-blue-700">
                            {availableStock} units available
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="h-12 w-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="text-xl">-</span>
                    </button>
                    <span className="h-12 w-16 flex items-center justify-center font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => Math.min(availableStock, prev + 1))}
                      disabled={quantity >= availableStock}
                      className="h-12 w-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Max: {availableStock} units
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || (hasVariants && !selectedVariant)}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  !isOutOfStock && (!hasVariants || selectedVariant)
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {hasVariants && !selectedVariant
                  ? 'Select Options'
                  : isOutOfStock
                    ? 'Out of Stock'
                    : `Add to Cart - ${formatPrice((product.price || 0) * quantity)}`
                }
              </button>

              {/* Store Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    {store?.logoUrl ? (
                      <img 
                        src={store.logoUrl} 
                        alt={store.storeName}
                        className="h-full w-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-xl">🏪</span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sold by {store?.storeName}</div>
                    <div className="text-sm text-gray-600">
                      {store?.storeDescription || 'Verified seller'}
                    </div>
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

export default ProductDetail;