// src/components/vendor/StoreBuilder/sections/CategoriesSection.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Folder, ChevronRight } from 'lucide-react';

const CategoriesSection = ({ section, onUpdate, categories }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600">
          Display all your store categories
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {categories.length} category(ies) available
        </p>
      </div>
      
      {categories.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No categories found</p>
          <p className="text-xs text-gray-400 mt-1">Add categories in store settings</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Grid className="h-4 w-4 text-indigo-600" />
                <span className="text-sm text-gray-900">{category.name}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          ))}
        </div>
      )}
      
      {/* Preview */}
      {categories.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Grid className="h-4 w-4 mr-2" />
            Preview
          </h4>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {categories.slice(0, 6).map(category => (
              <div
                key={category.id}
                className="flex-shrink-0 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer"
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesSection;