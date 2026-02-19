// Admin Manage Stores - Real data from APIs
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Eye, Edit, Pause, Store, MapPinHouse,
  Play, Trash2, Users, TrendingUp, ChevronDown,
  AlertCircle, CheckCircle, XCircle, ArrowLeft,
  Mail, Phone, Calendar, Globe, Package, ShoppingBag,
  User, Shield, CreditCard, MapPin, DollarSign,
  CalendarDays, RefreshCw, Check, X, BarChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { storeAPI } from '../../api/store.api';
import { vendorAPI } from '../../api/vendor.api';
import { pricingAPI } from '../../api/pricing.api';
import { subscriptionAPI } from '../../api/subscription.api';
import useAuthStore from '../../store/authStore';

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [vendors, setVendors] = useState({});
  const [subscriptions, setSubscriptions] = useState({});
  const [plans, setPlans] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  
  // Modal states
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [subscriptionForm, setSubscriptionForm] = useState({
    planId: '',
    planName: '',
    billingCycle: 'monthly',
    autoRenew: true,
    startDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    analytics: 1 // Added analytics checkbox with default true
  });
  
  const navigate = useNavigate();
    const {authInialized,isAuthenticated} = useAuthStore();


  useEffect(() => {
    if(!authInialized){
      return;
    }
    fetchStores();
    fetchPlans();
  }, [authInialized]);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const storesData = await storeAPI.getAll();
      const storesList = Array.isArray(storesData) ? storesData : [];
      setStores(storesList);

      // Fetch vendors for all stores
      await fetchVendors(storesList);
      
    } catch (err) {
      setError(err.message || 'Failed to load stores');
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVendors = async (storesList) => {
    const vendorMap = {};
    const vendorIds = [...new Set(storesList.map(s => s.vendorId).filter(Boolean))];
    
    for (const vendorId of vendorIds) {
      try {
        const vendor = await vendorAPI.getById(vendorId);
        if (vendor) {
          vendorMap[vendorId] = vendor;
        }
      } catch (err) {
        console.error('Error fetching vendor:', err);
      }
    }
    
    setVendors(vendorMap);
    
    // Fetch subscriptions for vendors
    await fetchVendorSubscriptions(vendorIds, vendorMap);
  };

  const fetchVendorSubscriptions = async (vendorIds, vendorMap) => {
    const subscriptionMap = {};
    
    for (const vendorId of vendorIds) {
      try {
        const subscription = await subscriptionAPI.getVendorSubscriptionByVendorId(vendorId);
        if (subscription) {
          subscriptionMap[vendorId] = subscription;
        }
      } catch (err) {
        console.error(`Error fetching subscription for vendor ${vendorId}:`, err);
      }
    }
    
    setSubscriptions(subscriptionMap);
  };

  const fetchPlans = async () => {
    try {
      const plansData = await pricingAPI.getPlans();
      setPlans(Array.isArray(plansData) ? plansData : []);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const toggleRowExpansion = (storeId) => {
    setExpandedRows(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  const handleStatusUpdate = async (storeId, newStatus) => {
    try {
      const store = stores.find(s => s.id === storeId);
      if (!store) return;

      const updatedStore = {
        ...store,
        storeStatus: newStatus,
      };

      await storeAPI.update(updatedStore);
      
      setStores(stores.map(s => s.id === storeId ? updatedStore : s));
    } catch (err) {
      alert(`Failed to update store status: ${err.message}`);
    }
  };

  const handleDelete = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      return;
    }

    try {
      await storeAPI.delete(storeId);
      setStores(stores.filter(s => s.id !== storeId));
      setExpandedRows(prev => prev.filter(id => id !== storeId));
    } catch (err) {
      alert(`Failed to delete store: ${err.message}`);
    }
  };

  const openSubscriptionModal = (vendor, store) => {
    setSelectedVendor({ ...vendor, store });
    
    // Find vendor's current subscription if exists
    const currentSubscription = subscriptions[vendor.id];
    
    if (currentSubscription) {
      // Editing existing subscription
      setSubscriptionForm({
        planId: currentSubscription.planId || '',
        planName: currentSubscription.planName || '',
        billingCycle: currentSubscription.billingCycle || 'monthly',
        autoRenew: currentSubscription.autoRenew || true,
        startDate: currentSubscription.startDate ? 
          new Date(currentSubscription.startDate).toISOString().split('T')[0] : 
          new Date().toISOString().split('T')[0],
        status: currentSubscription.status || 'ACTIVE',
        analytics: currentSubscription.analytics !== undefined ? currentSubscription.analytics : 1 // Use existing value or default to true
      });
    } else {
      // Creating new subscription
      const productCount = store?.products?.length || 0;
      let suggestedPlan = plans[0];
      
      if (plans.length > 0) {
        if (productCount > 100) {
          suggestedPlan = plans.find(p => p.name.toLowerCase().includes('business')) || plans[2] || plans[0];
        } else if (productCount > 50) {
          suggestedPlan = plans.find(p => p.name.toLowerCase().includes('pro')) || plans[1] || plans[0];
        } else {
          suggestedPlan = plans.find(p => p.name.toLowerCase().includes('basic')) || plans[0];
        }
      }
      
      setSubscriptionForm({
        planId: suggestedPlan?.id || '',
        planName: suggestedPlan?.name || '',
        billingCycle: 'monthly',
        autoRenew: true,
        startDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        analytics: true // Default to true for new subscriptions
      });
    }
    
    setShowSubscriptionModal(true);
  };

  const calculateEndDate = (startDate, billingCycle) => {
    const start = new Date(startDate);
    if (billingCycle === 'monthly') {
      start.setMonth(start.getMonth() + 1);
    } else {
      start.setFullYear(start.getFullYear() + 1);
    }
    return start.toISOString().split('T')[0];
  };

  const handleSubscriptionAction = async () => {
    try {
      if (!selectedVendor || !subscriptionForm.planId) {
        alert('Please select a plan');
        return;
      }

      const endDate = calculateEndDate(subscriptionForm.startDate, subscriptionForm.billingCycle);
      
      const subscriptionData = {
        vendorId: selectedVendor.id,
        planId: subscriptionForm.planId,
        planName: subscriptionForm.planName,
        billingCycle: subscriptionForm.billingCycle,
        startDate: subscriptionForm.startDate,
        endDate: endDate,
        autoRenew: subscriptionForm.autoRenew,
        status: subscriptionForm.status,
        analytics: subscriptionForm.analytics // Added analytics field
      };

      const currentSubscription = subscriptions[selectedVendor.id];
      
     
      
      let result;
      if (currentSubscription) {
        // Update existing subscription
         const updatedSubscription = {
        ...subscriptionData,
        id: subscriptions[selectedVendor.id]?.id || undefined
      }
      console.log('Updating subscription with data:', updatedSubscription);
        result = await subscriptionAPI.updateVendorSubscription(updatedSubscription);
      } else {
        // Create new subscription
        result = await subscriptionAPI.addVendorSubscription(subscriptionData);
      }
      
      if (result) {
        // Update local state
        setSubscriptions(prev => ({
          ...prev,
          [selectedVendor.id]: {
            ...subscriptionData,
            id: result.id || currentSubscription?.id || Date.now(),
            createdAt: result.createdAt || new Date().toISOString()
          }
        }));
        
        setShowSubscriptionModal(false);
        setSelectedVendor(null);
        await fetchVendorSubscriptions([selectedVendor.id], {});

      }
    } catch (err) {
      alert(`Failed to ${subscriptions[selectedVendor.id] ? 'update' : 'create'} subscription: ${err.message}`);
    }
  };

  const handleCancelSubscription = async (vendorId) => {
    const subscription = subscriptions[vendorId];
    if (!subscription || !window.confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      await subscriptionAPI.cancel(subscription.id);
      
      // Update local state
      setSubscriptions(prev => ({
        ...prev,
        [vendorId]: {
          ...subscription,
          status: 'CANCELLED',
          autoRenew: false
        }
      }));
      
      alert('Subscription cancelled successfully!');
    } catch (err) {
      alert(`Failed to cancel subscription: ${err.message}`);
    }
  };

  const getStatusConfig = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'ACTIVE': return { 
        color: 'bg-green-100 text-green-800 border border-green-200',
        icon: CheckCircle, 
        label: 'Active',
        bgColor: 'bg-green-50'
      };
      case 'INACTIVE': return { 
        color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        icon: AlertCircle, 
        label: 'Inactive',
        bgColor: 'bg-yellow-50'
      };
      default: return { 
        color: 'bg-gray-100 text-gray-800 border border-gray-200',
        icon: Pause, 
        label: 'Inactive',
        bgColor: 'bg-gray-50'
      };
    }
  };

  const getSubscriptionStatusConfig = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'ACTIVE': return { 
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle, 
        label: 'Active'
      };
      case 'PENDING': return { 
        color: 'bg-yellow-100 text-yellow-800',
        icon: AlertCircle, 
        label: 'Pending'
      };
      case 'CANCELLED': return { 
        color: 'bg-red-100 text-red-800',
        icon: XCircle, 
        label: 'Cancelled'
      };
      case 'EXPIRED': return { 
        color: 'bg-gray-100 text-gray-800',
        icon: Clock, 
        label: 'Expired'
      };
      default: return { 
        color: 'bg-gray-100 text-gray-800',
        icon: AlertCircle, 
        label: 'Unknown'
      };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const stats = {
    total: stores.length,
    active: stores.filter(s => s.storeStatus === 'Active').length,
    inactive: stores.filter(s => s.storeStatus === 'Inactive').length,
    subscribed: Object.keys(subscriptions).length,
    unsubscribed: stores.length - Object.keys(subscriptions).length
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = !searchQuery || 
      (store.storeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendors[store.vendorId]?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
      store.storeStatus?.toUpperCase() === selectedStatus.toUpperCase();
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Management</h1>
                <p className="text-gray-600">Manage all vendor stores and subscriptions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-gray-600">Total Stores</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.active}</div>
            <div className="text-gray-600">Active Stores</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.subscribed}</div>
            <div className="text-gray-600">Subscribed</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.inactive}</div>
            <div className="text-gray-600">Pending Approval</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stores by name or owner..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stores Table */}
        {filteredStores.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Stores Found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search filters' : 'No stores have been created yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left p-6 font-semibold text-gray-900">Store</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Owner</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Subscription</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Actions</th>
                    <th className="text-left p-6 font-semibold text-gray-900 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStores.map((store) => {
                    const statusConfig = getStatusConfig(store.storeStatus);
                    const StatusIcon = statusConfig.icon;
                    const vendor = vendors[store.vendorId];
                    const subscription = vendor ? subscriptions[vendor.id] : null;
                    const subscriptionConfig = subscription ? getSubscriptionStatusConfig(subscription.status) : null;
                    const isExpanded = expandedRows.includes(store.id);
                    
                    return (
                      <React.Fragment key={store.id}>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                                {store.storeLogoUrl ? (
                                  <img 
                                    src={store.storeLogoUrl} 
                                    alt={store.storeName} 
                                    className="h-full w-full object-cover rounded-xl"
                                  />
                                ) : (
                                  <span className="text-2xl">🏪</span>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{store.storeName}</div>
                                <div className="text-sm text-gray-500">ID: {store.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="font-medium text-gray-900">{vendor?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{vendor?.email || 'N/A'}</div>
                          </td>
                          <td className="p-6">
                            {subscription ? (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${subscriptionConfig.color}`}>
                                    {subscriptionConfig.icon && React.createElement(subscriptionConfig.icon, { className: "h-3 w-3" })}
                                    <span>{subscriptionConfig.label}</span>
                                  </span>
                                  {subscription.planName && (
                                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                      {subscription.planName}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Renews: {formatDate(subscription.endDate)}
                                </div>
                                {subscription.analytics !== undefined && (
                                  <div className="text-xs text-gray-500 flex items-center">
                                    <BarChart className="h-3 w-3 mr-1" />
                                    Analytics: {subscription.analytics ? 'Enabled' : 'Disabled'}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
                                No subscription
                              </div>
                            )}
                          </td>
                          <td className="p-6">
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.color}`}>
                              <StatusIcon className="h-4 w-4 mr-2" />
                              <span>{statusConfig.label}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => navigate(`/store/${store.storeName}`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Store"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => vendor && openSubscriptionModal(vendor, store)}
                                className={`p-2 rounded-lg transition-colors ${
                                  subscription 
                                    ? 'text-purple-600 hover:bg-purple-50' 
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={subscription ? "Manage Subscription" : "Add Subscription"}
                              >
                                <DollarSign className="h-5 w-5" />
                              </button>
                              {store.storeStatus === 'Active' ? (
                                <button
                                  onClick={() => handleStatusUpdate(store.id, 'Inactive')}
                                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                  title="Deactivate"
                                >
                                  <Pause className="h-5 w-5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusUpdate(store.id, 'Active')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Activate"
                                >
                                  <Play className="h-5 w-5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(store.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                          <td className="p-6">
                            <button
                              onClick={() => toggleRowExpansion(store.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </td>
                        </tr>
                        
                        {/* Expanded Details Row */}
                        {isExpanded && (
                          <tr className={statusConfig.bgColor}>
                            <td colSpan="7" className="p-8">
                              <div className="grid md:grid-cols-3 gap-8">
                                {/* Store Details */}
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                    <Store className="h-5 w-5 mr-2 text-indigo-600" />
                                    Store Details
                                  </h3>
                                  <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                      <div className="h-20 w-20 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
                                        {store.storeLogoUrl ? (
                                          <img 
                                            src={store.storeLogoUrl} 
                                            alt={store.storeName} 
                                            className="h-16 w-16 object-cover rounded-lg"
                                          />
                                        ) : (
                                          <span className="text-3xl">🏪</span>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{store.storeName}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{store.storeDescription || 'No description provided'}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                      <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                          <Package className="h-4 w-4 mr-2" />
                                          <span>Products:</span>
                                          <span className="font-medium ml-auto text-gray-900">{store.products?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                          <ShoppingBag className="h-4 w-4 mr-2" />
                                          <span>Orders:</span>
                                          <span className="font-medium ml-auto text-gray-900">{store.orders?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                          <Calendar className="h-4 w-4 mr-2" />
                                          <span>Created:</span>
                                          <span className="font-medium ml-auto text-gray-900">{formatDate(store.createdAt)}</span>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                          <Globe className="h-4 w-4 mr-2" />
                                          <span>Store URL:</span>
                                          <a 
                                            href={`/store/${store.storeName}`}
                                            className="font-medium ml-auto text-blue-600 hover:underline truncate"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            /store/{store.storeName}
                                          </a>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                          <MapPinHouse className="h-4 w-4 mr-2" />
                                          <span>Address:</span>
                                          <span className="font-medium ml-auto text-gray-900 truncate">
                                            {store.storeAddress || 'N/A'}
                                          </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                          <CreditCard className="h-4 w-4 mr-2" />
                                          <span>Payment:</span>
                                          <span className={`font-medium ml-auto px-2 py-0.5 rounded-full text-xs ${
                                            store.paymentSetup 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-red-100 text-red-800'
                                          }`}>
                                            {store.paymentSetup ? 'Setup' : 'Not Setup'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Vendor Details */}
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                    <User className="h-5 w-5 mr-2 text-purple-600" />
                                    Vendor Details
                                  </h3>
                                  <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                      <div className="h-12 w-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
                                        {vendor?.avatarUrl ? (
                                          <img 
                                            src={vendor.avatarUrl} 
                                            alt={vendor.name} 
                                            className="h-10 w-10 object-cover rounded-lg"
                                          />
                                        ) : (
                                          <span className="text-xl">👤</span>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{vendor?.name || 'Unknown Vendor'}</h4>
                                        <p className="text-sm text-gray-600">Vendor ID: {store.vendorId}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-3 pt-4 border-t border-gray-200">
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium mr-2">Email:</span>
                                        <span className="text-gray-900">{vendor?.email || 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium mr-2">Phone:</span>
                                        <span className="text-gray-900">{vendor?.phoneNumber || 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium mr-2">Joined:</span>
                                        <span className="text-gray-900">{formatDate(vendor?.createdAt)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Subscription Details */}
                                <div>
                                  <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                                      Subscription
                                    </h3>
                                    {subscription && (
                                      <button
                                        onClick={() => handleCancelSubscription(vendor.id)}
                                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    )}
                                  </div>
                                  
                                  {subscription ? (
                                    <div className="space-y-4">
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">Status:</span>
                                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${subscriptionConfig.color}`}>
                                            {subscriptionConfig.label}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">Plan:</span>
                                          <span className="font-medium text-gray-900">{subscription.planName}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">Start Date:</span>
                                          <span className="font-medium text-gray-900">{formatDate(subscription.startDate)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">End Date:</span>
                                          <span className="font-medium text-gray-900">{formatDate(subscription.endDate)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">Days Remaining:</span>
                                          <span className={`font-medium ${
                                            getDaysRemaining(subscription.endDate) <= 7 
                                              ? 'text-red-600' 
                                              : 'text-green-600'
                                          }`}>
                                            {getDaysRemaining(subscription.endDate)} days
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">Auto Renew:</span>
                                          <span className={`font-medium ${
                                            subscription.autoRenew ? 'text-green-600' : 'text-gray-600'
                                          }`}>
                                            {subscription.autoRenew ? 'Yes' : 'No'}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">Billing Cycle:</span>
                                          <span className="font-medium text-gray-900">
                                            {subscription.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">Analytics:</span>
                                          <span className={`font-medium flex items-center ${
                                            subscription.analytics ? 'text-green-600' : 'text-gray-600'
                                          }`}>
                                            {subscription.analytics ? 'Enabled' : 'Disabled'}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <div className="pt-4 border-t border-gray-200">
                                        <button
                                          onClick={() => vendor && openSubscriptionModal(vendor, store)}
                                          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                          <RefreshCw className="h-4 w-4" />
                                          <span>Update Subscription</span>
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-8">
                                      <div className="text-yellow-500 text-4xl mb-3">💸</div>
                                      <h4 className="font-semibold text-gray-900 mb-2">No Active Subscription</h4>
                                      <p className="text-sm text-gray-600 mb-4">This vendor doesn't have a subscription plan</p>
                                      <button
                                        onClick={() => vendor && openSubscriptionModal(vendor, store)}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                                      >
                                        Create Subscription
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-gray-600">
                  Showing {filteredStores.length} of {stores.length} stores
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedRows([])}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Collapse All
                  </button>
                  <button
                    onClick={() => setExpandedRows(filteredStores.map(s => s.id))}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Expand All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {subscriptions[selectedVendor.id] ? 'Update' : 'Create'} Subscription
              </h2>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Vendor Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Vendor Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Vendor ID</div>
                    <div className="font-medium">{selectedVendor.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Vendor Name</div>
                    <div className="font-medium">{selectedVendor.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Store</div>
                    <div className="font-medium">{selectedVendor.store?.storeName || 'No store'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Products</div>
                    <div className="font-medium">{selectedVendor.store?.products?.length || 0}</div>
                  </div>
                </div>
              </div>
              
              {/* Plan Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Select Plan</h3>
                {plans.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No plans available
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSubscriptionForm({
                          ...subscriptionForm,
                          planId: plan.id,
                          planName: plan.name
                        })}
                        className={`p-4 border rounded-xl text-left transition-all ${
                          subscriptionForm.planId == plan.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">{plan.name}</div>
                          {plan.popular && (
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          ${plan.price} <span className="text-sm font-normal text-gray-600">/month</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {plan.productLimit === 0 ? 'Unlimited' : plan.productLimit} products
                        </div>
                        {plan.features && plan.features.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            Features: {plan.features.join(', ')}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Subscription Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={subscriptionForm.startDate}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, startDate: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Cycle
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSubscriptionForm({...subscriptionForm, billingCycle: 'monthly'})}
                      className={`px-6 py-3 rounded-xl transition-all ${
                        subscriptionForm.billingCycle === 'monthly'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setSubscriptionForm({...subscriptionForm, billingCycle: 'yearly'})}
                      className={`px-6 py-3 rounded-xl transition-all ${
                        subscriptionForm.billingCycle === 'yearly'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Yearly (Save 16%)
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={subscriptionForm.autoRenew}
                      onChange={(e) => setSubscriptionForm({...subscriptionForm, autoRenew: e.target.checked})}
                      className="h-5 w-5 text-indigo-600 rounded"
                    />
                    <span className="text-gray-700">Auto Renew</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Subscription will automatically renew at the end of the billing period
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={subscriptionForm.status}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, status: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>
              
              {/* Analytics Checkbox */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                <div className="flex items-start">
                  <div className="flex items-center h-6">
                    <input
                      id="analytics"
                      type="checkbox"
                      checked={subscriptionForm.analytics}
                      onChange={(e) => setSubscriptionForm({...subscriptionForm, analytics: e.target.checked})}
                      className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <label htmlFor="analytics" className="font-semibold text-gray-900 flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-indigo-600" />
                      Enable Analytics Dashboard
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Allow this vendor to access detailed analytics, sales reports, customer insights, and performance metrics.
                    </p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Recommended</span>
                      <span className="ml-2">Includes: Sales trends, conversion rates, customer behavior</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Subscription Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{subscriptionForm.planName || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing Cycle:</span>
                    <span className="font-medium">{subscriptionForm.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{subscriptionForm.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">
                      {calculateEndDate(subscriptionForm.startDate, subscriptionForm.billingCycle)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto Renew:</span>
                    <span className="font-medium">{subscriptionForm.autoRenew ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Analytics:</span>
                    <span className={`font-medium flex items-center ${
                      subscriptionForm.analytics ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {subscriptionForm.analytics ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      subscriptionForm.status === 'ACTIVE' ? 'text-green-600' :
                      subscriptionForm.status === 'PENDING' ? 'text-yellow-600' :
                      subscriptionForm.status === 'CANCELLED' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {subscriptionForm.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="px-6 py-3 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubscriptionAction}
                  disabled={!subscriptionForm.planId}
                  className={`px-8 py-3 rounded-xl font-medium ${
                    subscriptionForm.planId
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {subscriptions[selectedVendor.id] ? 'Update' : 'Create'} Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStores;