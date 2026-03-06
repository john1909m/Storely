// Vendor Store Page - Real data from APIs
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Store, Package, ShoppingBag, BarChart, Settings, 
  Plus, Edit, Copy, Check, ExternalLink, TrendingUp,
  Users, DollarSign, AlertCircle, Eye, LogOut, Menu, X,
  ChevronRight, Clock, Star, Archive, Layers, MapPin, Phone, User,
  CreditCard // Added for pricing button
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { storeAPI } from '../../api/store.api';
import { productAPI } from '../../api/product.api';
import { orderAPI } from '../../api/order.api';
import StoreFooter from '../../components/StoreFooter';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import useAuthStore from '../../store/authStore';
// import { useErrorHandler } from './../../hooks/useErrorHandler';

const VendorStore = () => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStock: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { store: authStore, vendor, setStore: setAuthStore, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
    const { handleError } = useErrorHandler();
  const {authInialized,isAuthenticated} = useAuthStore();

  useEffect(() => {
    if(!authInialized){
      navigate('/login');
      return;
    }
    fetchStoreData();
    const handleRefresh = () => fetchStoreData();
    window.addEventListener('focus', handleRefresh);
    
    return () => {
      window.removeEventListener('focus', handleRefresh);
    };
  }, [authInialized, location]);

  const fetchStoreData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let storeData = null;
      
      if (vendor?.id) {
        try {
          const stores = await storeAPI.getByVendorId(vendor.id);
          storeData = Array.isArray(stores) ? stores[0] : stores;
        } catch (storeErr) {
          handleError(storeErr);
        }
      }
      
      if (!storeData && authStore?.id) {
        try {
          storeData = await storeAPI.getById(authStore.id);
        } catch (storeByIdErr) {
          handleError(storeByIdErr);
          storeData = authStore;
        }
      }

      if (!storeData) {
        setError('Store not found. Please create a store first.');
        setIsLoading(false);
        return;
      }

      setStore(storeData);
      if (setAuthStore) {
        setAuthStore(storeData);
      }

      if (storeData.id) {
        // Fetch products
        let productsList = [];
        try {
          const storeProducts = await productAPI.getAll(storeData.id);
          productsList = Array.isArray(storeProducts) ? storeProducts : [];
          setProducts(productsList);
        } catch (productErr) {
          handleError(productErr);
          setProducts([]);
        }

        // Fetch orders
        let ordersList = [];
        try {
          const storeOrders = await orderAPI.getByStore(storeData.id);
          ordersList = Array.isArray(storeOrders) ? storeOrders : [];
          setOrders(ordersList);
        } catch (orderErr) {
          handleError(orderErr);
          setOrders([]);
        }

        // Calculate stats
        const pendingOrders = ordersList.filter(o => 
          (o.orderStatus || o.status)?.toUpperCase() === 'PENDING'
        ).length;

        const lowStockItems = productsList.filter(p => 
          (p.quantity || p.stock || 0) < 5
        ).length;

        setStats({
          totalProducts: productsList.length,
          totalOrders: ordersList.length,
          totalRevenue: ordersList.reduce((sum, order) => sum + (order.totalPrice || order.total || order.amount || 0), 0),
          totalCustomers: new Set(ordersList.map(order => order.customerId).filter(Boolean)).size,
          pendingOrders,
          lowStock: lowStockItems
        });
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyStoreLink = () => {
    const storeLink = `${window.location.origin}/store/${store?.storeName || ''}`;
    navigator.clipboard.writeText(storeLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStoreUrl = () => {
    if (!store?.storeName) return '';
    return `${window.location.origin}/store/${store.storeName}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <Store className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 font-medium">Loading your store...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Store Not Found</h2>
          <p className="text-gray-600 mb-8">{error || 'Please create a store first'}</p>
          <Link
            to="/vendor/create-store"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* Sticky Header with Glassmorphism */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Store Name */}
            <div className="flex items-center space-x-3">
              {store.storeLogoUrl ? (
                <img 
                  src={store.storeLogoUrl} 
                  alt={store.storeName}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div 
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-xl shadow-md"
                  style={{ 
                    backgroundColor: store.primaryColor || '#800020',
                    color: store.secondaryColor || '#ffffff'
                  }}
                >
                  <Store className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              )}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-1">
                  {store.storeName}
                </h1>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    store.storeStatus === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full mr-1 ${
                      store.storeStatus === 'Active' ? 'bg-green-600' : 'bg-yellow-600'
                    }`}></span>
                    {store.storeStatus || 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Top Right */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Pricing Button - NEW */}
              <Link
                to="/vendor/pricing"
                className="px-4 py-2.5 text-indigo-700 hover:text-white hover:bg-indigo-600 rounded-xl transition-all flex items-center space-x-2 border border-indigo-200 hover:border-indigo-600 group"
              >
                <CreditCard className="h-5 w-5 group-hover:text-white" />
                <span className="font-medium">Pricing</span>
              </Link>
              
              <Link
                to="/vendor/settings"
                className="px-4 py-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center space-x-2 group"
              >
                <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                <span className="font-medium">Settings</span>
              </Link>
              
              <Link
                to="/vendor/dashboard"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <BarChart className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="px-4 py-2.5 text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all flex items-center space-x-2 border border-red-200 hover:border-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Panel */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden animate-slide-left">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <Store className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{store.storeName}</div>
                      <div className="text-xs text-gray-500">Store Menu</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <div className="space-y-2">
                  {/* Pricing Link in Mobile Menu */}
                  <Link
                    to="/vendor/pricing"
                    className="flex items-center px-4 py-3.5 text-gray-700 hover:bg-indigo-50 rounded-xl transition-all group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">Pricing</div>
                      <div className="text-xs text-gray-500">View subscription plans</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>

                  <Link
                    to="/vendor/settings"
                    className="flex items-center px-4 py-3.5 text-gray-700 hover:bg-indigo-50 rounded-xl transition-all group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <Settings className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">Settings</div>
                      <div className="text-xs text-gray-500">Manage your store</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                  
                  <Link
                    to="/vendor/dashboard"
                    className="flex items-center px-4 py-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-xl border border-indigo-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <BarChart className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-indigo-700">Dashboard</div>
                      <div className="text-xs text-indigo-500">Analytics & reports</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-indigo-400" />
                  </Link>
                  
                  <div className="border-t border-gray-100 my-4"></div>
                  
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center px-4 py-3.5 w-full text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                  >
                    <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100">
                      <LogOut className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3 flex-1 text-left">
                      <div className="font-medium">Logout</div>
                      <div className="text-xs text-red-500">Sign out of account</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-red-400" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{vendor?.name || 'Vendor'}</div>
                    <div className="text-xs text-gray-500">{vendor?.email || ''}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Store URL Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 mb-8 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <ExternalLink className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 mb-1">Your store is live at</p>
              <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                {getStoreUrl()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:flex-shrink-0">
            <button
              onClick={copyStoreLink}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all flex items-center justify-center space-x-2 group"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Copy Link</span>
                </>
              )}
            </button>
            <a
              href={getStoreUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">View</span>
            </a>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
              {stats.lowStock > 0 && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  {stats.lowStock} low
                </span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.totalProducts)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Products</div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              {stats.pendingOrders > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  {stats.pendingOrders} pending
                </span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.totalOrders)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quick Actions</h2>
            <span className="text-xs text-gray-500 sm:hidden">Swipe →</span>
          </div>
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:px-0 scrollbar-hide">
            <Link
              to="/vendor/products"
              className="flex-shrink-0 w-64 sm:w-auto bg-white rounded-xl p-5 sm:p-6 border border-gray-200/80 hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">Manage Products</div>
              <div className="text-sm text-gray-500">Edit or update stock</div>
            </Link>

            <Link
              to="/vendor/categories"
              className="flex-shrink-0 w-64 sm:w-auto bg-white rounded-xl p-5 sm:p-6 border border-gray-200/80 hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">Manage Categories</div>
              <div className="text-sm text-gray-500">Edit or update categories</div>
            </Link>

            <Link
              to="/vendor/orders"
              className="flex-shrink-0 w-64 sm:w-auto bg-white rounded-xl p-5 sm:p-6 border border-gray-200/80 hover:border-green-300 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">View Orders</div>
              <div className="text-sm text-gray-500">Process & fulfill</div>
            </Link>

            <Link
              to="/vendor/analytics"
              className="flex-shrink-0 w-64 sm:w-auto bg-white rounded-xl p-5 sm:p-6 border border-gray-200/80 hover:border-purple-300 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">Analytics</div>
              <div className="text-sm text-gray-500">Track performance</div>
            </Link>
          </div>
        </div>

        {/* Main Grid - Store Info, Recent Products, Recent Orders */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Store Info & Recent Products */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Store Info Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Store className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-600" />
                  Store Overview
                </h2>
                <Link
                  to="/vendor/settings"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                  Edit <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-5">
                <div>
                  <p className="text-gray-600 leading-relaxed">
                    {store.storeDescription || (
                      <span className="text-gray-400 italic">No description provided. Add one in settings.</span>
                    )}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center text-gray-500 mb-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-xs uppercase tracking-wider">Address</span>
                    </div>
                    <p className="text-gray-900 font-medium">{store.storeAddress || 'Not set'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center text-gray-500 mb-1">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-xs uppercase tracking-wider">Contact</span>
                    </div>
                    <p className="text-gray-900 font-medium">{store.storePhone || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-600" />
                  Recent Products
                </h2>
                <Link
                  to="/vendor/products"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                  View All ({stats.totalProducts})
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">Your product catalog is empty</p>
                  <Link
                    to="/vendor/products"
                    className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {products.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="group border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.imageUrls?.[0] ? (
                            <img 
                              src={product.imageUrls[0]} 
                              alt={product.productName || product.name}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate">
                            {product.productName || product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-900 font-medium">
                              {formatCurrency(product.price || 0)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              (product.quantity || product.stock || 0) > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {(product.quantity || product.stock || 0)} left
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Recent Orders */}
          <div className="space-y-6 sm:space-y-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-600" />
                  Recent Orders
                </h2>
                <Link
                  to="/vendor/orders"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No orders yet</p>
                  <p className="text-sm text-gray-500 mt-1">Orders will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => {
                    const status = (order.orderStatus || order.status || 'PENDING').toUpperCase();
                    const statusColors = {
                      PENDING: 'bg-yellow-100 text-yellow-700',
                      CONFIRMED: 'bg-blue-100 text-blue-700',
                      SHIPPED: 'bg-purple-100 text-purple-700',
                      DELIVERED: 'bg-green-100 text-green-700',
                      CANCELLED: 'bg-red-100 text-red-700'
                    };
                    
                    return (
                      <Link
                        key={order.id}
                        to={`/vendor/orders`}
                        className="block border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            #{order.orderNumber || order.id}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
                            {status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.totalPrice || order.total || order.amount || 0)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
};

// Add this CSS to your global styles or component
const styles = `
  @keyframes slideLeft {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .animate-slide-left {
    animation: slideLeft 0.3s ease-out;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default VendorStore;