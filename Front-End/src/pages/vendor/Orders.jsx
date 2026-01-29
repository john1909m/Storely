// Vendor Orders Page - Real data from APIs
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Eye, Package, Truck,
  CheckCircle, XCircle, Clock, AlertCircle,
  Download, Printer, MessageSquare, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderAPI } from '../../api/order.api';
import { customerAPI } from '../../api/customer.api';
import { Link } from 'react-router-dom';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({}); // Map of customerId -> customer data
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { store, vendor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (store?.id) {
      fetchOrders();
    } else {
      setError('Store not found. Please create a store first.');
      setIsLoading(false);
    }
  }, [store]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch orders for the store
      const storeOrders = await orderAPI.getByStore(store.id);
      const ordersList = Array.isArray(storeOrders) ? storeOrders : [];
      setOrders(ordersList);

      // Fetch customer data for each order
      const customerIds = [...new Set(ordersList.map(order => order.customerId).filter(Boolean))];
      const customerMap = {};
      
      for (const customerId of customerIds) {
        try {
          // Note: You might need to adjust this based on your API
          // If there's no direct getById, you might need to get from order
          const customer = await customerAPI.getByOrder(ordersList.find(o => o.customerId === customerId)?.id);
          if (customer) {
            customerMap[customerId] = customer;
          }
        } catch (err) {
          console.error('Error fetching customer:', err);
        }
      }
      
      setCustomers(customerMap);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const updatedOrder = {
        ...order,
        orderStatus: newStatus
      };

      await orderAPI.update(updatedOrder);
      
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
    } catch (err) {
      alert(`Failed to update order status: ${err.message}`);
    }
  };

  const getStatusIcon = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'CONFIRMED': 
      case 'PROCESSING': return <Package className="h-4 w-4" />;
      case 'SHIPPED': return <Truck className="h-4 w-4" />;
      case 'DELIVERED': return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': 
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  // Calculate stats from real data
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus?.toUpperCase() === 'PENDING').length,
    processing: orders.filter(o => ['CONFIRMED', 'PROCESSING'].includes(o.orderStatus?.toUpperCase())).length,
    shipped: orders.filter(o => o.orderStatus?.toUpperCase() === 'SHIPPED').length,
    delivered: orders.filter(o => o.orderStatus?.toUpperCase() === 'DELIVERED').length,
    cancelled: orders.filter(o => o.orderStatus?.toUpperCase() === 'CANCELLED').length,
    revenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
  };

  const statusConfig = {
    all: { label: 'All Orders', color: 'gray', count: stats.total },
    pending: { label: 'Pending', color: 'yellow', count: stats.pending },
    processing: { label: 'Processing', color: 'blue', count: stats.processing },
    shipped: { label: 'Shipped', color: 'purple', count: stats.shipped },
    delivered: { label: 'Delivered', color: 'green', count: stats.delivered },
    cancelled: { label: 'Cancelled', color: 'red', count: stats.cancelled }
  };

  // Filter orders by status and search
  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || 
      order.orderStatus?.toUpperCase() === selectedStatus.toUpperCase();
    
    const matchesSearch = !searchQuery || 
      order.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerId?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      customers[order.customerId]?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customers[order.customerId]?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
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
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Link
                  to="/vendor/store"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                  <p className="text-gray-600">Manage and track customer orders</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Export</span>
              </button>
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

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.delivered}</div>
            <div className="text-gray-600">Delivered</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">${stats.revenue.toFixed(2)}</div>
            <div className="text-gray-600">Revenue</div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={`px-6 py-3 rounded-xl transition-all ${
                  selectedStatus === key
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{config.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedStatus === key
                      ? 'bg-white/20'
                      : 'bg-gray-100'
                  }`}>
                    {config.count}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search filters' : 'You don\'t have any orders yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Table Header with Bulk Actions */}
            {selectedOrders.length > 0 && (
              <div className="p-6 bg-indigo-50 border-b border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-indigo-700">
                      {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                    </div>
                    <select 
                      className="px-4 py-2 bg-white border border-indigo-200 rounded-lg text-indigo-700"
                      onChange={(e) => {
                        if (e.target.value) {
                          selectedOrders.forEach(orderId => {
                            handleStatusUpdate(orderId, e.target.value);
                          });
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Bulk Actions</option>
                      <option value="CONFIRMED">Mark as Confirmed</option>
                      <option value="SHIPPED">Mark as Shipped</option>
                      <option value="DELIVERED">Mark as Delivered</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setSelectedOrders([])}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Clear selection
                  </button>
                </div>
              </div>
            )}

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-6">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={handleSelectAll}
                        className="h-5 w-5 text-indigo-600 rounded"
                      />
                    </th>
                    <th className="text-left p-6 font-semibold text-gray-900">Order ID</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Customer</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Date</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Total</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const customer = customers[order.customerId];
                    return (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-6">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                            className="h-5 w-5 text-indigo-600 rounded"
                          />
                        </td>
                        <td className="p-6">
                          <div className="font-semibold text-gray-900">#{order.id || order.orderId}</div>
                        </td>
                        <td className="p-6">
                          <div className="font-medium text-gray-900">
                            {customer?.name || `Customer #${order.customerId}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer?.email || customer?.phoneNumber || 'No contact info'}
                          </div>
                        </td>
                        <td className="p-6 text-gray-700">
                          {order.orderDate 
                            ? new Date(order.orderDate).toLocaleDateString()
                            : 'N/A'
                          }
                        </td>
                        <td className="p-6">
                          <div className="font-bold text-gray-900">
                            ${(order.totalPrice || 0).toFixed(2)}
                          </div>
                        </td>
                        <td className="p-6">
                          <select
                            value={order.orderStatus || 'PENDING'}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(order.orderStatus)}`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => navigate(`/vendor/orders/${order.id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View Details"
                            >
                              <Eye className="h-5 w-5" />
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
                  Showing {filteredOrders.length} of {orders.length} orders
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
