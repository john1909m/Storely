// Vendor Analytics Dashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users,
  Package, Truck, CheckCircle, XCircle, Clock, AlertCircle,
  ArrowLeft, Calendar, Download, RefreshCw, BarChart,
  PieChart, LineChart, Activity, Target, Award,
  Zap, Shield, CreditCard, MapPin, Mail, Phone,
  ChevronDown, ChevronUp, Filter, Search, Eye,
  Printer, FileText, Percent, Star, ThumbsUp,ArrowRight ,
  Smartphone, Laptop, Globe, ShoppingCart, Sparkles,
  Lock, Crown, Rocket, Gift, TrendingUp as TrendUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderAPI } from '../../api/order.api';
import { productAPI } from '../../api/product.api';
import { customerAPI } from '../../api/customer.api';
import { subscriptionAPI } from '../../api/subscription.api';
import { storeAPI } from '../../api/store.api';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const VendorAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [analyticsData, setAnalyticsData] = useState({
    orders: [],
    products: [],
    customers: [],
    revenue: 0,
    topProducts: [],
    recentOrders: [],
    salesByDay: [],
    categoryDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAnalyticsAccess, setHasAnalyticsAccess] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [store, setStore] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const { vendor } = useAuth();
  const navigate = useNavigate();
    const { handleError } = useErrorHandler();

  useEffect(() => {
    if (vendor?.id) {
      checkAnalyticsAccess();
      fetchStoreData();
    }
  }, [vendor]);

  useEffect(() => {
    if (hasAnalyticsAccess && store?.id) {
      fetchAnalyticsData();
    }
  }, [hasAnalyticsAccess, store, timeRange, dateRange]);

  const checkAnalyticsAccess = async () => {
    try {
      setIsLoading(true);
      // Fetch vendor's subscription
      const vendorSubscription = await subscriptionAPI.getVendorSubscriptionByVendorId(vendor.id);
      setSubscription(vendorSubscription);
      
      // Check if analytics is enabled
      if (vendorSubscription) {
        // Check if analytics is explicitly true or if it's a pro/business plan
        const hasAnalytics = 
          vendorSubscription.analytics === true || 
          vendorSubscription.planName?.toLowerCase().includes('pro') ||
          vendorSubscription.planName?.toLowerCase().includes('business') ||
          vendorSubscription.planName?.toLowerCase().includes('enterprise');
        
        setHasAnalyticsAccess(hasAnalytics);
      } else {
        setHasAnalyticsAccess(false);
      }
    } catch (err) {
      handleError(err);
      setHasAnalyticsAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStoreData = async () => {
    try {
      // Fetch vendor's store
      const vendorStores = await storeAPI.getByVendorId(vendor.id);
      const vendorStore = Array.isArray(vendorStores) ? vendorStores[0] : vendorStores;
      setStore(vendorStore);
    } catch (err) {
      handleError(err);
      
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch orders
      const storeOrders = await orderAPI.getByStore(store.id);
      const ordersList = Array.isArray(storeOrders) ? storeOrders : [];
      
      // Fetch products
      const storeProducts = await productAPI.getAll(store.id);
      const productsList = Array.isArray(storeProducts) ? storeProducts : [];
      
      // Filter orders by date range
      const filteredOrders = filterOrdersByDateRange(ordersList, dateRange);
      
      // Fetch customers for orders
      const customersMap = await fetchCustomersData(filteredOrders);
      
      // Calculate analytics
      const analytics = calculateAnalytics(
        filteredOrders,
        productsList,
        customersMap,
        ordersList,
        dateRange
      );
      
      setAnalyticsData(analytics);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrdersByDateRange = (orders, range) => {
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);
    endDate.setHours(23, 59, 59, 999);
    
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate || order.createdAt || order.date);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const fetchCustomersData = async (orders) => {
    const customerIds = [...new Set(orders.map(o => o.customerId).filter(Boolean))];
    const customerMap = {};
    
    // Fetch in batches to avoid too many requests
    const batchSize = 5;
    for (let i = 0; i < customerIds.length; i += batchSize) {
      const batch = customerIds.slice(i, i + batchSize);
      await Promise.all(batch.map(async (id) => {
        try {
          const customer = await customerAPI.getById(id);
          if (customer) {
            customerMap[id] = customer;
          }
        } catch (err) {
          handleError(err);
        }
      }));
    }
    
    return customerMap;
  };

  const calculateAnalytics = (orders, products, customersMap, allOrders, dateRange) => {
    // Basic metrics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => 
      sum + (order.totalPrice || order.total || order.amount || 0), 0
    );
    
    const totalProducts = products.length;
    const totalCustomers = Object.keys(customersMap).length;
    
    // Order status breakdown
    const orderStatusBreakdown = {
      pending: orders.filter(o => (o.orderStatus || o.status)?.toUpperCase() === 'PENDING').length,
      confirmed: orders.filter(o => (o.orderStatus || o.status)?.toUpperCase() === 'CONFIRMED').length,
      shipped: orders.filter(o => (o.orderStatus || o.status)?.toUpperCase() === 'SHIPPED').length,
      delivered: orders.filter(o => (o.orderStatus || o.status)?.toUpperCase() === 'DELIVERED').length,
      cancelled: orders.filter(o => (o.orderStatus || o.status)?.toUpperCase() === 'CANCELLED').length
    };
    
    // Payment method breakdown
    const paymentMethods = {};
    orders.forEach(order => {
      const method = order.paymentMethod || 'Cash on Delivery';
      paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });
    
    // Average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Top products
    const productSales = {};
    orders.forEach(order => {
      const items = order.items || order.orderItems || [];
      items.forEach(item => {
        const productId = item.productId || item.id;
        const productName = item.productName || item.name || `Product ${productId}`;
        const quantity = item.quantity || 1;
        const revenue = (item.price || 0) * quantity;
        
        if (!productSales[productId]) {
          productSales[productId] = {
            id: productId,
            name: productName,
            quantity: 0,
            revenue: 0,
            image: item.image
          };
        }
        productSales[productId].quantity += quantity;
        productSales[productId].revenue += revenue;
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    // Sales by day
    const salesByDay = {};
    orders.forEach(order => {
      const date = new Date(order.orderDate || order.createdAt || order.date);
      const day = date.toISOString().split('T')[0];
      
      if (!salesByDay[day]) {
        salesByDay[day] = {
          date: day,
          revenue: 0,
          orders: 0,
          items: 0
        };
      }
      
      const orderTotal = order.totalPrice || order.total || order.amount || 0;
      salesByDay[day].revenue += orderTotal;
      salesByDay[day].orders += 1;
      
      const items = order.items || order.orderItems || [];
      salesByDay[day].items += items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    });
    
    // Category distribution
    const categoryDistribution = {};
    products.forEach(product => {
      const category = product.category?.name || product.category || 'Uncategorized';
      if (!categoryDistribution[category]) {
        categoryDistribution[category] = {
          count: 0,
          revenue: 0
        };
      }
      categoryDistribution[category].count += 1;
    });
    
    // Calculate revenue by category from orders
    orders.forEach(order => {
      const items = order.items || order.orderItems || [];
      items.forEach(item => {
        const product = products.find(p => 
          p.id === item.productId || p.name === item.productName
        );
        if (product) {
          const category = product.category?.name || product.category || 'Uncategorized';
          if (categoryDistribution[category]) {
            categoryDistribution[category].revenue += (item.price || 0) * (item.quantity || 1);
          }
        }
      });
    });
    
    // Growth metrics (compare with previous period)
    const previousPeriodStart = new Date(dateRange.start);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);
    const previousPeriodEnd = new Date(dateRange.start);
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
    
    const previousOrders = allOrders.filter(order => {
      const orderDate = new Date(order.orderDate || order.createdAt || order.date);
      return orderDate >= previousPeriodStart && orderDate <= previousPeriodEnd;
    });
    
    const previousRevenue = previousOrders.reduce((sum, order) => 
      sum + (order.totalPrice || order.total || order.amount || 0), 0
    );
    
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : totalRevenue > 0 ? 100 : 0;
    
    const orderGrowth = previousOrders.length > 0
      ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100
      : totalOrders > 0 ? 100 : 0;
    
    // Customer metrics
    const returningCustomers = orders.reduce((acc, order) => {
      if (customersMap[order.customerId]?.orderCount > 1) {
        return acc + 1;
      }
      return acc;
    }, 0);
    
    const customerRetentionRate = totalCustomers > 0 
      ? (returningCustomers / totalCustomers) * 100 
      : 0;
    
    // Conversion rate (assuming 1000 visits per day average)
    const estimatedVisits = 30 * 1000;
    const conversionRate = estimatedVisits > 0 ? (totalOrders / estimatedVisits) * 100 : 0;
    
    return {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      averageOrderValue,
      orderStatusBreakdown,
      paymentMethods,
      topProducts,
      salesByDay: Object.values(salesByDay).sort((a, b) => a.date.localeCompare(b.date)),
      categoryDistribution: Object.entries(categoryDistribution).map(([category, data]) => ({
        category,
        count: data.count,
        revenue: data.revenue
      })),
      revenueGrowth,
      orderGrowth,
      customerRetentionRate,
      returningCustomers,
      conversionRate,
      recentOrders: orders
        .sort((a, b) => new Date(b.orderDate || b.createdAt || b.date) - new Date(a.orderDate || a.createdAt || a.date))
        .slice(0, 10)
    };
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    
    const end = new Date();
    let start = new Date();
    
    switch (range) {
      case '7days':
        start.setDate(start.getDate() - 7);
        break;
      case '30days':
        start.setDate(start.getDate() - 30);
        break;
      case '90days':
        start.setDate(start.getDate() - 90);
        break;
      case '12months':
        start.setMonth(start.getMonth() - 12);
        break;
      default:
        break;
    }
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value || 0);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
            <BarChart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-600" />
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Loading Analytics Dashboard</p>
          <p className="text-gray-500">Please wait while we crunch the numbers...</p>
        </div>
      </div>
    );
  }

  // No Analytics Access State
  if (!hasAnalyticsAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/vendor/dashboard"
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
                <p className="text-gray-600">Advanced insights and performance metrics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Required */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Hero Upgrade Card */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden mb-8 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="relative p-12 text-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <div className="inline-flex items-center justify-center h-24 w-24 bg-white/20 backdrop-blur-lg rounded-3xl mb-8 ring-4 ring-white/30">
                    <Lock className="h-12 w-12 text-white" />
                  </div>
                  
                  <h2 className="text-5xl font-bold text-white mb-4">
                    Analytics Locked
                  </h2>
                  
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Your current plan doesn't include access to advanced analytics. 
                    Upgrade to unlock powerful insights and grow your business.
                  </p>
                  
                  {/* Features Grid */}
                  <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left border border-white/20">
                      <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        <TrendUp className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Sales Analytics</h3>
                      <p className="text-white/70 text-sm">Track revenue, orders, and growth trends in real-time</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left border border-white/20">
                      <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Customer Insights</h3>
                      <p className="text-white/70 text-sm">Understand behavior, retention, and lifetime value</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left border border-white/20">
                      <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Product Performance</h3>
                      <p className="text-white/70 text-sm">Identify top sellers and optimize your inventory</p>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      to="/vendor/pricing"
                      className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 text-lg font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
                    >
                      <Rocket className="h-5 w-5 mr-2" />
                      Upgrade Now
                    </Link>
                    
                    <Link
                      to="/vendor/dashboard"
                      className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Subscription Card */}
            
          </div>
        </div>
      </div>
    );
  }

  // Main Analytics Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/vendor/dashboard"
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <BarChart className="h-8 w-8 mr-3 text-indigo-600" />
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Time Range Selector */}
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer hover:border-indigo-300 transition-colors"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="12months">Last 12 Months</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              
              <button
                onClick={fetchAnalyticsData}
                className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <RefreshCw className="h-5 w-5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 animate-slide-down">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-3 text-red-600" />
                <span className="font-medium">{error}</span>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="text-red-800 hover:text-red-900"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="h-14 w-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
              <div className={`flex items-center px-3 py-1.5 rounded-full ${
                analyticsData.revenueGrowth >= 0 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {analyticsData.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-bold">
                  {formatPercentage(Math.abs(analyticsData.revenueGrowth))}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(analyticsData.totalRevenue)}
            </div>
            <div className="text-gray-600 font-medium">Total Revenue</div>
            <div className="text-sm text-gray-500 mt-3 flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Avg: {formatCurrency(analyticsData.averageOrderValue)} per order
            </div>
          </div>
          
          {/* Orders Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-7 w-7 text-blue-600" />
              </div>
              <div className={`flex items-center px-3 py-1.5 rounded-full ${
                analyticsData.orderGrowth >= 0 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {analyticsData.orderGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-bold">
                  {formatPercentage(Math.abs(analyticsData.orderGrowth))}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(analyticsData.totalOrders)}
            </div>
            <div className="text-gray-600 font-medium">Total Orders</div>
            <div className="text-sm text-gray-500 mt-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              {analyticsData.orderStatusBreakdown?.delivered || 0} delivered
            </div>
          </div>
          
          {/* Customers Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="h-14 w-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
              <div className="bg-green-50 text-green-700 flex items-center px-3 py-1.5 rounded-full">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm font-bold">
                  {formatPercentage(analyticsData.customerRetentionRate)}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(analyticsData.totalCustomers)}
            </div>
            <div className="text-gray-600 font-medium">Total Customers</div>
            <div className="text-sm text-gray-500 mt-3 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {analyticsData.returningCustomers || 0} returning
            </div>
          </div>
          
          {/* Products Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="h-14 w-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                <Package className="h-7 w-7 text-amber-600" />
              </div>
              <div className="bg-blue-50 text-blue-700 flex items-center px-3 py-1.5 rounded-full">
                <Target className="h-4 w-4 mr-1" />
                <span className="text-sm font-bold">
                  {formatPercentage(analyticsData.conversionRate)}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(analyticsData.totalProducts)}
            </div>
            <div className="text-gray-600 font-medium">Products</div>
            <div className="text-sm text-gray-500 mt-3 flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              {analyticsData.topProducts?.length || 0} top performers
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <LineChart className="h-6 w-6 mr-2 text-indigo-600" />
                Revenue Trend
              </h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
                <option value="items">Items Sold</option>
              </select>
            </div>
            
            <div className="h-80 flex items-end justify-between gap-2">
              {analyticsData.salesByDay?.slice(-14).map((day, index) => {
                const maxValue = Math.max(...analyticsData.salesByDay.map(d => 
                  selectedMetric === 'revenue' ? d.revenue : 
                  selectedMetric === 'orders' ? d.orders : d.items
                ), 1);
                
                // const value = selectedMetric === 'revenue' ? d.revenue :
                //              selectedMetric === 'orders' ? d.orders : d.items;
                
                const value = selectedMetric === 'revenue' ? day.revenue : 
                              selectedMetric === 'orders' ? day.orders : day.items;
                const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                
                // Color gradient based on value
                const getBarColor = () => {
                  if (selectedMetric === 'revenue') {
                    return index % 2 === 0 
                      ? 'from-indigo-500 to-indigo-600' 
                      : 'from-purple-500 to-purple-600';
                  } else if (selectedMetric === 'orders') {
                    return 'from-blue-500 to-blue-600';
                  } else {
                    return 'from-green-500 to-green-600';
                  }
                };
                
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full flex justify-center">
                      <div 
                        className={`w-full max-w-[40px] bg-gradient-to-t ${getBarColor()} rounded-t-lg group-hover:from-indigo-600 group-hover:to-purple-600 transition-all cursor-pointer shadow-lg`}
                        style={{ height: `${Math.max(height, 4)}%`, minHeight: '4px' }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                          {selectedMetric === 'revenue' ? formatCurrency(value) : 
                           selectedMetric === 'orders' ? `${value} orders` : `${value} items`}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2 font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {analyticsData.salesByDay?.length === 0 && (
              <div className="h-80 flex flex-col items-center justify-center text-gray-500">
                <BarChart className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium">No sales data available</p>
                <p className="text-sm">Try adjusting your date range</p>
              </div>
            )}
          </div>

          {/* Order Status Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <PieChart className="h-6 w-6 mr-2 text-indigo-600" />
              Order Status Breakdown
            </h3>
            
            <div className="space-y-5">
              {[
                { key: 'pending', label: 'Pending', color: 'bg-yellow-400', count: analyticsData.orderStatusBreakdown?.pending || 0 },
                { key: 'confirmed', label: 'Confirmed', color: 'bg-purple-400', count: analyticsData.orderStatusBreakdown?.confirmed || 0 },
                { key: 'shipped', label: 'Shipped', color: 'bg-blue-400', count: analyticsData.orderStatusBreakdown?.shipped || 0 },
                { key: 'delivered', label: 'Delivered', color: 'bg-green-400', count: analyticsData.orderStatusBreakdown?.delivered || 0 },
                { key: 'cancelled', label: 'Cancelled', color: 'bg-red-400', count: analyticsData.orderStatusBreakdown?.cancelled || 0 }
              ].map((status) => (
                <div key={status.key} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 ${status.color} rounded-full mr-2 group-hover:scale-110 transition-transform`}></div>
                      <span className="text-gray-700 font-medium">{status.label}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-gray-900">{status.count}</span>
                      <span className="text-sm text-gray-500 w-16 text-right font-medium">
                        {analyticsData.totalOrders > 0 
                          ? `${((status.count / analyticsData.totalOrders) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${status.color} transition-all duration-500 group-hover:scale-x-105`}
                      style={{ 
                        width: analyticsData.totalOrders > 0 
                          ? `${(status.count / analyticsData.totalOrders) * 100}%`
                          : '0%',
                        transformOrigin: 'left'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-lg">Total Orders</span>
                  <span className="font-bold text-2xl text-indigo-600">
                    {analyticsData.totalOrders || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products & Categories */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Selling Products */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              Top Selling Products
            </h3>
            
            {analyticsData.topProducts?.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 p-3 rounded-xl transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                        #{index + 1}
                      </div>
                      <div className="h-14 w-14 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                            <Package className="h-6 w-6 text-indigo-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          {product.quantity} units sold
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">
                        {formatCurrency(product.revenue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {analyticsData.totalRevenue > 0 
                          ? `${((product.revenue / analyticsData.totalRevenue) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="h-20 w-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-lg font-medium">No product sales data</p>
                <p className="text-sm">Start selling to see your top products</p>
              </div>
            )}
            
            {analyticsData.topProducts?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link 
                  to="/vendor/products"
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center justify-center group"
                >
                  View all products 
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <PieChart className="h-6 w-6 mr-2 text-indigo-600" />
              Category Performance
            </h3>
            
            {analyticsData.categoryDistribution?.length > 0 ? (
              <div className="space-y-5">
                {analyticsData.categoryDistribution
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((category, index) => {
                    const colors = [
                      { bar: 'bg-indigo-500', dot: 'bg-indigo-500', text: 'text-indigo-600' },
                      { bar: 'bg-purple-500', dot: 'bg-purple-500', text: 'text-purple-600' },
                      { bar: 'bg-pink-500', dot: 'bg-pink-500', text: 'text-pink-600' },
                      { bar: 'bg-green-500', dot: 'bg-green-500', text: 'text-green-600' },
                      { bar: 'bg-orange-500', dot: 'bg-orange-500', text: 'text-orange-600' }
                    ];
                    
                    return (
                      <div key={category.category} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`h-3 w-3 ${colors[index].dot} rounded-full mr-2 group-hover:scale-110 transition-transform`}></div>
                            <span className="text-gray-700 font-medium">{category.category}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-bold text-gray-900">{formatCurrency(category.revenue)}</span>
                            <span className={`text-sm font-medium w-16 text-right ${colors[index].text}`}>
                              {analyticsData.totalRevenue > 0 
                                ? `${((category.revenue / analyticsData.totalRevenue) * 100).toFixed(1)}%`
                                : '0%'
                              }
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full ${colors[index].bar} transition-all duration-500 group-hover:scale-x-105`}
                            style={{ 
                              width: analyticsData.totalRevenue > 0 
                                ? `${(category.revenue / analyticsData.totalRevenue) * 100}%`
                                : '0%',
                              transformOrigin: 'left'
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>{category.count} products</span>
                          <span>{formatCurrency(category.revenue / (category.count || 1))} avg</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="h-20 w-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PieChart className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-lg font-medium">No category data</p>
                <p className="text-sm">Add categories to your products</p>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">Total Products</span>
                <span className="font-bold text-lg text-indigo-600">
                  {analyticsData.totalProducts || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-indigo-600" />
              Recent Orders
            </h3>
            <Link 
              to="/vendor/orders"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center group"
            >
              View all orders
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {analyticsData.recentOrders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="p-4 text-left text-gray-700 font-semibold text-sm rounded-l-lg">Order ID</th>
                    <th className="p-4 text-left text-gray-700 font-semibold text-sm">Date</th>
                    <th className="p-4 text-left text-gray-700 font-semibold text-sm">Customer</th>
                    <th className="p-4 text-left text-gray-700 font-semibold text-sm">Items</th>
                    <th className="p-4 text-left text-gray-700 font-semibold text-sm">Total</th>
                    <th className="p-4 text-left text-gray-700 font-semibold text-sm rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.recentOrders.map((order) => {
                    const status = order.orderStatus || order.status || 'PENDING';
                    const statusColors = {
                      PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                      CONFIRMED: 'bg-blue-100 text-blue-800 border border-blue-200',
                      SHIPPED: 'bg-purple-100 text-purple-800 border border-purple-200',
                      DELIVERED: 'bg-green-100 text-green-800 border border-green-200',
                      CANCELLED: 'bg-red-100 text-red-800 border border-red-200'
                    };
                    
                    return (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-colors">
                        <td className="p-4 font-medium text-indigo-600">
                          #{order.orderNumber || order.id.slice(-8)}
                        </td>
                        <td className="p-4 text-gray-700">
                          {new Date(order.orderDate || order.createdAt || order.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-gray-700">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                            Customer #{order.customerId?.slice(-6) || 'N/A'}
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 text-gray-400 mr-2" />
                            {(order.items || order.orderItems || []).length} items
                          </div>
                        </td>
                        <td className="p-4 font-bold text-gray-900">
                          {formatCurrency(order.totalPrice || order.total || order.amount || 0)}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="h-20 w-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">Orders will appear here once customers start buying</p>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-indigo-600" />
            Payment Methods
          </h3>
          
          {Object.keys(analyticsData.paymentMethods || {}).length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(analyticsData.paymentMethods).map(([method, count], index) => {
                const colors = [
                  'bg-gradient-to-br from-indigo-500 to-indigo-600',
                  'bg-gradient-to-br from-purple-500 to-purple-600',
                  'bg-gradient-to-br from-pink-500 to-pink-600',
                  'bg-gradient-to-br from-green-500 to-green-600'
                ];
                
                return (
                  <div key={method} className={`${colors[index % colors.length]} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all`}>
                    <div className="text-3xl font-bold mb-2">{count}</div>
                    <div className="text-white/90 font-medium mb-3">{method}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">Orders</span>
                      <span className="text-white font-bold">
                        {analyticsData.totalOrders > 0 
                          ? `${((count / analyticsData.totalOrders) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </span>
                    </div>
                    <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                      <div 
                        className="bg-white h-1.5 rounded-full"
                        style={{ 
                          width: analyticsData.totalOrders > 0 
                            ? `${(count / analyticsData.totalOrders) * 100}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">No payment data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};



export default VendorAnalytics;