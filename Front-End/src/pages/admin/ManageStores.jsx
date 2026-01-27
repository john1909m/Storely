// src/pages/admin/ManageStores.jsx
import React, { useState } from 'react';
import {
  Search, Filter, Eye, Edit, Pause,
  Play, Trash2, Users, TrendingUp,
  AlertCircle, CheckCircle, XCircle
} from 'lucide-react';

const ManageStores = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stores = [
    {
      id: 'STORE-001',
      name: 'TechGadget Store',
      owner: 'John Smith',
      email: 'john@techgadget.com',
      products: 28,
      orders: 142,
      revenue: '$8,425',
      status: 'active',
      plan: 'Professional',
      joined: '2024-01-15',
      rating: 4.8
    },
    {
      id: 'STORE-002',
      name: 'Fashion Hub',
      owner: 'Sarah Johnson',
      email: 'sarah@fashionhub.com',
      products: 156,
      orders: 342,
      revenue: '$24,189',
      status: 'active',
      plan: 'Business',
      joined: '2023-11-22',
      rating: 4.5
    },
    {
      id: 'STORE-003',
      name: 'Home & Living',
      owner: 'Mike Wilson',
      email: 'mike@homeliving.com',
      products: 89,
      orders: 78,
      revenue: '$5,432',
      status: 'pending',
      plan: 'Starter',
      joined: '2024-03-01',
      rating: 0
    },
    {
      id: 'STORE-004',
      name: 'Fitness Gear Pro',
      owner: 'Emma Davis',
      email: 'emma@fitnessgear.com',
      products: 42,
      orders: 231,
      revenue: '$12,456',
      status: 'suspended',
      plan: 'Professional',
      joined: '2024-02-10',
      rating: 4.2
    },
    {
      id: 'STORE-005',
      name: 'Book Nook',
      owner: 'Robert Brown',
      email: 'robert@booknook.com',
      products: 124,
      orders: 89,
      revenue: '$3,789',
      status: 'active',
      plan: 'Professional',
      joined: '2024-01-30',
      rating: 4.9
    },
    {
      id: 'STORE-006',
      name: 'Beauty Bliss',
      owner: 'Lisa Miller',
      email: 'lisa@beautybliss.com',
      products: 67,
      orders: 156,
      revenue: '$9,876',
      status: 'inactive',
      plan: 'Starter',
      joined: '2023-12-05',
      rating: 4.3
    }
  ];

  const stats = [
    { label: 'Total Stores', value: '6', change: '+12%', icon: Users },
    { label: 'Active Stores', value: '3', change: '+5%', icon: CheckCircle },
    { label: 'Pending Approval', value: '1', change: '-2%', icon: AlertCircle },
    { label: 'Total Revenue', value: '$64,167', change: '+18%', icon: TrendingUp }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active': return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'pending': return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'suspended': return { color: 'bg-red-100 text-red-800', icon: XCircle };
      case 'inactive': return { color: 'bg-gray-100 text-gray-800', icon: Pause };
      default: return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || store.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Management</h1>
              <p className="text-gray-600">Manage all vendor stores on the platform</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700">
              Add New Store
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stores by name, owner, or email..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
              <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                <option>All Plans</option>
                <option>Starter</option>
                <option>Professional</option>
                <option>Business</option>
              </select>
              <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stores Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-6 font-semibold text-gray-900">Store</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Owner</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Products</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Orders</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Revenue</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Plan</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store) => {
                  const statusConfig = getStatusConfig(store.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <div className="text-2xl">🏪</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{store.name}</div>
                            <div className="text-sm text-gray-500">{store.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="font-medium text-gray-900">{store.owner}</div>
                        <div className="text-sm text-gray-500">{store.email}</div>
                      </td>
                      <td className="p-6">
                        <div className="font-medium text-gray-900">{store.products}</div>
                      </td>
                      <td className="p-6">
                        <div className="font-medium text-gray-900">{store.orders}</div>
                      </td>
                      <td className="p-6">
                        <div className="font-bold text-gray-900">{store.revenue}</div>
                      </td>
                      <td className="p-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-4 w-4 mr-2" />
                          <span className="capitalize">{store.status}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{store.plan}</span>
                          {store.rating > 0 && (
                            <span className="text-sm text-yellow-600">★ {store.rating}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Edit className="h-5 w-5" />
                          </button>
                          {store.status === 'active' ? (
                            <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                              <Pause className="h-5 w-5" />
                            </button>
                          ) : (
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                              <Play className="h-5 w-5" />
                            </button>
                          )}
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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

        {/* Bulk Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-gray-700">
              Select stores to perform bulk actions
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                Export Stores
              </button>
              <button className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100">
                Approve Selected
              </button>
              <button className="px-6 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100">
                Suspend Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStores;