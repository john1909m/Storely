// StoreHome.jsx - Mobile Optimized with Variant Support
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

const StoreHome = () => {
  const { storeName } = useParams();
  const navigate = useNavigate();
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'newest'
  
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

  useEffect(() => {
    if (storeName) {
      fetchStoreData();
    }
  }, [storeName]);

  useEffect(() => {
    // Load cart and wishlist from localStorage
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
    // Save cart to localStorage for checkout
    if (storeName && cart.length > 0) {
      // Save to store-specific key
      localStorage.setItem(`cart_${storeName}`, JSON.stringify(cart));
      
      // Also save to global checkout key with store info
      localStorage.setItem('checkout_cart', JSON.stringify({
        storeId: store?.id,
        storeName: store?.storeName,
        storeLogo: store?.logoUrl,
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
      // Clear checkout cart if cart is empty
      localStorage.removeItem('checkout_cart');
    }
  }, [cart, storeName, store]);

  useEffect(() => {
    // Save wishlist to localStorage
    if (storeName) {
      localStorage.setItem(`wishlist_${storeName}`, JSON.stringify(wishlist));
    }
  }, [wishlist, storeName]);

  // Focus management for modals
  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      // Small delay to ensure animation completes before focusing
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [showSearchBar]);

  // Prevent body scroll when modals are open
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

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch store by name
      const storeData = await storeAPI.getByName(storeName);
      if (!storeData) {
        throw new Error('Store not found');
      }
      setStore(storeData);

      // Fetch products for this store
      const storeProducts = await productAPI.getAll(storeData.id);
      
      // Enhance products with variant info
      const enhancedProducts = storeProducts.map(product => ({
        ...product,
        hasVariants: product.variants && product.variants.length > 0,
        variantCount: product.variants?.length || 0,
        totalStock: product.variants 
          ? product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
          : product.quantity || 0
      }));
      
      setProducts(enhancedProducts || []);

      // Fetch categories for this store
      const storeCategories = await categoryAPI.getByStore(storeData.id);
      setCategories(storeCategories || []);

    } catch (err) {
      handleError(err);
      setError(err.message || 'Failed to load store');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, selectedVariant = null) => {
    setCart(prevCart => {
      // Create cart item with variant information
      const cartItem = {
        id: product.id,
        productName: product.productName || product.name,
        price: product.price || 0,
        imageUrls: product.imageUrls || [],
        quantity: 1,
        addedAt: new Date().toISOString()
      };

      // Add variant information if provided
      if (selectedVariant) {
        cartItem.selectedColor = selectedVariant.productColor;
        cartItem.color = selectedVariant.productColor;
        cartItem.selectedSize = selectedVariant.productSize;
        cartItem.size = selectedVariant.productSize;
        cartItem.variantId = selectedVariant.id;
      } else if (product.hasVariants) {
        // If product has variants but no variant selected, open variant selector
        setSelectedProductForVariant(product);
        setShowVariantModal(true);
        return prevCart;
      }

      // Check if item already exists in cart (with same variant)
      const existingItemIndex = prevCart.findIndex(item => {
        if (selectedVariant) {
          // For variant products, match by variant combination
          return item.id === product.id && 
                 item.selectedColor === cartItem.selectedColor &&
                 item.selectedSize === cartItem.selectedSize;
        }
        // For simple products, just match by id
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
      
      // Trigger cart pulse animation
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
      const matchesSearch = !searchQuery || 
        (product.productName || product.name).toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        product.categoryId === parseInt(selectedCategory) ||
        product.category?.id === parseInt(selectedCategory);
      
      return matchesSearch && matchesCategory;
    })
  );

  const getStoreRating = () => {
    // In a real app, this would come from the API
    return { rating: 4.8, reviews: 245 };
  };

  // Format price in EGP
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Handle category selection for mobile
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategoriesDrawer(false);
    // Scroll to top of products
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Mobile category drawer component
  const MobileCategoriesDrawer = () => (
    <div 
      className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
        showCategoriesDrawer ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={(e) => {
        // Prevent closing when clicking inside the drawer
        if (e.target === e.currentTarget) {
          setShowCategoriesDrawer(false);
        }
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setShowCategoriesDrawer(false)}
      />
      
      {/* Drawer */}
      <div 
        className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
          showCategoriesDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Filter className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Categories</h2>
          </div>
          <button
            onClick={() => setShowCategoriesDrawer(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Categories List */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          <div className="space-y-1">
            {/* All Products */}
            <button
              onClick={() => handleCategorySelect('all')}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-2 border-indigo-100'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">All Products</div>
                  <div className="text-sm text-gray-500">{products.length} items</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            
            {/* Category Items */}
            {categories.map((category) => {
              const categoryProductCount = products.filter(p => 
                p.categoryId === category.id || p.category?.id === category.id
              ).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id.toString())}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                    selectedCategory === category.id.toString()
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-2 border-indigo-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-gray-600 text-lg">
                        {category.categoryName?.charAt(0) || '🏷️'}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{category.categoryName || category.name}</div>
                      <div className="text-sm text-gray-500">{categoryProductCount} items</div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              );
            })}
          </div>
          
          {/* Store Info in Drawer */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Store Info</h3>
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
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => setShowCategoriesDrawer(false)}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile Search Bar Component - Fixed to prevent auto-focus on mount
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
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              // Remove autoFocus to prevent keyboard from opening automatically
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

  // Variant Selection Modal
  const VariantSelectionModal = () => {
    if (!selectedProductForVariant) return null;
    
    return (
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          showVariantModal ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={(e) => {
          // Prevent closing when clicking inside the modal
          if (e.target === e.currentTarget) {
            setShowVariantModal(false);
            setSelectedProductForVariant(null);
          }
        }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => {
            setShowVariantModal(false);
            setSelectedProductForVariant(null);
          }}
        />
        
        {/* Modal */}
        <div 
          className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Select Options</h3>
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
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-indigo-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading store...</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Store Not Found</h2>
              <p className="text-gray-600 mb-8">{error || 'This store does not exist or has been removed.'}</p>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-sm hover:shadow"
              >
                Go Back Home
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
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Store is Not Active</h2>
              <p className="text-gray-600 mb-8">{error || 'This store is currently inactive.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
      title={store.storeName}
      description={store.storeDescription || `تسوق أفضل المنتجات من ${store.storeName} - متجر إلكتروني متكامل`}
      keywords={`${store.storeName}, متجر, تسوق, منتجات, ${store.storeCategory || ''}, ${store.storeCity || ''}`}
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
      {/* Mobile Search Bar */}
      <MobileSearchBar />

      {/* Mobile Categories Drawer */}
      <MobileCategoriesDrawer />

      {/* Variant Selection Modal */}
      <VariantSelectionModal />

      {/* Top Navigation Bar - Mobile Optimized */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        {/* Top Bar with Store Name and Cart */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:hidden">
            {/* Mobile Menu Button */}
            <button
              ref={mobileMenuButtonRef}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
            
            {/* Store Logo and Name */}
            <Link to={`/store/${storeName}`} className="flex items-center gap-3">
              {store.logoUrl ? (
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={store.logoUrl} 
                    alt={store.storeName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-indigo-600" />
                </div>
              )}
              <div>
                <div className="font-bold text-gray-900 line-clamp-1">{store.storeName}</div>
                <div className="text-xs text-gray-500">Online Store</div>
              </div>
            </Link>
            
            {/* Mobile Cart Button with Animation */}
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {getCartItemCount() > 0 && (
                <span className={`absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transform transition-all ${
                  cartPulse ? 'scale-125' : 'scale-100'
                }`}>
                  {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                </span>
              )}
            </button>
          </div>
          
          {/* Desktop Top Bar */}
          <div className="hidden lg:flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link to={`/store/${storeName}`} className="flex items-center gap-4">
                {store.logoUrl ? (
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-100 border-2 border-white shadow">
                    <img 
                      src={store.logoUrl} 
                      alt={store.storeName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center border-2 border-white shadow">
                    <ShoppingBag className="h-7 w-7 text-indigo-600" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{store.storeName}</h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {getStoreRating().rating} ({getStoreRating().reviews})
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Desktop Cart Button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl group flex items-center gap-3"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getCartItemCount() > 0 && (
                  <span className={`absolute -top-2 -right-2 h-5 w-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow transform transition-all ${
                    cartPulse ? 'scale-125' : 'scale-100'
                  }`}>
                    {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">Your Cart</div>
                <div className="text-xs opacity-90">{getCartItemCount()} items</div>
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
            {/* Menu Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                {store.logoUrl ? (
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={store.logoUrl} 
                      alt={store.storeName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-indigo-600" />
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-900">{store.storeName}</div>
                  <div className="text-sm text-gray-500">Verified Store</div>
                </div>
              </div>
              
              <button
                onClick={() => setShowMobileMenu(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Menu Items */}
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
                  <span className="font-medium text-gray-900">Search Products</span>
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
                  <span className="font-medium text-gray-900">Categories</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              
              {/* Store Info in Mobile Menu */}
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-4 px-4">Store Info</h3>
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
            
            {/* Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Home className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section - Mobile Optimized */}
      <div className="bg-white border-b border-gray-100 lg:sticky lg:top-0 lg:z-20">
        <div className="container mx-auto px-4 py-4">
          {/* Desktop Search - Hidden on Mobile */}
          <div className="hidden lg:block">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
          
          {/* Mobile Filter Bar */}
          <div className="flex items-center justify-between lg:justify-end gap-3 lg:gap-4 mt-4 lg:mt-0">
            {/* Mobile Category Button */}
            <button
              ref={categoriesButtonRef}
              onClick={() => setShowCategoriesDrawer(true)}
              className="flex-1 lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 rounded-xl font-medium"
            >
              <Filter className="h-5 w-5" />
              <span>Categories</span>
            </button>
            
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearchBar(true)}
              className="lg:hidden p-3 bg-gray-50 border border-gray-200 rounded-xl"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              
              <button
                onClick={fetchStoreData}
                className="p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* Mobile View Controls */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Selected Category Indicator - Mobile */}
          <div className="lg:hidden mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedCategory === 'all' ? (
                  <>
                    <ShoppingBag className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">All Products</span>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-4 bg-indigo-100 rounded"></div>
                    <span className="font-medium text-gray-900">
                      {categories.find(c => c.id.toString() === selectedCategory)?.categoryName || 'Category'}
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
                className="text-sm text-indigo-600 font-medium"
              >
                Sort: {sortBy === 'featured' ? 'Featured' :
                       sortBy === 'price-low' ? 'Low Price' :
                       sortBy === 'price-high' ? 'High Price' : 'Newest'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button for Mobile */}
      {getCartItemCount() > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 lg:hidden z-40 h-14 w-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white transform transition-all hover:scale-110 active:scale-95"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 h-5 w-5 bg-white text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shadow">
              {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
            </span>
          </div>
        </button>
      )}

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Categories Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Categories</h3>
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">All Products</span>
                  <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {products.length}
                  </span>
                </button>
                
                {categories.map((category) => {
                  const categoryProductCount = products.filter(p => 
                    p.categoryId === category.id || p.category?.id === category.id
                  ).length;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        selectedCategory === category.id.toString()
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{category.categoryName || category.name}</span>
                      <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {categoryProductCount}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {/* Store Info */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">Store Info</h4>
                <div className="space-y-4">
                  {store.storeAddress && (
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Location</div>
                        <div className="text-sm text-gray-600">{store.storeAddress}</div>
                      </div>
                    </div>
                  )}
                  
                  {store.storePhone && (
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Contact</div>
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
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCategory === 'all' 
                    ? `All Products`
                    : categories.find(c => c.id.toString() === selectedCategory)?.categoryName || 'Category'
                  }
                </h2>
                <span className="text-sm text-gray-500">{filteredProducts.length} items</span>
              </div>
              
              <div className="overflow-x-auto pb-2 -mx-4 px-4">
                <div className="flex gap-2 min-w-max">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white border border-gray-200 text-gray-700'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.slice(0, 8).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                        selectedCategory === category.id.toString()
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-white border border-gray-200 text-gray-700'
                      }`}
                    >
                      {category.categoryName || category.name}
                    </button>
                  ))}
                  {categories.length > 8 && (
                    <button
                      onClick={() => setShowCategoriesDrawer(true)}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg whitespace-nowrap"
                    >
                      More +
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Products Header */}
            <div className="hidden lg:block mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'all' 
                      ? `All Products (${filteredProducts.length})`
                      : `${categories.find(c => c.id.toString() === selectedCategory)?.categoryName || 'Category'} (${filteredProducts.length})`
                    }
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {store.storeDescription || 'Premium products with exceptional quality'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">
                    Showing {filteredProducts.length} of {products.length} products
                  </div>
                </div>
              </div>
              
              {/* Category Pills */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.slice(0, 6).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        selectedCategory === category.id.toString()
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow'
                      }`}
                    >
                      {category.categoryName || category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 lg:p-12 text-center">
                <div className="h-20 w-20 lg:h-24 lg:w-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 lg:h-12 lg:w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No Products Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? `No products match "${searchQuery}"`
                    : 'No products available in this category'
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-sm hover:shadow"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                : "space-y-4 lg:space-y-6"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
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
                  />
                ))}
              </div>
            )}

            {/* Store Features */}
            <StoreFooter />
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
      />
    </div>
  );
};

export default StoreHome;