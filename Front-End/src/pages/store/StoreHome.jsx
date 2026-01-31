// src/pages/store/StoreHome.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Star, Truck, Shield, 
  Plus, BarChart, Package, Users,
  Filter, Search, Heart, ShoppingCart,
  CheckCircle, AlertCircle,
  TrendingUp, Eye, Clock, Download,
  MessageSquare, DollarSign, RefreshCw,
  ArrowUpRight, ArrowDownRight,
  Grid, List, ChevronRight, Store,
  Loader2
} from 'lucide-react';
import { productAPI, productImagesAPI } from '../../api/product.api';
import { categoryAPI } from '../../api/category.api';
import { storeAPI } from '../../api/store.api';
import { format } from 'date-fns';

// Loading Skeleton Components
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="flex justify-between mb-3">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-20 mb-6"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-10 bg-gray-200 rounded w-28"></div>
      </div>
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
      <div className="h-6 w-12 bg-gray-200 rounded"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </div>
);

// Local Storage Cart Management
const cartManager = {
  // Get cart from localStorage
  getCart: () => {
    try {
      const cart = localStorage.getItem('store_cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  },

  // Add product to cart
  addToCart: (product, quantity = 1) => {
    try {
      const cart = cartManager.getCart();
      const existingItemIndex = cart.findIndex(item => item.id === product.id && item.storeId === product.storeId);
      
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          storeId: product.storeId,
          category: product.category,
          quantity: quantity,
          addedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem('store_cart', JSON.stringify(cart));
      return cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Get cart count
  getCartCount: () => {
    try {
      const cart = cartManager.getCart();
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  },

  // Remove item from cart
  removeFromCart: (productId) => {
    try {
      const cart = cartManager.getCart();
      const updatedCart = cart.filter(item => item.id !== productId);
      localStorage.setItem('store_cart', JSON.stringify(updatedCart));
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: () => {
    try {
      localStorage.removeItem('store_cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Get cart total
  getCartTotal: () => {
    try {
      const cart = cartManager.getCart();
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
      console.error('Error getting cart total:', error);
      return 0;
    }
  }
};

// Customer View Component
const CustomerStoreView = ({ storeParam }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [storeData, setStoreData] = useState({
    id: null,
    name: '',
    description: '',
    rating: 0,
    reviews: 0,
    verified: false,
    shippingPolicy: '',
    policies: []
  });
  const [cartCount, setCartCount] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStoreData();
    // Initialize cart count from localStorage
    setCartCount(cartManager.getCartCount());
    
    // Add event listener for cart updates from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'store_cart') {
        setCartCount(cartManager.getCartCount());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storeParam]);

  const fetchStoreData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Resolve store by ID or name
      let storeResponse;
      let resolvedStoreId;
      if (storeParam && !isNaN(Number(storeParam)) && Number(storeParam) > 0) {
        storeResponse = await storeAPI.getById(Number(storeParam), false);
        resolvedStoreId = Number(storeParam);
      } else if (storeParam) {
        storeResponse = await storeAPI.getByName(storeParam, false);
        resolvedStoreId = storeResponse?.id || storeResponse?.storeId;
      } else {
        throw new Error('Store identifier missing');
      }

      if (!storeResponse) {
        throw new Error('Store not found');
      }

      // Normalize store data
      setStoreData({
        id: resolvedStoreId,
        name: storeResponse.storeName || storeResponse.name || 'Untitled Store',
        description: storeResponse.description || 'No description available',
        rating: storeResponse.rating || 0,
        reviews: storeResponse.reviewCount || 0,
        verified: storeResponse.verified || false,
        shippingPolicy: storeResponse.shippingPolicy || 'Free shipping on orders over $50',
        policies: storeResponse.policies || ['Secure Payment', '30-Day Returns', '1-Year Warranty']
      });

          if (!storeResponse) {
            throw new Error('Store not found');
          }

          // Normalize store data
          setStoreData({
            id: resolvedStoreId,
            name: storeResponse.storeName || storeResponse.name || 'Untitled Store',
            description: storeResponse.description || 'No description available',
            rating: storeResponse.rating || 0,
            reviews: storeResponse.reviewCount || 0,
            verified: storeResponse.verified || false,
            shippingPolicy: storeResponse.shippingPolicy || 'Free shipping on orders over $50',
            policies: storeResponse.policies || ['Secure Payment', '30-Day Returns', '1-Year Warranty']
          });

          // Prepare category map
          let categoriesResponse = [];
          let categoryMap = {};
          try {
            categoriesResponse = await categoryAPI.getByStore(Number(resolvedStoreId));
          } catch (error) {
            // No categories found
          }
          categoriesResponse.forEach(cat => {
            categoryMap[cat.id] = {
              name: cat.name,
              icon: getCategoryIcon(cat.name)
            };
          });

          // Fetch products for this store
          const productsResponse = await productAPI.getAll(Number(resolvedStoreId));

          // Process products with images and category names
          const productsWithDetails = await Promise.all(
            productsResponse.map(async (product) => {
              try {
                let imagesResponse = [];
                try {
                  imagesResponse = await productImagesAPI.getByProduct(product.id);
                } catch (error) {
                  // No images for product
                }

                const category = categoryMap[product.categoryId] || {
                  name: product.category || 'Uncategorized',
                  icon: getCategoryIcon(product.category || 'Uncategorized')
                };

                return {
                  ...product,
                  imageUrl: imagesResponse[0]?.url || getDefaultProductImage(category.name),
                  images: imagesResponse,
                  category: category.name,
                  categoryIcon: category.icon,
                  storeId: resolvedStoreId,
                  stock: product.stock || 0,
                  price: product.price || 0,
                  rating: product.rating || 0,
                  reviewCount: product.reviewCount || 0
                };
              } catch (error) {
                console.error(`Error loading product ${product.id}:`, error);
                return {
                  ...product,
                  imageUrl: getDefaultProductImage(product.category || 'Uncategorized'),
                  images: [],
                  category: product.category || 'Uncategorized',
                  categoryIcon: getCategoryIcon(product.category || 'Uncategorized'),
                  storeId: resolvedStoreId,
                  stock: product.stock || 0,
                  price: product.price || 0,
                  rating: product.rating || 0,
                  reviewCount: product.reviewCount || 0
                };
              }
            })
          );

          setProducts(productsWithDetails);
          setFilteredProducts(productsWithDetails);

          // Prepare categories for display
          const displayCategories = categoriesResponse.map(cat => ({
            id: cat.id,
            name: cat.name,
            count: productsWithDetails.filter(p => p.categoryId === cat.id).length,
            icon: getCategoryIcon(cat.name)
          }));

          // Add uncategorized if needed
          const uncategorizedCount = productsWithDetails.filter(p => !p.categoryId).length;
          if (uncategorizedCount > 0) {
            displayCategories.push({
              id: 'uncategorized',
              name: 'Uncategorized',
              count: uncategorizedCount,
              icon: '📦'
            });
          }

          setCategories(displayCategories);
          // Ensure store id is set for navigation/links
          setStoreData(prev => ({ ...prev, id: resolvedStoreId }));
        } catch (error) {
          console.error('Error fetching store data:', error);
          if (error.message && error.message.includes('Unauthorized')) {
            setError('You are not logged in or your session expired. Please log in to access this store.');
          } else if (error.message && error.message.includes('Forbidden')) {
            setError('You do not have permission to access this store. Please check your account or contact support.');
          } else {
            setError('Failed to load store data. Please try again.');
          }
        } finally {
          setIsLoading(false);
        }
      };
      return icons[categoryName] || '📦';
    };
    
  

  const getDefaultProductImage = (category) => {
    const defaultImages = {
      'Electronics': '📱',
      'Fashion': '👕',
      'Home & Living': '🏠',
      'Fitness': '💪',
      'Books': '📚',
      'Beauty': '💄',
      'Toys': '🎮',
      'Food': '🍎',
      'Default': '🎁'
    };
    return defaultImages[category] || defaultImages['Default'];
  };

  useEffect(() => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'uncategorized') {
        filtered = filtered.filter(product => !product.categoryId);
      } else {
        filtered = filtered.filter(product => product.categoryId === selectedCategory);
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, sortBy, products]);

  const handleAddToCart = (product) => {
    try {
      const updatedCart = cartManager.addToCart(product);
      const newCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(newCount);
      
      // Show success feedback
      alert(`Added ${product.name} to cart!`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleCartClick = () => {
    const routeName = storeData?.name || storeData?.storeName || storeParam;
    if (routeName) {
      navigate(`/store/${encodeURIComponent(routeName)}/cart`);
    } else {
      navigate('/cart');
    }
  };

  const handleProductClick = (productId) => {
    const routeName = storeData?.name || storeData?.storeName || storeParam;
    if (routeName) {
      navigate(`/store/${encodeURIComponent(routeName)}/product/${productId}`);
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-12 animate-pulse">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-white/20 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-white/20 rounded w-64"></div>
                <div className="flex space-x-4">
                  <div className="h-6 bg-white/20 rounded w-32"></div>
                  <div className="h-6 bg-white/20 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Store</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchStoreData}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Store Banner with Parallax Effect */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <Store className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{storeData.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-300 fill-current mr-1" />
                    <span>{storeData.rating.toFixed(1)} ({storeData.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Truck className="h-4 w-4 mr-1" />
                    <span>{storeData.shippingPolicy}</span>
                  </div>
                  {storeData.verified && (
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Shield className="h-4 w-4 mr-1" />
                      <span>Verified seller</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={handleCartClick}
              className="group relative px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart ({cartCount})</span>
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Store Description */}
        {storeData.description && (
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Store</h2>
            <p className="text-gray-600">{storeData.description}</p>
          </div>
        )}

        {/* Advanced Search & Filter Bar */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, description, or category..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
              
              <button className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg">
                <Filter className="h-5 w-5" />
                <span>Advanced Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Carousel */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center space-x-1"
              >
                <span>View all categories</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 px-6 py-4 rounded-xl border transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg'
                    : 'bg-white border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🛍️</div>
                  <div className="font-semibold">All Products</div>
                  <div className="text-sm opacity-75">{products.length} items</div>
                </div>
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-6 py-4 rounded-xl border transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg'
                      : 'bg-white border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="font-semibold">{category.name}</div>
                    <div className="text-sm opacity-75">{category.count} products</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Products' : 
               categories.find(c => c.id === selectedCategory)?.name || 'Selected Category'}
              <span className="text-gray-500 text-lg font-normal ml-2">
                ({filteredProducts.length} items)
              </span>
            </h2>
            {filteredProducts.length > 0 && (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate(`/store/${storeId}/products`)}
                  className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center space-x-1"
                >
                  <span>View all products</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div 
                    className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'} bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden cursor-pointer`}
                    onClick={() => handleProductClick(product.id)}
                  >
                    {typeof product.imageUrl === 'string' && product.imageUrl.startsWith('http') ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-6xl">{product.imageUrl}</div>
                    )}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all shadow-lg hover:shadow-xl">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.id);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all shadow-lg hover:shadow-xl"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        {product.category || 'Uncategorized'}
                      </span>
                      {product.discount && product.discount > 0 && (
                        <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <h3 
                      className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description || 'No description available'}
                    </p>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {product.rating ? product.rating.toFixed(1) : '0.0'} ({product.reviewCount || 0})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <div className="text-2xl font-bold text-gray-900">
                            ${product.price ? product.price.toFixed(2) : '0.00'}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={!product.stock || product.stock <= 0}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                          product.stock > 0
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="h-5 w-5" />
                        <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Store Features & Policies */}
        {storeData.policies && storeData.policies.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Shop With Us</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {storeData.policies.map((policy, index) => {
                const policyIcons = {
                  'Free Shipping': Truck,
                  'Secure Payment': Shield,
                  '24/7 Support': Clock,
                  'Best Price': DollarSign,
                  '30-Day Returns': RefreshCw,
                  '1-Year Warranty': Shield,
                  'Price Match': DollarSign,
                  'Easy Returns': RefreshCw
                };
                
                const Icon = policyIcons[policy] || Shield;
                const colors = ['green', 'blue', 'purple', 'orange', 'red', 'indigo', 'yellow', 'pink'];
                const color = colors[index % colors.length];
                
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                    <div className={`h-12 w-12 bg-${color}-50 rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 text-${color}-600`} />
                    </div>
                    <div className="font-semibold text-gray-900 mb-1">{policy}</div>
                    <div className="text-sm text-gray-600">
                      {policy === 'Free Shipping' && 'On orders over $50'}
                      {policy === 'Secure Payment' && '100% secure checkout'}
                      {policy === '24/7 Support' && 'Dedicated customer service'}
                      {policy === '30-Day Returns' && 'Easy return policy'}
                      {policy === '1-Year Warranty' && 'Product warranty included'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Vendor View Component
const VendorStoreView = ({ storeId }) => {
  const navigate = useNavigate();
  const [storeStats, setStoreStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    customers: 0,
    conversionRate: 0,
    satisfactionRate: 0,
    inventoryTurnover: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storeStatus, setStoreStatus] = useState('active');
  const [performanceData, setPerformanceData] = useState([]);
  const [storeData, setStoreData] = useState({
    name: '',
    url: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchVendorData();
  }, [storeId]);

  const fetchVendorData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch store details
      const storeResponse = await storeAPI.getById(storeId);
      setStoreData({
        name: storeResponse.storeName || storeResponse.name,
        url: `storely.com/store/${storeId}`
      });
      setStoreStatus(storeResponse.status || 'active');
      
      // Fetch categories
      const categoriesResponse = await categoryAPI.getByStore(storeId);
      setCategories(categoriesResponse);
      
      // Fetch store products
      const productsResponse = await productAPI.getAll(storeId);
      setRecentProducts(productsResponse.slice(0, 5));
      
      // Calculate store statistics
      const totalRevenue = productsResponse.reduce((sum, product) => 
        sum + (product.price * (product.soldQuantity || 0)), 0);
      
      // Get unique customers (simulated)
      const uniqueCustomers = Math.floor(productsResponse.length * 2.5);
      
      setStoreStats({
        totalOrders: storeResponse.totalOrders || Math.floor(productsResponse.length * 1.2),
        totalProducts: productsResponse.length,
        totalRevenue,
        customers: uniqueCustomers,
        conversionRate: storeResponse.conversionRate || 4.8,
        satisfactionRate: storeResponse.satisfactionRate || 94,
        inventoryTurnover: storeResponse.inventoryTurnover || 68
      });

      // Generate recent activity from actual products
      const activities = productsResponse.slice(0, 4).map((product, index) => ({
        time: new Date(Date.now() - (index * 6 * 60 * 60 * 1000)),
        action: `Product "${product.name}" updated`,
        amount: null,
        type: 'update'
      }));
      
      setRecentActivity(activities);

      // Generate performance data
      setPerformanceData([
        { month: 'Jan', revenue: 3200, orders: 45 },
        { month: 'Feb', revenue: 4200, orders: 52 },
        { month: 'Mar', revenue: 5100, orders: 61 },
        { month: 'Apr', revenue: 6800, orders: 78 },
        { month: 'May', revenue: 8425, orders: 89 },
      ]);

    } catch (error) {
      console.error('Error fetching vendor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate(`/vendor/store/${storeId}/products/add`);
  };

  const handleAddCategory = () => {
    navigate(`/vendor/store/${storeId}/categories/add`);
  };

    const icons = {
      'Electronics': '📱',
      'Fashion': '👕',
      'Clothing': '👕',
      'Home & Living': '🏠',
      'Home': '🏠',
      'Fitness': '💪',
      'Sports': '⚽',
      'Books': '📚',
      'Beauty': '💄',
      'Toys': '🎮',
      'Food': '🍎',
      'Drinks': '🥤',
      'Furniture': '🪑',
      'Jewelry': '💎',
      'Shoes': '👟',
      'Bags': '👜',
      'Watches': '⌚',
      'Music': '🎵',
      'Movies': '🎬',
      'Games': '🎮'
    };
    return icons[categoryName] || '📦';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 animate-pulse">
                <div className="h-16 w-16 bg-gray-200 rounded-2xl"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Vendor Header with Gradient */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Store className="h-8 w-8 text-white" />
                </div>
                <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white ${
                  storeStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-3">
                  <h1 className="text-2xl font-bold">{storeData.name || 'My Store'}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    storeStatus === 'active'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {storeStatus === 'active' ? '● Live' : 'Suspended'}
                  </span>
                </div>
                <p className="text-gray-300 mt-1">{storeData.url}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
              </button>
              <button 
                onClick={() => navigate(`/vendor/store/${storeId}/settings`)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
              >
                Store Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Store Statistics with Animations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Orders', 
              value: storeStats.totalOrders, 
              change: '+12%',
              icon: ShoppingBag,
              color: 'blue',
              trend: 'up'
            },
            { 
              label: 'Total Products', 
              value: storeStats.totalProducts, 
              change: '+5%',
              icon: Package,
              color: 'green',
              trend: 'up'
            },
            { 
              label: 'Total Revenue', 
              value: `$${storeStats.totalRevenue.toLocaleString()}`, 
              change: '+18%',
              icon: DollarSign,
              color: 'purple',
              trend: 'up'
            },
            { 
              label: 'Customers', 
              value: storeStats.customers, 
              change: '+7%',
              icon: Users,
              color: 'indigo',
              trend: 'up'
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`bg-white rounded-xl p-6 border border-gray-100 hover:border-${action.color}-200 hover:shadow-xl transition-all hover:-translate-y-1 text-left group`}
              >
                <div className={`h-12 w-12 bg-${action.color}-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {action.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Categories & Products Summary */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Categories */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Categories</h3>
              <button 
                onClick={handleAddCategory}
                className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center space-x-1 text-sm"
              >
                <span>Add Category</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {categories.slice(0, 5).map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-lg">{getCategoryIcon(category.name)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">
                        {recentProducts.filter(p => p.categoryId === category.id).length} products
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100">
                    Edit
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No categories yet. Add your first category!
                </div>
              )}
            </div>
          </div>

          {/* Store Performance */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Store Performance</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Conversion Rate</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-green-600">{storeStats.conversionRate}%</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    style={{ width: `${Math.min(storeStats.conversionRate, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Customer Satisfaction</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-blue-600">{storeStats.satisfactionRate}%</span>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                    style={{ width: `${Math.min(storeStats.satisfactionRate, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Inventory Turnover</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-yellow-600">{storeStats.inventoryTurnover}%</span>
                    <TrendingUp className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                    style={{ width: `${Math.min(storeStats.inventoryTurnover, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Recent Products */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <button className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center space-x-1 text-sm">
                <span>View all</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      activity.type === 'order' ? 'bg-blue-50' :
                      activity.type === 'update' ? 'bg-green-50' :
                      activity.type === 'review' ? 'bg-yellow-50' : 'bg-purple-50'
                    }`}>
                      {activity.type === 'order' && <ShoppingBag className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'update' && <Package className="h-5 w-5 text-green-600" />}
                      {activity.type === 'review' && <Star className="h-5 w-5 text-yellow-600" />}
                      {activity.type === 'payment' && <DollarSign className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{activity.action}</div>
                      <div className="text-sm text-gray-500">
                        {format(activity.time, 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                  {activity.amount && (
                    <div className="font-semibold text-gray-900">${activity.amount.toFixed(2)}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Products</h3>
              <button 
                onClick={() => navigate(`/vendor/store/${storeId}/products`)}
                className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center space-x-1 text-sm"
              >
                <span>View all products</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-8 w-8 object-cover rounded" />
                      ) : (
                        <div className="text-lg">📱</div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">${product.price?.toFixed(2)} • {product.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock || 0} in stock
                    </span>
                  </div>
                </div>
              ))}
              {recentProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No products yet. Add your first product!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store Health */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Store Health</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Store Active</div>
                  <div className="text-sm text-gray-500">Your store is live and receiving orders</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Verified Account</div>
                  <div className="text-sm text-gray-500">Identity verified and trusted</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Action Required</div>
                  <div className="text-sm text-gray-500">Update shipping rates for new zone</div>
                </div>
              </div>
              <button className="px-4 py-2 text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">
                Fix Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for category icons
const getCategoryIcon = (categoryName) => {
  const icons = {
    'Electronics': '📱',
    'Fashion': '👕',
    'Home': '🏠',
    'Fitness': '💪',
    'Books': '📚',
    'Beauty': '💄',
    'Toys': '🎮',
    'Food': '🍎',
    'Default': '📦'
  };
  return icons[categoryName] || icons['Default'];
};

// Main StoreHome Component
const StoreHome = ({ viewType = 'customer' }) => {
  const { storeName } = useParams();
  const navigate = useNavigate();

  if (viewType === 'vendor') {
    return <VendorStoreView storeId={storeName} />;
  }

  return <CustomerStoreView storeParam={storeName} />;
};

export default StoreHome;