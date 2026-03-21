// pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productAPI } from '../../api/product.api';
import { storeAPI } from '../../api/store.api';
import { Palette, Ruler, Check, AlertCircle, ChevronLeft, ShoppingBag } from 'lucide-react';
import StoreFooter from '../../components/StoreFooter';
import { useErrorHandler } from '../../hooks/useErrorHandler';

// ✨ إضافة أنماط CSS للـ animations
const fadeInStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
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
  
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  .animate-fade-in-scale {
    animation: fadeInScale 0.5s ease-out forwards;
  }
`;

const ProductDetail = () => {
  const { storeName, productId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Variant selection states
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantQuantity, setVariantQuantity] = useState(0);
  const [uniqueColors, setUniqueColors] = useState([]);
  const { handleError } = useErrorHandler();

  // 🎨 دالة للحصول على الألوان المخصصة مع قيم افتراضية
  const getStoreColors = () => {
    return {
      primary: store?.primaryColor || '#4f46e5',
      secondary: store?.secondaryColor || '#9333ea',
      primaryLight: store?.primaryColor ? `${store.primaryColor}20` : '#e0e7ff',
      secondaryLight: store?.secondaryColor ? `${store.secondaryColor}20` : '#f3e8ff'
    };
  };

  // 🎨 دالة لتوليد style object للتدرجات
  const getGradientStyle = (fromColor, toColor) => {
    return {
      background: `linear-gradient(to right, ${fromColor}, ${toColor})`
    };
  };

  useEffect(() => {
    fetchProductData();
  }, [storeName, productId]);

  useEffect(() => {
    if (!loading && product && store) {
      setTimeout(() => {
        setPageLoaded(true);
      }, 100);
    }
  }, [loading, product, store]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const colors = [...new Set(product.variants
        .map(v => v.productColor)
        .filter(Boolean))];
      setUniqueColors(colors);
      
      if (colors.length > 0 && !selectedColor) {
        setSelectedColor(colors[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    if (selectedColor && product?.variants) {
      const sizes = product.variants
        .filter(v => v.productColor === selectedColor && v.productSize)
        .map(v => v.productSize)
        .filter((v, i, a) => a.indexOf(v) === i);
      
      setAvailableSizes(sizes);
      
      if (selectedSize && !sizes.includes(selectedSize)) {
        setSelectedSize(null);
        setSelectedVariant(null);
        setVariantQuantity(0);
      }
      
      if (!product.variants.some(v => v.productSize)) {
        const variant = product.variants.find(v => v.productColor === selectedColor);
        setSelectedVariant(variant);
        setVariantQuantity(variant?.quantity || 0);
      }
    }
  }, [selectedColor, product]);

  useEffect(() => {
    if (selectedColor && selectedSize && product?.variants) {
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
      setPageLoaded(false);
      
      const storeData = await storeAPI.getByName(storeName);
      if (!storeData) throw new Error('Store not found');
      setStore(storeData);

      const productData = await productAPI.getById(productId, storeData.id);
      if (!productData || productData.storeId !== storeData.id) {
        throw new Error('Product not found in this store');
      }
      setProduct(productData);

    } catch (err) {
      handleError(err);
      setError(err.message || t('productDetail.errors.failedToLoad'));
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
    
    const cartItem = {
      id: product.id,
      productName: product.productName || product.name,
      price: product.price || 0,
      imageUrls: product.imageUrls || [],
      quantity: quantity,
      addedAt: new Date().toISOString()
    };

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
        return item.id === product.id && 
               item.selectedColor === selectedColor &&
               item.selectedSize === selectedSize;
      }
      return item.id === product.id;
    });
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }
    
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    
    const variantText = selectedColor && selectedSize 
      ? ` (${selectedColor} / ${selectedSize})`
      : selectedColor 
        ? ` (${selectedColor})`
        : '';
    
    navigate(`/store/${storeName}?addedToCart=true`);
  };

  const formatPrice = (price) => {
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(price || 0);
  };

  const colors = store ? getStoreColors() : { primary: '#4f46e5', secondary: '#9333ea', primaryLight: '#e0e7ff', secondaryLight: '#f3e8ff' };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div 
            className="h-12 w-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ 
              borderColor: `${colors.primaryLight}`, 
              borderTopColor: colors.primary 
            }}
          ></div>
          <p className="text-gray-600">{t('productDetail.loading.product')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('productDetail.errors.productNotFound')}</h2>
          <p className="text-gray-600 mb-6">{error || t('productDetail.errors.productNotFoundMessage')}</p>
          <button
            onClick={() => navigate(`/store/${storeName}`)}
            className="inline-flex items-center px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all"
            style={getGradientStyle(colors.primary, colors.secondary)}
          >
            {t('productDetail.buttons.backToStore')}
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
      <style>{fadeInStyles}</style>
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/store/${storeName}`)}
          className={`mb-6 flex items-center space-x-2 transition-all duration-700 ${
            pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
          style={{ color: colors.primary }}
        >
          <ChevronLeft className="h-5 w-5" />
          <span>{t('productDetail.buttons.backToStoreName', { storeName: store?.storeName })}</span>
        </button>

        {/* Product Card */}
        <div 
          className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg transition-all duration-700 ${
            pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className="aspect-square bg-gray-50 rounded-2xl overflow-hidden transition-all duration-700 delay-100"
                style={pageLoaded ? { opacity: 1 } : { opacity: 0 }}
              >
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
              
              {/* Thumbnail Images */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {product.imageUrls.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-2'
                          : 'border-gray-200'
                      }`}
                      style={selectedImageIndex === index ? { borderColor: colors.primary } : {}}
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
            <div className="space-y-6">
              {/* Category & Title */}
              <div className={`transition-all duration-700 delay-200 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <span 
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3"
                  style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
                >
                  {product.categoryName || product.category?.name || t('productDetail.uncategorized')}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.productName || product.name}
                </h1>
              </div>

              {/* Price */}
              <div className={`transition-all duration-700 delay-300 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatPrice(product.price || 0)}
                </div>
                {product.oldPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                    <span 
                      className="px-2 py-1 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
                    >
                      {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% {t('productDetail.off')}
                    </span>
                  </div>
                )}
              </div>

              {/* Variant Selection */}
              {hasVariants && (
                <div className={`space-y-6 transition-all duration-700 delay-400 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {/* Color Selection */}
                  {uniqueColors.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="h-5 w-5" style={{ color: colors.primary }} />
                        <label className="text-sm font-medium text-gray-700">{t('productDetail.color')}:</label>
                        <span className="text-sm font-semibold" style={{ color: colors.primary }}>
                          {selectedColor || t('productDetail.select')}
                        </span>
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
                                  ? 'text-white'
                                  : isAvailable
                                    ? 'text-gray-700 hover:border-gray-300'
                                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                              }`}
                              style={selectedColor === color 
                                ? getGradientStyle(colors.primary, colors.secondary)
                                : { borderColor: selectedColor === color ? colors.primary : colors.primaryLight }
                              }
                            >
                              {color}
                              {!isAvailable && (
                                <span className="ml-2 text-xs">({t('productDetail.out')})</span>
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
                        <Ruler className="h-5 w-5" style={{ color: colors.primary }} />
                        <label className="text-sm font-medium text-gray-700">{t('productDetail.size')}:</label>
                        <span className="text-sm font-semibold" style={{ color: colors.primary }}>
                          {selectedSize || t('productDetail.select')}
                        </span>
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
                                  ? 'text-white'
                                  : isAvailable
                                    ? 'text-gray-700 hover:border-gray-300'
                                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                              }`}
                              style={selectedSize === size 
                                ? getGradientStyle(colors.primary, colors.secondary)
                                : { borderColor: colors.primaryLight }
                              }
                            >
                              {size}
                              {!isAvailable && (
                                <span className="ml-2 text-xs">({t('productDetail.out')})</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Stock Info */}
                  {selectedVariant && (
                    <div 
                      className="rounded-xl p-4 transition-all duration-700"
                      style={{ backgroundColor: colors.primaryLight }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: colors.primary }}>
                            {t('productDetail.selected')}: {selectedColor} {selectedSize && `/ ${selectedSize}`}
                          </p>
                          <p className="text-sm opacity-75" style={{ color: colors.primary }}>
                            {availableStock} {t('productDetail.unitsAvailable')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className={`transition-all duration-700 delay-500 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('productDetail.description')}</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.description || t('productDetail.noDescription')}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className={`transition-all duration-700 delay-600 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('productDetail.quantity')}
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
                    {t('productDetail.max')}: {availableStock} {t('productDetail.units')}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || (hasVariants && !selectedVariant)}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-700 cursor-pointer ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                } ${
                  !isOutOfStock && (!hasVariants || selectedVariant)
                    ? 'text-white hover:opacity-90 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                style={!isOutOfStock && (!hasVariants || selectedVariant) ? getGradientStyle(colors.primary, colors.secondary) : {}}
              >
                {hasVariants && !selectedVariant
                  ? t('productDetail.selectOptions')
                  : isOutOfStock
                    ? t('productDetail.outOfStock')
                    : `${t('productDetail.addToCart')} - ${formatPrice((product.price || 0) * quantity)}`
                }
              </button>

              {/* Store Info */}
              <div className={`pt-8 border-t border-gray-200 transition-all duration-700 delay-800 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center space-x-4">
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: colors.primaryLight }}
                  >
                    {store?.logoUrl ? (
                      <img 
                        src={store.logoUrl} 
                        alt={store.storeName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="h-6 w-6" style={{ color: colors.primary }} />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t('productDetail.soldBy')} {store?.storeName}</div>
                    <div className="text-sm text-gray-600">
                      {store?.storeDescription || t('productDetail.verifiedSeller')}
                    </div>
                    {store?.primaryColor && (
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: colors.primary }}
                        />
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: colors.secondary }}
                        />
                        <span className="text-xs text-gray-500">{t('productDetail.storeColors')}</span>
                      </div>
                    )}
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