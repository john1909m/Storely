// src/pages/vendor/ManageCategories.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search, Filter, Plus, Edit, Trash2, ArrowLeft,
  Loader2, AlertCircle, Check, X, FolderOpen,
  Package, Clock, Sparkles, Save, Tag, Layers,
  ChevronDown, ChevronUp, MoreVertical, Eye
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { categoryAPI } from '../../api/category.api';
import { productAPI } from '../../api/product.api';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const ManageCategories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Form state for new category
  const [newCategory, setNewCategory] = useState({
    name: '',
  });

  // Form state for edit category
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
  });

  const { store } = useAuth();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (store?.id) {
      fetchData();
    }
  }, [store]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesData = await categoryAPI.getByStore(store.id);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      
      const productsData = await productAPI.getAll(store.id);
      setProducts(Array.isArray(productsData) ? productsData : []);
      
    } catch (err) {
      handleError(err);
      setError(t('vendorCategories.errors.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const getProductCountByCategory = (categoryId) => {
    return products.filter(p => p.categoryId === categoryId || p.category?.id === categoryId).length;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      setError(t('vendorCategories.errors.categoryNameRequired'));
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const categoryData = {
        name: newCategory.name,
        storeId: store.id
      };

      const created = await categoryAPI.add(categoryData);
      setCategories(prev => [...prev, created]);
      
      setSuccess(t('vendorCategories.success.categoryAdded'));
      setTimeout(() => setSuccess(null), 3000);
      
      resetAddForm();
      setShowAddModal(false);
      
    } catch (err) {
      handleError(err);
      setError(t('vendorCategories.errors.failedToAdd'));
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    
    if (!editForm.name.trim()) {
      setError(t('vendorCategories.errors.categoryNameRequired'));
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updated = await categoryAPI.update({
        id: editForm.id,
        name: editForm.name,
        storeId: store.id
      });

      setCategories(prev => prev.map(c => c.id === editForm.id ? updated : c));
      
      setSuccess(t('vendorCategories.success.categoryUpdated'));
      setTimeout(() => setSuccess(null), 3000);
      
      resetEditForm();
      setShowEditModal(false);
      
    } catch (err) {
      handleError(err);
      setError(t('vendorCategories.errors.failedToUpdate'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const productCount = getProductCountByCategory(categoryId);
    
    if (productCount > 0) {
      setError(t('vendorCategories.errors.categoryHasProducts'));
      return;
    }

    if (!window.confirm(t('vendorCategories.confirm.deleteCategory'))) {
      return;
    }

    try {
      await categoryAPI.delete(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
      
      setSuccess(t('vendorCategories.success.categoryDeleted'));
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      handleError(err);
      setError(t('vendorCategories.errors.failedToDelete'));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return;
    
    if (!window.confirm(t('vendorCategories.confirm.bulkDelete', { count: selectedCategories.length }))) {
      return;
    }

    try {
      await Promise.all(selectedCategories.map(id => categoryAPI.delete(id)));
      setCategories(prev => prev.filter(c => !selectedCategories.includes(c.id)));
      setSelectedCategories([]);
      
      setSuccess(t('vendorCategories.success.categoriesDeleted', { count: selectedCategories.length }));
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      handleError(err);
      setError(t('vendorCategories.errors.failedToDeleteCategories'));
    }
  };

  const resetAddForm = () => {
    setNewCategory({
      name: '',
    });
  };

  const resetEditForm = () => {
    setEditForm({
      id: '',
      name: '',
    });
    setEditingCategory(null);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setEditForm({
      id: category.id,
      name: category.name || '',
    });
    setShowEditModal(true);
  };

  const toggleRowExpand = (categoryId) => {
    setExpandedRows(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map(c => c.id));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
  };

  const stats = {
    total: categories.length,
    withProducts: categories.filter(c => getProductCountByCategory(c.id) > 0).length
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchQuery || 
      category.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <Layers className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 font-medium">{t('vendorCategories.loading.categories')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Link
                to="/vendor/store"
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Layers className="h-6 w-6 mr-2 text-indigo-600" />
                  {t('vendorCategories.title')}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {store?.storeName} • {stats.total} {t('vendorCategories.categories')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="hidden sm:flex px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">{t('vendorCategories.filters')}</span>
              </button>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">{t('vendorCategories.addCategory')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5" />
              <span className="text-sm">{success}</span>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-800 hover:text-green-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Layers className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">{t('vendorCategories.stats.totalCategories')}</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.withProducts}</div>
            <div className="text-sm text-gray-600">{t('vendorCategories.stats.withProducts')}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('vendorCategories.search.placeholder')}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Categories Table */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-20 w-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('vendorCategories.empty.title')}</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? t('vendorCategories.empty.adjustSearch') : t('vendorCategories.empty.createFirst')}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                {t('vendorCategories.empty.addCategory')}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            {selectedCategories.length > 0 && (
              <div className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                    {selectedCategories.length} {t('vendorCategories.selected')}
                  </span>
                </div>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{t('vendorCategories.deleteSelected')}</span>
                </button>
              </div>
            )}

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-6 w-12">
                        <input
                          type="checkbox"
                          checked={selectedCategories.length === filteredCategories.length}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                      </th>
                      <th className="text-left p-6 font-semibold text-gray-900">{t('vendorCategories.table.category')}</th>
                      <th className="text-left p-6 font-semibold text-gray-900">{t('vendorCategories.table.products')}</th>
                      <th className="text-left p-6 font-semibold text-gray-900">{t('vendorCategories.table.actions')}</th>
                      <th className="p-6 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => {
                      const productCount = getProductCountByCategory(category.id);
                      const isExpanded = expandedRows.includes(category.id);
                      
                      return (
                        <React.Fragment key={category.id}>
                          <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-6">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleSelectCategory(category.id)}
                                className="h-4 w-4 text-indigo-600 rounded"
                              />
                            </td>
                            <td className="p-6">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                                  {category.imageUrl ? (
                                    <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover rounded-lg" />
                                  ) : (
                                    <FolderOpen className="h-5 w-5 text-indigo-600" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{category.name}</div>
                                  <div className="text-xs text-gray-500">ID: {category.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{productCount}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openEditModal(category)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title={t('vendorCategories.edit')}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title={t('vendorCategories.delete')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="p-6">
                              <button
                                onClick={() => toggleRowExpand(category.id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-500" />
                                )}
                              </button>
                            </td>
                          </tr>
                          
                          {/* Expanded Details */}
                          {isExpanded && (
                            <tr className="bg-gray-50">
                              <td colSpan="5" className="p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('vendorCategories.expanded.categoryDetails')}</h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <span className="text-gray-500">{t('vendorCategories.expanded.name')}:</span>
                                        <span className="ml-2 text-gray-900">{category.name}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('vendorCategories.expanded.productsInCategory')}</h4>
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-600">{t('vendorCategories.expanded.totalProducts')}:</span>
                                        <span className="font-bold text-indigo-600">{productCount}</span>
                                      </div>
                                      {productCount === 0 && (
                                        <p className="text-xs text-gray-500 mt-2">{t('vendorCategories.expanded.noProducts')}</p>
                                      )}
                                    </div>
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
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredCategories.map((category) => {
                const productCount = getProductCountByCategory(category.id);
                
                return (
                  <div key={category.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleSelectCategory(category.id)}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                          {category.imageUrl ? (
                            <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover rounded-lg" />
                          ) : (
                            <FolderOpen className="h-5 w-5 text-indigo-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <div className="text-xs text-gray-500">ID: {category.id}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{productCount} {t('vendorCategories.products')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-sm text-gray-500">
              {t('vendorCategories.showing', { count: filteredCategories.length, total: categories.length })}
            </div>
          </>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('vendorCategories.modal.add.title')}</h2>
              <button
                onClick={() => {
                  resetAddForm();
                  setShowAddModal(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('vendorCategories.modal.add.categoryName')} *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder={t('vendorCategories.modal.add.namePlaceholder')}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t('vendorCategories.modal.add.adding')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{t('vendorCategories.modal.add.addCategory')}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetAddForm();
                    setShowAddModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  {t('vendorCategories.modal.add.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('vendorCategories.modal.edit.title')}</h2>
              <button
                onClick={() => {
                  resetEditForm();
                  setShowEditModal(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleEditCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('vendorCategories.modal.edit.categoryName')} *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t('vendorCategories.modal.edit.saving')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{t('vendorCategories.modal.edit.saveChanges')}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetEditForm();
                    setShowEditModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  {t('vendorCategories.modal.edit.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;