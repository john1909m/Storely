// src/components/vendor/StoreBuilder/PageToggles.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, ShoppingBag } from 'lucide-react';

const PageToggles = ({ pages, onTogglePage, theme }) => {
  const { t } = useTranslation();
  const pageOptions = [
    { id: 'home', label: t('components.storeBuilder.pageToggles.homePage'), icon: Home, description: t('components.storeBuilder.pageToggles.homePageDescription') },
    // { id: 'allProducts', label: 'All Products Page', icon: ShoppingBag, description: 'Browse all products' }
  ];
  
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{t('components.storeBuilder.pageToggles.title')}</h2>
      <p className="text-sm text-gray-500 mb-6">{t('components.storeBuilder.pageToggles.subtitle')}</p>
      
      <div className="space-y-4">
        {pageOptions.map((page) => {
          const Icon = page.icon;
          const isEnabled = pages[page.id];
          
          return (
            <div
              key={page.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${theme?.primaryColor}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color: theme?.primaryColor }} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{page.label}</div>
                  <div className="text-xs text-gray-500">{page.description}</div>
                </div>
              </div>
              
              <button
                onClick={() => onTogglePage(page.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
                style={isEnabled ? { backgroundColor: theme?.primaryColor } : {}}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
      
      {!pages.home && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-700">
            Home page is disabled. All sections below will be hidden from customers.
          </p>
        </div>
      )}
    </div>
  );
};

export default PageToggles;