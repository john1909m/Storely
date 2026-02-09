// StoreHome.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { storeAPI } from '../../api/store.api';
import { productAPI } from '../../api/product.api';
import { categoryAPI } from '../../api/category.api';
import CartSidebar from '../../components/CartSidebar';
import ProductCard from '../../components/ProductCard';
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
  Heart
} from 'lucide-react';

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
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);

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
        console.error('Error parsing cart:', err);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (err) {
        console.error('Error parsing wishlist:', err);
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
        items: cart,
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
      setProducts(storeProducts || []);

      // Fetch categories for this store
      const storeCategories = await categoryAPI.getByStore(storeData.id);
      setCategories(storeCategories || []);

    } catch (err) {
      console.error('Error fetching store data:', err);
      setError(err.message || 'Failed to load store');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          ...product,
          quantity: 1,
          addedAt: new Date().toISOString()
        }];
      }
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
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start lg:items-center gap-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-white shadow-lg">
                    {store.logoUrl ? (
                      <img 
                        src={store.logoUrl} 
                        alt={store.storeName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-3xl text-gray-400">
                        🏪
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{store.storeName}</h1>
                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
                      Verified
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {getStoreRating().rating} ({getStoreRating().reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Truck className="h-4 w-4" />
                      <span className="text-sm">{store.shippingPolicy || 'Free shipping available'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">24/7 Support</span>
                    </div>
                  </div>
                  
                  {store.storeDescription && (
                    <p className="mt-4 text-gray-600 line-clamp-2">
                      {store.storeDescription}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowCart(true)}
                  className="relative px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl group"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Your Cart</div>
                      <div className="text-xs opacity-90">{getCartItemCount()} items</div>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {getCartItemCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative max-w-2xl">
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
            
            <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
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
                        <div className="text-gray-500">📍</div>
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
                        <div className="text-gray-500">📞</div>
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
            {/* Products Header */}
            <div className="mb-8">
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
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="h-24 w-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
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
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={isInWishlist(product.id)}
                    onViewDetails={() => navigate(`/store/${storeName}/product/${product.id}`)}
                  />
                ))}
              </div>
            )}

            {/* Store Features */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose {store.storeName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    title: 'Premium Quality', 
                    icon: '✨',
                    desc: 'Carefully curated products with premium materials and craftsmanship.',
                    color: 'from-blue-50 to-indigo-50'
                  },
                  { 
                    title: 'Fast Shipping', 
                    icon: '🚚',
                    desc: 'Same-day shipping on orders placed before 3 PM local time.',
                    color: 'from-emerald-50 to-teal-50'
                  },
                  { 
                    title: 'Secure Payment', 
                    icon: '🛡️',
                    desc: '100% secure checkout with encrypted payment processing.',
                    color: 'from-amber-50 to-orange-50'
                  },
                  { 
                    title: 'Easy Returns', 
                    icon: '↩️',
                    desc: '30-day return policy with free returns for all products.',
                    color: 'from-purple-50 to-pink-50'
                  }
                ].map((feature, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow group">
                    <div className={`h-16 w-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <div className="text-3xl">{feature.icon}</div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3">{feature.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
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
        onUpdateQuantity={(productId, quantity) => {
          if (quantity < 1) {
            setCart(prev => prev.filter(item => item.id !== productId));
          } else {
            setCart(prev =>
              prev.map(item =>
                item.id === productId
                  ? { ...item, quantity }
                  : item
              )
            );
          }
        }}
        onRemoveItem={(productId) => {
          setCart(prev => prev.filter(item => item.id !== productId));
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