// src/components/layout/CategoriesSection.jsx
import React from 'react';
import { Grid, ChevronRight } from 'lucide-react';

const CategoriesSection = ({ categories, onCategoryClick, colors, themeType, t }) => {
  if (!categories || categories.length === 0) return null;
  
  const getSectionStyle = () => {
    if (themeType === 'MODERN') {
      return 'bg-[#181818] text-white';
    }
    return 'bg-white';
  };
  
  return (
    <div className={`py-12 ${getSectionStyle()}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-gray-500">Find what you're looking for</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {categories.slice(0, 8).map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className={`group flex flex-col items-center justify-center gap-2 p-6 rounded-lg shadow-md transition-transform hover:scale-105 ${themeType === 'MODERN' ? 'bg-[#2a2a2a] text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              <div className="h-12 w-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                <Grid className="h-6 w-6" style={{ color: colors.primary }} />
              </div>
              <h3 className={`font-semibold ${themeType === 'MODERN' ? 'text-white' : 'text-gray-900'} group-hover:text-indigo-600 transition`}>{category.name}</h3>
              <ChevronRight className="h-4 w-4 mx-auto mt-2 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;