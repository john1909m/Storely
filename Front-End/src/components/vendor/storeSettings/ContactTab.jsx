// src/components/vendor/StoreSettings/ContactTab.jsx
import React from 'react';
import { MapPin, Phone } from 'lucide-react';

const ContactTab = ({ storeInfo, t, handleStoreInfoChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
          <MapPin className="h-5 w-5 text-green-600" />
        </div>
        {t('vendorStoreDetails.contact.title')}
      </h2>
      
      <div className="space-y-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('vendorStoreDetails.contact.phoneNumber')}
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
            {t('vendorStoreDetails.contact.storeAddress')}
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <textarea
              value={storeInfo.storeAddress}
              onChange={(e) => handleStoreInfoChange('storeAddress', e.target.value)}
              rows={3}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all focus:bg-white resize-none"
              placeholder={t('vendorStoreDetails.contact.addressPlaceholder')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;