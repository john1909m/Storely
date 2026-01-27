// src/pages/vendor/Orders.jsx
import React, { useState } from 'react';
import {
  Search, Filter, Eye, Package, Truck,
  CheckCircle, XCircle, Clock, AlertCircle,
  Download, Printer, MessageSquare
} from 'lucide-react';

const VendorOrders = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);

  const orders = [
    {
      id: 'ORD-1245',
      customer: 'John Smith',
      email: 'john@example.com',
      date: '2024-03-15',
      items: 2,
      total: 379.98,
      status: 'processing',
      payment: 'paid',
      shipping: 'standard'
    },
    {
      id: 'ORD-1244',
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      date: '2024-03-14',
      items: 1,
      total: 129.99,
      status: 'shipped',
      payment: 'paid',
      shipping: 'express'
    },
    {
      id: 'ORD-1243',
      customer: 'Mike Wilson',
      email: 'mike@example.com',
      date: '2024-03-13',
      items: 3,
      total: 89.97,
      status: 'delivered',
      payment: 'paid',
      shipping: 'standard'
    },
    {
      id: 'ORD-1242',
      customer: 'Emma Davis',
      email: 'emma@example.com',
      date: '2024-03-12',
      items: 1,
      total: 249.99,
      status: 'pending',
      payment: 'pending',
      shipping: 'standard'
    },
    {
      id: 'ORD-1241',
      customer: 'Robert Brown',
      email: 'robert@example.com',
      date: '2024-03-11',
      items: 2,
      total: 59.98,
      status: 'cancelled',
      payment: 'refunded',
      shipping: 'standard'
    },
    {
      id: 'ORD-1240',
      customer: 'Lisa Miller',
      email: 'lisa@example.com',
      date: '2024-03-10',
      items: 1,
      total: 89.99,
      status: 'delivered',
      payment: 'paid',
      shipping: 'express'
    }
  ];

  const statusConfig = {
    all: { label: 'All Orders', color: 'gray', count: 6 },
    pending: { label: 'Pending', color: 'yellow', count: 1 },
    processing: { label: 'Processing', color: 'blue', count: 1 },
    shipped: { label: 'Shipped', color: 'purple', count: 1 },
    delivered: { label: 'Delivered', color: 'green', count: 2 },
    cancelled: { label: 'Cancelled', color: 'red', count: 1 }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
              <p className="text-gray-600">Manage and track customer orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                <Download className="h-5 w-5 inline mr-2" />
                Export
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700">
                <Printer className="h-5 w-5 inline mr-2" />
                Print Labels
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats & Filters */}
        <div className="mb-8">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
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

          {/* Search & Action Bar */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer, or email..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Date Filter */}
              <div className="flex items-center space-x-4">
                <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Custom range</option>
                </select>
                <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                  <Filter className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table Header with Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="p-6 bg-indigo-50 border-b border-indigo-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-indigo-700">
                    {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                  </div>
                  <select className="px-4 py-2 bg-white border border-indigo-200 rounded-lg text-indigo-700">
                    <option>Bulk Actions</option>
                    <option>Mark as Processing</option>
                    <option>Mark as Shipped</option>
                    <option>Print Labels</option>
                    <option>Export Selected</option>
                  </select>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Apply
                  </button>
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
                      checked={selectedOrders.length === orders.length}
                      onChange={handleSelectAll}
                      className="h-5 w-5 text-indigo-600 rounded"
                    />
                  </th>
                  <th className="text-left p-6 font-semibold text-gray-900">Order ID</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Customer</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Date</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Items</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Total</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Payment</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
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
                      <div className="font-semibold text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.shipping} shipping</div>
                    </td>
                    <td className="p-6">
                      <div className="font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="p-6 text-gray-700">{order.date}</td>
                    <td className="p-6">
                      <div className="font-medium text-gray-900">{order.items} item{order.items > 1 ? 's' : ''}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-gray-900">${order.total.toFixed(2)}</div>
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">{order.status}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.payment === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : order.payment === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <span className="capitalize">{order.payment}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Package className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                          <MessageSquare className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-gray-600">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Previous
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  2
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-green-600">+12%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">6</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm font-medium text-green-600">+8%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
            <div className="text-gray-600">Completed Orders</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-sm font-medium text-red-600">-2%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">2</div>
            <div className="text-gray-600">Pending Orders</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-sm font-medium text-green-600">+15%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$899.90</div>
            <div className="text-gray-600">Revenue</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Order Activity</h2>
          <div className="space-y-4">
            {[
              { time: '2 hours ago', action: 'Order #ORD-1245 marked as Processing', type: 'processing' },
              { time: '5 hours ago', action: 'Order #ORD-1244 shipped via Express', type: 'shipped' },
              { time: '1 day ago', action: 'Payment received for Order #ORD-1243', type: 'payment' },
              { time: '2 days ago', action: 'New order #ORD-1242 received', type: 'new' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'processing' ? 'bg-blue-100' :
                    activity.type === 'shipped' ? 'bg-purple-100' :
                    activity.type === 'payment' ? 'bg-green-100' : 'bg-indigo-100'
                  }`}>
                    {activity.type === 'processing' && <Package className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'shipped' && <Truck className="h-5 w-5 text-purple-600" />}
                    {activity.type === 'payment' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {activity.type === 'new' && <AlertCircle className="h-5 w-5 text-indigo-600" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-500 text-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;