// Admin Manage Stores - Real data from APIs
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Eye, Edit, Pause,
  Play, Trash2, Users, TrendingUp,
  AlertCircle, CheckCircle, XCircle, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { storeAPI } from '../../api/store.api';
import { vendorAPI } from '../../api/vendor.api';

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [vendors, setVendors] = useState({}); // Map of vendorId -> vendor
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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

      // Fetch vendor info for each store
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

  const handleStatusUpdate = async (storeId, newStatus) => {
    try {
      const store = stores.find(s => s.id === storeId);
      if (!store) return;

      const updatedStore = {
        ...store,
        storeStatus: newStatus
      };

      await storeAPI.update(updatedStore);
      
      // Update local state
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
    } catch (err) {
      alert(`Failed to delete store: ${err.message}`);
    }
  };

  const getStatusConfig = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'ACTIVE': return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' };
      case 'INACTIVE': return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Inactive' };
      case 'SUSPENDED': return { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Suspended' };
      default: return { color: 'bg-gray-100 text-gray-800', icon: Pause, label: 'Inactive' };
    }
  };

  // Calculate stats from real data
  const stats = {
    total: stores.length,
    active: stores.filter(s => s.storeStatus?.toUpperCase() === 'ACTIVE').length,
    inactive: stores.filter(s => s.storeStatus?.toUpperCase() === 'INACTIVE').length,
    suspended: stores.filter(s => s.storeStatus?.toUpperCase() === 'SUSPENDED').length,
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.suspended}</div>
            <div className="text-gray-600">Suspended</div>
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
                <option value="SUSPENDED">Suspended</option>
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
                  </tr>
                </thead>
                <tbody>
                  {filteredStores.map((store) => {
                    const statusConfig = getStatusConfig(store.storeStatus);
                    const StatusIcon = statusConfig.icon;
                    const vendor = vendors[store.vendorId];
                    
                    return (
                      <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                              {store.storeLogoUrl ? (
                                <img src={store.storeLogoUrl} alt={store.storeName} className="h-full w-full object-cover rounded-xl" />
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
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                            <StatusIcon className="h-4 w-4 mr-2" />
                            <span>{statusConfig.label}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/store/${store.storeName}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View Store"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            {store.storeStatus?.toUpperCase() === 'ACTIVE' ? (
                              <button
                                onClick={() => handleStatusUpdate(store.id, 'INACTIVE')}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                                title="Deactivate"
                              >
                                <Pause className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusUpdate(store.id, 'ACTIVE')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Activate"
                              >
                                <Play className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(store.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStores;
