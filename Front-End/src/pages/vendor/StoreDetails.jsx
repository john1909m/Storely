// src/pages/vendor/StoreDetails.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { ChevronRight, Menu, X, Eye, Save, Loader2, Store, Sparkles, Calendar, Building2, MapPin, Wallet, Brush, Facebook, Globe, ArrowLeft, AlertCircle } from 'lucide-react';
import StoreSettings from '../../components/vendor/StoreSettings';
import StoreFooter from '../../components/StoreFooter';
import Toast from '../../components/ui/Toast';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';

const StoreDetails = () => {
  const { t } = useTranslation();
  const { store, vendor, isLoading: authLoading } = useAuth();
  const { authInialized } = useAuthStore();
  const [activeTab, setActiveTab] = useState('basic');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Create a ref for the save button in StoreSettings
  const saveButtonRef = useRef(null);

  const tabs = [
    { id: 'basic', label: t('vendorStoreDetails.tabs.basic.label'), icon: Store, description: t('vendorStoreDetails.tabs.basic.description') },
    { id: 'shipping', label: t('vendorStoreDetails.tabs.shipping.label'), icon: MapPin, description: t('vendorStoreDetails.tabs.shipping.description') },
    { id: 'deposit', label: t('vendorStoreDetails.tabs.deposit.label'), icon: Wallet, description: t('vendorStoreDetails.tabs.deposit.description') },
    { id: 'payment', label: t('vendorStoreDetails.tabs.payment.label'), icon: Wallet, description: t('vendorStoreDetails.tabs.payment.description') },
    { id: 'branding', label: t('vendorStoreDetails.tabs.branding.label'), icon: Brush, description: t('vendorStoreDetails.tabs.branding.description') },
    { id: 'contact', label: t('vendorStoreDetails.tabs.contact.label'), icon: MapPin, description: t('vendorStoreDetails.tabs.contact.description') },
    { id: 'social', label: t('vendorStoreDetails.tabs.social.label'), icon: Facebook, description: t('vendorStoreDetails.tabs.social.description') },
    { id: 'domain', label: t('vendorStoreDetails.tabs.domain.label'), icon: Globe, description: t('vendorStoreDetails.tabs.domain.description') },
    
  ];

  const getStoreUrl = () => {
    if (!store?.storeName) return '';
    return `${window.location.origin}/store/${store.storeName}`;
  };

  // Function to trigger save from StoreSettings
  const handleGlobalSave = () => {
    if (saveButtonRef.current) {
      saveButtonRef.current.click();
    }
  };

  // Function to show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Function to hide toast
  const hideToast = () => {
    setToast(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <Store className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 font-medium">{t('vendorStoreDetails.loading.storeSettings')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('vendorStoreDetails.loading.pleaseWait')}</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('vendorStoreDetails.errors.storeNotFoundTitle')}</h2>
            <p className="text-gray-600 mb-8">{t('vendorStoreDetails.errors.storeNotFoundBody')}</p>
            <a
              href="/vendor/store/create"
              className="block w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {t('vendorStoreDetails.buttons.createStore')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Toast Container */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      
      {/* Sticky Header */}
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
                  <Store className="h-6 w-6 mr-2 text-indigo-600" />
                  {t('vendorStoreDetails.title')}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {t('vendorStoreDetails.subtitle')}
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
                  <span className="text-sm font-medium">{t('vendorStoreDetails.buttons.preview')}</span>
                </a>
                <button
                  onClick={handleGlobalSave}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('vendorStoreDetails.buttons.saveAll')}</span>
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
                      <div className="font-semibold text-gray-900">{t('vendorStoreDetails.menu.storeSettings')}</div>
                      <div className="text-xs text-gray-500">{store.storeName}</div>
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
                      <span className="text-sm font-medium text-gray-700">{t('vendorStoreDetails.menu.previewStore')}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </a>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {t('vendorStoreDetails.menu.navigation')}
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
                    <div className="text-sm font-medium text-gray-900">{vendor?.name || t('vendorStoreDetails.vendor')}</div>
                    <div className="text-xs text-gray-500">{vendor?.email || ''}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-2xl p-2 border border-gray-200/80 shadow-sm">
            <label className="block text-xs font-medium text-gray-500 mb-2 px-2">
              {t('vendorStoreDetails.mobile.activeSection')}
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
                <h3 className="font-semibold text-gray-900">{store.storeName}</h3>
                
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
                  {t('vendorStoreDetails.sidebar.storePreview')}
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
                      {store.storeLogoUrl ? (
                        <img 
                          src={store.storeLogoUrl} 
                          alt="Store Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Store className="h-8 w-8 text-indigo-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 truncate">
                        {store.storeName || t('vendorStoreDetails.sidebar.storeNamePlaceholder')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(store.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - StoreSettings Component */}
          <div className="lg:col-span-9">
            <StoreSettings 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              store={store}
              vendor={vendor}
              saveButtonRef={saveButtonRef}
              showToast={showToast}
            />
          </div>
        </div>
        <StoreFooter />
      </div>

      {/* Mobile Save Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-30">
        <button
          onClick={handleGlobalSave}
          className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span className="font-medium">{t('vendorStoreDetails.buttons.saveAllChanges')}</span>
        </button>
      </div>
    </div>
  );
};

export default StoreDetails;