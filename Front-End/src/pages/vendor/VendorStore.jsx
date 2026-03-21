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
import { useTranslation } from 'react-i18next';

const VendorStore = () => {
  const { t, i18n } = useTranslation();
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
        setError(t('vendor.store.storeNotFoundBodyFallback'));
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
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode).format(num || 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <Store className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 font-medium">{t('vendor.store.loading')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('vendor.store.pleaseWait')}</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('vendor.store.storeNotFoundTitle')}</h2>
          <p className="text-gray-600 mb-8">{error || t('vendor.store.storeNotFoundBodyFallback')}</p>
          <Link
            to="/vendor/create-store"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('vendor.store.createYourStore')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Store Name */}
            <div className="flex items-center space-x-3">
              {store.storeLogoUrl ? (
                <img 
                  src={store.storeLogoUrl} 
                  alt={store.storeName}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
                />
              ) : (
                <div 
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center text-xl"
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
                    {(store.storeStatus || 'Inactive') === 'Active'
                      ? t('vendor.store.storeStatus.active')
                      : t('vendor.store.storeStatus.inactive')}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/vendor/pricing"
                className="px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">{t('vendor.store.nav.pricing')}</span>
              </Link>
              
              <Link
                to="/vendor/settings"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">{t('vendor.store.nav.settings')}</span>
              </Link>
              
              <Link
                to="/vendor/dashboard"
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <BarChart className="h-5 w-5" />
                <span className="font-medium">{t('vendor.store.nav.dashboard')}</span>
              </Link>
              
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2 border border-red-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">{t('vendor.store.nav.logout')}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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

      {/* Simple Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl z-50 md:hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{t('vendor.store.mobile.menu')}</div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-1">
                <Link
                  to="/vendor/pricing"
                  className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-indigo-600 mr-3" />
                    <span>{t('vendor.store.nav.pricing')}</span>
                  </div>
                </Link>

                <Link
                  to="/vendor/settings"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-600 mr-3" />
                    <span>{t('vendor.store.nav.settings')}</span>
                  </div>
                </Link>
                
                <Link
                  to="/vendor/dashboard"
                  className="block px-4 py-3 text-indigo-700 bg-indigo-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 text-indigo-600 mr-3" />
                    <span className="font-medium">{t('vendor.store.nav.dashboard')}</span>
                  </div>
                </Link>
                
                <div className="border-t border-gray-200 my-4"></div>
                
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>{t('vendor.store.nav.logout')}</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{vendor?.name || t('vendor.store.vendorFallbackName')}</div>
                  <div className="text-xs text-gray-500">{vendor?.email || ''}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('vendor.store.dashboard.welcomeBackPrefix', { vendorName: store?.vendorName || t('vendor.store.vendorFallbackName') })}
          </h1>
          
          {/* بار صغير لزيارات المتجر */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm text-gray-600">{t('vendor.store.dashboard.totalVisitsLabel')}</span>
            <span className="font-semibold text-gray-900">
              {(() => {
                const value = store.totalVisits / 2;
                return (value % 1 !== 0 ? Math.ceil(value) : value) || 0;
              })()}
            </span>
          </div>
        </div>
        {/* Simple Store URL Bar */}
        <div className="bg-white rounded-lg p-4 mb-8 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ExternalLink className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 mb-1">{t('vendor.store.dashboard.yourStoreLiveAtLabel')}</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {getStoreUrl()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:flex-shrink-0">
            <button
              onClick={copyStoreLink}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                    <span className="text-sm">{t('vendor.store.dashboard.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                    <span className="text-sm">{t('vendor.store.dashboard.copyLink')}</span>
                </>
              )}
            </button>
            <a
              href={getStoreUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm">{t('vendor.store.dashboard.view')}</span>
            </a>
          </div>
        </div>

        {/* Simple Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
              {stats.lowStock > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  {stats.lowStock} {t('vendor.store.statistics.lowStockSuffix')}
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.totalProducts)}
            </div>
            <div className="text-sm text-gray-600">{t('vendor.store.statistics.totalProducts')}</div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-green-600" />
              </div>
              {stats.pendingOrders > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  {stats.pendingOrders} {t('vendor.store.statistics.pending')}
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.totalOrders)}
            </div>
            <div className="text-sm text-gray-600">{t('vendor.store.statistics.totalOrders')}</div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="text-sm text-gray-600">{t('vendor.store.statistics.totalRevenue')}</div>
          </div>

          
        </div>

        {/* Simple Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('vendor.store.quickActions.title')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/vendor/products"
              className="bg-white rounded-lg p-5 border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <Edit className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="font-medium text-gray-900 mb-1">{t('vendor.store.quickActions.manageProducts')}</div>
              <div className="text-sm text-gray-500">{t('vendor.store.quickActions.manageProductsDescription')}</div>
            </Link>

            <Link
              to="/vendor/categories"
              className="bg-white rounded-lg p-5 border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <Layers className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="font-medium text-gray-900 mb-1">{t('vendor.store.quickActions.manageCategories')}</div>
              <div className="text-sm text-gray-500">{t('vendor.store.quickActions.manageCategoriesDescription')}</div>
            </Link>

            <Link
              to="/vendor/orders"
              className="bg-white rounded-lg p-5 border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
            >
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div className="font-medium text-gray-900 mb-1">{t('vendor.store.quickActions.viewOrders')}</div>
              <div className="text-sm text-gray-500">{t('vendor.store.quickActions.viewOrdersDescription')}</div>
            </Link>

            <Link
              to="/vendor/analytics"
              className="bg-white rounded-lg p-5 border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="font-medium text-gray-900 mb-1">{t('vendor.store.quickActions.analytics')}</div>
              <div className="text-sm text-gray-500">{t('vendor.store.quickActions.analyticsDescription')}</div>
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Info Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Store className="h-5 w-5 mr-2 text-indigo-600" />
                  {t('vendor.store.storeOverview.title')}
                </h2>
                <Link
                  to="/vendor/settings"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                  {t('vendor.store.storeOverview.edit')} <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  {store.storeDescription || (
                    <span className="text-gray-400 italic">{t('vendor.store.storeOverview.descriptionFallback')}</span>
                  )}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-gray-500 mb-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-xs">{t('vendor.store.storeOverview.addressLabel')}</span>
                    </div>
                    <p className="text-gray-900 font-medium">{store.storeAddress || t('vendor.store.storeOverview.notSet')}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-gray-500 mb-1">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-xs">{t('vendor.store.storeOverview.contactLabel')}</span>
                    </div>
                    <p className="text-gray-900 font-medium">{store.storePhone || t('vendor.store.storeOverview.notSet')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-indigo-600" />
                  {t('vendor.store.recentProducts.title')}
                </h2>
                <Link
                  to="/vendor/products"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                  {t('vendor.store.recentProducts.viewAll')} ({stats.totalProducts})
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-3">{t('vendor.store.recentProducts.emptyCatalogTitle')}</p>
                  <Link
                    to="/vendor/products"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('vendor.store.recentProducts.addFirstProduct')}
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {products.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {product.imageUrls?.[0] ? (
                            <img 
                              src={product.imageUrls[0]} 
                              alt={product.productName || product.name}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 truncate">
                            {product.productName || product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-900 font-medium">
                              {formatCurrency(product.price || 0)}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              (product.quantity || product.stock || 0) > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {(product.quantity || product.stock || 0)} {t('vendor.store.productQuantityLeftSuffix')}
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

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-indigo-600" />
                  {t('vendor.store.recentOrders.title')}
                </h2>
                <Link
                  to="/vendor/orders"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                  {t('vendor.store.recentOrders.viewAll')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-6">
                  <ShoppingBag className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">{t('vendor.store.recentOrders.emptyTitle')}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('vendor.store.recentOrders.emptySubtext')}</p>
                </div>
              ) : (
                <div className="space-y-3">
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
                        className="block border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            #{order.orderNumber || order.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
                              {t(`vendor.store.orderStatus.${status}`, { defaultValue: status })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.totalPrice || order.total || order.amount || 0)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
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

export default VendorStore;