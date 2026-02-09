// Admin Manage Stores - Real data from APIs
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Eye, Edit, Pause, Store,MapPinHouse,
  Play, Trash2, Users, TrendingUp, ChevronDown,
  AlertCircle, CheckCircle, XCircle, ArrowLeft,
  Mail, Phone, Calendar, Globe, Package, ShoppingBag,
  User, Shield, CreditCard, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { storeAPI } from '../../api/store.api';
import { vendorAPI } from '../../api/vendor.api';

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [vendors, setVendors] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const storesData = await storeAPI.getAll();
      const storesList = Array.isArray(storesData) ? storesData : [];
      setStores(storesList);

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
    } catch (err) {
      setError(err.message || 'Failed to load stores');
      setStores([]);
    } finally {
      setIsLoading(false);
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

  const stats = {
    total: stores.length,
    active: stores.filter(s => s.storeStatus === 'Active').length,
    inactive: stores.filter(s => s.storeStatus === 'Inactive').length,
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
                <p className="text-gray-600">Manage all vendor stores on the platform</p>
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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                    <th className="text-left p-6 font-semibold text-gray-900">Products</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Orders</th>
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
                            <div className="font-medium text-gray-900">{store.products?.length || 0}</div>
                          </td>
                          <td className="p-6">
                            <div className="font-medium text-gray-900">{store.orders?.length || 0}</div>
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
                              {store.storeStatus=== 'Active' ? (
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
                              <div className="grid md:grid-cols-2 gap-8">
                                {/* Store Details Section */}
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
                                    
                                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 pt-4 border-t border-gray-200" >
                                      <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                          <Package className="h-4 w-4 mr-2" />
                                          <span>Products:</span>
                                          <span className="font-medium ml-auto text-gray-900">{store.products?.length || 0} products</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                          <ShoppingBag className="h-4 w-4 mr-2" />
                                          <span>Orders:</span>
                                          <span className="font-medium ml-auto text-gray-900">{store.orders?.length || 0} orders</span>
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
                                            className="font-medium ml-auto text-blue-600 hover:underline truncate max-w-[120px]"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {store.storeName}
                                          </a>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                          <MapPinHouse className="h-4 w-4 mr-2" />
                                          <span>Address</span>
                                          <span className={`font-medium ml-auto px-2 py-0.5 rounded-full text-xs ${
                                            store.storeAddress 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-gray-100 text-gray-800'
                                          }`}>
                                            {store.storeAddress ? store.storeAddress : 'N/A'}
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

                                {/* Vendor Details Section */}
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
                                        <span className="text-gray-900 truncate">{vendor?.email || 'N/A'}</span>
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
                                      {vendor?.companyName && (
                                        <div className="flex items-center text-sm text-gray-600">
                                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                          <span className="font-medium mr-2">Company:</span>
                                          <span className="text-gray-900">{vendor.companyName}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Vendor Stats */}
                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <div className="text-xs text-gray-500">Total Stores</div>
                                        <div className="font-bold text-gray-900 mt-1">
                                          {Object.values(vendors).filter(v => v.id === vendor?.id).length || 1}
                                        </div>
                                      </div>
                                      
                                    </div>
                                  </div>
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
    </div>
  );
};

export default ManageStores;