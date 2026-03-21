// src/pages/store/StoreHome.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { storeAPI } from '../../api/store.api';
import { productAPI } from '../../api/product.api';
import { categoryAPI } from '../../api/category.api';
import CartSidebar from '../../components/CartSidebar';
import ProductCard from '../../components/ProductCard';
import VariantSelector from '../../components/VariantSelector';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Shield, 
  Truck, 
  Clock, 
  RefreshCw,
  ChevronRight,
  Grid,
  List,
  Heart,
  Menu,
  X,
  Home,
  ChevronLeft,
  ChevronDown,
  Phone,
  MapPin,
  ShoppingBag,
  Palette,
  Ruler,
  Package
} from 'lucide-react';
import StoreFooter from '../../components/StoreFooter';
import SEO from '../../components/SEO';
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
  
  .animate-stagger-1 {
    animation: fadeIn 0.6s ease-out 0.1s forwards;
    opacity: 0;
  }
  
  .animate-stagger-2 {
    animation: fadeIn 0.6s ease-out 0.2s forwards;
    opacity: 0;
  }
  
  .animate-stagger-3 {
    animation: fadeIn 0.6s ease-out 0.3s forwards;
    opacity: 0;
  }
  
  .animate-stagger-4 {
    animation: fadeIn 0.6s ease-out 0.4s forwards;
    opacity: 0;
  }
  
  .animate-stagger-5 {
    animation: fadeIn 0.6s ease-out 0.5s forwards;
    opacity: 0;
  }
