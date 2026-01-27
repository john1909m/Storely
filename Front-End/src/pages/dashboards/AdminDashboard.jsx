// src/pages/dashboard/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store, Users, DollarSign, TrendingUp,
  BarChart, Settings, Shield, AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Stores', value: '6', change: '+12%', icon: Store },
    { label: 'Total Vendors', value: '5', change: '+8%', icon: Users },
    { label: 'Total Revenue', value: '$64,167', change: '+18%', icon: DollarSign },
    { label: 'Platform Growth', value: '24%', change: '+3%', icon: TrendingUp },
  ];

  const recentActivity = [
    { time: '2 hours ago', action: 'New store "TechGadget" approved', user: 'John Smith' },
    { time: '5 hours ago', action: 'Store "Fashion Hub" upgraded to Business plan', user: 'Sarah Johnson' },
    { time: '1 day ago', action: 'Payment processed for 15 vendors', user: 'System' },
    { time: '2 days ago', action: 'Platform maintenance completed', user: 'Admin' },
  ];

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
              <Shield className="h-5 w-5 text-indigo-600" />
              <span className="text-gray-600">Administrator Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Platform Stats */}
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
                <Link to="/admin/pricing" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                  <span>Pricing Management</span>
                </Link>
                <Link to="/admin/users" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                  <Users className="h-5 w-5" />
                  <span>User Management</span>
                </Link>
                <Link to="/admin/settings" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                  <Settings className="h-5 w-5" />
                  <span>Platform Settings</span>
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
                    <span className="text-gray-600">Database</span>
                    <span className="text-green-600 font-medium">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payments</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                <Link to="/admin/activity" className="text-indigo-600 hover:text-indigo-500">
                  View all →
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">{activity.action}</div>
                      <div className="text-sm text-gray-500">
                        {activity.time} • By {activity.user}
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-500 text-sm">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
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
            <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Pending Actions</h3>
                  <p className="text-gray-700 mb-4">
                    You have 1 store pending approval and 2 vendor support tickets waiting for review.
                  </p>
                  <div className="flex items-center space-x-4">
                    <Link to="/admin/stores" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                      Review Stores
                    </Link>
                    <Link to="/admin/support" className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">
                      View Tickets
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;