// src/components/vendor/StoreBuilder/SectionWrapper.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';

const SectionWrapper = ({ section, onToggle, onRemove, isDisabled, theme, children }) => {
  const { t } = useTranslation();
  const getSectionTitle = () => {
    switch (section.type) {
      case 'BANNER': return 'Banner Section';
      case 'FEATURED_PRODUCTS': return 'Featured Products';
      case 'CATEGORIES': return 'Categories';
      case 'FOOTER': return 'Footer';
      default: return 'Section';
    }
  };
  
  return (
    <div className={`bg-white rounded-xl border transition-all ${
      !section.enabled ? 'border-gray-200 bg-gray-50/50' : 'border-gray-200 hover:border-indigo-200'
    }`}>
      {/* Section Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="cursor-move text-gray-400">
            <GripVertical className="h-4 w-4" />
          </div>
          <div>
            <h3 className={`font-semibold ${section.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
              {getSectionTitle()}
            </h3>
            <p className="text-xs text-gray-500">
              {section.enabled ? 'Enabled - Visible to customers' : 'Disabled - Hidden from customers'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggle}
            disabled={isDisabled}
            className={`p-2 rounded-lg transition-colors ${
              section.enabled
                ? 'hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            style={section.enabled ? { color: theme?.primaryColor } : {}}
            title={section.enabled ? 'Disable section' : 'Enable section'}
          >
            {section.enabled ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
          </button>
          
          <button
            onClick={onRemove}
            disabled={isDisabled}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove section"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Section Content */}
      <div className={`p-4 ${!section.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default SectionWrapper;