`;

const StoreHome = () => {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Variant selection modal state
  const [selectedProductForVariant, setSelectedProductForVariant] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  
  // Mobile states
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoriesDrawer, setShowCategoriesDrawer] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { handleError } = useErrorHandler();
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Refs for focus management
  const searchInputRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const categoriesButtonRef = useRef(null);

  // 🎨 دالة للحصول على الألوان المخصصة مع قيم افتراضية
  const getStoreColors = () => {
    return {
      primary: store?.primaryColor || '#4f46e5',
      secondary: store?.secondaryColor || '#9333ea',
      primaryLight: store?.primaryColor ? `${store.primaryColor}20` : '#e0e7ff',
      secondaryLight: store?.secondaryColor ? `${store.secondaryColor}20` : '#f3e8ff'
    };
  };

  useEffect(() => {
    if (storeName) {
      fetchStoreData();
    }
  }, [storeName]);

  useEffect(() => {
    if (store?.id) {
      fetchProductsByCategory();
    }
  }, [selectedCategory, store?.id]);

  useEffect(() => {
    const cartKey = `cart_${storeName}`;
    const savedCart = localStorage.getItem(cartKey);
    const savedWishlist = localStorage.getItem(`wishlist_${storeName}`);
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        handleError(err);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (err) {
        handleError(err);
      }
    }
  }, [storeName]);

  useEffect(() => {
    if (storeName && cart.length > 0) {
      localStorage.setItem(`cart_${storeName}`, JSON.stringify(cart));
      
      localStorage.setItem('checkout_cart', JSON.stringify({
        storeId: store?.id,
        storeName: store?.storeName,
        storeLogo: store?.storeLogoUrl,
        items: cart.map(item => ({
          id: item.id,
          productId: item.id,
          productName: item.productName || item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrls: item.imageUrls,
          color: item.selectedColor || item.color || null,
          size: item.selectedSize || item.size || null,
          variantId: item.variantId || null
        })),
        timestamp: new Date().toISOString()
      }));
    } else {
      localStorage.removeItem('checkout_cart');
    }
  }, [cart, storeName, store]);

  useEffect(() => {
    if (storeName) {
      localStorage.setItem(`wishlist_${storeName}`, JSON.stringify(wishlist));
    }
  }, [wishlist, storeName]);

  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [showSearchBar]);

  useEffect(() => {
    if (showMobileMenu || showCategoriesDrawer || showSearchBar || showVariantModal || showCart) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu, showCategoriesDrawer, showSearchBar, showVariantModal, showCart]);

  useEffect(() => {
    if (!loading && store) {
      setTimeout(() => {
        setPageLoaded(true);
      }, 100);
    }
  }, [loading, store]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      setError(null);
      setPageLoaded(false);

      const storeData = await storeAPI.getByName(storeName);
      await storeAPI.incrementVisits(storeData.id);
      
      if (!storeData) {
        throw new Error('Store not found');
      }
      setStore(storeData);

      const storeCategories = await categoryAPI.getByStore(storeData.id);
      const enhancedCategories = storeCategories.map(cat => ({
        id: cat.id,
        categoryName: cat.categoryName || cat.name || `Category ${cat.id}`,
        name: cat.name || cat.categoryName || `Category ${cat.id}`
      }));
      
      setCategories(enhancedCategories);

    } catch (err) {
      handleError(err);
      setError(err.message || t('storeHome.errors.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      
      let productsData = [];
      
      if (selectedCategory === 'all') {
        productsData = await productAPI.getAll(store.id);
      } else {
        const categoryId = selectedCategory;
        productsData = await productAPI.getByCategory(categoryId, store.id);
      }
      
      const enhancedProducts = productsData.map(product => ({
        ...product,
        hasVariants: product.variants && product.variants.length > 0,
        variantCount: product.variants?.length || 0,
        totalStock: product.variants 
          ? product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
          : product.quantity || 0,
        productName: product.productName || product.name,
        name: product.name || product.productName
      }));
      
      setProducts(enhancedProducts);
      
    } catch (err) {
      handleError(err);
      setError(err.message || t('storeHome.errors.failedToLoadProducts'));
    } finally {
      setLoading(false); 
    }
  };

  const handleAddToCart = (product, selectedVariant = null) => {
    setCart(prevCart => {
      const cartItem = {
        id: product.id,
        productName: product.productName || product.name,
        price: product.price || 0,
        imageUrls: product.imageUrls || [],
        quantity: 1,
        addedAt: new Date().toISOString()
      };

      if (selectedVariant) {
        cartItem.selectedColor = selectedVariant.productColor;
        cartItem.color = selectedVariant.productColor;
        cartItem.selectedSize = selectedVariant.productSize;
        cartItem.size = selectedVariant.productSize;
        cartItem.variantId = selectedVariant.id;
      } else if (product.hasVariants) {
        setSelectedProductForVariant(product);
        setShowVariantModal(true);
        return prevCart;
      }

      const existingItemIndex = prevCart.findIndex(item => {
        if (selectedVariant) {
          return item.id === product.id && 
                 item.selectedColor === cartItem.selectedColor &&
                 item.selectedSize === cartItem.selectedSize;
        }
        return item.id === product.id;
      });
      
      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, cartItem];
      }
      
      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 500);
      
      return updatedCart;
    });
  };

  const handleVariantSelect = (product, selectedVariant) => {
    handleAddToCart(product, selectedVariant);
    setShowVariantModal(false);
    setSelectedProductForVariant(null);
  };

  const handleToggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleSortProducts = (products) => {
    switch(sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
        return [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      default:
        return products;
    }
  };

  const filteredProducts = handleSortProducts(
    products.filter(product => {
      const productName = product.productName || product.name || '';
      const matchesSearch = !searchQuery || 
        productName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    })
  );

  const formatPrice = (price) => {
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategoriesDrawer(false);
    setSearchQuery('');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const colors = getStoreColors();

  const getGradientStyle = (fromColor, toColor) => {
    return {
      background: `linear-gradient(to right, ${fromColor}, ${toColor})`
    };
  };

  // Mobile Categories Drawer
  const MobileCategoriesDrawer = () => (
    <div 
      className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
        showCategoriesDrawer ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowCategoriesDrawer(false);
        }
      }}
    >
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        style={{ opacity: showCategoriesDrawer ? 1 : 0 }}
        onClick={() => setShowCategoriesDrawer(false)}
      />
      
      <div 
        className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
          showCategoriesDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Filter className="h-5 w-5" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('storeHome.categories.title')}</h2>
          </div>
          <button
            onClick={() => setShowCategoriesDrawer(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          <div className="space-y-1">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                selectedCategory === 'all'
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              style={selectedCategory === 'all' ? getGradientStyle(colors.primary, colors.secondary) : {}}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: selectedCategory === 'all' ? 'rgba(255,255,255,0.2)' : colors.primaryLight,
                    color: selectedCategory === 'all' ? 'white' : colors.primary
                  }}
                >
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{t('storeHome.categories.allProducts')}</div>
                  <div className="text-sm opacity-75">{t('storeHome.categories.allItems')}</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 opacity-75" />
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id.toString())}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  selectedCategory === category.id.toString()
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={selectedCategory === category.id.toString() ? getGradientStyle(colors.primary, colors.secondary) : {}}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: selectedCategory === category.id.toString() ? 'rgba(255,255,255,0.2)' : colors.primaryLight,
                      color: selectedCategory === category.id.toString() ? 'white' : colors.primary
                    }}
                  >
                    <div className="text-lg font-bold">
                      {category.categoryName?.charAt(0) || '📦'}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{category.categoryName || category.name}</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 opacity-75" />
              </button>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">{t('storeHome.storeInfo.title')}</h3>
            <div className="space-y-3">
              {store?.storeAddress && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div className="text-sm">{store.storeAddress}</div>
                </div>
              )}
              
              {store?.storePhone && (
                <a 
                  href={`tel:${store.storePhone}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div className="text-sm font-medium">{store.storePhone}</div>
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => setShowCategoriesDrawer(false)}
            className="w-full py-3 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            style={getGradientStyle(colors.primary, colors.secondary)}
          >
            {t('storeHome.categories.applyFilter')}
          </button>
        </div>
      </div>
    </div>
  );

  const MobileSearchBar = () => (
    <div 
      className={`fixed inset-x-0 top-0 z-40 lg:hidden bg-white shadow-lg transform transition-transform duration-300 ${
        showSearchBar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearchBar(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t('storeHome.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none"
              style={{ '--tw-ring-color': colors.primary }}
              onFocus={(e) => e.target.style.setProperty('--tw-ring-color', colors.primary)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const VariantSelectionModal = () => {
    if (!selectedProductForVariant) return null;
    
    return (
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          showVariantModal ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowVariantModal(false);
            setSelectedProductForVariant(null);
          }
        }}
      >
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          style={{ opacity: showVariantModal ? 1 : 0 }}
          onClick={() => {
            setShowVariantModal(false);
            setSelectedProductForVariant(null);
          }}
        />
        
        <div 
          className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300"
          style={{ 
            opacity: showVariantModal ? 1 : 0,
            transform: showVariantModal ? 'scale(1)' : 'scale(0.95)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Package className="h-6 w-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t('storeHome.variantModal.title')}</h3>
                <p className="text-sm text-gray-500">{selectedProductForVariant.productName || selectedProductForVariant.name}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowVariantModal(false);
                setSelectedProductForVariant(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-6">
            <VariantSelector
              product={selectedProductForVariant}
              onSelect={(variant) => handleVariantSelect(selectedProductForVariant, variant)}
              onClose={() => {
                setShowVariantModal(false);
                setSelectedProductForVariant(null);
              }}
              formatPrice={formatPrice}
              colors={colors}
              t={t}
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading && !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div 
              className="h-16 w-16 border-4 rounded-full animate-spin"
              style={{ 
                borderColor: `${colors.primaryLight}`, 
                borderTopColor: colors.primary 
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="h-8 w-8 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primaryLight }}
              ></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">{t('storeHome.loading.store')}</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl text-gray-400">🏪</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('storeHome.errors.storeNotFound')}</h2>
              <p className="text-gray-600 mb-8">{error || t('storeHome.errors.storeNotFoundMessage')}</p>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-sm hover:shadow"
                style={getGradientStyle(colors.primary, colors.secondary)}
              >
                {t('storeHome.buttons.goBackHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (store.storeStatus !== 'Active') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl text-gray-400">🏪</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('storeHome.errors.storeInactive')}</h2>
              <p className="text-gray-600 mb-8">{t('storeHome.errors.storeInactiveMessage')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{fadeInStyles}</style>
      
      <SEO 
        title={store.storeName}
        description={store.storeDescription || `Shop the best products from ${store.storeName}`}
        keywords={`${store.storeName}, store, shop, products, ${store.storeCategory || ''}, ${store.storeCity || ''}`}
        image={store.storeLogoUrl}
        url={`https://storely.com/store/${store.storeName}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Store",
          "name": store.storeName,
          "description": store.storeDescription,
          "image": store.storeLogoUrl,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": store.storeAddress,
            "addressLocality": store.storeCity,
            "addressCountry": "EG"
          },
          "telephone": store.storePhone,
          "priceRange": "₪₪",
          "openingHours": "Mo-Su 09:00-22:00",
          "sameAs": [
            store.facebook,
            store.instagram
          ].filter(Boolean)
        }}
      />
      
      <MobileSearchBar />
      <MobileCategoriesDrawer />
      <VariantSelectionModal />

      {/* 🎨 Top Navigation Bar مع الألوان المخصصة وتأثير Fade In */}
      <div className={`bg-white border-b border-gray-100 sticky top-0 z-30 transition-all duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:hidden">
            <button
              ref={mobileMenuButtonRef}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" style={{ color: colors.primary }} />
              ) : (
                <Menu className="h-6 w-6" style={{ color: colors.primary }} />
              )}
            </button>
            
            <Link to={`/store/${storeName}`} className="flex items-center gap-3">
              {store.storeLogoUrl ? (
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={store.storeLogoUrl} 
                    alt={store.storeName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primaryLight }}
                >
                  <ShoppingBag className="h-5 w-5" style={{ color: colors.primary }} />
                </div>
              )}
              <div>
                <div className="font-bold text-gray-900 line-clamp-1">{store.storeName}</div>
                <div className="text-xs text-gray-500">{t('storeHome.header.onlineStore')}</div>
              </div>
            </Link>
            
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95"
            >
              <ShoppingCart className="h-6 w-6" style={{ color: colors.primary }} />
              {getCartItemCount() > 0 && (
                <span 
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transform transition-all"
                  style={getGradientStyle(colors.primary, colors.secondary)}
                >
                  {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                </span>
              )}
            </button>
          </div>
          
          <div className="hidden lg:flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link to={`/store/${storeName}`} className="flex items-center gap-4">
                {store.storeLogoUrl ? (
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-100 border-2 border-white shadow">
                    <img 
                      src={store.storeLogoUrl} 
                      alt={store.storeName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="h-14 w-14 rounded-xl flex items-center justify-center border-2 border-white shadow"
                    style={{ backgroundColor: colors.primaryLight }}
                  >
                    <ShoppingBag className="h-7 w-7" style={{ color: colors.primary }} />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{store.storeName}</h1>
                </div>
              </Link>
            </div>
            
            <button
              onClick={() => setShowCart(true)}
              className="relative px-5 py-3 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl group flex items-center gap-3"
              style={getGradientStyle(colors.primary, colors.secondary)}
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getCartItemCount() > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 h-5 w-5 bg-white rounded-full flex items-center justify-center text-xs font-bold shadow transform transition-all"
                    style={{ 
                      color: colors.primary,
                      ...(cartPulse ? { transform: 'scale(1.25)' } : {})
                    }}
                  >
                    {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">{t('storeHome.cart.yourCart')}</div>
                <div className="text-xs opacity-90">{getCartItemCount()} {t('storeHome.cart.items')}</div>
              </div>
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMobileMenu(false);
            }
          }}
        >
          <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                {store.storeLogoUrl ? (
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={store.storeLogoUrl} 
                      alt={store.storeName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="h-12 w-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.primaryLight }}
                  >
                    <ShoppingBag className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-900">{store.storeName}</div>
                  <div className="text-sm text-gray-500">{t('storeHome.header.verifiedStore')}</div>
                </div>
              </div>
              
              <button
                onClick={() => setShowMobileMenu(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowSearchBar(true);
                }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-3 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{t('storeHome.menu.searchProducts')}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowCategoriesDrawer(true);
                }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-3 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{t('storeHome.menu.categories')}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-4 px-4">{t('storeHome.storeInfo.title')}</h3>
                <div className="space-y-3">
                  {store.storeAddress && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div className="text-sm text-gray-700">{store.storeAddress}</div>
                    </div>
                  )}
                  
                  {store.storePhone && (
                    <a 
                      href={`tel:${store.storePhone}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div className="text-sm font-medium text-gray-700">{store.storePhone}</div>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Home className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">{t('storeHome.menu.backToHome')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className={`bg-white border-b border-gray-100 lg:sticky lg:top-0 lg:z-20 transition-all duration-700 delay-100 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="hidden lg:block">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.primary }} />
              <input
                type="text"
                placeholder={t('storeHome.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none"
                style={{ '--tw-ring-color': colors.primary } }
                onFocus={(e) => e.target.style.setProperty('--tw-ring-color', colors.primary)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between lg:justify-end gap-3 lg:gap-4 mt-4 lg:mt-0">
            <button
              ref={categoriesButtonRef}
              onClick={() => setShowCategoriesDrawer(true)}
              className="flex-1 lg:hidden flex items-center justify-center gap-2 px-4 py-3 border rounded-xl font-medium"
              style={{ 
                backgroundColor: colors.primaryLight,
                color: colors.primary,
                borderColor: colors.primary
              }}
            >
              <Filter className="h-5 w-5" />
              <span>{t('storeHome.filters.categories')}</span>
            </button>
            
            <button
              onClick={() => setShowSearchBar(true)}
              className="lg:hidden p-3 bg-gray-50 border border-gray-200 rounded-xl"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all`}
                  style={viewMode === 'grid' ? { backgroundColor: colors.primaryLight, color: colors.primary } : {}}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all`}
                  style={viewMode === 'list' ? { backgroundColor: colors.primaryLight, color: colors.primary } : {}}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none text-sm"
                style={{ '--tw-ring-color': colors.primary }}
              >
                <option value="featured">{t('storeHome.sort.featured')}</option>
                <option value="price-low">{t('storeHome.sort.priceLowToHigh')}</option>
                <option value="price-high">{t('storeHome.sort.priceHighToLow')}</option>
                <option value="newest">{t('storeHome.sort.newest')}</option>
              </select>
              
              <button
                onClick={fetchProductsByCategory}
                className="p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                title={t('storeHome.buttons.refresh')}
              >
                <RefreshCw className="h-5 w-5" style={{ color: colors.primary }} />
              </button>
            </div>
            
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg`}
                style={viewMode === 'grid' ? { backgroundColor: colors.primaryLight, color: colors.primary } : {}}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg`}
                style={viewMode === 'list' ? { backgroundColor: colors.primaryLight, color: colors.primary } : {}}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="lg:hidden mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedCategory === 'all' ? (
                  <>
                    <ShoppingBag className="h-4 w-4" style={{ color: colors.primary }} />
                    <span className="font-medium text-gray-900">{t('storeHome.categories.allProducts')}</span>
                  </>
                ) : (
                  <>
                    <div 
                      className="h-4 w-4 rounded"
                      style={{ backgroundColor: colors.primaryLight }}
                    ></div>
                    <span className="font-medium text-gray-900">
                      {categories.find(c => c.id.toString() === selectedCategory)?.categoryName || t('storeHome.categories.category')}
                    </span>
                  </>
                )}
                <span className="text-sm text-gray-500">({filteredProducts.length})</span>
              </div>
              <button
                onClick={() => setSortBy(prev => 
                  prev === 'featured' ? 'price-low' : 
                  prev === 'price-low' ? 'price-high' : 
                  prev === 'price-high' ? 'newest' : 'featured'
                )}
                className="text-sm font-medium"
                style={{ color: colors.primary }}
              >
                {t('storeHome.sort.sort')}: {sortBy === 'featured' ? t('storeHome.sort.featured') :
                       sortBy === 'price-low' ? t('storeHome.sort.lowPrice') :
                       sortBy === 'price-high' ? t('storeHome.sort.highPrice') : t('storeHome.sort.newest')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button for Mobile */}
      {getCartItemCount() > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className={`fixed bottom-6 right-6 lg:hidden z-40 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center text-white transform transition-all hover:scale-110 active:scale-95 animate-fade-in-scale`}
          style={getGradientStyle(colors.primary, colors.secondary)}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span 
              className="absolute -top-2 -right-2 h-5 w-5 bg-white rounded-full flex items-center justify-center text-xs font-bold shadow"
              style={{ color: colors.primary }}
            >
              {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
            </span>
          </div>
        </button>
      )}

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Categories Sidebar */}
          <div className={`hidden lg:block lg:w-64 flex-shrink-0 transition-all duration-700 delay-200 ${pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">{t('storeHome.categories.title')}</h3>
                <Filter className="h-5 w-5" style={{ color: colors.primary }} />
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === 'all'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={selectedCategory === 'all' ? getGradientStyle(colors.primary, colors.secondary) : {}}
                >
                  <span className="font-medium">{t('storeHome.categories.allProducts')}</span>
                  <span 
                    className="text-sm px-2 py-1 rounded-full"
                    style={selectedCategory === 'all' 
                      ? { backgroundColor: 'rgba(255,255,255,0.2)' }
                      : { backgroundColor: colors.primaryLight, color: colors.primary }
                    }
                  >
                    {products.length}
                  </span>
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id.toString())}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === category.id.toString()
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    style={selectedCategory === category.id.toString() ? getGradientStyle(colors.primary, colors.secondary) : {}}
                  >
                    <span className="font-medium">{category.categoryName || category.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">{t('storeHome.storeInfo.title')}</h4>
                <div className="space-y-4">
                  {store.storeAddress && (
                    <div className="flex items-start gap-3">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.primaryLight }}
                      >
                        <MapPin className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{t('storeHome.storeInfo.location')}</div>
                        <div className="text-sm text-gray-600">{store.storeAddress}</div>
                      </div>
                    </div>
                  )}
                  
                  {store.storePhone && (
                    <div className="flex items-start gap-3">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.primaryLight }}
                      >
                        <Phone className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{t('storeHome.storeInfo.contact')}</div>
                        <div className="text-sm text-gray-600">{store.storePhone}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Category Pills */}
            <div className={`lg:hidden mb-6 transition-all duration-700 delay-150 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCategory === 'all' 
                    ? t('storeHome.categories.allProducts')
                    : categories.find(c => c.id.toString() === selectedCategory)?.categoryName || t('storeHome.categories.category')
                  }
                </h2>
                <span className="text-sm text-gray-500">{filteredProducts.length} {t('storeHome.items')}</span>
              </div>
              
              <div className="overflow-x-auto pb-2 -mx-4 px-4">
                <div className="flex gap-2 min-w-max">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all text-white`}
                    style={selectedCategory === 'all' 
                      ? getGradientStyle(colors.primary, colors.secondary)
                      : { backgroundColor: 'white', borderColor: colors.primaryLight, color: colors.primary, borderWidth: 1 }
                    }
                  >
                    {t('storeHome.categories.allProducts')}
                  </button>
                  {categories.slice(0, 8).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                        selectedCategory === category.id.toString() ? 'text-white' : ''
                      }`}
                      style={selectedCategory === category.id.toString() 
                        ? getGradientStyle(colors.primary, colors.secondary)
                        : { backgroundColor: 'white', borderColor: colors.primaryLight, color: colors.primary, borderWidth: 1 }
                      }
                    >
                      {category.categoryName || category.name}
                    </button>
                  ))}
                  {categories.length > 8 && (
                    <button
                      onClick={() => setShowCategoriesDrawer(true)}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg whitespace-nowrap"
                    >
                      {t('storeHome.categories.more')} +
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Products Header */}
            <div className={`hidden lg:block mb-8 transition-all duration-700 delay-300 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'all' 
                      ? `${t('storeHome.categories.allProducts')} (${filteredProducts.length})`
                      : `${categories.find(c => c.id.toString() === selectedCategory)?.categoryName || t('storeHome.categories.category')} (${filteredProducts.length})`
                    }
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {store.storeDescription || t('storeHome.storeInfo.descriptionFallback')}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">
                    {t('storeHome.showing')} {filteredProducts.length} {t('storeHome.products')}
                  </div>
                </div>
              </div>
              
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.slice(0, 6).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        selectedCategory === category.id.toString() ? 'text-white' : ''
                      }`}
                      style={selectedCategory === category.id.toString() 
                        ? getGradientStyle(colors.primary, colors.secondary)
                        : { backgroundColor: 'white', borderColor: colors.primaryLight, color: colors.primary, borderWidth: 1 }
                      }
                    >
                      {category.categoryName || category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div 
                    className="h-12 w-12 border-4 rounded-full animate-spin mx-auto mb-4"
                    style={{ 
                      borderColor: colors.primaryLight,
                      borderTopColor: colors.primary
                    }}
                  ></div>
                  <p className="text-gray-600">{t('storeHome.loading.products')}</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={`bg-white rounded-2xl border border-gray-100 p-8 lg:p-12 text-center transition-all duration-700 delay-500 ${pageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="h-20 w-20 lg:h-24 lg:w-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 lg:h-12 lg:w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('storeHome.noProducts.title')}</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? t('storeHome.noProducts.noMatch', { query: searchQuery })
                    : selectedCategory !== 'all'
                    ? t('storeHome.noProducts.noProductsInCategory')
                    : t('storeHome.noProducts.noProducts')
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="inline-flex items-center px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-sm hover:shadow"
                  style={getGradientStyle(colors.primary, colors.secondary)}
                >
                  {t('storeHome.buttons.viewAllProducts')}
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                : "space-y-4 lg:space-y-6"
              }>
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`transition-all duration-700 ${
                      pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ 
                      transitionDelay: `${400 + (index * 50)}ms`
                    }}
                  >
                    <ProductCard
                      product={product}
                      viewMode={viewMode}
                      onAddToCart={() => {
                        if (product.hasVariants) {
                          setSelectedProductForVariant(product);
                          setShowVariantModal(true);
                        } else {
                          handleAddToCart(product);
                        }
                      }}
                      onToggleWishlist={handleToggleWishlist}
                      isInWishlist={isInWishlist(product.id)}
                      onViewDetails={() => navigate(`/store/${storeName}/product/${product.id}`)}
                      formatPrice={formatPrice}
                      colors={colors}
                      t={t}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        store={store}
        formatPrice={formatPrice}
        colors={colors}
        onUpdateQuantity={(productId, quantity, variantInfo = null) => {
          if (quantity < 1) {
            setCart(prev => prev.filter(item => {
              if (variantInfo) {
                return !(item.id === productId && 
                        item.selectedColor === variantInfo.color &&
                        item.selectedSize === variantInfo.size);
              }
              return item.id !== productId;
            }));
          } else {
            setCart(prev =>
              prev.map(item => {
                if (variantInfo) {
                  if (item.id === productId && 
                      item.selectedColor === variantInfo.color &&
                      item.selectedSize === variantInfo.size) {
                    return { ...item, quantity };
                  }
                } else if (item.id === productId) {
                  return { ...item, quantity };
                }
                return item;
              })
            );
          }
        }}
        onRemoveItem={(productId, variantInfo = null) => {
          setCart(prev => prev.filter(item => {
            if (variantInfo) {
              return !(item.id === productId && 
                      item.selectedColor === variantInfo.color &&
                      item.selectedSize === variantInfo.size);
            }
            return item.id !== productId;
          }));
        }}
        onCheckout={() => {
          navigate('/checkout');
          setShowCart(false);
        }}
        t={t}
      />
      <StoreFooter />
    </div>
  );
};

export default StoreHome;