// src/components/vendor/StoreSettings/DomainTab.jsx
import React from 'react';
import { Globe, Copy, Eye, QrCode, Download } from 'lucide-react';

const DomainTab = ({ getStoreUrl, t, handleCopyStoreLink, handleDownloadQR }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
          <Globe className="h-5 w-5 text-blue-600" />
        </div>
        {t('vendorStoreDetails.domain.title')}
      </h2>
      
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {t('vendorStoreDetails.domain.yourStoreUrl')}
        </label>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3.5 font-mono text-sm text-gray-700 truncate">
              {getStoreUrl() || t('vendorStoreDetails.domain.urlNotSet')}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyStoreLink}
                disabled={!getStoreUrl()}
                className="flex-1 sm:flex-none px-4 py-3.5 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
              >
                <Copy className="h-4 w-4" />
                <span className="text-sm font-medium">{t('vendorStoreDetails.domain.copy')}</span>
              </button>
              <a
                href={getStoreUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center justify-center space-x-2 transition-all"
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">{t('vendorStoreDetails.domain.visit')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          {t('vendorStoreDetails.domain.storeQrCode')}
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
                      {t('vendorStoreDetails.domain.clickToDownload')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <div className="text-sm text-gray-500">{t('vendorStoreDetails.domain.setUrlFirst')}</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <h3 className="font-semibold text-gray-900 text-lg mb-2">
              {t('vendorStoreDetails.domain.shareYourStore')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('vendorStoreDetails.domain.qrDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button 
                onClick={handleDownloadQR}
                disabled={!getStoreUrl()}
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="h-5 w-5" />
                <span className="text-sm font-medium">{t('vendorStoreDetails.domain.downloadQr')}</span>
              </button>
              <button 
                onClick={handleCopyStoreLink}
                disabled={!getStoreUrl()}
                className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
              >
                <Copy className="h-5 w-5" />
                <span className="text-sm font-medium">{t('vendorStoreDetails.domain.copyLink')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainTab;