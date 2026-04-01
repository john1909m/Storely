// Admin Dashboard - Real data from APIs
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store, Users, DollarSign, TrendingUp,
  BarChart, Settings, Shield, AlertCircle
} from 'lucide-react';
import { storeAPI } from '../../api/store.api';
import { vendorAPI } from '../../api/vendor.api';
import useAuthStore from '../../store/authStore';

const AdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {authInialized} = useAuthStore();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all stores and vendors
      const [storesData, vendorsData] = await Promise.all([
        storeAPI.getAll(),
        vendorAPI.getAll()
      ]);

      setStores(Array.isArray(storesData) ? storesData : []);
      setVendors(Array.isArray(vendorsData) ? vendorsData : []);

      // Fetch orders for each store to calculate revenue
      // This is optional - you might want to optimize this
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts and auth is initialized
  useEffect(() => {
    if (authInialized) {
      fetchDashboardData();
    }
  }, [authInialized]);

  // Calculate stats from real data
  const stats = {
    totalStores: stores.length,
    activeStores: stores.filter(s => s.storeStatus === 'Active').length,
    inactiveStores: stores.filter(s => s.storeStatus=== 'Inactive').length,
    totalVendors: vendors.length,
    pendingStores: stores.filter(s => s.storeStatus === 'Inactive').length,
  };

  // Get recent stores (last 5)
  const recentStores = stores
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const logoutHandler =() => {
    try{
      sessionStorage.clear();
      window.location.href = '/login';
    } catch(err) {
      console.error('Logout error:', err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Platform administration and management</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div>
              <button onClick={logoutHandler} className='p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-800 transition-colors cursor-pointer duration-200 px-4 ml-4'>Logout</button>
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

        {/* Platform Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Store className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalStores}</div>
            <div className="text-gray-600">Total Stores</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Store className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.activeStores}</div>
            <div className="text-gray-600">Active Stores</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalVendors}</div>
            <div className="text-gray-600">Total Vendors</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingStores}</div>
            <div className="text-gray-600">Pending Approval</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-8">
              <nav className="space-y-2">
                <Link to="/admin/dashboard" className="flex items-center space-x-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl">
                  <BarChart className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/admin/stores" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                  <Store className="h-5 w-5" />
                  <span>Manage Stores</span>
                </Link>
                <Link to="/admin/vendors" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                  <Users className="h-5 w-5" />
                  <span>Manage Vendors</span>
                </Link>
                <Link to="/admin/pricing" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                  <span>Pricing Management</span>
                </Link>
                
              </nav>

              {/* System Status */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Platform</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Stores</span>
                    <span className="text-green-600 font-medium">{stats.activeStores} Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Vendors</span>
                    <span className="font-medium">{stats.totalVendors}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Recent Stores */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Stores</h2>
                <Link to="/admin/stores" className="text-indigo-600 hover:text-indigo-500">
                  View all →
                </Link>
              </div>
              {recentStores.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No stores found
                </div>
              ) : (
                <div className="space-y-4">
                  {recentStores.map((store) => (
                    <div key={store.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-900">{store.storeName}</div>
                        <div className="text-sm text-gray-500">
                          Status: {store.storeStatus || 'Inactive'} • 
                          Products: {store.products?.length || 0} • 
                          Orders: {store.orders?.length || 0} •
                          Visits: {(() => {
                            const value = store.totalVisits / 2;
                            return (value % 1 !== 0 ? Math.ceil(value) : value) || 0;
                          })()}

                        </div>
                      </div>
                      <Link
                        to={`/admin/stores?storeId=${store.id}`}
                        className="text-indigo-600 hover:text-indigo-500 text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/admin/stores" className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 hover:border-indigo-200 transition-all">
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <Store className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Manage Stores</h3>
                <p className="text-gray-600 mb-4">Approve, suspend, or manage vendor stores</p>
                <span className="text-indigo-600 font-medium">Go to Stores →</span>
              </Link>
              <Link to="/admin/pricing" className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 hover:border-blue-200 transition-all">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pricing Plans</h3>
                <p className="text-gray-600 mb-4">Configure pricing and commission rates</p>
                <span className="text-blue-600 font-medium">Manage Pricing →</span>
              </Link>
            </div>

            {/* Alerts */}
            {stats.pendingStores > 0 && (
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Pending Actions</h3>
                    <p className="text-gray-700 mb-4">
                      You have {stats.pendingStores} store{stats.pendingStores > 1 ? 's' : ''} pending approval.
                    </p>
                    <Link to="/admin/stores" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                      Review Stores
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
