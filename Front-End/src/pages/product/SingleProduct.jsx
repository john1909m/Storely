// pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productAPI } from '../../api/product.api';
import { storeAPI } from '../../api/store.api';
import { Palette, Ruler, Check, AlertCircle, ChevronLeft, ShoppingBag, Heart, Share2, Shield, Truck, RefreshCw } from 'lucide-react';
import StoreFooter from '../../components/StoreFooter';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const fadeInStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
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
  const [themeType, setThemeType] = useState('CLASSIC');
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Variant selection states
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantQuantity, setVariantQuantity] = useState(0);
  const [uniqueColors, setUniqueColors] = useState([]);
  const { handleError } = useErrorHandler();

  const getStoreColors = () => ({
    primary: store?.primaryColor || '#4f46e5',
    secondary: store?.secondaryColor || '#9333ea',
    primaryLight: store?.primaryColor ? `${store.primaryColor}20` : '#e0e7ff',
    secondaryLight: store?.secondaryColor ? `${store.secondaryColor}20` : '#f3e8ff'
  });

  const getGradientStyle = (fromColor, toColor) => ({
    background: `linear-gradient(to right, ${fromColor}, ${toColor})`
  });

  // Theme-specific styles
  const getPageBg = () => {
    if (themeType === 'MODERN') return 'bg-black';
    if (themeType === 'MINIMAL') return 'bg-white';
    return 'bg-gradient-to-b from-gray-50 to-white';
  };

  const getCardBg = () => {
    if (themeType === 'MODERN') return 'bg-black/40 backdrop-blur-sm border border-white/10';
    if (themeType === 'MINIMAL') return 'bg-white border border-gray-100';
    return 'bg-white border border-gray-100';
  };

  const getTextColor = () => {
    if (themeType === 'MODERN') return 'text-white';
    if (themeType === 'MINIMAL') return 'text-gray-900';
    return 'text-gray-900';
  };

  const getSecondaryTextColor = () => {
    if (themeType === 'MODERN') return 'text-gray-400';
    if (themeType === 'MINIMAL') return 'text-gray-600';
    return 'text-gray-600';
  };

  useEffect(() => {
    fetchProductData();
  }, [storeName, productId]);

  useEffect(() => {
    if (!loading && product && store) {
      setTimeout(() => setPageLoaded(true), 100);
      setThemeType(store.themeType || 'CLASSIC');
      
      // Check if product is in wishlist
      const wishlistKey = `wishlist_${storeName}`;
      const savedWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
      setIsInWishlist(savedWishlist.some(item => item.id === product?.id));
    }
  }, [loading, product, store, storeName]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const colors = [...new Set(product.variants.map(v => v.productColor).filter(Boolean))];
      setUniqueColors(colors);
      if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0]);
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
      const variant = product.variants.find(v => v.productColor === selectedColor && v.productSize === selectedSize);
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
      return selectedVariant?.quantity || 0;
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
      if (selectedColor) cartItem.selectedColor = selectedColor;
      if (selectedSize) cartItem.selectedSize = selectedSize;
      if (selectedVariant) cartItem.variantId = selectedVariant.id;
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
    navigate(`/store/${storeName}?addedToCart=true`);
  };

  const handleToggleWishlist = () => {
    const wishlistKey = `wishlist_${storeName}`;
    const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    
    let newWishlist;
    if (isInWishlist) {
      newWishlist = existingWishlist.filter(item => item.id !== product.id);
    } else {
      newWishlist = [...existingWishlist, product];
    }
    
    localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
    setIsInWishlist(!isInWishlist);
  };

  const formatPrice = (price) => {
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(price || 0);
  };

  const colors = store ? getStoreColors() : { primary: '#4f46e5', secondary: '#9333ea', primaryLight: '#e0e7ff' };
  const hasVariants = product?.variants && product.variants.length > 0;
  const availableStock = getAvailableStock();
  const isOutOfStock = hasVariants ? availableStock <= 0 : (product?.quantity || 0) <= 0;

  if (loading) {
    return (
      <div className={`min-h-screen ${getPageBg()} flex items-center justify-center`}>
        <div className="text-center">
          <div className="h-12 w-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: `${colors.primaryLight}`, borderTopColor: colors.primary }}></div>
          <p className={getSecondaryTextColor()}>{t('productDetail.loading.product')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`min-h-screen ${getPageBg()} flex items-center justify-center`}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h2 className={`text-2xl font-bold ${getTextColor()} mb-2`}>{t('productDetail.errors.productNotFound')}</h2>
          <p className={`${getSecondaryTextColor()} mb-6`}>{error || t('productDetail.errors.productNotFoundMessage')}</p>
          <button onClick={() => navigate(`/store/${storeName}`)} className="inline-flex items-center px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all" style={getGradientStyle(colors.primary, colors.secondary)}>
            {t('productDetail.buttons.backToStore')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getPageBg()}`}>
      <style>{fadeInStyles}</style>
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button onClick={() => navigate(`/store/${storeName}`)} className={`mb-6 flex items-center space-x-2 transition-all duration-700 ${pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ color: colors.primary }}>
          <ChevronLeft className="h-5 w-5" />
          <span>{t('productDetail.buttons.backToStoreName', { storeName: store?.storeName })}</span>
        </button>

        {/* Product Card */}
        <div className={`${getCardBg()} rounded-2xl overflow-hidden shadow-lg transition-all duration-700 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden transition-all duration-700 delay-100" style={pageLoaded ? { opacity: 1 } : { opacity: 0 }}>
                {product.imageUrls && product.imageUrls[selectedImageIndex] ? (
                  <img src={product.imageUrls[selectedImageIndex]} alt={product.productName || product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-6xl">📦</div>
                )}
              </div>
              
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {product.imageUrls.map((image, index) => (
                    <button key={index} onClick={() => setSelectedImageIndex(index)} className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index ? 'border-2' : 'border-gray-200'}`} style={selectedImageIndex === index ? { borderColor: colors.primary } : {}}>
                      <img src={image} alt={`${product.productName} ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className={`transition-all duration-700 delay-200 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3" style={{ backgroundColor: colors.primaryLight, color: colors.primary }}>
                  {product.categoryName || product.category?.name || t('productDetail.uncategorized')}
                </span>
                <h1 className={`text-3xl font-bold ${getTextColor()} mb-2`}>{product.productName || product.name}</h1>
              </div>

              {/* Price */}
              <div className={`transition-all duration-700 delay-300 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className={`text-4xl font-bold ${getTextColor()} mb-2`}>{formatPrice(product.price || 0)}</div>
                {product.oldPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>
                    <span className="px-2 py-1 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.primaryLight, color: colors.primary }}>
                      {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% {t('productDetail.off')}
                    </span>
                  </div>
                )}
              </div>

              {/* Variant Selection */}
              {hasVariants && (
                <div className={`space-y-6 transition-all duration-700 delay-400 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {uniqueColors.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="h-5 w-5" style={{ color: colors.primary }} />
                        <label className={`text-sm font-medium ${getSecondaryTextColor()}`}>{t('productDetail.color')}:</label>
                        <span className="text-sm font-semibold" style={{ color: colors.primary }}>{selectedColor || t('productDetail.select')}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {uniqueColors.map(color => {
                          const isAvailable = product.variants.some(v => v.productColor === color && v.quantity > 0);
                          return (
                            <button key={color} onClick={() => setSelectedColor(color)} disabled={!isAvailable}
                              className={`px-4 py-2 rounded-xl border-2 transition-all ${selectedColor === color ? 'text-white' : isAvailable ? 'text-gray-700 hover:border-gray-300' : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'}`}
                              style={selectedColor === color ? getGradientStyle(colors.primary, colors.secondary) : { borderColor: selectedColor === color ? colors.primary : colors.primaryLight }}>
                              {color}{!isAvailable && <span className="ml-2 text-xs">({t('productDetail.out')})</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {availableSizes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Ruler className="h-5 w-5" style={{ color: colors.primary }} />
                        <label className={`text-sm font-medium ${getSecondaryTextColor()}`}>{t('productDetail.size')}:</label>
                        <span className="text-sm font-semibold" style={{ color: colors.primary }}>{selectedSize || t('productDetail.select')}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {availableSizes.map(size => {
                          const variant = product.variants.find(v => v.productColor === selectedColor && v.productSize === size);
                          const isAvailable = variant?.quantity > 0;
                          return (
                            <button key={size} onClick={() => setSelectedSize(size)} disabled={!isAvailable}
                              className={`px-4 py-2 rounded-xl border-2 transition-all ${selectedSize === size ? 'text-white' : isAvailable ? 'text-gray-700 hover:border-gray-300' : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'}`}
                              style={selectedSize === size ? getGradientStyle(colors.primary, colors.secondary) : { borderColor: colors.primaryLight }}>
                              {size}{!isAvailable && <span className="ml-2 text-xs">({t('productDetail.out')})</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedVariant && (
                    <div className="rounded-xl p-4 transition-all duration-700" style={{ backgroundColor: colors.primaryLight }}>
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: colors.primary }}>{t('productDetail.selected')}: {selectedColor} {selectedSize && `/ ${selectedSize}`}</p>
                          <p className="text-sm opacity-75" style={{ color: colors.primary }}>{availableStock} {t('productDetail.unitsAvailable')}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className={`transition-all duration-700 delay-500 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h3 className={`text-lg font-semibold ${getTextColor()} mb-3`}>{t('productDetail.description')}</h3>
                <p className={getSecondaryTextColor()}>{product.description || t('productDetail.noDescription')}</p>
              </div>

              {/* Quantity Selector */}
              <div className={`transition-all duration-700 delay-600 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className={`block text-sm font-medium ${getSecondaryTextColor()} mb-2`}>{t('productDetail.quantity')}</label>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center border rounded-lg ${themeType === 'MODERN' ? 'border-white/20' : 'border-gray-200'}`}>
                    <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} disabled={quantity <= 1} className="h-12 w-12 flex items-center justify-center disabled:opacity-50">
                      <div className='border-2 border-white w-6 h-7 p-4 flex flex-col justify-center items-center flex-shrink-0 rounded-2xl' style={{ backgroundColor: colors.primary }}>
                        <span className="text-2xl text-white text-center flex justify-center items-center">-</span>
                      </div>
                    </button>
                    <span className={`h-12 w-16 flex items-center justify-center font-semibold ${getTextColor()}`}>{quantity}</span>
                    <button onClick={() => setQuantity(prev => Math.min(availableStock, prev + 1))} disabled={quantity >= availableStock} className="h-12 w-12 flex items-center justify-center disabled:opacity-50">
                      <div className='border-2 border-white w-6 h-7 p-4 flex flex-col justify-center items-center flex-shrink-0 rounded-2xl' style={{ backgroundColor: colors.primary }}>
                        <span className="text-2xl text-white text-center flex justify-center items-center">+</span>
                      </div>
                    </button>
                  </div>
                  <div className={`text-sm ${getSecondaryTextColor()}`}>{t('productDetail.max')}: {availableStock} {t('productDetail.units')}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button onClick={handleAddToCart} disabled={isOutOfStock || (hasVariants && !selectedVariant)} className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all ${!isOutOfStock && (!hasVariants || selectedVariant) ? 'text-white hover:opacity-90 shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} style={!isOutOfStock && (!hasVariants || selectedVariant) ? getGradientStyle(colors.primary, colors.secondary) : {}}>
                  {hasVariants && !selectedVariant ? t('productDetail.selectOptions') : isOutOfStock ? t('productDetail.outOfStock') : `${t('productDetail.addToCart')} - ${formatPrice((product.price || 0) * quantity)}`}
                </button>
                
                
              </div>

              {/* Store Info */}
              <div className={`pt-8 border-t ${themeType === 'MODERN' ? 'border-white/10' : 'border-gray-200'} transition-all duration-700 delay-800 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: colors.primaryLight }}>
                    {store?.logoUrl ? <img src={store.logoUrl} alt={store.storeName} className="h-full w-full object-cover" /> : <ShoppingBag className="h-6 w-6" style={{ color: colors.primary }} />}
                  </div>
                  <div>
                    <div className={`font-semibold ${getTextColor()}`}>{t('productDetail.soldBy')} {store?.storeName}</div>
                    <div className={`text-sm ${getSecondaryTextColor()}`}>{store?.storeDescription || t('productDetail.verifiedSeller')}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.primary }} />
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.secondary }} />
                      <span className={`text-xs ${getSecondaryTextColor()}`}>{t('productDetail.storeColors')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default ProductDetail;