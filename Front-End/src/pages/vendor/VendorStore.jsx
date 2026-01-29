// Vendor Store Page - Real data from APIs
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Store, Package, ShoppingBag, BarChart, Settings, 
  Plus, Edit, Copy, Check, ExternalLink, TrendingUp,
  Users, DollarSign, AlertCircle, Eye
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { storeAPI } from '../../api/store.api';
import { productAPI } from '../../api/product.api';
import { orderAPI } from '../../api/order.api';

const VendorStore = () => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const { store: authStore, vendor, setStore: setAuthStore } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get store from auth or fetch by vendor ID
      let storeData = authStore;
      
      if (!storeData && vendor?.id) {
        const stores = await storeAPI.getByVendorId(vendor.id);
        storeData = Array.isArray(stores) ? stores[0] : stores;
        if (storeData) {
          setAuthStore(storeData);
        }
      }

      if (!storeData) {
        setError('Store not found. Please create a store first.');
        setIsLoading(false);
        return;
      }

      setStore(storeData);

      // Fetch products for this store
      if (storeData.id) {
        try {
          const storeProducts = await productAPI.getAll(storeData.id);
          setProducts(Array.isArray(storeProducts) ? storeProducts : []);
          setStats(prev => ({ ...prev, totalProducts: Array.isArray(storeProducts) ? storeProducts.length : 0 }));
        } catch (err) {
          console.error('Error fetching products:', err);
          setProducts([]);
        }

        // Fetch orders for this store
        try {
          const storeOrders = await orderAPI.getByStore(storeData.id);
          const ordersList = Array.isArray(storeOrders) ? storeOrders : [];
          setOrders(ordersList);
          setStats(prev => ({ 
            ...prev, 
            totalOrders: ordersList.length,
            totalRevenue: ordersList.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
            totalCustomers: new Set(ordersList.map(order => order.customerId).filter(Boolean)).size
          }));
        } catch (err) {
          console.error('Error fetching orders:', err);
          setOrders([]);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load store data');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store data...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Please create a store first'}</p>
          <Link
            to="/vendor/create-store"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {store.storeLogoUrl ? (
                <img 
                  src={store.storeLogoUrl} 
                  alt={store.storeName}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-gray-200"
                />
              ) : (
                <div 
                  className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                  style={{ 
                    backgroundColor: store.primaryColor || '#800020',
                    color: store.secondaryColor || '#ffffff'
                  }}
                >
                  <Store className="h-8 w-8" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900">{store.storeName}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    store.storeStatus === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {store.storeStatus || 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Store className="h-4 w-4" />
                    <span>{getStoreUrl()}</span>
                  </div>
                  <button
                    onClick={copyStoreLink}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={getStoreUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Store</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/vendor/settings"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center space-x-2"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <Link
                to="/vendor/dashboard"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2 shadow-md"
              >
                <BarChart className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalProducts}</div>
            <div className="text-gray-600">Total Products</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalOrders}</div>
            <div className="text-gray-600">Total Orders</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <div className="text-gray-600">Total Revenue</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCustomers}</div>
            <div className="text-gray-600">Customers</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/vendor/products"
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                <Plus className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">Add Product</div>
              <div className="text-sm text-gray-500">Create a new product listing</div>
            </Link>

            <Link
              to="/vendor/products"
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">Manage Products</div>
              <div className="text-sm text-gray-500">Edit or delete products</div>
            </Link>

            <Link
              to="/vendor/orders"
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">View Orders</div>
              <div className="text-sm text-gray-500">Manage customer orders</div>
            </Link>

            <Link
              to="/vendor/dashboard"
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">Analytics</div>
              <div className="text-sm text-gray-500">View store analytics</div>
            </Link>
          </div>
        </div>

        {/* Store Overview */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Store Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Overview</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Store Description</label>
                  <p className="text-gray-600">
                    {store.storeDescription || 'No description provided'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                    <p className="text-gray-600">{store.storeAddress || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Phone</label>
                    <p className="text-gray-600">{store.storePhone || 'Not set'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/vendor/settings"
                    className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Store Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Products</h2>
                <Link
                  to="/vendor/products"
                  className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No products yet</p>
                  <Link
                    to="/vendor/products"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {products.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {product.images && product.images[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.productName}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {product.productName || product.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            ${product.price || 0} • Qty: {product.quantity || 0}
                          </p>
                        </div>
                        <Link
                          to={`/vendor/products`}
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Recent Orders */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              <Link
                to="/vendor/orders"
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                View All
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">
                        #{order.id || order.orderId}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'CONFIRMED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus || 'PENDING'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      ${order.totalPrice || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.orderDate || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorStore;
