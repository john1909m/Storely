// src/components/vendor/StoreBuilder/sections/FooterSection.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layers } from 'lucide-react';

const FooterSection = ({ section, onUpdate }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Footer Text
        </label>
        <textarea
          value={section.text || ''}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          placeholder="Enter footer text (e.g., copyright, contact info, etc.)"
        />
        <p className="text-xs text-gray-500 mt-2">
          This text will appear at the bottom of every page
        </p>
      </div>
      
      {/* Preview */}
      {section.text && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Preview
          </h4>
          <div className="p-4 bg-gray-800 text-gray-300 text-center text-sm rounded-lg">
            {section.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterSection;