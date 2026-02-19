// Admin Manage Vendors Page with API Data - FIXED Store Fetching
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, Search, Filter, Eye, Edit, Mail,
  Phone, Calendar, CheckCircle, XCircle, Shield, 
  TrendingUp, Package, Store, MoreVertical, ChevronDown,
  Loader2
} from 'lucide-react';
import { vendorAPI } from '../../api/vendor.api';
import { storeAPI } from '../../api/store.api';
import useAuthStore from '../../store/authStore';

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [stores, setStores] = useState({}); // Map vendorId -> stores array
  const [storeStats, setStoreStats] = useState({}); // Map vendorId -> stats
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStores, setIsLoadingStores] = useState({}); // Track loading per vendor
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedRows, setExpandedRows] = useState([]);
  const navigate = useNavigate();
    const {authInialized,isAuthenticated} = useAuthStore();


  useEffect(() => {
    if(!authInialized){
      navigate('/login');
      return;
    }
    fetchVendors();
  }, [authInialized]);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch vendors
      const vendorsData = await vendorAPI.getAll();
      const vendorsList = Array.isArray(vendorsData) ? vendorsData : [];
      setVendors(vendorsList);

      // Initialize loading states
      const loadingStates = {};
      vendorsList.forEach(vendor => {
        loadingStates[vendor.id] = true;
      });
      setIsLoadingStores(loadingStates);

      // Fetch stores for each vendor in parallel
      const storePromises = vendorsList.map(async (vendor) => {
        try {
          
          let vendorStores = [];
          
        
    
          
          // Method 2: If first method fails, try to get all stores and filter
          if (!Array.isArray(vendorStores) || vendorStores.length === 0) {
            try {
              const allStores = await storeAPI.getAll();
              vendorStores = allStores.filter(store => store.vendorId === vendor.id);
            } catch (err) {
              console.warn(`Method 2 failed for vendor ${vendor.id}:`, err);
            }
          }
          
            console.log(vendorStores);
            
          // Ensure we always return an array
          return {
            vendorId: vendor.id,
            stores: Array.isArray(vendorStores) ? vendorStores : []
          };
        } catch (err) {
          console.error(`Error fetching stores for vendor ${vendor.id}:`, err);
          return {
            vendorId: vendor.id,
            stores: []
          };
        }
      });

      // Wait for all store fetches to complete
      const storeResults = await Promise.all(storePromises);
      
      // Create stores map and calculate stats
      const storesMap = {};
      const statsMap = {};
      
      storeResults.forEach(({ vendorId, stores: vendorStores }) => {
        storesMap[vendorId] = vendorStores;
        
        // Calculate stats for this vendor
        const totalProducts = vendorStores.reduce((total, store) => 
          total + (store.products ? (Array.isArray(store.products) ? store.products.length : parseInt(store.products) || 0) : 0), 0);
        
        const totalOrders = vendorStores.reduce((total, store) => 
          total + (store.orders ? (Array.isArray(store.orders) ? store.orders.length : parseInt(store.orders) || 0) : 0), 0);
        
        const totalRevenue = vendorStores.reduce((total, store) => {
          if (store.orders && Array.isArray(store.orders)) {
            return total + store.orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
          }
          return total + (parseFloat(store.totalRevenue) || 0);
        }, 0);
        
        statsMap[vendorId] = {
          totalProducts,
          totalOrders,
          totalRevenue,
          storeCount: vendorStores.length
        };
        
        // Update loading state
        setIsLoadingStores(prev => ({
          ...prev,
          [vendorId]: false
        }));
      });
      
      setStores(storesMap);
      setStoreStats(statsMap);
    } catch (err) {
      setError(err.message || 'Failed to load vendors');
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVendorStores = async (vendorId) => {
    if (stores[vendorId] && stores[vendorId].length > 0) {
      return; // Already loaded
    }

    setIsLoadingStores(prev => ({ ...prev, [vendorId]: true }));

    try {
      let vendorStores = [];
      
      // Try multiple methods to get stores
      try {
        vendorStores = await storeAPI.getByVendor(vendorId);
      } catch (err) {
        console.warn(`Direct vendor fetch failed:`, err);
      }
      
      if (!Array.isArray(vendorStores) || vendorStores.length === 0) {
        try {
          const allStores = await storeAPI.getAll();
          vendorStores = allStores.filter(store => store.vendorId === vendorId);
        } catch (err) {
          console.warn(`Filter method failed:`, err);
        }
      }

      vendorStores = Array.isArray(vendorStores) ? vendorStores : [];

      // Calculate stats
      const totalProducts = vendorStores.reduce((total, store) => 
        total + (store.products ? (Array.isArray(store.products) ? store.products.length : parseInt(store.products) || 0) : 0), 0);
      
      const totalOrders = vendorStores.reduce((total, store) => 
        total + (store.orders ? (Array.isArray(store.orders) ? store.orders.length : parseInt(store.orders) || 0) : 0), 0);
      
      const totalRevenue = vendorStores.reduce((total, store) => {
        if (store.orders && Array.isArray(store.orders)) {
          return total + store.orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
        }
        return total + (parseFloat(store.totalRevenue) || 0);
      }, 0);

      setStores(prev => ({
        ...prev,
        [vendorId]: vendorStores
      }));

      setStoreStats(prev => ({
        ...prev,
        [vendorId]: {
          totalProducts,
          totalOrders,
          totalRevenue,
          storeCount: vendorStores.length
        }
      }));
    } catch (err) {
      console.error(`Error fetching stores for vendor ${vendorId}:`, err);
      // Ensure we still set empty array on error
      setStores(prev => ({
        ...prev,
        [vendorId]: []
      }));
      setStoreStats(prev => ({
        ...prev,
        [vendorId]: {
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          storeCount: 0
        }
      }));
    } finally {
      setIsLoadingStores(prev => ({ ...prev, [vendorId]: false }));
    }
  };

  const toggleRowExpansion = async (vendorId) => {
    const isExpanded = expandedRows.includes(vendorId);
    
    if (!isExpanded) {
      // If expanding, fetch store data if not already loaded
      if (!stores[vendorId] || stores[vendorId].length === 0) {
        await fetchVendorStores(vendorId);
      }
    }
    
    setExpandedRows(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleStatusUpdate = async (vendorId, newStatus) => {
    try {
      const vendor = vendors.find(v => v.id === vendorId);
      if (!vendor) return;

      const updatedVendor = {
        ...vendor,
        status: newStatus,
      };

      await vendorAPI.update(updatedVendor);
      
      setVendors(vendors.map(v => v.id === vendorId ? updatedVendor : v));
    } catch (err) {
      alert(`Failed to update vendor status: ${err.message}`);
    }
  };

  const handleDelete = async (vendorId) => {
    if (!window.confirm('Are you sure you want to delete this vendor? All associated stores will also be deleted.')) {
      return;
    }

    try {
      await vendorAPI.delete(vendorId);
      setVendors(vendors.filter(v => v.id !== vendorId));
      setExpandedRows(prev => prev.filter(id => id !== vendorId));
      
      // Remove from stores and stats
      setStores(prev => {
        const newStores = { ...prev };
        delete newStores[vendorId];
        return newStores;
      });
      
      setStoreStats(prev => {
        const newStats = { ...prev };
        delete newStats[vendorId];
        return newStats;
      });
    } catch (err) {
      alert(`Failed to delete vendor: ${err.message}`);
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
      case 'PENDING': return { 
        color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        icon: Shield, 
        label: 'Pending',
        bgColor: 'bg-yellow-50'
      };
      case 'SUSPENDED': return { 
        color: 'bg-red-100 text-red-800 border border-red-200',
        icon: XCircle, 
        label: 'Suspended',
        bgColor: 'bg-red-50'
      };
      case 'INACTIVE': return { 
        color: 'bg-gray-100 text-gray-800 border border-gray-200',
        icon: Shield, 
        label: 'Inactive',
        bgColor: 'bg-gray-50'
      };
      default: return { 
        color: 'bg-gray-100 text-gray-800 border border-gray-200',
        icon: Shield, 
        label: status || 'Unknown',
        bgColor: 'bg-gray-50'
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

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = !searchQuery || 
      (vendor.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.companyName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
      (vendor.status || '').toUpperCase() === selectedStatus.toUpperCase();
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vendors.length,
    active: vendors.filter(v => v.status?.toUpperCase() === 'ACTIVE').length,
    pending: vendors.filter(v => v.status?.toUpperCase() === 'PENDING').length,
    stores: Object.values(stores).reduce((total, storeArray) => total + storeArray.length, 0),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendors...</p>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
                <p className="text-gray-600">Manage all vendors and their stores</p>
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
        <div className="grid md:grid-cols-2 grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-gray-600">Total Vendors</div>
          </div>
          
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Store className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.stores}</div>
            <div className="text-gray-600">Total Stores</div>
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
                placeholder="Search vendors by name or email"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
          </div>
        </div>

        {/* Vendors Table */}
        {filteredVendors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Vendors Found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search filters' : 'No vendors have registered yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left p-6 font-semibold text-gray-900">Vendor</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Contact</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Stores</th>
                    <th className="text-left p-6 font-semibold text-gray-900 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => {
                    const statusConfig = getStatusConfig(vendor.status);
                    const StatusIcon = statusConfig.icon;
                    const vendorStores = stores[vendor.id] || [];
                    const stats = storeStats[vendor.id] || { storeCount: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 };
                    const isExpanded = expandedRows.includes(vendor.id);
                    const isLoadingStoreData = isLoadingStores[vendor.id];
                    
                    return (
                      <React.Fragment key={vendor.id}>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                {vendor.avatarUrl ? (
                                  <img 
                                    src={vendor.avatarUrl} 
                                    alt={vendor.name} 
                                    className="h-full w-full object-cover rounded-xl"
                                  />
                                ) : (
                                  <span className="text-2xl">👤</span>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{vendor.name}</div>
                                <div className="text-sm text-gray-500">
                                  {vendor.companyName || 'Individual Seller'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="space-y-1">
                              <div className="text-gray-900 truncate max-w-[200px]">{vendor.email}</div>
                              <div className="text-sm text-gray-500">{vendor.phoneNumber || 'No phone'}</div>
                            </div>
                          </td>
                          <td className="p-6">
                            {isLoadingStoreData ? (
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                <span className="text-sm text-gray-500">Loading...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Store className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium">{vendorStores[0]?.storeName || 'Unnamed Store'}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <Package className="h-3 w-3" />
                                  <span>{stats.totalProducts} products</span>
                                </div>
                              </div>
                            )}
                          </td>
                          
                          
                          <td className="p-5">
                            <button
                              onClick={() => toggleRowExpansion(vendor.id)}
                              disabled={isLoadingStoreData}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </td>
                        </tr>
                        
                        {/* Expanded Details Row */}
                        {isExpanded && (
                          <tr className={statusConfig.bgColor}>
                            <td colSpan="6" className="p-8">
                              {isLoadingStoreData ? (
                                <div className="flex items-center justify-center py-12">
                                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-3" />
                                  <span className="text-gray-600">Loading store data...</span>
                                </div>
                              ) : (
                                <div className="grid md:grid-cols-2 gap-8">
                                  {/* Vendor Details Section */}
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                      <Users className="h-5 w-5 mr-2 text-purple-600" />
                                      Vendor Profile
                                    </h3>
                                    <div className="space-y-4">
                                      <div className="flex items-start space-x-4">
                                        <div className="h-20 w-20 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
                                          {vendor.avatarUrl ? (
                                            <img 
                                              src={vendor.avatarUrl} 
                                              alt={vendor.name} 
                                              className="h-16 w-16 object-cover rounded-lg"
                                            />
                                          ) : (
                                            <span className="text-3xl">👤</span>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="font-bold text-gray-900 text-lg">{vendor.name}</h4>
                                          <p className="text-sm text-gray-600 mt-1">{vendor.companyName || 'Individual Seller'}</p>
                                          <div className="flex items-center mt-2 space-x-2">
                                            <span className="text-sm text-gray-500">ID: {vendor.id}</span>
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                              Vendor
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-3 pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-2 gap-5">
                                          <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                              <Mail className="h-4 w-4 mr-2" />
                                              <span>Email:</span>
                                            </div>
                                            <div className="font-medium text-gray-900 pl-6">{vendor.email}</div>
                                          </div>
                                          <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                              <Phone className="h-4 w-4 mr-2" />
                                              <span>Phone:</span>
                                            </div>
                                            <div className="font-medium text-gray-900 pl-6">{vendor.phoneNumber || 'Not provided'}</div>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-600">
                                          <Calendar className="h-4 w-4 mr-2" />
                                          <span>Joined:</span>
                                          <span className="font-medium ml-auto text-gray-900">{formatDate(vendor.createdAt)}</span>
                                        </div>
                                        
                                        {vendor.address && (
                                          <div className="text-sm">
                                            <div className="text-gray-600 mb-1">Address:</div>
                                            <div className="text-gray-900">{vendor.address}</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Vendor Stores & Stats Section */}
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                      <Store className="h-5 w-5 mr-2 text-indigo-600" />
                                      Store Performance
                                    </h3>
                                    
                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                      <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                        <div className="text-xs text-gray-500">Stores</div>
                                        <div className="font-bold text-gray-900 text-xl mt-1">
                                          {stats.storeCount}
                                        </div>
                                      </div>
                                      <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                        <div className="text-xs text-gray-500">Products</div>
                                        <div className="font-bold text-gray-900 text-xl mt-1">
                                          {stats.totalProducts}
                                        </div>
                                      </div>
                                      <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                        <div className="text-xs text-gray-500">Orders</div>
                                        <div className="font-bold text-gray-900 text-xl mt-1">
                                          {stats.totalOrders}
                                        </div>
                                      </div>
                                    </div>

                                    

                                    {/* Stores List */}
                                    <div className="space-y-3">
                                      <div className="text-sm font-medium text-gray-900">Store List:</div>
                                      {vendorStores.length > 0 ? (
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                          {vendorStores.map((store) => (
                                            <div key={store.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors">
                                              <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                                  <span className="text-sm">🏪</span>
                                                </div>
                                                <div>
                                                  <div className="font-medium text-gray-900 text-sm">{store.storeName}</div>
                                                  <div className="text-xs text-gray-500">
                                                    {store.products ? (Array.isArray(store.products) ? store.products.length : store.products) || 0 : 0} products
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex items-center space-x-2">
                                                <span className={`text-xs px-2 py-1 rounded ${
                                                  store.storeStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                  store.storeStatus === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                                                  'bg-gray-100 text-gray-800'
                                                }`}>
                                                  {store.storeStatus || 'UNKNOWN'}
                                                </span>
                                                <button
                                                  onClick={() => navigate(`/store/${store.storeName}`)}
                                                  className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                                                >
                                                  View →
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-center py-4 text-gray-500 text-sm">
                                          No stores created yetww
                                        </div>
                                      )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 pt-6 border-t border-gray-200 mt-6">
                                      <button
                                        onClick={() => handleDelete(vendor.id)}
                                        className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm"
                                      >
                                        Delete Vendor
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
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
                  Showing {filteredVendors.length} of {vendors.length} vendors
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedRows([])}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Collapse All
                  </button>
                  <button
                    onClick={() => setExpandedRows(filteredVendors.map(v => v.id))}
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
    </div>
  );
};

export default ManageVendors;