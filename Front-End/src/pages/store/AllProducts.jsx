// src/pages/store/AllProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { storeAPI } from '../../api/store.api';
import { productAPI } from '../../api/product.api';
import { categoryAPI } from '../../api/category.api';
import CartSidebar from '../../components/CartSidebar';
import StoreFooter from '../../components/StoreFooter';
import { useErrorHandler } from '../../hooks/useErrorHandler';

// Import Theme Components
import ClassicTheme from '../../components/themes/ClassicTheme';
import MinimalTheme from '../../components/themes/MinimalTheme';
import ModernTheme from '../../components/themes/ModernTheme';

const AllProductsPage = () => {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [themeType, setThemeType] = useState('CLASSIC');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  
  const { handleError } = useErrorHandler();

  const getStoreColors = () => ({
    primary: store?.primaryColor || '#4f46e5',
    secondary: store?.secondaryColor || '#9333ea',
    primaryLight: store?.primaryColor ? `${store.primaryColor}20` : '#e0e7ff'
  });

  useEffect(() => {
    fetchData();
  }, [storeName]);

  useEffect(() => {
    if (store?.id) {
      fetchProducts();
    }
  }, [store, selectedCategory]);

  useEffect(() => {
    if (!loading && store) {
      setTimeout(() => setPageLoaded(true), 100);
    }
  }, [loading, store]);

  useEffect(() => {
    const cartKey = `cart_${storeName}`;
    const savedCart = localStorage.getItem(cartKey);
    const savedWishlist = localStorage.getItem(`wishlist_${storeName}`);
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, [storeName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const storeData = await storeAPI.getByName(storeName);
      setStore(storeData);
      setThemeType(storeData.themeType || 'CLASSIC');
      
      const categoriesData = await categoryAPI.getByStore(storeData.id);
      setCategories(categoriesData);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let productsData;
      
      if (selectedCategory === 'all') {
        productsData = await productAPI.getAll(store.id);
      } else {
        productsData = await productAPI.getByCategory(selectedCategory, store.id);
      }
      
      setProducts(productsData);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const cartKey = `cart_${storeName}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    const existingItem = existingCart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        productName: product.name,
        price: product.price,
        imageUrls: product.imageUrls,
        quantity: 1
      });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    setCart(existingCart);
  };

  const handleToggleWishlist = (product) => {
    const wishlistKey = `wishlist_${storeName}`;
    const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    
    const exists = existingWishlist.find(item => item.id === product.id);
    let newWishlist;
    
    if (exists) {
      newWishlist = existingWishlist.filter(item => item.id !== product.id);
    } else {
      newWishlist = [...existingWishlist, product];
    }
    
    localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
    setWishlist(newWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const formatPrice = (price) => {
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  const handleSortProducts = (productsList) => {
    switch(sortBy) {
      case 'price-low':
        return [...productsList].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return [...productsList].sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
        return [...productsList].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      default:
        return productsList;
    }
  };

  const filteredProducts = handleSortProducts(
    products.filter(product => {
      const matchesSearch = !searchQuery || 
        product.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
  );

  const colors = getStoreColors();

  // Common props for all themes
  const commonProps = {
  store,
  products,
  categories,
  formatPrice,
  colors,
  getCartItemCount,
  setShowCart,
  setShowMobileMenu,
  showMobileMenu,
  setShowSearchBar: () => {},
  handleAddToCart,
  handleToggleWishlist,
  isInWishlist,
  onViewDetails: (product) => navigate(`/store/${storeName}/product/${product.id}`),
  onViewAllProducts: () => navigate(`/store/${storeName}/products`),
  t,
  pageLoaded,
  renderLayoutSections: () => null,
  isAllProductsPage: true,
  themeType, // ← أضف هذا السطر
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  filteredProducts
};

  // Get theme component
  const getThemeComponent = () => {
    switch (themeType) {
      case 'MINIMAL':
        return <MinimalTheme {...commonProps} />;
      case 'MODERN':
        return <ModernTheme {...commonProps} />;
      default:
        return <ClassicTheme {...commonProps} />;
    }
  };

  if (loading && !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {getThemeComponent()}
      
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        store={store}
        formatPrice={formatPrice}
        colors={colors}
        themeType={themeType}
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

export default AllProductsPage;