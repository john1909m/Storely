// src/pages/store/AllProducts.jsx
import React, { useState } from 'react';
import { 
  Search, Filter, Grid, List, 
  Star, ShoppingCart, Heart, 
  Edit, Trash2, Eye, Plus,
  Package, Tag, TrendingUp
} from 'lucide-react';

// Customer View Component
const CustomerProductsView = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const products = [
    { id: 1, name: 'Wireless Bluetooth Headphones', price: 129.99, originalPrice: 159.99, rating: 4.5, reviews: 124, image: '🎧', category: 'Electronics', stock: 42 },
    { id: 2, name: 'Premium Smart Watch', price: 249.99, originalPrice: 299.99, rating: 4.8, reviews: 89, image: '⌚', category: 'Electronics', stock: 18 },
    { id: 3, name: 'Organic Cotton T-Shirt', price: 29.99, originalPrice: 39.99, rating: 4.2, reviews: 56, image: '👕', category: 'Fashion', stock: 156 },
    { id: 4, name: 'Ceramic Coffee Mug Set', price: 39.99, originalPrice: 49.99, rating: 4.7, reviews: 203, image: '☕', category: 'Home', stock: 27 },
    { id: 5, name: 'Yoga Mat Premium', price: 49.99, originalPrice: 59.99, rating: 4.8, reviews: 342, image: '🧘', category: 'Fitness', stock: 63 },
    { id: 6, name: 'Wireless Mouse', price: 34.99, originalPrice: 44.99, rating: 4.3, reviews: 87, image: '🖱️', category: 'Electronics', stock: 94 },
    { id: 7, name: 'Designer Backpack', price: 79.99, originalPrice: 99.99, rating: 4.6, reviews: 231, image: '🎒', category: 'Fashion', stock: 32 },
    { id: 8, name: 'Air Purifier', price: 159.99, originalPrice: 199.99, rating: 4.9, reviews: 156, image: '💨', category: 'Home', stock: 15 },
  ];

  const categories = [
    { name: 'Electronics', count: 12, icon: '📱' },
    { name: 'Fashion', count: 24, icon: '👕' },
    { name: 'Home & Living', count: 18, icon: '🏠' },
    { name: 'Fitness', count: 8, icon: '💪' },
    { name: 'Books', count: 6, icon: '📚' },
    { name: 'Beauty', count: 14, icon: '💄' },
  ];

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Browse our complete collection of products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryToggle(cat.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        selectedCategories.includes(cat.name)
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    defaultValue="250"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>$100 - $250</span>
                    <span>$500+</span>
                  </div>
                </div>
              </div>

              {/* Filters Button */}
              <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{products.length}</span> products
                </div>
                <div className="flex items-center space-x-4">
                  {/* View Mode */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'grid'
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'list'
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
            }>
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div className={`
                    ${viewMode === 'list' ? 'w-48' : 'h-48'}
                    bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center
                  `}>
                    <div className="text-6xl">{product.image}</div>
                  </div>

                  {/* Product Details */}
                  <div className={viewMode === 'list' ? 'flex-1 p-6' : 'p-6'}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-red-500">
                          <Heart className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-blue-500">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                      {product.name}
                    </h3>

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
                      <span className="ml-2 text-sm text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm">
                      {viewMode === 'list' 
                        ? 'Premium quality product with 1-year warranty. Free shipping available.'
                        : 'Premium quality with warranty'
                      }
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500">
                          {product.stock} in stock
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2">
                          <ShoppingCart className="h-5 w-5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center space-x-2">
              {[1, 2, 3, '...', 8].map((page, index) => (
                <button
                  key={index}
                  className={`h-10 w-10 rounded-lg ${
                    page === 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vendor View Component
const VendorProductsView = () => {
  const [products] = useState([
    { 
      id: 1, 
      name: 'Wireless Bluetooth Headphones', 
      price: 129.99, 
      cost: 89.99,
      category: 'Electronics', 
      stock: 42,
      status: 'active',
      sales: 124,
      revenue: '$16,119'
    },
    { 
      id: 2, 
      name: 'Premium Smart Watch', 
      price: 249.99, 
      cost: 179.99,
      category: 'Electronics', 
      stock: 18,
      status: 'active',
      sales: 89,
      revenue: '$22,249'
    },
    { 
      id: 3, 
      name: 'Organic Cotton T-Shirt', 
      price: 29.99, 
      cost: 14.99,
      category: 'Fashion', 
      stock: 156,
      status: 'active',
      sales: 56,
      revenue: '$1,679'
    },
    { 
      id: 4, 
      name: 'Ceramic Coffee Mug Set', 
      price: 39.99, 
      cost: 19.99,
      category: 'Home', 
      stock: 27,
      status: 'low-stock',
      sales: 203,
      revenue: '$8,119'
    },
    { 
      id: 5, 
      name: 'Yoga Mat Premium', 
      price: 49.99, 
      cost: 24.99,
      category: 'Fitness', 
      stock: 63,
      status: 'active',
      sales: 342,
      revenue: '$17,096'
    },
    { 
      id: 6, 
      name: 'Wireless Mouse', 
      price: 34.99, 
      cost: 14.99,
      category: 'Electronics', 
      stock: 0,
      status: 'out-of-stock',
      sales: 87,
      revenue: '$3,044'
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-amber-100 text-amber-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
              <p className="text-gray-600">Manage your store products and inventory</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-green-600">+12%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">6</div>
            <div className="text-gray-600">Total Products</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm font-medium text-green-600">+18%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">901</div>
            <div className="text-gray-600">Total Sales</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Tag className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-sm font-medium text-green-600">+8%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$68,306</div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-sm font-medium text-red-600">-3%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">27</div>
            <div className="text-gray-600">Low Stock Items</div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                </select>
                <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-6 font-semibold text-gray-900">Product</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Category</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Price</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Stock</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Sales</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Revenue</th>
                  <th className="text-left p-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-2xl">🎧</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: PROD-{product.id.toString().padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-gray-700">{product.category}</span>
                    </td>
                    <td className="p-6">
                      <div className="font-semibold text-gray-900">${product.price}</div>
                      <div className="text-sm text-gray-500">Cost: ${product.cost}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                          {product.status === 'active' ? 'In Stock' : 
                           product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                        </div>
                        <div className="text-gray-700">{product.stock} units</div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-medium text-gray-900">{product.sales}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-semibold text-gray-900">{product.revenue}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="h-5 w-5" />
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
                Showing 1 to 6 of 6 products
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Previous
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                  1
                </button>
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
              Select products to perform bulk actions
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                Export Products
              </button>
              <button className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100">
                Update Stock
              </button>
              <button className="px-6 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100">
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main AllProducts Component
const AllProducts = ({ viewType = 'customer' }) => {
  return viewType === 'vendor' ? <VendorProductsView /> : <CustomerProductsView />;
};

export default AllProducts;