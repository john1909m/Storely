// src/pages/dashboard/VendorDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, Package, TrendingUp, Users,
  Plus, ShoppingBag, BarChart, Settings
} from 'lucide-react';

const VendorDashboard = () => {
  const stats = [
    { label: 'Total Orders', value: '142', change: '+12%', icon: ShoppingBag },
    { label: 'Total Products', value: '28', change: '+5%', icon: Package },
    { label: 'Total Revenue', value: '$8,425', change: '+18%', icon: TrendingUp },
    { label: 'Customers', value: '89', change: '+7%', icon: Users },
  ];

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
            <div className="flex items-center space-x-4">
              <Link to="/vendor/store" className="text-indigo-600 hover:text-indigo-500">
                View Store →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
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
                <Link to="/vendor/store-settings" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                  <Settings className="h-5 w-5" />
                  <span>Store Settings</span>
                </Link>
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/vendor/products" className="block p-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add New Product</span>
                  </Link>
                  <Link to="/vendor/store-settings" className="block p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                    Update Store Info
                  </Link>
                  <Link to="/vendor/support" className="block p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                    Contact Support
                  </Link>
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
                <Link to="/vendor/orders" className="text-indigo-600 hover:text-indigo-500">
                  View all →
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  { time: '2 hours ago', action: 'New order #ORD-1245 received', amount: '$129.99' },
                  { time: '5 hours ago', action: 'Product "Wireless Headphones" updated', amount: '' },
                  { time: '1 day ago', action: 'New customer review received', amount: '⭐ 5 stars' },
                  { time: '2 days ago', action: 'Payment processed for order #ORD-1240', amount: '$89.99' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">{activity.action}</div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                    {activity.amount && (
                      <div className="font-semibold text-gray-900">{activity.amount}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/vendor/products" className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100 hover:border-indigo-200 transition-all">
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <Package className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Manage Products</h3>
                <p className="text-gray-600 mb-4">Add, edit, or remove products from your store</p>
                <span className="text-indigo-600 font-medium">Go to Products →</span>
              </Link>
              <Link to="/vendor/orders" className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:border-green-200 transition-all">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Process Orders</h3>
                <p className="text-gray-600 mb-4">View and manage customer orders</p>
                <span className="text-green-600 font-medium">Go to Orders →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;