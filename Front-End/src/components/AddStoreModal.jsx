// Add Store Modal Component
import React, { useState } from 'react';
import { X, Store, MapPin, Phone, FileText, Palette, Type } from 'lucide-react';
import { storeAPI } from '../api/store.api';
import { useAuth } from '../hooks/useAuth';

const AddStoreModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    storeDescription: '',
    storePhone: '',
    storeLogoUrl: '',
    primaryColor: '#800020',
    secondaryColor: '#ffffff',
    fontFamily: 'Inter',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { vendor } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!vendor?.id) {
      setError('Vendor information not found');
      return;
    }

    setIsLoading(true);

    try {
      const storeData = {
        vendorId: vendor.id,
        storeName: formData.storeName,
        storeAddress: formData.storeAddress,
        storeDescription: formData.storeDescription,
        storePhone: formData.storePhone,
        storeLogoUrl: formData.storeLogoUrl || '',
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        fontFamily: formData.fontFamily,
        storeStatus: 'Inactive', // Default status
        products: [],
        categories: [],
        orders: [],
        customerIds: [],
      };

      const newStore = await storeAPI.add(storeData);
      onSuccess(newStore);
      onClose();
      // Reset form
      setFormData({
        storeName: '',
        storeAddress: '',
        storeDescription: '',
        storePhone: '',
        storeLogoUrl: '',
        primaryColor: '#800020',
        secondaryColor: '#ffffff',
        fontFamily: 'Inter',
      });
    } catch (err) {
      setError(err.message || 'Failed to create store. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Store className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Store</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name *
            </label>
            <div className="relative">
              <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="My Awesome Store"
              />
            </div>
          </div>

          {/* Store Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>
          </div>

          {/* Store Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Description *
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <textarea
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleChange}
                required
                rows={4}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="Describe your store and what you sell..."
              />
            </div>
          </div>

          {/* Store Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Phone *
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="storePhone"
                value={formData.storePhone}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="+1234567890"
              />
            </div>
          </div>

          {/* Store Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Logo URL (Optional)
            </label>
            <input
              type="url"
              name="storeLogoUrl"
              value={formData.storeLogoUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Branding Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Branding</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="relative">
                  <Palette className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="relative">
                  <Palette className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Font Family */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="fontFamily"
                  value={formData.fontFamily}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Your store will be created with "Inactive" status. 
              An admin will review and activate it before customers can see it.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Store className="h-5 w-5" />
                  <span>Create Store</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
