// Vendor Orders Page - Real data from APIs
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Eye, Package, Truck,
  CheckCircle, XCircle, Clock, AlertCircle,
  Download, Printer, MessageSquare, ArrowLeft,
  ChevronDown, ChevronUp, User, Mail, Phone, MapPin,
  ShoppingBag, Tag, DollarSign, CreditCard, Calendar,
  Truck as Shipping, Box, Hash, FileText
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderAPI } from '../../api/order.api';
import { customerAPI } from '../../api/customer.api';
import { Link } from 'react-router-dom';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({}); // Map of customerId -> customer data
  const [expandedRows, setExpandedRows] = useState([]);
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
      const customerMap = {};
      
      for (const order of ordersList) {
        if (order.customerId) {
          try {
            const customer = await customerAPI.getById(order.customerId);
            if (customer) {
              customerMap[order.customerId] = customer;
            }
          } catch (err) {
            console.error(`Error fetching customer ${order.customerId}:`, err);
            // If getById fails, try to extract from order data
            if (order.customer) {
              customerMap[order.customerId] = order.customer;
            }
          }
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
        
        status: newStatus // Some APIs might use 'status' instead of 'orderStatus'
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
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'PAID': 
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': 
      case 'REFUNDED': return 'bg-red-100 text-red-800';
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

  const toggleRowExpand = (orderId) => {
    setExpandedRows(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Calculate stats from real data
  const stats = {
    total: orders.length,
    pending: orders.filter(o => {
      const status = o.orderStatus || o.status;
      return status?.toUpperCase() === 'PENDING';
    }).length,
    
    shipped: orders.filter(o => {
      const status = o.orderStatus || o.status;
      return status?.toUpperCase() === 'SHIPPED';
    }).length,
    delivered: orders.filter(o => {
      const status = o.orderStatus || o.status;
      return status?.toUpperCase() === 'DELIVERED';
    }).length,
    cancelled: orders.filter(o => {
      const status = o.orderStatus || o.status;
      return status?.toUpperCase() === 'CANCELLED';
    }).length,
    revenue: orders.reduce((sum, order) => sum + (order.totalPrice || order.total || order.amount || 0), 0)
  };

  const statusConfig = {
    all: { label: 'All Orders', color: 'gray', count: stats.total },
    pending: { label: 'Pending', color: 'yellow', count: stats.pending },
    
    shipped: { label: 'Shipped', color: 'purple', count: stats.shipped },
    delivered: { label: 'Delivered', color: 'green', count: stats.delivered },
    cancelled: { label: 'Cancelled', color: 'red', count: stats.cancelled }
  };

  // Filter orders by status and search
  const filteredOrders = orders.filter(order => {
    const status = order.orderStatus || order.status;
    const matchesStatus = selectedStatus === 'all' || 
      status?.toUpperCase() === selectedStatus.toUpperCase();
    
    const customer = customers[order.customerId];
    const matchesSearch = !searchQuery || 
      order.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerId?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.phone?.toLowerCase().includes(searchQuery.toLowerCase());

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
                <Printer className="h-5 w-5" />
                <span>Print</span>
              </button>
              <button 
                onClick={fetchOrders}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Refresh</span>
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
                placeholder="Search orders by ID, order number, customer name, email, or phone..."
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
                      <option value="PENDING">Mark as Pending</option>
                      <option value="CONFIRMED">Mark as Confirmed</option>
                      <option value="SHIPPED">Mark as Shipped</option>
                      <option value="DELIVERED">Mark as Delivered</option>
                      <option value="CANCELLED">Mark as Cancelled</option>
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
                    <th className="p-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={handleSelectAll}
                        className="h-5 w-5 text-indigo-600 rounded"
                      />
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900 w-12"></th>
                    <th className="text-left p-4 font-semibold text-gray-900">Order ID</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Customer</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Total</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const customer = customers[order.customerId] || order.customer;
                    const isExpanded = expandedRows.includes(order.id);
                    const status = order.orderStatus || order.status || 'PENDING';
                    const orderTotal = order.totalPrice || order.total || order.amount || 0;
                    const orderDate = order.orderDate || order.createdAt || order.date;
                    const items = order.items || order.orderItems || [];
                    
                    return (
                      <React.Fragment key={order.id}>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => handleSelectOrder(order.id)}
                              className="h-5 w-5 text-indigo-600 rounded"
                            />
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => toggleRowExpand(order.id)}
                              className="p-1 hover:bg-gray-200 rounded transition-all duration-200"
                            >
                              {isExpanded ? 
                                <ChevronUp className="h-5 w-5 text-gray-600" /> : 
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                              }
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-gray-900">
                              #{order.orderNumber || order.id}
                            </div>
                            {order.paymentMethod && (
                              <div className="text-sm text-gray-500">
                                Paid via {order.paymentMethod}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">
                              {customer?.firstName || `Customer #${order.customerId}`} {customer?.lastName || ''}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer?.email || customer?.phoneNumber || 'No contact info'}
                            </div>
                          </td>
                          <td className="p-4 text-gray-700">
                            {orderDate 
                              ? new Date(orderDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'N/A'
                            }
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-gray-900">
                              ${orderTotal.toFixed(2)}
                            </div>
                            {items.length > 0 && (
                              <div className="text-sm text-gray-500">
                                {items.length} item{items.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <select
                              value={status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium border-0 w-full max-w-xs ${getStatusColor(status)}`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="PROCESSING">Processing</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => toggleRowExpand(order.id)}
                                className={`p-2 ${isExpanded ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}
                                title={isExpanded ? "Hide Details" : "Show Details"}
                              >
                                {isExpanded ? 'Hide Details' : 'Show Details'}
                              </button>
                              <button 
                                onClick={() => navigate(`/vendor/orders/${order.id}`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="View Full Details"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Dropdown Details Row */}
                        {isExpanded && (
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <td colSpan="8" className="p-0">
                              <div className="p-6">
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                  {/* Order Summary */}
                                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                                      <FileText className="h-5 w-5 mr-2" />
                                      Order Summary
                                    </h3>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <div className="text-sm text-gray-500 mb-1">Order ID</div>
                                          <div className="font-medium flex items-center">
                                            <Hash className="h-4 w-4 mr-2 text-gray-400" />
                                            #{order.id}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-sm text-gray-500 mb-1">Order Date</div>
                                          <div className="font-medium flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                            {orderDate 
                                              ? new Date(orderDate).toLocaleString('en-US', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                })
                                              : 'N/A'
                                            }
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <div className="text-sm text-gray-500 mb-1">Payment Method</div>
                                          <div className="font-medium flex items-center">
                                            <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                                            {order.paymentMethod || 'Cash on Delivery'}
                                          </div>
                                        </div>
                                        
                                      </div>
                                    </div>
                                  </div>

                                  {/* Customer Information */}
                                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                                      <User className="h-5 w-5 mr-2" />
                                      Customer Information
                                    </h3>
                                    <div className="space-y-4">
                                      <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                          <User className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-900">{customer?.firstName || 'N/A'} {customer?.lastName || ''}</div>
                                          <div className="text-sm text-gray-500">Customer ID: #{customer?.id || order.customerId}</div>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-3">
                                        <div className="flex items-center">
                                          <Mail className="h-4 w-4 text-gray-400 mr-3" />
                                          <div className="flex-1">
                                            <div className="text-sm text-gray-500">City</div>
                                            <div>{customer?.city || 'N/A'}</div>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                          <Phone className="h-4 w-4 text-gray-400 mr-3" />
                                          <div className="flex-1">
                                            <div className="text-sm text-gray-500">Phone</div>
                                            <div>{customer?.phoneNumber || customer?.phone || 'N/A'} - {customer?.whatsappNumber || 'N/A'}</div>
                                          </div>
                                        </div>
                                        
                                        {(customer?.address || customer?.shippingAddress || order.shippingAddress) && (
                                          <div className="flex items-start">
                                            <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-1" />
                                            <div className="flex-1">
                                              <div className="text-sm text-gray-500">Shipping Address</div>
                                              <div>
                                                {customer?.address ||''}
                                                
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        
                                        {customer?.createdAt && (
                                          <div className="flex items-center">
                                            <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                                            <div className="flex-1">
                                              <div className="text-sm text-gray-500">Customer Since</div>
                                              <div>
                                                {new Date(customer.createdAt).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric'
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Order Items Table */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                  <h3 className="font-semibold text-gray-900 mb-6 flex items-center text-lg">
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Order Items ({items.length})
                                  </h3>
                                  
                                  {items.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                      <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                      No items found in this order
                                    </div>
                                  ) : (
                                    <div className="overflow-x-auto">
                                      <table className="w-full">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="p-4 text-left text-gray-700 font-semibold">Product</th>
                                            <th className="p-4 text-left text-gray-700 font-semibold">SKU</th>
                                            <th className="p-4 text-left text-gray-700 font-semibold">Quantity</th>
                                            <th className="p-4 text-left text-gray-700 font-semibold">Unit Price</th>
                                            <th className="p-4 text-left text-gray-700 font-semibold">Total</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {items.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                                              <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                  {item.image && (
                                                    <img 
                                                      src={item.image} 
                                                      alt={item.productName || item.name}
                                                      className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                  )}
                                                  <div>
                                                    <div className="font-medium text-gray-900">
                                                      {item.productName || item.name}
                                                    </div>
                                                    {item.variant && (
                                                      <div className="text-sm text-gray-500">
                                                        Variant: {item.variant}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="p-4">
                                                <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                                                  {item.productId || 'N/A'}
                                                </div>
                                              </td>
                                              <td className="p-4">
                                                <div className="flex items-center space-x-2">
                                                  <span className="font-medium">{item.quantity || 1}</span>
                                                </div>
                                              </td>
                                              <td className="p-4">
                                                <div className="font-medium">${(item.price || 0).toFixed(2)}</div>
                                              </td>
                                              <td className="p-4">
                                                <div className="font-semibold text-gray-900">
                                                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                                </div>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                                          <tr>
                                            <td colSpan="3" className="p-4"></td>
                                            <td className="p-4 text-right font-semibold text-gray-700">Subtotal:</td>
                                            <td className="p-4 font-semibold">${orderTotal.toFixed(2)}</td>
                                          </tr>
                                          {order.tax && (
                                            <tr>
                                              <td colSpan="3" className="p-4"></td>
                                              <td className="p-4 text-right font-semibold text-gray-700">Tax:</td>
                                              <td className="p-4 font-semibold">${order.tax.toFixed(2)}</td>
                                            </tr>
                                          )}
                                          {order.shippingCost && (
                                            <tr>
                                              <td colSpan="3" className="p-4"></td>
                                              <td className="p-4 text-right font-semibold text-gray-700">Shipping:</td>
                                              <td className="p-4 font-semibold">${order.shippingCost.toFixed(2)}</td>
                                            </tr>
                                          )}
                                          {order.discount && (
                                            <tr>
                                              <td colSpan="3" className="p-4"></td>
                                              <td className="p-4 text-right font-semibold text-gray-700">Discount:</td>
                                              <td className="p-4 font-semibold text-green-600">-${order.discount.toFixed(2)}</td>
                                            </tr>
                                          )}
                                          <tr className="border-t-2 border-gray-300">
                                            <td colSpan="3" className="p-4"></td>
                                            <td className="p-4 text-right font-bold text-lg text-gray-900">Total:</td>
                                            <td className="p-4 font-bold text-lg text-gray-900">
                                              ${orderTotal.toFixed(2)}
                                            </td>
                                          </tr>
                                        </tfoot>
                                      </table>
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
                  Showing {filteredOrders.length} of {orders.length} orders
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Refresh Data</span>
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

export default VendorOrders;