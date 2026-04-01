// components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Star, Heart, Zap, Check, Package, Shield, Truck, RefreshCw, Palette, Info, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ 
  product, viewMode, onAddToCart, onToggleWishlist, isInWishlist, onViewDetails,
  formatPrice, themeType = 'CLASSIC', colors = { primary: '#4f46e5', secondary: '#9333ea', primaryLight: '#e0e7ff' }, t
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cardLoaded, setCardLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => { setTimeout(() => setCardLoaded(true), 100); }, []);

  const getGradientStyle = (fromColor, toColor) => ({ background: `linear-gradient(to right, ${fromColor}, ${toColor})` });
  const getDiscountPercentage = () => product.oldPrice && product.price < product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    if (isMobile && product.hasVariants) { setShowQuickAdd(true); setIsAddingToCart(false); return; }
    onAddToCart(product);
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const defaultFormatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(price);
  const priceFormatter = formatPrice || defaultFormatPrice;
  const discount = getDiscountPercentage();
  const totalStock = product.totalStock || product.quantity || 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;
  const isOutOfStock = totalStock <= 0;
  const hasVariants = product.hasVariants || (product.variants && product.variants.length > 0);
  const variantCount = product.variantCount || product.variants?.length || 0;

  // Theme-specific card styles
  const getCardStyle = () => {
    if (themeType === 'MODERN') {
      return `bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-${colors.primary}/50`;
    }
    if (themeType === 'MINIMAL') {
      return `bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-md`;
    }
    return `bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-xl`;
  };

  const getButtonStyle = (isSmall = false) => {
    const baseStyle = themeType === 'MODERN' 
      ? `bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 transition-all`
      : themeType === 'MINIMAL'
        ? `bg-gray-900 text-white hover:bg-gray-800 transition-all`
        : `text-white hover:opacity-90 transition-all`;
    
    if (isSmall) {
      return `p-1.5 rounded-lg ${baseStyle}`;
    }
    return `px-4 py-2.5 rounded-lg font-medium text-sm ${baseStyle}`;
  };

  const getBadgeStyle = (type) => {
    if (themeType === 'MODERN') {
      if (type === 'discount') return `px-2 py-1 text-white text-xs font-bold rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500`;
      if (type === 'variant') return `px-2 py-1 text-white text-xs font-medium rounded-lg shadow-lg bg-purple-500`;
      return `px-2 py-1 text-white text-xs font-medium rounded-lg shadow-lg bg-indigo-500`;
    }
    if (themeType === 'MINIMAL') {
      if (type === 'discount') return `px-2 py-1 bg-red-500 text-white text-xs font-bold rounded`;
      if (type === 'variant') return `px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded`;
      return `px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded`;
    }
    if (type === 'discount'){
      if (type === 'discount') return `px-2 py-1 bg-red-500 text-white text-xs font-bold rounded`;
      if (type === 'variant') return `px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded`;
      return `px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded`;
    }
  };

  const getTextStyle = () => {
    if (themeType === 'MODERN') return 'text-white';
    if (themeType === 'MINIMAL') return 'text-gray-900';
    return 'text-gray-900';
  };

  const getSecondaryTextStyle = () => {
    if (themeType === 'MODERN') return 'text-gray-400';
    if (themeType === 'MINIMAL') return 'text-gray-600';
    return 'text-gray-600';
  };

  const QuickAddModal = () => {
    if (!showQuickAdd) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQuickAdd(false)} />
        <div className={`relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl animate-slide-up sm:animate-fade-in-scale ${themeType === 'MODERN' ? 'bg-black border border-white/10' : 'bg-white'}`}>
          <div className="sm:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-100">
                  {product.imageUrls && product.imageUrls[0] ? (
                    <img src={product.imageUrls[0]} alt={product.productName || product.name} className="h-full w-full object-cover" />
                  ) : (<div className="h-full w-full flex items-center justify-center"><Package className="h-6 w-6 text-gray-400" /></div>)}
                </div>
                <div><h4 className={`font-semibold line-clamp-1 ${getTextStyle()}`}>{product.productName || product.name}</h4><p className={`text-sm ${getSecondaryTextStyle()}`}>{variantCount} {t('productCard.variantsAvailable')}</p></div>
              </div>
              <button onClick={() => setShowQuickAdd(false)} className="p-2 hover:bg-gray-100 rounded-lg"><span className="text-2xl">×</span></button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="rounded-xl p-4" style={{ backgroundColor: `${colors.primary}20` }}>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary }}><Info className="h-4 w-4 text-white" /></div>
                  <div><p className="text-sm font-medium" style={{ color: colors.primary }}>{t('productCard.multipleOptions')}</p><p className="text-xs mt-1" style={{ color: colors.primary, opacity: 0.7 }}>{t('productCard.selectOptionsOnProductPage')}</p></div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowQuickAdd(false); onViewDetails(); }} className={`flex-1 py-4 rounded-xl font-medium text-lg shadow-lg ${themeType === 'MINIMAL' ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'}`}>{t('productCard.viewDetails')}</button>
                {/* <button onClick={() => { setShowQuickAdd(false); onToggleWishlist(product); }} className={`p-4 rounded-xl border-2 transition-all ${isInWishlist ? 'text-red-600' : 'border-gray-200 text-gray-600'}`} style={isInWishlist ? { backgroundColor: `${colors.primary}20`, borderColor: colors.primary } : {}}>
                  <Heart className={`h-6 w-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </button> */}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4"><div className="flex items-center justify-between"><span className={getSecondaryTextStyle()}>{t('productCard.startingFrom')}</span><div><span className={`text-2xl font-bold ${getTextStyle()}`}>{priceFormatter(product.price)}</span>{discount && <span className="ml-2 text-sm text-gray-500 line-through">{priceFormatter(product.oldPrice)}</span>}</div></div></div>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Grid View
  if (viewMode === 'grid' && isMobile) {
    return (
      <>
        <div className={`group ${getCardStyle()} ${cardLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ borderColor: isHovered ? colors.primary : undefined }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="h-full w-full cursor-pointer" onClick={onViewDetails}>
              {product.imageUrls && product.imageUrls[0] ? <img src={product.imageUrls[0]} alt={product.productName || product.name} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center"><Package className="h-10 w-10 text-gray-300" /></div>}
            </div>
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount && <div className={getBadgeStyle('discount')}>-{discount}%</div>}
              {hasVariants && <div className={getBadgeStyle('variant')}><Palette className="h-3 w-3 inline mr-1" />{t('productCard.variants')}</div>}
            </div>
            {/* <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }} className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-sm transition-all ${isInWishlist ? 'text-white' : 'bg-white/90 text-gray-600'}`} style={isInWishlist ? { backgroundColor: colors.primary } : {}}><Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} /></button> */}
            {!isOutOfStock && isLowStock && <div className="absolute bottom-2 left-2 right-2"><div className="text-white text-xs px-2 py-1 rounded-lg text-center" style={{ backgroundColor: colors.secondary, opacity: 0.9 }}>{t('productCard.onlyLeft', { count: totalStock })}</div></div>}
          </div>
          <div className="p-3">
            <div className="mb-1"><span className="text-xs" style={{ color: colors.primary }}>{product.category?.categoryName || product.category?.name || t('productCard.product')}</span></div>
            <h3 className={`font-medium mb-2 line-clamp-2 text-sm cursor-pointer ${getTextStyle()}`} onClick={onViewDetails} style={{ color: isHovered ? colors.primary : undefined }}>{product.productName || product.name}</h3>
            <div className="flex items-baseline gap-1 mb-2"><span className={`text-lg font-bold ${getTextStyle()}`}>{priceFormatter(product.price)}</span>{discount && <span className="text-xs text-gray-500 line-through">{priceFormatter(product.oldPrice)}</span>}</div>
            <button onClick={handleAddToCart} disabled={isOutOfStock} className={`w-full py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-gray-100 text-gray-400' : getButtonStyle()}`}>
              {isAddingToCart ? <><Check className="h-4 w-4" />{t('productCard.added')}</> : isOutOfStock ? t('productCard.outOfStock') : hasVariants ? <><Palette className="h-4 w-4" />{t('productCard.selectOptions')}</> : <><ShoppingCart className="h-4 w-4" />{t('productCard.addToCart')}</>}
            </button>
          </div>
        </div>
        <QuickAddModal />
      </>
    );
  }

  // Desktop Grid View
  if (viewMode === 'grid') {
    return (
      <>
        <div className={`group ${getCardStyle()} ${cardLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ borderColor: isHovered ? colors.primary : undefined, boxShadow: isHovered && themeType === 'CLASSIC' ? `0 20px 25px -5px ${colors.primary}20` : undefined }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            <div className="h-full w-full cursor-pointer relative" onClick={onViewDetails}>
              {product.imageUrls && product.imageUrls[0] ? <img src={product.imageUrls[0]} alt={product.productName || product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="h-full w-full flex items-center justify-center"><Package className="h-16 w-16 text-gray-300" /></div>}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={onViewDetails} className="w-full py-2.5 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 flex items-center justify-center gap-2"><Eye className="h-4 w-4" />{t('productCard.quickView')}</button>
              </div>
            </div>
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount && <div className={getBadgeStyle('discount')}>-{discount}%</div>}
              {hasVariants && <div className={getBadgeStyle('variant')}><Palette className="h-3 w-3 inline mr-1" />{variantCount} {t('productCard.variants')}</div>}
              {product.isFeatured && <div className={getBadgeStyle('featured')}>{t('productCard.featured')}</div>}
            </div>
            {/* <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }} className={`absolute top-3 right-3 p-2.5 rounded-lg backdrop-blur-sm transition-all transform hover:scale-110 ${isInWishlist ? 'text-white' : 'bg-white/90 text-gray-600'}`} style={isInWishlist ? { backgroundColor: colors.primary } : {}}><Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} /></button> */}
            {!isOutOfStock && isLowStock && <div className="absolute bottom-3 left-3 right-3"><div className="text-white text-xs px-2 py-1.5 rounded-lg text-center font-medium" style={{ backgroundColor: colors.secondary }}>{t('productCard.onlyLeftInStock', { count: totalStock })}</div></div>}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="inline-flex px-2 py-1 rounded-md text-xs" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{product.category?.categoryName || product.category?.name || t('productCard.product')}</span>
              {/* Small Add to Cart Button for variants - appears only if product has variants */}
              {hasVariants && !isOutOfStock && (
                <button onClick={handleAddToCart} className={getButtonStyle(true)} title="Quick Add">
                  <Plus className="h-3 w-3" />
                </button>
              )}
            </div>
            <h3 className={`font-semibold mb-2 line-clamp-2 cursor-pointer transition-colors text-sm ${getTextStyle()}`} onClick={onViewDetails} style={{ color: isHovered ? colors.primary : undefined }}>{product.productName || product.name}</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-bold ${getTextStyle()}`}>{priceFormatter(product.price)}</span>
                  {discount && <span className="text-xs text-gray-500 line-through">{priceFormatter(product.oldPrice)}</span>}
                </div>
                <div className={`text-xs mt-1 ${getSecondaryTextStyle()}`}>{totalStock} {t('productCard.available')}</div>
              </div>
              {/* Large Add to Cart Button for no variants */}
              {!hasVariants && (
                <button onClick={handleAddToCart} disabled={isOutOfStock} className={`p-2.5 rounded-lg transition-all ${isOutOfStock ? 'bg-gray-100 text-gray-400' : getButtonStyle()}`}>
                  {isAddingToCart ? <Check className="h-5 w-5" /> : isOutOfStock ? <span className="text-xs px-2">{t('productCard.out')}</span> : <ShoppingCart className="h-5 w-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
        <QuickAddModal />
      </>
    );
  }

  // List View
  return (
    <>
      <div className={`group ${themeType === 'MODERN' ? 'bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10' : themeType === 'MINIMAL' ? 'bg-white rounded-xl border border-gray-100' : 'bg-white rounded-2xl border border-gray-100'} p-4 sm:p-6 transition-all duration-300 ${cardLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ borderColor: isHovered ? colors.primary : undefined }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="relative w-full sm:w-40 lg:w-48 flex-shrink-0">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer" onClick={onViewDetails}>
              {product.imageUrls && product.imageUrls[0] ? <img src={product.imageUrls[0]} alt={product.productName || product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="h-full w-full flex items-center justify-center"><Package className="h-12 w-12 text-gray-300" /></div>}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {discount && <div className={getBadgeStyle('discount')}>-{discount}%</div>}
                {hasVariants && <div className={getBadgeStyle('variant')}>{variantCount} {t('productCard.variants')}</div>}
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-md text-xs" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{product.category?.categoryName || product.category?.name || t('productCard.product')}</span>
                  <div className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-400 fill-current" /><span className={`text-sm font-medium ${getSecondaryTextStyle()}`}>4.8</span></div>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 cursor-pointer transition-colors line-clamp-2 ${getTextStyle()}`} onClick={onViewDetails} style={{ color: isHovered ? colors.primary : undefined }}>{product.productName || product.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }} className={`p-2 rounded-lg transition-all ${isInWishlist ? 'text-white' : 'bg-gray-50 text-gray-600'}`} style={isInWishlist ? { backgroundColor: colors.primary } : {}}><Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} /></button> */}
                {/* Small Add to Cart Button in List View */}
                {!isOutOfStock && (
                  <button onClick={handleAddToCart} className={`p-2 rounded-lg transition-all ${getButtonStyle(true)}`} title="Add to Cart">
                    {isAddingToCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
            <p className={`text-sm mb-4 line-clamp-2 ${getSecondaryTextStyle()}`}>{product.description || t('productCard.defaultDescription')}</p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-2xl font-bold ${getTextStyle()}`}>{priceFormatter(product.price)}</span>
                  {discount && <><span className="text-sm text-gray-500 line-through">{priceFormatter(product.oldPrice)}</span><span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{t('productCard.save')} {priceFormatter(product.oldPrice - product.price)}</span></>}
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${!isOutOfStock ? (isLowStock ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700') : 'bg-gray-100 text-gray-600'}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${!isOutOfStock ? (isLowStock ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-gray-400'}`} />
                  {isOutOfStock ? t('productCard.outOfStock') : `${totalStock} ${t('productCard.inStock')}`}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={onViewDetails} className={`flex-1 sm:flex-none px-4 py-3 border-2 rounded-xl transition-all font-medium text-sm flex items-center justify-center gap-2 ${themeType === 'MODERN' ? 'border-white/20 text-white hover:border-indigo-500' : 'border-gray-200 text-gray-700 hover:border-indigo-300'}`}>
                  <Eye className="h-4 w-4" /><span className="hidden sm:inline">{t('productCard.details')}</span>
                </button>
                {/* Large Add to Cart Button in List View for no variants */}
                {!hasVariants && (
                  <button onClick={handleAddToCart} disabled={isOutOfStock} className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-gray-100 text-gray-400' : getButtonStyle()}`}>
                    {isAddingToCart ? <><Check className="h-4 w-4" /><span>{t('productCard.added')}</span></> : isOutOfStock ? t('productCard.outOfStock') : <><ShoppingCart className="h-4 w-4" /><span>{t('productCard.add')}</span></>}
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              {/* <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><Shield className="h-3 w-3" style={{ color: colors.primary }} /><span>{t('productCard.warranty')}</span></div>
                <div className="flex items-center gap-1"><Truck className="h-3 w-3" style={{ color: colors.secondary }} /><span>{t('productCard.freeShipping')}</span></div>
                <div className="flex items-center gap-1"><RefreshCw className="h-3 w-3" style={{ color: colors.primary }} /><span>{t('productCard.returns')}</span></div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;