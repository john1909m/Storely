// src/pages/store/StoreHome.jsx
import React, { useState, useEffect, useRef, use } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { storeAPI } from '../../api/store.api';
import { productAPI } from '../../api/product.api';
import { categoryAPI } from '../../api/category.api';
import CartSidebar from '../../components/CartSidebar';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import SEO from '../../components/SEO';
import StoreFooter from '../../components/StoreFooter';

// Theme Imports
import ClassicTheme from '../../components/themes/ClassicTheme';
import MinimalTheme from '../../components/themes/MinimalTheme';
import ModernTheme from '../../components/themes/ModernTheme';

// Layout Components
import BannerSection from '../../components/layout/BannerSection';
import FeaturedProductsSection from '../../components/layout/FeaturedProductsSection';
import CategoriesSection from '../../components/layout/CategoriesSection';
import FooterSection from '../../components/layout/FooterSection';

const StoreHome = () => {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Theme & Layout state
  const [themeType, setThemeType] = useState('CLASSIC');
  const [layout, setLayout] = useState(null);
  
  // UI state
  const [showMobileMenu, setShowMobileMenu] = useState(false); // ← أضف هذا
  const [showSearchBar, setShowSearchBar] = useState(false); // ← أضف هذا
  const [showCategoriesDrawer, setShowCategoriesDrawer] = useState(false); // ← أضف هذا
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  
  const { handleError } = useErrorHandler();

  // Get store colors
  const getStoreColors = () => ({
    primary: store?.primaryColor || '#4f46e5',
    secondary: store?.secondaryColor || '#9333ea',
    primaryLight: store?.primaryColor ? `${store.primaryColor}20` : '#e0e7ff',
    secondaryLight: store?.secondaryColor ? `${store.secondaryColor}20` : '#f3e8ff'
  });

  // Load store data
  useEffect(() => {
    if (storeName) {
      fetchStoreData();
    }
  }, [storeName]);

  // Load products when store is ready
  useEffect(() => {
    if (store?.id) {
      fetchProducts();
      fetchCategories();
    }
  }, [store]);

  // Load cart from localStorage
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

  // Save cart to localStorage
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
    } else if (cart.length === 0) {
      localStorage.removeItem('checkout_cart');
    }
  }, [cart, storeName, store]);

  // Save wishlist
  useEffect(() => {
    if (storeName) {
      localStorage.setItem(`wishlist_${storeName}`, JSON.stringify(wishlist));
    }
  }, [wishlist, storeName]);

  // Animation on load
  useEffect(() => {
    if (!loading && store) {
      setTimeout(() => setPageLoaded(true), 100);
    }
  }, [loading, store]);

  let hasHome=false;

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
      
      // Load theme from store
      setThemeType(storeData.themeType || 'CLASSIC');
      
      // Load layout from store
      if (storeData.layoutConfig) {
        try {
          const parsedLayout = JSON.parse(storeData.layoutConfig);
          setLayout(parsedLayout);
          hasHome = true;
        } catch (err) {
          console.error('Error parsing layout:', err);
          setDefaultLayout();
        }
      } else {
        setDefaultLayout();
      }

    } catch (err) {
      handleError(err);
      setError(err.message || t('storeHome.errors.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const setDefaultLayout = () => {
    setLayout({
      pages: { 
        home: true, 
        allProducts: true 
      },
      sections: [
        { type: 'BANNER', enabled: true, images: [], title: 'Welcome', subtitle: 'Shop the best products' },
        { type: 'FEATURED_PRODUCTS', enabled: true, productIds: [] },
        { type: 'CATEGORIES', enabled: true },
        { type: 'FOOTER', enabled: true, text: `© ${new Date().getFullYear()} ${store?.storeName || 'Your Store'}. All rights reserved.` }
      ]
    });
  };

  useEffect(() => {
    if (!hasHome && layout?.pages?.home) {
      navigate(`/store/${storeName}/products`);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData = await productAPI.getAll(store.id);
      const enhancedProducts = productsData.map(product => ({
        ...product,
        hasVariants: product.variants && product.variants.length > 0,
        variantCount: product.variants?.length || 0,
        productName: product.productName || product.name,
        name: product.name || product.productName
      }));
      setProducts(enhancedProducts);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryAPI.getByStore(store.id);
      const enhancedCategories = categoriesData.map(cat => ({
        id: cat.id,
        categoryName: cat.categoryName || cat.name,
        name: cat.name || cat.categoryName
      }));
      setCategories(enhancedCategories);
    } catch (err) {
      handleError(err);
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

  const formatPrice = (price) => {
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price || 0);
  };

  const colors = getStoreColors();

  // Render layout sections
  const renderLayoutSections = () => {
    if (!layout?.sections) return null;
    
    const sections = [];
    
    for (const section of layout.sections) {
      if (!section.enabled) continue;
      
      switch (section.type) {
        case 'BANNER':
          sections.push(
            <BannerSection
              key="banner"
              section={section}
              store={store}
              themeType={themeType}
              colors={colors}
              t={t}
            />
          );
          break;
          
        case 'FEATURED_PRODUCTS':
          sections.push(
            <FeaturedProductsSection
              key="featured"
              section={section}
              products={products}
              formatPrice={formatPrice}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist}
              onViewDetails={(product) => navigate(`/store/${storeName}/product/${product.id}`)}
              colors={colors}
              themeType={themeType}
              t={t}
            />
          );
          break;
          
        case 'CATEGORIES':
          sections.push(
            <CategoriesSection
              key="categories"
              categories={categories}
              onCategoryClick={(categoryId) => navigate(`/store/${storeName}/category/${categoryId}`)}
              colors={colors}
              themeType={themeType}
              t={t}
            />
          );
          break;
          
        case 'FOOTER':
          sections.push(
            <FooterSection
              key="footer"
              section={section}
              store={store}
              colors={colors}
              themeType={themeType}
              t={t}
            />
          );
          break;
          
        default:
          break;
      }
    }
    
    return sections;
  };

  // Get the appropriate theme component
  const getThemeComponent = () => {
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
      setShowSearchBar,
      setShowCategoriesDrawer,
      handleAddToCart,
      handleToggleWishlist,
      isInWishlist,
      onViewDetails: (product) => navigate(`/store/${storeName}/product/${product.id}`),
      onViewAllProducts: () => navigate(`/store/${storeName}/products`),
      t,
      pageLoaded,
      renderLayoutSections,
      isAllProductsPage: false,
      themeType,
      searchQuery: '',
      setSearchQuery: () => {},
      selectedCategory: 'all',
      setSelectedCategory: () => {},
      viewMode: 'grid',
      setViewMode: () => {},
      sortBy: 'featured',
      setSortBy: () => {},
      filteredProducts: [],
      cart, // ← أضف cart
      onUpdateQuantity: (productId, quantity, variantInfo = null) => {
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
      },
      onRemoveItem: (productId, variantInfo = null) => {
        setCart(prev => prev.filter(item => {
          if (variantInfo) {
            return !(item.id === productId && 
                    item.selectedColor === variantInfo.color &&
                    item.selectedSize === variantInfo.size);
          }
          return item.id !== productId;
        }));
      },
      onCheckout: () => {
        navigate('/checkout');
        setShowCart(false);
      }
    };
    
    switch (themeType) {
      case 'MINIMAL':
        return <MinimalTheme {...commonProps} />;
      case 'MODERN':
        return <ModernTheme {...commonProps} />;
      case 'CLASSIC':
      default:
        return <ClassicTheme {...commonProps} />;
    }
  };

  if (loading && !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div 
              className="h-16 w-16 border-4 rounded-full animate-spin"
              style={{ borderColor: `${colors.primaryLight}`, borderTopColor: colors.primary }}
            ></div>
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
                className="inline-flex items-center justify-center px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
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

  // Check if home page is enabled in layout
  if (layout?.pages?.home === false) {
    hasHome = false;
    navigate(`/store/${storeName}/products`);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl text-gray-400">🏠</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('storeHome.errors.homePageDisabled')}</h2>
              <p className="text-gray-600 mb-8">{t('storeHome.errors.homePageDisabledMessage')}</p>
              <Link
                to={`/store/${storeName}/products`}
                className="inline-flex items-center justify-center px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
              >
                {t('storeHome.buttons.viewProducts')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO 
        title={store.storeName}
        description={store.storeDescription || `Shop the best products from ${store.storeName}`}
        keywords={`${store.storeName}, store, shop, products`}
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
            "addressCountry": "EG"
          },
          "telephone": store.storePhone,
          "priceRange": "$$",
          "sameAs": [store.facebook, store.instagram].filter(Boolean)
        }}
      />
      
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

export default StoreHome;