// src/pages/vendor/StoreDetails.jsx
import React, { useState, useEffect } from 'react';
import {
  Save, Upload, Palette, Globe, Store,
  MapPin, Phone, Mail, Facebook, Instagram,
  Eye, Image, Download, Loader2, AlertCircle, Check,
  ChevronRight, Menu, X, Copy, QrCode,
  Brush, Building2, Clock, Calendar,
  Tag, Sparkles, ImagePlus, Trash2,
  Truck, Plus, Minus, Edit3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { storeAPI } from '../../api/store.api';
import { categoryAPI } from '../../api/category.api';
import { shippingAPI } from '../../api/shipping.api';
import StoreFooter from '../../components/StoreFooter';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import useAuthStore from '../../store/authStore';

// Add styles for animations
const styles = `
  @keyframes slideLeft {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .animate-slide-left {
    animation: slideLeft 0.3s ease-out;
  }

  .animate-slide-down {
    animation: slideDown 0.3s ease-out;
  }

  .animate-pulse-slow {
    animation: pulse 2s ease-in-out infinite;
  }

  .ml-13 {
    margin-left: 3.25rem;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .shipping-card-enter {
    animation: slideDown 0.3s ease-out;
  }
`;

const StoreDetails = () => {
  const { store, vendor, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleError } = useErrorHandler();
  const { authInialized } = useAuthStore();

  // Store info state
  const [storeInfo, setStoreInfo] = useState({
    storeName: '',
    storeDescription: '',
    storePhone: '',
    storeAddress: '',
    categoryId: '',
    createdAt: '',
    storeStatus: store?.storeStatus || 'Inactive'
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

  // Shipping state
  const [governorates, setGovernorates] = useState([]);
  const [shippingCosts, setShippingCosts] = useState([]);
  const [loadingGovernorates, setLoadingGovernorates] = useState(false);
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [tempShippingPrice, setTempShippingPrice] = useState('');

  // Available categories
  const [categories, setCategories] = useState([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (!authLoading && store && authInialized) {
      fetchAllData();
    }
  }, [authLoading, store, authInialized]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchStoreData(),
        fetchGovernorates(),
        fetchShippingCosts()
      ]);

    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreData = async () => {
    try {
      if (store?.id) {
        const storeData = await storeAPI.getById(store.id);
        
        setStoreInfo({
          storeName: storeData.storeName || '',
          storeDescription: storeData.storeDescription || '',
          storePhone: storeData.storePhone || '',
          storeAddress: storeData.storeAddress || '',
          categoryId: storeData.categoryId || '',
          createdAt: storeData.createdAt || new Date().toISOString(),
          storeStatus: storeData.storeStatus || 'Inactive'
        });

        setBranding({
          primaryColor: storeData.primaryColor || '#4f46e5',
          secondaryColor: storeData.secondaryColor || '#8b5cf6',
          storeLogoUrl: storeData.storeLogoUrl || '',
        });

        setSocialMedia({
          facebook: storeData.facebook || '',
          instagram: storeData.instagram || '',
        });
      }

      const storeCategories = await categoryAPI.getByStore(store.id);
      setCategories(storeCategories || []);

    } catch (err) {
      handleError(err);
    }
  };

  const fetchGovernorates = async () => {
    try {
      setLoadingGovernorates(true);
      const data = await shippingAPI.getGovernorates();
      setGovernorates(data || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingGovernorates(false);
    }
  };

  const fetchShippingCosts = async () => {
    try {
      if (store?.id) {
        const data = await shippingAPI.getStoreShippingCosts(store.id);
        setShippingCosts(data || []);
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Handlers
  const handleStoreInfoChange = (field, value) => {
    setStoreInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleBrandingChange = (field, value) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (field, value) => {
    setSocialMedia(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingToggle = (governorateId) => {
    setShippingCosts(prev => {
      const exists = prev.find(c => c.governorateId === governorateId);
      
      if (exists) {
        // Remove if exists
        return prev.filter(c => c.governorateId !== governorateId);
      } else {
        // Add new with default price
        return [...prev, { governorateId, price: 0 }];
      }
    });
  };

  const handleShippingPriceChange = (governorateId, price) => {
    setShippingCosts(prev => 
      prev.map(c => 
        c.governorateId === governorateId 
          ? { ...c, price: parseFloat(price) || 0 }
          : c
      )
    );
  };

  const startEditingShipping = (cost) => {
    setEditingShippingId(cost.governorateId);
    setTempShippingPrice(cost.price.toString());
  };

  const saveEditingShipping = (governorateId) => {
    setEditingShippingId(null);
    setTempShippingPrice('');
  };

  const cancelEditingShipping = () => {
    setEditingShippingId(null);
    setTempShippingPrice('');
  };

  const getGovernorateName = (id) => {
    const gov = governorates.find(g => g.id === id);
    return gov ? gov.name : `Governorate ${id}`;
  };

  const getShippingCost = (governorateId) => {
    const cost = shippingCosts.find(c => c.governorateId === governorateId);
    return cost ? cost.price : null;
  };

  const isShippingSelected = (governorateId) => {
    return shippingCosts.some(c => c.governorateId === governorateId);
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
        id: store.id,
        storeName: storeInfo.storeName,
        storeDescription: storeInfo.storeDescription,
        storePhone: storeInfo.storePhone,
        storeAddress: storeInfo.storeAddress,
        categoryId: storeInfo.categoryId || null,
        ...branding,
        ...socialMedia,
        storeStatus: storeInfo.storeStatus,
        shippingCosts: shippingCosts.map(cost => ({
          governorateId: cost.governorateId,
          price: parseFloat(cost.price) || 0
        }))
      };

      // Clean undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      // Save store with shipping costs
      await storeAPI.updateWithShipping(updateData);
      
      setSuccess('Store details updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const CLOUD_NAME = "dnycajxc0";
  const UPLOAD_PRESET = "storely_unsigned";

  const handleImageUpload = async (file, type) => {
    try {
      type === "logo" && setUploadingLogo(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('cloud_name', CLOUD_NAME);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      if (type === "logo") {
        setBranding(prev => ({
          ...prev,
          storeLogoUrl: data.secure_url,
        }));
        
        await storeAPI.update({
          id: store.id,
          storeLogoUrl: data.secure_url
        });
      }

      setSuccess(`${type === "logo" ? "Logo" : "Favicon"} uploaded successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      handleError(err);
    } finally {
      type === "logo" && setUploadingLogo(false);
    }
  };

  const handleRemoveImage = async (type) => {
    try {
      if (!window.confirm(`Are you sure you want to remove the ${type}?`)) {
        return;
      }

      const updateData = { id: store.id };

      if (type === 'logo') {
        updateData.storeLogoUrl = '';
        setBranding(prev => ({ ...prev, storeLogoUrl: '' }));
      }

      await storeAPI.update(updateData);
      
      setSuccess(`${type === 'logo' ? 'Logo' : 'Favicon'} removed successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      handleError(err);
    }
  };

  const handleDownloadQR = () => {
    if (!getStoreUrl()) {
      setError('Store URL is not set. Please set a store URL first.');
      return;
    }

    const storeUrl = getStoreUrl();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(storeUrl)}`;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${storeInfo.storeName || 'store'}-qrcode.png`;
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

    try {
      await navigator.clipboard.writeText(getStoreUrl());
      setSuccess('Store link copied to clipboard!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      handleError(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Store, description: 'Store name & description' },
    { id: 'shipping', label: 'Shipping', icon: Truck, description: 'Shipping costs by governorate' },
    { id: 'branding', label: 'Branding', icon: Brush, description: 'Logo & colors' },
    { id: 'contact', label: 'Contact', icon: MapPin, description: 'Phone & Location' },
    { id: 'social', label: 'Social', icon: Facebook, description: 'Social media profiles' },
    { id: 'domain', label: 'Domain & QR', icon: Globe, description: 'Store URL & QR code' },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <Store className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 font-medium">Loading your store settings...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-xl border border-gray-100">
          <div className="text-center">
            <div className="bg-red-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Store Not Found</h2>
            <p className="text-gray-600 mb-8">You need to create a store first.</p>
            <a
              href="/vendor/store/create"
              className="block w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Create Your Store
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <style>{styles}</style>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Store className="h-6 w-6 mr-2 text-indigo-600" />
                  Store Settings
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Customize your store details and branding
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                <a
                  href={getStoreUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">Preview</span>
                </a>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span className="text-sm font-medium">Save</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Panel */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden animate-slide-left">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <Store className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Store Settings</div>
                      <div className="text-xs text-gray-500">{storeInfo.storeName}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-2 mt-4">
                  <a
                    href={getStoreUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Preview Store</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </a>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    <div className="flex items-center">
                      {saving ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin mr-3" />
                      ) : (
                        <Save className="h-5 w-5 text-white mr-3" />
                      )}
                      <span className="text-sm font-medium text-white">
                        {saving ? 'Saving...' : 'Save Changes'}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Navigation
                </h3>
                <div className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className={`h-5 w-5 ${
                        activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500'
                      }`} />
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-medium ${
                          activeTab === tab.id ? 'text-indigo-700' : 'text-gray-900'
                        }`}>
                          {tab.label}
                        </div>
                        <div className="text-xs text-gray-500">{tab.description}</div>
                      </div>
                      {activeTab === tab.id && (
                        <ChevronRight className="h-4 w-4 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{vendor?.name || 'Vendor'}</div>
                    <div className="text-xs text-gray-500">{vendor?.email || ''}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 animate-slide-down">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="p-1.5 hover:bg-red-200 rounded-lg">
                <X className="h-4 w-4 text-red-800" />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 animate-slide-down">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 sm:px-6 py-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">{success}</span>
              </div>
              <button onClick={() => setSuccess(null)} className="p-1.5 hover:bg-green-200 rounded-lg">
                <X className="h-4 w-4 text-green-800" />
              </button>
            </div>
          </div>
        )}

        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-2xl p-2 border border-gray-200/80 shadow-sm">
            <label className="block text-xs font-medium text-gray-500 mb-2 px-2">
              Active Section
            </label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 font-medium"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label} - {tab.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Store Status</h3>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                  storeInfo.storeStatus === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                    storeInfo.storeStatus === 'Active' ? 'bg-green-600' : 'bg-yellow-600'
                  }`} />
                  {storeInfo.storeStatus}
                </span>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <tab.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${
                        activeTab === tab.id ? 'text-indigo-700' : 'text-gray-900'
                      }`}>
                        {tab.label}
                      </div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                    {activeTab === tab.id && (
                      <ChevronRight className="h-4 w-4 text-indigo-600" />
                    )}
                  </button>
                ))}
              </nav>

              {/* Store Preview Card */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-indigo-600" />
                  Store Preview
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
                      {branding.storeLogoUrl ? (
                        <img 
                          src={branding.storeLogoUrl} 
                          alt="Store Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Store className="h-8 w-8 text-indigo-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 truncate">
                        {storeInfo.storeName || 'Your Store Name'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(storeInfo.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Products</span>
                      <span className="font-semibold text-gray-900">{store.products?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-gray-600">Orders</span>
                      <span className="font-semibold text-gray-900">{store.orders?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-3">
                      <Store className="h-5 w-5 text-indigo-600" />
                    </div>
                    Basic Store Information
                  </h2>
                  <span className="hidden sm:inline text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    Required Fields *
                  </span>
                </div>
                
                <div className="space-y-6">
                  {/* Store Name */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        value={storeInfo.storeName}
                        onChange={(e) => handleStoreInfoChange('storeName', e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all group-focus-within:bg-white"
                        placeholder="Enter your store name"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 flex items-center">
                      <Tag className="h-4 w-4 mr-1 text-gray-400" />
                      This will be displayed as your store name across the platform
                    </p>
                  </div>

                  {/* Store Description */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Description
                    </label>
                    <textarea
                      value={storeInfo.storeDescription}
                      onChange={(e) => handleStoreInfoChange('storeDescription', e.target.value)}
                      rows={5}
                      maxLength={500}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white resize-none"
                      placeholder="Describe your store and what makes it unique..."
                    />
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        This description appears on your store page
                      </p>
                      <span className={`text-xs px-3 py-1.5 rounded-full ${
                        storeInfo.storeDescription.length >= 450 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {storeInfo.storeDescription.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Store Category */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Category
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={storeInfo.categoryId}
                        onChange={(e) => handleStoreInfoChange('categoryId', e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none"
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Store Created */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Calendar className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Store Created</div>
                          <div className="font-semibold text-gray-900">
                            {formatDate(storeInfo.createdAt)}
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        storeInfo.storeStatus === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {storeInfo.storeStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Tab - NEW */}
            {activeTab === 'shipping' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    Shipping Costs by Governorate
                  </h2>
                </div>

                {loadingGovernorates ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Summary */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900 mb-1">Shipping Settings</h3>
                          <p className="text-sm text-blue-700">
                            Select governorates and set shipping prices. {shippingCosts.length} of {governorates.length} governorates configured.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Governorates List */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {governorates.map((gov) => {
                        const isSelected = isShippingSelected(gov.id);
                        const cost = getShippingCost(gov.id);
                        const isEditing = editingShippingId === gov.id;

                        return (
                          <div
                            key={gov.id}
                            className={`bg-gray-50 rounded-xl p-4 border transition-all ${
                              isSelected 
                                ? 'border-indigo-300 bg-indigo-50/30' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleShippingToggle(gov.id)}
                                  className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <div>
                                  <h4 className="font-medium text-gray-900">{gov.name}</h4>
                                  <p className="text-xs text-gray-500">ID: {gov.id}</p>
                                </div>
                              </div>

                              {isSelected && (
                                <div className="flex items-center space-x-2">
                                  {isEditing ? (
                                    <>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">EGP</span>
                                        <input
                                          type="number"
                                          value={tempShippingPrice}
                                          onChange={(e) => setTempShippingPrice(e.target.value)}
                                          min="0"
                                          step="1"
                                          className="w-28 pl-12 pr-3 py-2 bg-white border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                          autoFocus
                                          onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                              handleShippingPriceChange(gov.id, tempShippingPrice);
                                              saveEditingShipping(gov.id);
                                            }
                                          }}
                                        />
                                      </div>
                                      <button
                                        onClick={() => {
                                          handleShippingPriceChange(gov.id, tempShippingPrice);
                                          saveEditingShipping(gov.id);
                                        }}
                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                      >
                                        <Check className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={cancelEditingShipping}
                                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                          {formatPrice(cost)}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => startEditingShipping({ governorateId: gov.id, price: cost })}
                                        className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                        <div className="text-2xl font-bold text-green-700">{shippingCosts.length}</div>
                        <div className="text-sm text-green-600">Configured Governorates</div>
                      </div>
                      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                        <div className="text-2xl font-bold text-indigo-700">
                          {shippingCosts.reduce((sum, c) => sum + (c.price || 0), 0)} EGP
                        </div>
                        <div className="text-sm text-indigo-600">Total Shipping Value</div>
                      </div>
                    </div>

                    {shippingCosts.length === 0 && (
                      <div className="text-center py-8">
                        <Truck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No shipping costs configured yet</p>
                        <p className="text-sm text-gray-400 mt-1">Check the boxes above to add shipping costs for governorates</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                      <Brush className="h-5 w-5 text-purple-600" />
                    </div>
                    Store Branding
                  </h2>
                </div>
                
                <div className="space-y-8">
                  {/* Logo Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Store Logo
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <div className="relative group">
                        <div className="h-32 w-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-indigo-400 transition-all">
                          {branding.storeLogoUrl ? (
                            <>
                              <img 
                                src={branding.storeLogoUrl} 
                                alt="Store Logo"
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={() => handleRemoveImage('logo')}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center">
                              <ImagePlus className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                              <span className="text-xs text-gray-500">No logo</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="px-6 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 flex items-center space-x-2 cursor-pointer transition-all shadow-sm">
                            {uploadingLogo ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-sm font-medium">Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="h-5 w-5" />
                                <span className="text-sm font-medium">Upload Logo</span>
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
                          
                          {branding.storeLogoUrl && (
                            <button 
                              onClick={() => handleRemoveImage('logo')}
                              className="px-6 py-3.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 flex items-center space-x-2 transition-all"
                            >
                              <Trash2 className="h-5 w-5" />
                              <span className="text-sm font-medium">Remove</span>
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-4 flex items-center">
                          <Image className="h-4 w-4 mr-2 text-gray-400" />
                          Recommended: 400x400px, PNG or JPG, max 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <Palette className="h-5 w-5 mr-2 text-indigo-600" />
                      Color Scheme
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Primary Color
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div
                              className="h-12 w-12 rounded-xl shadow-md border-2 border-white"
                              style={{ backgroundColor: branding.primaryColor }}
                            />
                            <input
                              type="color"
                              value={branding.primaryColor}
                              onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                          <input
                            type="text"
                            value={branding.primaryColor}
                            onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono"
                            placeholder="#4f46e5"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Secondary Color
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div
                              className="h-12 w-12 rounded-xl shadow-md border-2 border-white"
                              style={{ backgroundColor: branding.secondaryColor }}
                            />
                            <input
                              type="color"
                              value={branding.secondaryColor}
                              onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                          <input
                            type="text"
                            value={branding.secondaryColor}
                            onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono"
                            placeholder="#8b5cf6"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-sm text-gray-500 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                      Primary color is used for buttons and highlights. Secondary color for accents.
                    </p>
                  </div>

                  {/* Live Preview */}
                  <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-indigo-400" />
                      Live Preview
                    </h3>
                    <div className="bg-white rounded-xl p-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-xl overflow-hidden shadow-lg">
                          {branding.storeLogoUrl ? (
                            <img 
                              src={branding.storeLogoUrl} 
                              alt="Store Logo"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                              <Store className="h-8 w-8 text-indigo-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-2">
                            {storeInfo.storeName || 'Your Store'}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className="px-4 py-2 text-white text-sm rounded-lg"
                              style={{ backgroundColor: branding.primaryColor }}
                            >
                              Shop Now
                            </span>
                            <span
                              className="px-4 py-2 text-white text-sm rounded-lg"
                              style={{ backgroundColor: branding.secondaryColor }}
                            >
                              Learn More
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      <input
                        type="tel"
                        value={storeInfo.storePhone}
                        onChange={(e) => handleStoreInfoChange('storePhone', e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all focus:bg-white"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      <textarea
                        value={storeInfo.storeAddress}
                        onChange={(e) => handleStoreInfoChange('storeAddress', e.target.value)}
                        rows={3}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all focus:bg-white resize-none"
                        placeholder="Enter your business address"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 flex items-center">
                      <Building2 className="h-4 w-4 mr-1 text-gray-400" />
                      Displayed for customers and used for shipping calculations
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <div className="h-10 w-10 bg-pink-100 rounded-xl flex items-center justify-center mr-3">
                    <Instagram className="h-5 w-5 text-pink-600" />
                  </div>
                  Social Media Profiles
                </h2>
                <p className="text-gray-600 mb-8 ml-13">
                  Connect your social media accounts to build trust with customers
                </p>

                <div className="space-y-6">
                  {/* Facebook */}
                  <div className="group">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Facebook className="h-4 w-4 text-blue-600" />
                      </div>
                      <label className="text-sm font-semibold text-gray-700">Facebook</label>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none text-gray-600 text-sm sm:w-32 flex items-center">
                        facebook.com/
                      </span>
                      <input
                        type="text"
                        value={socialMedia.facebook}
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                        className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                        placeholder="yourstore"
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="group">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="h-8 w-8 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Instagram className="h-4 w-4 text-pink-600" />
                      </div>
                      <label className="text-sm font-semibold text-gray-700">Instagram</label>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none text-gray-600 text-sm sm:w-32 flex items-center">
                        instagram.com/
                      </span>
                      <input
                        type="text"
                        value={socialMedia.instagram}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                        className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                        placeholder="yourstore"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                    </div>
                    <p className="text-sm text-indigo-800">
                      Social media links will be displayed on your store page to help customers connect with you.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Domain & QR Tab */}
            {activeTab === 'domain' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  Domain & Store URL
                </h2>
                
                {/* Store URL */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Store URL
                  </label>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3.5 font-mono text-sm text-gray-700 truncate">
                        {getStoreUrl() || 'store-name-not-set'}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleCopyStoreLink}
                          disabled={!getStoreUrl()}
                          className="flex-1 sm:flex-none px-4 py-3.5 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="text-sm font-medium">Copy</span>
                        </button>
                        <a
                          href={getStoreUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none px-4 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center justify-center space-x-2 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-medium">Visit</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Store QR Code
                  </label>
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="h-48 w-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-indigo-400 transition-all">
                        {getStoreUrl() ? (
                          <div className="relative">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(getStoreUrl())}`}
                              alt="QR Code"
                              className="h-40 w-40"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                              <span className="text-white text-xs font-medium px-3 py-1.5 bg-black/50 rounded-full">
                                Click to download
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                            <div className="text-sm text-gray-500">Set store URL first</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center lg:text-left">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        Share Your Store
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Download this QR code to share with your customers. They can scan it with their phone camera to visit your store instantly.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                        <button 
                          onClick={handleDownloadQR}
                          disabled={!getStoreUrl()}
                          className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                        >
                          <Download className="h-5 w-5" />
                          <span className="text-sm font-medium">Download QR Code</span>
                        </button>
                        <button 
                          onClick={handleCopyStoreLink}
                          disabled={!getStoreUrl()}
                          className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
                        >
                          <Copy className="h-5 w-5" />
                          <span className="text-sm font-medium">Copy Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <StoreFooter />
      </div>

      {/* Mobile Save Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-30">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-medium">Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span className="font-medium">Save All Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StoreDetails;