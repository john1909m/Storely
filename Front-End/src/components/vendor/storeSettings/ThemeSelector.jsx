// src/components/vendor/StoreSettings/ThemeSelector.jsx
import React from 'react';
import { Layout, Eye, Check, Info } from 'lucide-react';

const ThemeSelector = ({ branding, handleBrandingChange, t }) => {
  const themes = [
    {
      id: 'CLASSIC',
      name: 'Classic',
      icon: '🏛️',
      description: 'Traditional store layout',
      previewText: 'Traditional layout with familiar design'
    },
    {
      id: 'MODERN',
      name: 'Modern',
      icon: '✨',
      description: 'Dark theme with 3D effects',
      previewText: 'Dark theme with modern effects and animations'
    },
    {
      id: 'MINIMAL',
      name: 'Minimal',
      icon: '🌿',
      description: 'Clean & simple design',
      previewText: 'Clean, simple, and distraction-free design'
    }
  ];

  const getThemeStyles = (themeId, isSelected) => {
    if (themeId === 'CLASSIC') {
      return {
        container: isSelected ? 'ring-2 ring-indigo-500 shadow-lg scale-[1.02]' : 'hover:scale-[1.01] hover:shadow-md',
        border: isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300',
        iconBg: isSelected ? 'bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg' : 'bg-gradient-to-br from-gray-100 to-gray-200',
        iconColor: isSelected ? 'text-white' : '',
        titleColor: isSelected ? 'text-indigo-700' : 'text-gray-900'
      };
    } else if (themeId === 'MODERN') {
      return {
        container: isSelected ? 'ring-2 ring-indigo-500 shadow-lg scale-[1.02]' : 'hover:scale-[1.01] hover:shadow-md',
        border: isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300',
        iconBg: isSelected ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg' : 'bg-gradient-to-br from-indigo-100 to-purple-100',
        iconColor: isSelected ? 'text-white' : '',
        titleColor: isSelected ? 'text-indigo-700' : 'text-gray-900'
      };
    } else {
      return {
        container: isSelected ? 'ring-2 ring-indigo-500 shadow-lg scale-[1.02]' : 'hover:scale-[1.01] hover:shadow-md',
        border: isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300',
        iconBg: isSelected ? 'bg-white border-2 border-indigo-200 shadow-lg' : 'bg-white border border-gray-200',
        iconColor: '',
        titleColor: isSelected ? 'text-indigo-700' : 'text-gray-900'
      };
    }
  };

  const getPreviewStyle = (themeId) => {
    if (themeId === 'CLASSIC') {
      return (
        <div className="h-full bg-gray-50 p-3">
          <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    } else if (themeId === 'MODERN') {
      return (
        <div className="h-full bg-black p-3">
          <div className="h-8 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mb-2"></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-gray-800 rounded"></div>
            <div className="h-16 bg-gray-800 rounded"></div>
            <div className="h-16 bg-gray-800 rounded"></div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="h-full bg-white p-3">
          <div className="h-8 w-24 border-b border-gray-200 mb-2"></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-gray-50 border border-gray-100 rounded"></div>
            <div className="h-16 bg-gray-50 border border-gray-100 rounded"></div>
            <div className="h-16 bg-gray-50 border border-gray-100 rounded"></div>
          </div>
        </div>
      );
    }
  };

  const getPreviewText = (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    return theme?.previewText || '';
  };

  return (
    <div className="bg-gradient-to-r w-full from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Layout className="h-5 w-5 mr-2 text-indigo-600" />
        {t('vendorStoreDetails.branding.themeType')}
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        {t('vendorStoreDetails.branding.themeDescription')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const isSelected = branding.themeType === theme.id;
          const styles = getThemeStyles(theme.id, isSelected);
          
          return (
            <div
              key={theme.id}
              onClick={() => handleBrandingChange('themeType', theme.id)}
              className={`relative cursor-pointer rounded-xl transition-all duration-300 ${styles.container}`}
            >
              <div className={`border-2 rounded-xl p-4 transition-all ${styles.border}`}>
                {isSelected && (
                  <div className="absolute -top-2 -right-2">
                    <div className="h-6 w-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`h-16 w-16 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all ${styles.iconBg}`}>
                    <div className={`text-2xl ${styles.iconColor}`}>{theme.icon}</div>
                  </div>
                  <h4 className={`font-semibold mb-1 ${styles.titleColor}`}>
                    {theme.name}
                  </h4>
                  <p className="text-xs text-gray-500">{theme.description}</p>
                  {isSelected && (
                    <div className="mt-2 text-xs text-indigo-600 font-medium">
                      ✓ Active
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Live Theme Preview */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Eye className="h-4 w-4 text-indigo-600" />
          Live Preview
        </h4>
        <div className="relative h-32 rounded-lg overflow-hidden border border-gray-200">
          {getPreviewStyle(branding.themeType)}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {getPreviewText(branding.themeType)}
        </p>
      </div>
      
      {/* Preview Note */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <p className="text-xs text-blue-700">
            {t('vendorStoreDetails.branding.themePreviewNote')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;