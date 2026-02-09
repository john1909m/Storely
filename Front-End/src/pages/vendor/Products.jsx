// Vendor Products Page - Fixed with proper auth handling and edit modal
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Search, Edit, Trash2, Eye, Plus, Package, Tag, TrendingUp,
  ArrowLeft, AlertCircle, X, Save, Image, DollarSign, Hash,
  BookOpen, Globe, Layers, Check, Move, Loader2, FileTypeCorner
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productAPI } from '../../api/product.api';
import { categoryAPI } from '../../api/category.api';
import { storeAPI } from '../../api/store.api';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Get auth data from your custom hook
  const { 
    store, 
    isVendor, 
    isLoading: authLoading, 
    isAuthenticated,
    setStore 
  } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    imageUrls: [],
    imageAltText: [],
    imagePosition: [],
    storeId: store.id
  });

  // Edit product form state
  const [editProduct, setEditProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    imageUrls: [],
    imageAltText: [],
    imagePosition: [],
    storeId: store.id
  });

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    // Wait for auth to initialize
    if (authLoading) {
      return;
    }

    // Check if user is authenticated and is a vendor
    if (!isAuthenticated || !isVendor) {
      setError('Access denied. Please log in as a vendor.');
      setIsLoading(false);
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // Check if vendor has a store
    if (!store || !store.id) {
      setError('You need to create a store first before managing products.');
      setIsLoading(false);
      navigate('/vendor/store/create');
      return;
    }

    // Fetch data
    fetchData();
  }, [authLoading, isAuthenticated, isVendor, store, navigate, location]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch products
      const storeProducts = await productAPI.getAll(store.id);
      setProducts(Array.isArray(storeProducts) ? storeProducts : []);
      
      // Fetch categories
      const storeCategories = await categoryAPI.getByStore(store.id);
      setCategories(Array.isArray(storeCategories) ? storeCategories : []);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
      setProducts([]);
      setCategories([]);
      
      // Check if store still exists
      if (err.message?.includes('not found') || err.response?.status === 404) {
        setError('Store not found. Please create a new store.');
        // Clear store from auth state
        setStore(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProduct(true);
      
      if (!store?.id) {
        alert('Store not found. Please refresh the page.');
        return;
      }
      
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        categoryId: newProduct.categoryId ? parseInt(newProduct.categoryId) : null,
        storeId: store.id,
        images: newProduct.imageUrls,
        imagesAltText: newProduct.imageAltText,
        imagesPosition: newProduct.imagePosition
      };
      
      const createdProduct = await productAPI.add(productData);
      setProducts(prev => [...prev, createdProduct]);
      
      // Reset form and close modal
      setNewProduct({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
        imageUrls: [],
        imageAltText: [],
        imagePosition: []
      });
      setShowAddProductModal(false);
      
    } catch (err) {
      alert(`Failed to add product: ${err.message}`);
      console.error('Error adding product:', err);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProduct(true);
      
      if (!store?.id || !editProduct.id) {
        alert('Product or store not found. Please refresh the page.');
        return;
      }
      
      const productData = {
        name: editProduct.name,
        description: editProduct.description,
        price: parseFloat(editProduct.price),
        quantity: parseInt(editProduct.quantity),
        categoryId: editProduct.categoryId ? parseInt(editProduct.categoryId) : null,
        images: editProduct.imageUrls,
        imagesAltText: editProduct.imageAltText,
        imagesPosition: editProduct.imagePosition,
        storeId: store.id
      };
      
      const updatedProduct = await productAPI.update(editProduct);
      
      // Update products list
      setProducts(prev => prev.map(p => 
        p.id === editProduct.id ? updatedProduct : p
      ));
      
      // Reset form and close modal
      setEditProduct({
        id: editProduct.id,
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
        imageUrls: [],
        imageAltText: [],
        imagePosition: [],
        storeId: store.id
      });
      setShowEditProductModal(false);
      setEditingProduct(null);
      
    } catch (err) {
      alert(`Failed to update product: ${err.message}`);
      console.error('Error updating product:', err);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      setIsSavingCategory(true);
      
      if (!store?.id) {
        alert('Store not found. Please refresh the page.');
        return;
      }
      
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        storeId: store.id
      };
      
      const createdCategory = await categoryAPI.add(categoryData);
      setCategories(prev => [...prev, createdCategory]);
      
      // Reset form and close modal
      setNewCategory({
        name: '',
        description: ''
      });
      setShowAddCategoryModal(false);
      
    } catch (err) {
      alert(`Failed to add category: ${err.message}`);
      console.error('Error adding category:', err);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productAPI.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
      setSelectedProducts(prev => prev.filter(id => id !== productId));
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

  const handleEditClick = (product) => {
    setEditingProduct(product);
    
    // Prepare the edit form with product data
    setEditProduct({
      id: product.id,
      name: product.productName || product.name || '',
      description: product.description || '',
      price: product.price || '',
      quantity: product.quantity || '',
      categoryId: product.categoryId || product.category?.id || '',
      imageUrls: product.images || [],
      imageAltText: product.imagesAltText || [],
      imagePosition: product.imagesPosition || [],
      storeId: store.id
    });
    
    setShowEditProductModal(true);
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

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Go to Login
              </Link>
              <Link
                to="/vendor/store"
                className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Back to Store
              </Link>
            </div>
          </div>
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
                <p className="text-gray-600">
                  Managing products for {store?.storeName || 'your store'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl hover:from-emerald-700 hover:to-green-600 transition-all shadow-md flex items-center space-x-2"
              >
                <Tag className="h-5 w-5" />
                <span>Add Category</span>
              </button>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={fetchData}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg"
              >
                Retry
              </button>
            </div>
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl hover:from-emerald-700 hover:to-green-600 transition-all flex items-center space-x-2"
              >
                <Tag className="h-5 w-5" />
                <span>Add Category First</span>
              </button>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Product</span>
              </button>
            </div>
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
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                            {product.categoryName || product.category?.name || 'Uncategorized'}
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
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(product)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                <div className="text-gray-600">
                  {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} available
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct}>
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Enter product name"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      required
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Describe your product..."
                    />
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                        required
                        min="0"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddProductModal(false);
                        setShowAddCategoryModal(true);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New Category
                    </button>
                  </div>
                  {categories.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                      <p className="text-amber-700 mb-3">No categories found. Please add a category first.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddProductModal(false);
                          setShowAddCategoryModal(true);
                        }}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Add First Category
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={newProduct.categoryId}
                        onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none"
                      >
                        <option value="">Select a category</option>
                        <option value="">Uncategorized</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.categoryName || cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Image URLs (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URLs (one per line, optional)
                  </label>
                  <div className="relative">
                    <Image className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={newProduct.imageUrls.join('\n')}
                      onChange={(e) => setNewProduct({
                        ...newProduct, 
                        imageUrls: e.target.value.split('\n').filter(url => url.trim())
                      })}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (one per line, optional)
                  </label>
                  <div className='relative'>
                    <FileTypeCorner className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={newProduct.imageAltText.join('\n')}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        imageAltText: e.target.value.split('\n').filter(text => text.trim())
                      })}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Image 1 alt text&#10;Image 2 alt text"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images Position (optional)
                  </label>
                  <div className="relative">
                    <Move className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={newProduct.imagePosition.join('\n')}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        imagePosition: e.target.value.split('\n').filter(pos => pos.trim())
                      })}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Image 1 position&#10;Image 2 position"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  disabled={isSavingProduct}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct || categories.length === 0}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingProduct ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Adding Product...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Add Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <button
                onClick={() => {
                  setShowEditProductModal(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditProduct}>
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Enter product name"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={editProduct.description}
                      onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                      required
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Describe your product..."
                    />
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={editProduct.price}
                        onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={editProduct.quantity}
                        onChange={(e) => setEditProduct({...editProduct, quantity: e.target.value})}
                        required
                        min="0"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditProductModal(false);
                        setShowAddCategoryModal(true);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New Category
                    </button>
                  </div>
                  {categories.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                      <p className="text-amber-700 mb-3">No categories found. Please add a category first.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditProductModal(false);
                          setShowAddCategoryModal(true);
                        }}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Add First Category
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={editProduct.categoryId || ''}
                        onChange={(e) => setEditProduct({...editProduct, categoryId: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none"
                      >
                        <option value="">Uncategorized</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.categoryName || cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Image URLs (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URLs (one per line, optional)
                  </label>
                  <div className="relative">
                    <Image className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={editProduct.imageUrls.join('\n')}
                      onChange={(e) => setEditProduct({
                        ...editProduct, 
                        imageUrls: e.target.value.split('\n').filter(url => url.trim())
                      })}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (one per line, optional)
                  </label>
                  <div className='relative'>
                    <FileTypeCorner className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={editProduct.imageAltText.join('\n')}
                      onChange={(e) => setEditProduct({
                        ...editProduct,
                        imageAltText: e.target.value.split('\n').filter(text => text.trim())
                      })}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Image 1 alt text&#10;Image 2 alt text"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images Position (optional)
                  </label>
                  <div className="relative">
                    <Move className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={editProduct.imagePosition.join('\n')}
                      onChange={(e) => setEditProduct({
                        ...editProduct,
                        imagePosition: e.target.value.split('\n').filter(pos => pos.trim())
                      })}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Image 1 position&#10;Image 2 position"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProductModal(false);
                    setEditingProduct(null);
                  }}
                  disabled={isSavingProduct}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingProduct ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Updating Product...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Update Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddCategory}>
              <div className="space-y-6">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Electronics, Clothing, etc."
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Describe this category..."
                    />
                  </div>
                </div>

                {/* Existing Categories */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Existing Categories
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <div 
                          key={cat.id} 
                          className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                        >
                          <span className="font-medium text-gray-700 truncate">
                            {cat.categoryName || cat.name}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {cat.products?.length || 0} products
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  disabled={isSavingCategory}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCategory}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl hover:from-emerald-700 hover:to-green-600 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {isSavingCategory ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Adding Category...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Add Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;