// src/pages/store/StoreHome.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShoppingBag, Star, Truck, Shield, 
  Plus, BarChart, Package, Users,
  Filter, Search, Heart, ShoppingCart
} from 'lucide-react';

// Customer View Component
const CustomerStoreView = () => {
  const { storeId } = useParams();
  const [products] = useState([
    { id: 1, name: 'Wireless Headphones', price: 129.99, rating: 4.5, image: '🎧', category: 'Electronics' },
    { id: 2, name: 'Organic Cotton T-Shirt', price: 29.99, rating: 4.2, image: '👕', category: 'Fashion' },
    { id: 3, name: 'Ceramic Coffee Mug', price: 19.99, rating: 4.7, image: '☕', category: 'Home' },
    { id: 4, name: 'Yoga Mat Premium', price: 49.99, rating: 4.8, image: '🧘', category: 'Fitness' },
  ]);

  const [categories] = useState([
    { name: 'Electronics', count: 12 },
    { name: 'Fashion', count: 24 },
    { name: 'Home & Living', count: 18 },
    { name: 'Fitness', count: 8 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <div className="text-4xl">🏪</div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">TechGadget Store</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-300 fill-current" />
                  <span className="ml-1">4.8 (124 reviews)</span>
                </div>
                <div className="flex items-center">
                  <Truck className="h-5 w-5" />
                  <span className="ml-1">Free shipping</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5" />
                  <span className="ml-1">Verified seller</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter</span>
              </button>
              <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart (3)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-xl p-6 text-center border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-3xl mb-3">📱</div>
                <div className="font-semibold text-gray-900">{category.name}</div>
                <div className="text-sm text-gray-500">{category.count} products</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <button className="text-indigo-600 hover:text-indigo-500 font-medium">
              View all →
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="text-6xl">{product.image}</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <button className="text-gray-400 hover:text-red-500">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">${product.price}</div>
                      <div className="text-sm text-gray-500 line-through">$149.99</div>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Info */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About This Store</h3>
          <p className="text-gray-600 mb-6">
            TechGadget Store offers premium electronics and gadgets with free shipping and 1-year warranty on all products. 
            We focus on quality and customer satisfaction.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Free Shipping</div>
                <div className="text-sm text-gray-500">On orders over $50</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Secure Payment</div>
                <div className="text-sm text-gray-500">100% secure checkout</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">4.8 Rating</div>
                <div className="text-sm text-gray-500">Based on 124 reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vendor View Component
const VendorStoreView = () => {
  const [storeStatus] = useState('active');
  const [storeStats] = useState([
    { label: 'Total Orders', value: '142', change: '+12%', icon: Package },
    { label: 'Total Products', value: '28', change: '+5%', icon: ShoppingBag },
    { label: 'Total Revenue', value: '$8,425', change: '+18%', icon: BarChart },
    { label: 'Customers', value: '89', change: '+7%', icon: Users },
  ]);

  const [quickActions] = useState([
    { label: 'Add New Product', icon: Plus, color: 'indigo' },
    { label: 'View Orders', icon: ShoppingBag, color: 'blue' },
    { label: 'Manage Inventory', icon: Package, color: 'green' },
    { label: 'View Analytics', icon: BarChart, color: 'purple' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="text-3xl">🏪</div>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">My Store Dashboard</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    storeStatus === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {storeStatus === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </div>
                <p className="text-gray-600">storely.com/mystore</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md">
              Store Settings
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Store Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {storeStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
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
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className={`bg-white rounded-xl p-6 border border-gray-100 hover:border-${action.color}-200 hover:shadow-lg transition-all text-left`}
              >
                <div className={`h-12 w-12 bg-${action.color}-50 rounded-xl flex items-center justify-center mb-4`}>
                  <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                </div>
                <div className="font-semibold text-gray-900">{action.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-indigo-600 hover:text-indigo-500 font-medium">
              View all activity →
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { time: '2 hours ago', action: 'New order #ORD-1245', amount: '$129.99' },
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

        {/* Store Performance */}
        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Store Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700">Conversion Rate</span>
                  <span className="font-semibold text-green-600">4.8%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full w-4/5"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700">Customer Satisfaction</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full w-9/10"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700">Inventory Turnover</span>
                  <span className="font-semibold text-yellow-600">68%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-yellow-500 rounded-full w-2/3"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Store Health</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Store Active</div>
                    <div className="text-sm text-gray-500">Your store is live and receiving orders</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Verified Account</div>
                    <div className="text-sm text-gray-500">Identity verified and trusted</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Action Required</div>
                    <div className="text-sm text-gray-500">Update shipping rates for new zone</div>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100">
                  Fix Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main StoreHome Component
const StoreHome = ({ viewType = 'customer' }) => {
  return viewType === 'vendor' ? <VendorStoreView /> : <CustomerStoreView />;
};

export default StoreHome;