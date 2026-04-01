// src/components/vendor/StoreBuilder/sections/BannerSection.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';

import { storeAPI } from './../../../../api/store.api';

const BannerSection = ({ section, onUpdate, fileInputRefs, theme, storeId }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'banner');

    const response = await storeAPI.uploadBannerImage(storeId, file, 'banner');
    const data = await response.json();
    
    if (!data.url) {
      throw new Error('No URL returned');
    }
    
    return data.url;
  };

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert(t('components.storeBuilder.bannerSection.maxSize'));
          continue;
        }
        
        if (!file.type.startsWith('image/')) {
          alert(t('components.storeBuilder.bannerSection.invalidFile'));
          continue;
        }
        
        setUploading(true);
        
        try {
          const imageUrl = await uploadImageToServer(file);
          onUpdate({
            images: [...(section.images || []), imageUrl]
          });
        } catch (error) {
          console.error('Upload failed:', error);
          alert(t('components.storeBuilder.bannerSection.uploadError'));
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };
  
  const removeImage = (index) => {
    const newImages = [...(section.images || [])];
    newImages.splice(index, 1);
    onUpdate({ images: newImages });
  };
  
  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('components.storeBuilder.bannerSection.title')}
        </label>
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent outline-none"
          style={{ focusRingColor: theme?.primaryColor }}
          placeholder={t('components.storeBuilder.bannerSection.uploadImage')}
        />
      </div>
      
      {/* Subtitle Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('components.storeBuilder.bannerSection.title')}
        </label>
        <input
          type="text"
          value={section.subtitle || ''}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent outline-none"
          style={{ focusRingColor: theme?.primaryColor }}
          placeholder={t('components.storeBuilder.bannerSection.uploadImage')}
        />
      </div>
      
      {/* Images Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('components.storeBuilder.bannerSection.title')}
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          {(section.images || []).map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          <button
            onClick={addImage}
            disabled={uploading}
            className={`h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center transition-all ${
              uploading 
                ? 'bg-gray-100 cursor-wait' 
                : 'hover:border-indigo-400 hover:bg-indigo-50'
            }`}
            style={{ hoverBorderColor: theme?.primaryColor }}
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-indigo-500 mb-2 animate-spin" />
                <span className="text-xs text-gray-500">Uploading...</span>
              </>
            ) : (
              <>
                <Plus className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Add Image</span>
              </>
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Recommended size: 1920x600px. Max 5MB per image.
        </p>
      </div>
      
      {/* Preview */}
      {(section.images?.length > 0 || section.title) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          <div 
            className="relative h-40 rounded-lg overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${theme?.primaryColor}20, ${theme?.secondaryColor}20)` }}
          >
            {section.images?.[0] && (
              <img
                src={section.images[0]}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
              {section.title && (
                <h3 className="text-xl font-bold text-center px-4">{section.title}</h3>
              )}
              {section.subtitle && (
                <p className="text-sm text-center px-4 mt-2">{section.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerSection;