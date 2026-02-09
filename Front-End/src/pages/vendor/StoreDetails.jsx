// src/pages/vendor/StoreDetails.jsx
import React, { useState, useEffect } from 'react';
import {
  Save, Upload, Palette, Globe, Store,
  MapPin, Phone, Mail, Facebook, Instagram,
  Twitter, Youtube, Eye, Image, Link,
  Download, Loader2, AlertCircle, Check
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { storeAPI } from '../../api/store.api';
import { categoryAPI } from '../../api/category.api';

const StoreDetails = () => {
  const { store, user, isVendor, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Store info state
  const [storeInfo, setStoreInfo] = useState({
    storeName: '',
    storeDescription: '',
    storePhone: '',
    storeAddress: '',
    categoryId: '',
    createdAt: '',
    storeStatus:store?.storeStatus || 'Inactive'
  });

  // Branding state
  const [branding, setBranding] = useState({
    primaryColor: '#4f46e5',
    secondaryColor: '#8b5cf6',
    storeLogoUrl: '',
  });

  // Social media state
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: '',
    
  });

  // Available categories
  const [categories, setCategories] = useState([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Fetch store data on component mount
  useEffect(() => {
    if (!authLoading && store) {
      fetchStoreData();
    }
  }, [authLoading, store]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch store details
      if (store?.id) {
        const storeData = await storeAPI.getById(store.id);
        
        // Update store info
        setStoreInfo({
          storeName: storeData.storeName || '',
          storeDescription: storeData.storeDescription || '',
          
          storePhone: storeData.storePhone || '',
          storeAddress: storeData.storeAddress || '',
          categoryId: storeData.categoryId || '',
          createdAt: storeData.createdAt || new Date().toISOString(),
          storeStatus: storeData.storeStatus || 'Inactive'
        });

        // Update branding
        setBranding({
          primaryColor: storeData.primaryColor || '#4f46e5',
          secondaryColor: storeData.secondaryColor || '#8b5cf6',
          storeLogoUrl: storeData.storeLogoUrl || '',
          
        });

        // Update social media
        if (storeData.facebook || storeData.instagram || storeData.twitter || storeData.youtube) {
          setSocialMedia({
            facebook: storeData.facebook || '',
            instagram: storeData.instagram || '',
            
          });
        }
      }

      // Fetch categories
      const storeCategories = await categoryAPI.getByStore(store.id);
      setCategories(storeCategories || []);

    } catch (err) {
      console.error('Error fetching store data:', err);
      setError('Failed to load store data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStoreUrl = () => {
    if (!store?.storeName) return '';
    return `${window.location.origin}/store/${store.storeName}`;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (!store?.id) {
        setError('Store not found. Please create a store first.');
        return;
      }

      // Prepare update data
      const updateData = {
        ...storeInfo,
        ...branding,
        ...socialMedia,
        // Ensure storeId is included
        id: store.id
      };

      // Remove undefined or null values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      console.log('Updating store with data:', updateData);

      // Update store
      const updatedStore = await storeAPI.update(updateData);
      
      setSuccess('Store details updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Error updating store:', err);
      setError(err.message || 'Failed to update store details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file, type) => {
    try {
      if (type === 'logo') {
        setUploadingLogo(true);
      } else {
        setUploadingFavicon(true);
      }

      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('storeId', store.id);

      // Upload image (you'll need to implement this API endpoint)
      const response = await storeAPI.uploadImage(formData);
      
      // Update branding state with new image URL
      if (type === 'logo') {
        setBranding(prev => ({ ...prev, storeLogoUrl: response.url }));
      } 

      setSuccess(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Error uploading image:', err);
      setError(`Failed to upload ${type}. Please try again.`);
    } finally {
      if (type === 'logo') {
        setUploadingLogo(false);
      } else {
        setUploadingFavicon(false);
      }
    }
  };

  const handleRemoveImage = async (type) => {
    try {
      if (!window.confirm(`Are you sure you want to remove the ${type}?`)) {
        return;
      }

      const updateData = {
        storeId: store.id
      };

      if (type === 'logo') {
        updateData.storeLogoUrl = '';
        setBranding(prev => ({ ...prev, storeLogoUrl: '' }));
      } 

      await storeAPI.update(updateData);
      
      setSuccess(`${type === 'logo' ? 'Logo' : 'Favicon'} removed successfully!`);
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Error removing image:', err);
      setError(`Failed to remove ${type}. Please try again.`);
    }
  };

  const handleStoreInfoChange = (field, value) => {
    setStoreInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleBrandingChange = (field, value) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setSocialMedia(prev => ({ ...prev, [platform]: value }));
  };

  const handleDownloadQR = () => {
    if (!getStoreUrl()) {
      setError('Store URL is not set. Please set a store URL first.');
      return;
    }

    const storeUrl = getStoreUrl();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(storeUrl)}`;
    
    // Create a temporary link to download the QR code
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${storeInfo.storeName}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccess('QR Code downloaded successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCopyStoreLink = async () => {
    if (!getStoreUrl()) {
      setError('Store URL is not set. Please set a store URL first.');
      return;
    }

    const storeUrl = getStoreUrl();
    
    try {
      await navigator.clipboard.writeText(storeUrl);
      setSuccess('Store link copied to clipboard!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to copy store link. Please try again.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store data...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
            <p className="text-gray-600 mb-6">You need to create a store first.</p>
            <a
              href="/vendor/store/create"
              className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Create Store
            </a>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Settings</h1>
              <p className="text-gray-600">Customize your store details and branding</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={`https://localhost:5173/store/${storeInfo.storeName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center space-x-2"
              >
                <Eye className="h-5 w-5" />
                <span>Preview Store</span>
              </a>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900">
                <span className="sr-only">Dismiss</span>
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                <span>{success}</span>
              </div>
              <button onClick={() => setSuccess(null)} className="text-green-800 hover:text-green-900">
                <span className="sr-only">Dismiss</span>
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-8">
              <nav className="space-y-2">
                {[
                  { id: 'basic', label: 'Basic Info', icon: Store },
                  { id: 'branding', label: 'Branding', icon: Palette },
                  { id: 'contact', label: 'Contact Info', icon: Mail },
                  { id: 'social', label: 'Social Media', icon: Facebook },
                  { id: 'domain', label: 'Domain & URL', icon: Globe },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Store Preview */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Store Preview</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <div className="h-16 w-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {branding.logoUrl ? (
                      <img 
                        src={branding.logoUrl} 
                        alt="Store Logo"
                        className="h-full w-full object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="text-3xl">🏪</div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 mb-1">{storeInfo.storeName || 'Your Store'}</div>
                    <div className="text-sm text-gray-600">
                      {branding.storeSlug ? `${branding.storeSlug}.storely.com` : `/store/${storeInfo.storeName || 'your-store'}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'basic' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Store Information</h2>
                
                {/* Store Name */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={storeInfo.storeName}
                      onChange={(e) => handleStoreInfoChange('storeName', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Enter your store name"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    This will be displayed as your store name across the platform
                  </p>
                </div>

                {/* Store Description */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Description
                  </label>
                  <textarea
                    value={storeInfo.storeDescription}
                    onChange={(e) => handleStoreInfoChange('description', e.target.value)}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Describe your store and what makes it unique..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    This description appears on your store page. Maximum 500 characters.
                    <span className="ml-2">{storeInfo.storeDescription.length}/500</span>
                  </p>
                </div>

                

                {/* Year Established */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={storeInfo.createdAt ? new Date(storeInfo.createdAt).toLocaleDateString('en-GB') : ''}
                    onChange={(e) => handleStoreInfoChange('establishedYear', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="e.g., 2022"
                  />
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Branding</h2>
                
                {/* Logo */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Store Logo
                  </label>
                  <div className="flex items-center space-x-8">
                    <div className="h-32 w-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                      {branding.logoUrl ? (
                        <img 
                          src={branding.logoUrl} 
                          alt="Store Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-5xl">🏪</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <label className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center space-x-2 cursor-pointer">
                          {uploadingLogo ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-5 w-5" />
                              <span>Upload Logo</span>
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleImageUpload(file, 'logo');
                            }}
                          />
                        </label>
                        {branding.logoUrl && (
                          <button 
                            onClick={() => handleRemoveImage('logo')}
                            className="px-6 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100"
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Recommended size: 400x400px, PNG or JPG format, max 2MB
                      </p>
                    </div>
                  </div>
                </div>
                

                {/* Color Scheme */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Scheme</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <div
                          className="h-12 w-12 rounded-xl border-2 border-gray-200"
                          style={{ backgroundColor: branding.primaryColor }}
                        ></div>
                        <input
                          type="text"
                          value={branding.primaryColor}
                          onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="#4f46e5"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <div
                          className="h-12 w-12 rounded-xl border-2 border-gray-200"
                          style={{ backgroundColor: branding.secondaryColor }}
                        ></div>
                        <input
                          type="text"
                          value={branding.secondaryColor}
                          onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Primary color is used for buttons and highlights. Secondary color for accents.
                  </p>
                </div>

                {/* Preview */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 mb-4">Brand Preview</h3>
                  <div className="flex items-center space-x-6">
                    <div className="h-20 w-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden">
                      {branding.logoUrl ? (
                        <img 
                          src={branding.logoUrl} 
                          alt="Store Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl">🏪</div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-xl mb-2">{storeInfo.storeName || 'Your Store'}</div>
                      <div className="flex items-center space-x-4">
                        <div
                          className="h-8 w-32 rounded-lg"
                          style={{ backgroundColor: branding.primaryColor }}
                        ></div>
                        <div
                          className="h-8 w-32 rounded-lg"
                          style={{ backgroundColor: branding.secondaryColor }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                {/* Contact Details */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={storeInfo.storePhone}
                        onChange={(e) => handleStoreInfoChange('storePhone', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <textarea
                        value={storeInfo.storeAddress}
                        onChange={(e) => handleStoreInfoChange('storeAddress', e.target.value)}
                        rows={3}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="Enter your business address"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Displayed for customers and used for shipping calculations
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Media Profiles</h2>
                <p className="text-gray-600 mb-8">
                  Connect your social media accounts to build trust with customers
                </p>

                <div className="space-y-6">
                  {/* Facebook */}
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Facebook className="h-5 w-5 text-blue-600" />
                      <label className="text-sm font-medium text-gray-700">Facebook</label>
                    </div>
                    <div className="flex items-center">
                      <span className="px-4 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                        facebook.com/
                      </span>
                      <input
                        type="text"
                        value={socialMedia.facebook}
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="yourstore"
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Instagram className="h-5 w-5 text-pink-600" />
                      <label className="text-sm font-medium text-gray-700">Instagram</label>
                    </div>
                    <div className="flex items-center">
                      <span className="px-4 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                        instagram.com/
                      </span>
                      <input
                        type="text"
                        value={socialMedia.instagram}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="yourstore"
                      />
                    </div>
                  </div>

                  
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm text-blue-800">
                    Social media links will be displayed on your store page to help customers connect with you.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'domain' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Domain & Store URL</h2>
                
                {/* Store URL */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store URL
                  </label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500">
                      {getStoreUrl()}
                    </span>
                    
                    
                  </div>
                  
                </div>

               
               

                {/* QR Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Store QR Code
                  </label>
                  <div className="flex items-center space-x-8">
                    <div className="h-48 w-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                      {getStoreUrl() ? (
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${getStoreUrl()}`}
                          alt="QR Code"
                          className="h-40 w-40"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-2">📱</div>
                          <div className="text-sm text-gray-600">Set store URL to generate QR</div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Share Your Store</h3>
                      <p className="text-gray-600 mb-4">
                        Share this QR code to help customers find your store easily.
                      </p>
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={handleDownloadQR}
                          disabled={!getStoreUrl()}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <Download className="h-5 w-5" />
                          <span>Download QR Code</span>
                        </button>
                        <button 
                          onClick={handleCopyStoreLink}
                          disabled={!getStoreUrl()}
                          className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <Link className="h-5 w-5" />
                          <span>Copy Store Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;