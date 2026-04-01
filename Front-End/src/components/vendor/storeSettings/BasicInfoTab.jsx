// src/components/vendor/StoreSettings/BasicInfoTab.jsx
import React from 'react';
import { Store, Tag } from 'lucide-react';

const BasicInfoTab = ({ storeInfo, categories, t, handleStoreInfoChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
          <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-3">
            <Store className="h-5 w-5 text-indigo-600" />
          </div>
          {t('vendorStoreDetails.basic.title')}
        </h2>
        <span className="hidden sm:inline text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          {t('vendorStoreDetails.basic.requiredFields')}
        </span>
      </div>
      
      <div className="space-y-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('vendorStoreDetails.basic.storeName')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={storeInfo.storeName?.slice(0, 50) || ''}
              onChange={(e) => handleStoreInfoChange('storeName', e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all group-focus-within:bg-white"
              placeholder={t('vendorStoreDetails.basic.storeNamePlaceholder')}
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('vendorStoreDetails.basic.storeDescription')}
          </label>
          <textarea
            value={storeInfo.storeDescription}
            onChange={(e) => handleStoreInfoChange('storeDescription', e.target.value)}
            rows={5}
            maxLength={500}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white resize-none"
            placeholder={t('vendorStoreDetails.basic.storeDescriptionPlaceholder')}
          />
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('vendorStoreDetails.basic.storeCategory')}
          </label>
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={storeInfo.categoryId}
              onChange={(e) => handleStoreInfoChange('categoryId', e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none"
            >
              <option value="">{t('vendorStoreDetails.basic.selectCategory')}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;