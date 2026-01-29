// Vendor Products Page - Real data from APIs
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, Edit, Trash2, Eye, Plus, Package, Tag, TrendingUp,
  ArrowLeft, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productAPI } from '../../api/product.api';
import { categoryAPI } from '../../api/category.api';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { store } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (store?.id) {
      fetchProducts();
      fetchCategories();
    } else {
      setError('Store not found. Please create a store first.');
      setIsLoading(false);
    }
  }, [store]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storeProducts = await productAPI.getAll(store.id);
      setProducts(Array.isArray(storeProducts) ? storeProducts : []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const storeCategories = await categoryAPI.getByStore(store.id);
      setCategories(Array.isArray(storeCategories) ? storeCategories : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productAPI.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  // Calculate stats from real data
  const stats = {
    total: products.length,
    inStock: products.filter(p => (p.quantity || 0) > 0).length,
    lowStock: products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10).length,
    outOfStock: products.filter(p => (p.quantity || 0) === 0).length,
    totalRevenue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.soldQuantity || 0)), 0)
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      (product.productName || product.name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id?.toString().includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'all' || 
      product.categoryId?.toString() === selectedCategory ||
      product.category?.id?.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
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
            <div className="flex items-center space-x-4">
              <Link
                to="/vendor/store"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
                <p className="text-gray-600">Manage your store products and inventory</p>
              </div>
            </div>
            <Link
              to="/vendor/products/add"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Product</span>
            </Link>
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

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-gray-600">Total Products</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.inStock}</div>
            <div className="text-gray-600">In Stock</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.lowStock}</div>
            <div className="text-gray-600">Low Stock</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName || cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first product'}
            </p>
            <Link
              to="/vendor/products/add"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="p-6 bg-indigo-50 border-b border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="text-indigo-700">
                    {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${selectedProducts.length} product(s)?`)) {
                        selectedProducts.forEach(id => handleDelete(id));
                        setSelectedProducts([]);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-6">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={handleSelectAll}
                        className="h-5 w-5 text-indigo-600 rounded"
                      />
                    </th>
                    <th className="text-left p-6 font-semibold text-gray-900">Product</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Category</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Price</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Stock</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const productName = product.productName || product.name;
                    const productPrice = product.price || 0;
                    const productQuantity = product.quantity || 0;
                    const stockStatus = productQuantity === 0 ? 'out-of-stock' : 
                                       productQuantity < 10 ? 'low-stock' : 'in-stock';
                    
                    return (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-6">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                            className="h-5 w-5 text-indigo-600 rounded"
                          />
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                              {product.images && product.images[0] ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={productName}
                                  className="h-full w-full object-cover rounded-lg"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{productName}</div>
                              <div className="text-sm text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-gray-700">
                            {product.category?.categoryName || product.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="font-semibold text-gray-900">${productPrice.toFixed(2)}</div>
                        </td>
                        <td className="p-6">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            stockStatus === 'in-stock' ? 'bg-green-100 text-green-800' :
                            stockStatus === 'low-stock' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {stockStatus === 'in-stock' ? 'In Stock' : 
                             stockStatus === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{productQuantity} units</div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/store/${store?.storeName}/product/${product.id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => navigate(`/vendor/products/edit/${product.id}`)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
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
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProducts;
