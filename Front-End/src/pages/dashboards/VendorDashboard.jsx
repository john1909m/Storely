// src/pages/dashboards/VendorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Store, Package, TrendingUp, Users,
  Plus, ShoppingBag, BarChart, Settings, X, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { storeAPI } from '../../api/store.api';
import AddStoreModal from '../../components/AddStoreModal';

const VendorDashboard = () => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const { vendor, store, isVendor, hasStore } = useAuth();
  const navigate = useNavigate();

  // Redirect to store page if vendor has store
  useEffect(() => {
    if (isVendor() && hasStore()) {
      console.log('VendorDashboard: Store exists, redirecting to /vendor/store');
      navigate('/vendor/store', { replace: true });
      return;
    }
  }, [isVendor, hasStore, navigate]);

  useEffect(() => {
    if (isVendor() && vendor?.id && !hasStore()) {
      fetchStores();
    }
  }, [vendor, hasStore, isVendor]);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const vendorStores = await storeAPI.getByVendorId(vendor.id);
      setStores(Array.isArray(vendorStores) ? vendorStores : []);
    } catch (err) {
      setError(err.message || 'Failed to load stores');
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreClick = (store) => {
    navigate(`/vendor/store?storeId=${store.id}`);
  };

  const handleStoreCreated = (newStore) => {
    // Refresh stores list
    fetchStores();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600">Welcome back to your store management</p>
            </div>
            {stores.length > 0 && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddStoreModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Store</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* No Stores - Show Add Store Button */}
        {!isLoading && stores.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 bg-indigo-100 rounded-full mb-6">
                <Store className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No Store Found
              </h2>
              <p className="text-gray-600 mb-8">
                Get started by creating your first store. You can add products and start selling once your store is approved by admin.
              </p>
              <button
                onClick={() => setShowAddStoreModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Store</span>
              </button>
            </div>
          </div>
        )}

        {/* Stores List */}
        {!isLoading && stores.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Stores</h2>
              <p className="text-gray-600">Manage your stores and view their status</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => handleStoreClick(store)}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Store className="h-6 w-6 text-indigo-600" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        store.storeStatus === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {store.storeStatus || 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {store.storeName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {store.storeDescription || 'No description'}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>{store.products?.length || 0} Products</span>
                    <span>•</span>
                    <span>{store.orders?.length || 0} Orders</span>
                  </div>
                  {store.storeStatus === 'Inactive' && (
                    <div className="mt-4 flex items-center text-sm text-yellow-600 bg-yellow-50 rounded-lg p-2">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>Waiting for admin approval</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Sidebar Navigation - Only show if stores exist */}
        {stores.length > 0 && (
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-8">
                <nav className="space-y-2">
                  <Link to="/vendor/dashboard" className="flex items-center space-x-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl">
                    <BarChart className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/vendor/store" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                    <Store className="h-5 w-5" />
                    <span>My Store</span>
                  </Link>
                  <Link to="/vendor/products" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                    <Package className="h-5 w-5" />
                    <span>Products</span>
                  </Link>
                  <Link to="/vendor/orders" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                  <Link to="/vendor/settings" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                    <Settings className="h-5 w-5" />
                    <span>Store Settings</span>
                  </Link>
                </nav>
              </div>
            </div>
            <div className="lg:col-span-3">
              {/* Recent Activity or Quick Stats can go here */}
            </div>
          </div>
        )}
      </div>

      {/* Add Store Modal */}
      <AddStoreModal
        isOpen={showAddStoreModal}
        onClose={() => setShowAddStoreModal(false)}
        onSuccess={handleStoreCreated}
      />
    </div>
  );
};

export default VendorDashboard;