// src/components/vendor/StoreSettings/BrandingTab.jsx
import React from 'react';
import { Brush, Palette, Eye, Image, ImagePlus, Trash2, Upload, Loader2, Store } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { Link } from 'react-router-dom';

const BrandingTab = ({
  storeInfo,
  branding,
  uploadingLogo,
  t,
  handleBrandingChange,
  handleImageUpload,
  handleRemoveImage
}) => {
  return (
    <div className="w-[90vw] overflow-x-hidden sm:w-full  bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200/80 shadow-sm">
      <div className="w-full max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-purple-100 rounded-xl flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <Brush className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <span className="truncate">{t('vendorStoreDetails.branding.title')}</span>
          </h2>
        </div>
        
        <div className="space-y-6 sm:space-y-8">
          {/* Theme Selection */}
          <div className="w-full overflow-x-auto">
            <ThemeSelector 
              branding={branding}
              handleBrandingChange={handleBrandingChange}
              t={t}
            />
          </div>
          
          {/* Store Builder Link */}
          <div className='flex flex-col gap-2 items-center justify-center bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-3 sm:p-4 w-full'>
            <span className='text-red-600 text-xs sm:text-sm'>New Feature ✨</span>
            <Link 
              to="/vendor/storeBuilder" 
              className='bg-indigo-600 flex justify-center items-center py-3 sm:py-4 w-full max-w-[calc(100%-2rem)] sm:max-w-sm md:max-w-md rounded-xl text-white text-sm sm:text-lg hover:scale-105 transition-all duration-200'
            >
              <Store className='h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0' />
              <span className="truncate">Store builder</span>
            </Link>
          </div>

          {/* Logo Section */}
          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
              {t('vendorStoreDetails.branding.storeLogo')}
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
              <div className="relative group mx-auto sm:mx-0 flex-shrink-0">
                <div className="h-28 w-28 sm:h-32 sm:w-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-indigo-400 transition-all">
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
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-2">
                      <ImagePlus className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-1 sm:mb-2" />
                      <span className="text-xs text-gray-500">{t('vendorStoreDetails.branding.noLogo')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 w-full">
                  <label className="flex-1 sm:flex-none min-w-[120px] sm:min-w-[140px] px-3 sm:px-4 py-2.5 sm:py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-sm">
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium truncate">{t('vendorStoreDetails.buttons.uploading')}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium truncate">{t('vendorStoreDetails.buttons.uploadLogo')}</span>
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
                      className="flex-1 sm:flex-none min-w-[100px] sm:min-w-[120px] px-3 sm:px-4 py-2.5 sm:py-3.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 flex items-center justify-center space-x-2 transition-all"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium truncate">{t('vendorStoreDetails.buttons.remove')}</span>
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 flex items-center justify-center sm:justify-start">
                  <Image className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{t('vendorStoreDetails.branding.logoRecommendation')}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Color Scheme */}
          <div className="pt-4 sm:pt-6 border-t border-gray-100 w-full">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-600 flex-shrink-0" />
              <span>{t('vendorStoreDetails.branding.colorScheme')}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              <div className="space-y-2 sm:space-y-3 w-full min-w-0">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 truncate">
                  {t('vendorStoreDetails.branding.primaryColor')}
                </label>
                <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                  <div className="relative flex-shrink-0">
                    <div
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl shadow-md border-2 border-white"
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
                    className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-sm"
                    placeholder="#4f46e5"
                  />
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3 w-full min-w-0">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 truncate">
                  {t('vendorStoreDetails.branding.secondaryColor')}
                </label>
                <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                  <div className="relative flex-shrink-0">
                    <div
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl shadow-md border-2 border-white"
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
                    className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-sm"
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 w-full overflow-x-hidden">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-400 flex-shrink-0" />
              <span>{t('vendorStoreDetails.branding.livePreview')}</span>
            </h3>
            <div className="bg-white rounded-xl p-4 sm:p-6 w-full overflow-x-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                  {branding.storeLogoUrl ? (
                    <img 
                      src={branding.storeLogoUrl} 
                      alt="Store Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <Store className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                  <div className="font-bold text-gray-900 mb-2 text-sm sm:text-base truncate">
                    {storeInfo.storeName || t('vendorStoreDetails.branding.storeNamePlaceholder')}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    <span
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm rounded-lg inline-block whitespace-nowrap"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      {t('vendorStoreDetails.branding.shopNow')}
                    </span>
                    <span
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm rounded-lg inline-block whitespace-nowrap"
                      style={{ backgroundColor: branding.secondaryColor }}
                    >
                      {t('vendorStoreDetails.branding.learnMore')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingTab;