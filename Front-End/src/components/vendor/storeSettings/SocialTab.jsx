// src/components/vendor/StoreSettings/SocialTab.jsx
import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

const SocialTab = ({ socialMedia, t, handleSocialMediaChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center">
        <div className="h-10 w-10 bg-pink-100 rounded-xl flex items-center justify-center mr-3">
          <Instagram className="h-5 w-5 text-pink-600" />
        </div>
        {t('vendorStoreDetails.social.title')}
      </h2>

      <div className="space-y-6 mt-8">
        <div className="group">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Facebook className="h-4 w-4 text-blue-600" />
            </div>
            <label className="text-sm font-semibold text-gray-700">{t('vendorStoreDetails.social.facebook')}</label>
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

        <div className="group">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <Instagram className="h-4 w-4 text-pink-600" />
            </div>
            <label className="text-sm font-semibold text-gray-700">{t('vendorStoreDetails.social.instagram')}</label>
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
    </div>
  );
};

export default SocialTab;