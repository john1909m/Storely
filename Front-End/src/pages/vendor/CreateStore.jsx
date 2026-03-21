// Vendor Create Store Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Phone, FileText, Palette, Type, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { storeAPI } from '../../api/store.api';
import { Link } from 'react-router-dom';
import StoreFooter from '../../components/StoreFooter';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useTranslation } from 'react-i18next';

const CreateStore = () => {
  const { t } = useTranslation();
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
  const { vendor, setStore, isVendor } = useAuth();
  const navigate = useNavigate();
    const { handleError } = useErrorHandler();

  // Redirect if not vendor or already has store
  useEffect(() => {
    if (!isVendor()) {
      navigate('/login', { replace: true });
      return;
    }
    // If vendor already has store, redirect to store page
    // This will be checked via the auth store
  }, [isVendor, navigate]);

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
      setError(t('vendor.createStore.errors.vendorNotFound'));
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
        storeStatus: 'Inactive', // Store is inactive immediately after creation
        products: [],
        categories: [],
        orders: [],
        customerIds: [],
      };

      const newStore = await storeAPI.add(storeData);
      
      // Update auth store with new store
      setStore(newStore);
      
      // Redirect to vendor store page
      navigate('/vendor/store', { replace: true });
    } catch (err) {
      handleError(err);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/vendor/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('vendor.createStore.backToDashboard')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t('vendor.createStore.title')}</h1>
          <p className="text-gray-600 mt-2">{t('vendor.createStore.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('vendor.createStore.form.storeName')} * <span className='text-red-700'>{t('vendor.createStore.form.storeNameHint')}</span>
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
              <p className="mt-2 text-sm text-gray-500">
                {(() => {
                  const slug =
                    formData.storeName.toLowerCase().replace(/\s+/g, '-') || 'your-store';
                  return t('vendor.createStore.form.storeUrlWillBe', {
                    url: `storely.com/store/${slug}`,
                  });
                })()}
              </p>
            </div>

            {/* Store Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('vendor.createStore.form.storeAddress')} *
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
                {t('vendor.createStore.form.storeDescription')} *
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
                {t('vendor.createStore.form.storePhone')} *
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

            
            

            {/* Branding Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('vendor.createStore.form.brandingTitle')}</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vendor.createStore.form.primaryColor')}
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
                    {t('vendor.createStore.form.secondaryColor')}
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
                
                <div className="relative">
                  
                  <select
                    name="fontFamily"
                    value={formData.fontFamily}
                    onChange={handleChange}
                    hidden
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
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800 flex items-center">
                <Check className="h-4 w-4 mr-2" />
                {t('vendor.createStore.form.infoMessage')}

              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/vendor/dashboard')}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
                disabled={isLoading}
              >
                {t('vendor.createStore.form.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('vendor.createStore.form.createButton.creating')}</span>
                  </>
                ) : (
                  <>
                    <Store className="h-5 w-5" />
                    <span>{t('vendor.createStore.form.createButton.createStore')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default CreateStore;
