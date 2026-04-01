// src/pages/vendor/StoreBuilder.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Save, Eye, Trash2, Plus, Image, ShoppingBag,
  Layout, Sparkles, AlertCircle, Check, X,
  Upload, Camera, Package, Grid, Layers, GripVertical,
  Home, ShoppingCart, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productAPI } from '../../api/product.api';
import { storeAPI } from '../../api/store.api';
import { categoryAPI } from '../../api/category.api';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import StoreFooter from '../../components/StoreFooter';
import Toast from '../../components/ui/Toast';
// import PageToggles from '../../components/vendor/StoreBuilder/PageToggles';
// import SectionWrapper from '../../components/vendor/StoreBuilder/SectionWrapper';
// import BannerSection from '../../components/vendor/StoreBuilder/sections/BannerSection';
// import FeaturedProductsSection from '../../components/vendor/StoreBuilder/sections/FeaturedProductsSection';
// import CategoriesSection from '../../components/vendor/StoreBuilder/sections/CategoriesSection';
// import FooterSection from '../../components/vendor/StoreBuilder/sections/FooterSection';
import PageToggles from './../../components/vendor/storeBuilder/PageToggles';
import SectionWrapper from './../../components/vendor/storeBuilder/SectionWrapper';
import BannerSection from './../../components/vendor/storeBuilder/sections/BannerSection';
// import FeaturedProductsSection from './../../components/layout/FeaturedProductsSection';
import FeaturedProductsSection from './../../components/vendor/storeBuilder/sections/FeaturedProductsSection';
import CategoriesSection from './../../components/vendor/storeBuilder/sections/CategoriesSection';
import FooterSection from './../../components/vendor/storeBuilder/sections/FooterSection';

const StoreBuilder = () => {
  const navigate = useNavigate();
  const { store, vendor, refreshStore } = useAuth();
  const { handleError } = useErrorHandler();
  
  // Main layout state
  const [layout, setLayout] = useState({
    pages: {
      home: true,
      allProducts: true
    },
    sections: []
  });
  
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  // Theme state from store
  const [theme, setTheme] = useState({
    primaryColor: '#4f46e5',
    secondaryColor: '#8b5cf6',
    themeType: 'CLASSIC'
  });
  
  // Track existing section types
  const [existingSectionTypes, setExistingSectionTypes] = useState(new Set());
  
  // File upload refs
  const fileInputRefs = useRef({});
  
  useEffect(() => {
    fetchData();
  }, [store]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // First, get fresh store data with layout
      let currentStore = store;
      
      // If store doesn't have layoutConfig, fetch fresh store data
      if (!store?.layoutConfig) {
        try {
          const freshStore = await storeAPI.getById(store.id);
          currentStore = freshStore;
        } catch (err) {
          console.error('Failed to fetch fresh store:', err);
        }
      }
      
      // Load store theme from store
      if (currentStore) {
        setTheme({
          primaryColor: currentStore.primaryColor || '#4f46e5',
          secondaryColor: currentStore.secondaryColor || '#8b5cf6',
          themeType: currentStore.themeType || 'CLASSIC'
        });
      }
      
      // Fetch products
      if (store?.id) {
        const productsData = await productAPI.getAll(store.id);
        setProducts(productsData || []);
        
        // Fetch categories
        const categoriesData = await categoryAPI.getByStore(store.id);
        setCategories(categoriesData || []);
      }
      
      // Load saved layout from store's layoutConfig
      if (currentStore?.layoutConfig) {
        try {
          const savedLayout = JSON.parse(currentStore.layoutConfig);
          console.log('Loaded layout from store:', savedLayout);
          
          // Add unique IDs to sections if they don't have them
          const sectionsWithIds = (savedLayout.sections || []).map((section, index) => ({
            ...section,
            id: section.id || Date.now() + index
          }));
          
          setLayout({
            pages: savedLayout.pages || { home: true, allProducts: true },
            sections: sectionsWithIds
          });
          
          // Track existing section types
          const types = new Set(sectionsWithIds.map(s => s.type));
          setExistingSectionTypes(types);
          
        } catch (err) {
          console.error('Error parsing layout:', err);
          setDefaultLayout();
        }
      } else {
        console.log('No layout config found, using default');
        setDefaultLayout();
      }
    } catch (err) {
      console.error('Fetch data error:', err);
      handleError(err);
      showToast(err.message || 'Failed to load data', 'error');
      setDefaultLayout();
    } finally {
      setLoading(false);
    }
  };
  
  const setDefaultLayout = () => {
    setLayout({
      pages: { home: true, allProducts: true },
      sections: []
    });
    setExistingSectionTypes(new Set());
  };
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };
  
  const hideToast = () => {
    setToast(null);
  };
  
  // Page toggles
  const togglePage = (page) => {
    setLayout(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [page]: !prev.pages[page]
      }
    }));
  };
  
  // Section management - prevent duplicates
  const addSection = (sectionType) => {
    // Check if section type already exists
    if (existingSectionTypes.has(sectionType)) {
      showToast(`${sectionType} section already exists. You can only add one of each type.`, 'warning');
      return;
    }
    
    const newSection = {
      id: Date.now(),
      type: sectionType,
      enabled: true
    };
    
    if (sectionType === 'BANNER') {
      newSection.images = [];
      newSection.title = 'Welcome to our store';
      newSection.subtitle = 'Shop the best products';
    } else if (sectionType === 'FEATURED_PRODUCTS') {
      newSection.productIds = [];
    } else if (sectionType === 'CATEGORIES') {
      newSection.enabled = true;
    } else if (sectionType === 'FOOTER') {
      newSection.text = '© 2025 Your Store. All rights reserved.';
    }
    
    setLayout(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    
    // Add to existing types
    setExistingSectionTypes(prev => new Set([...prev, sectionType]));
    
    showToast(`${sectionType} section added successfully`, 'success');
  };
  
  const removeSection = (sectionId) => {
    const sectionToRemove = layout.sections.find(s => s.id === sectionId);
    if (!sectionToRemove) return;
    
    if (window.confirm(`Remove ${sectionToRemove.type} section from your store?`)) {
      setLayout(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId)
      }));
      
      // Remove from existing types
      setExistingSectionTypes(prev => {
        const newSet = new Set(prev);
        newSet.delete(sectionToRemove.type);
        return newSet;
      });
      
      showToast('Section removed', 'success');
    }
  };
  
  const toggleSectionEnabled = (sectionId) => {
    if (!layout.pages.home) return;
    
    setLayout(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section
      )
    }));
  };
  
  const updateSection = (sectionId, updates) => {
    setLayout(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, ...updates }
          : section
      )
    }));
  };
  
  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };
  
  const handleDragEnd = (e) => {
    setDraggedIndex(null);
    e.target.style.opacity = '';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }
    
    const newSections = [...layout.sections];
    const draggedSection = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(dropIndex, 0, draggedSection);
    
    setLayout(prev => ({
      ...prev,
      sections: newSections
    }));
    
    setDraggedIndex(null);
    showToast('Section reordered', 'success');
  };
  
  // Save layout to store
  const saveLayout = async () => {
    try {
      setSaving(true);
      
      // First, get fresh store data to ensure we have correct status
      const freshStore = await storeAPI.getById(store.id);
      console.log('Fresh store data:', freshStore);
      
      // Prepare layout data to save
      const layoutToSave = {
        pages: layout.pages,
        sections: layout.sections.map(section => {
          const { id, ...cleanSection } = section;
          return cleanSection;
        })
      };
      
      const layoutConfig = JSON.stringify(layoutToSave);
      console.log('Saving layout:', layoutConfig);
      
      // Update store with all data from fresh store + new layout
      const updateData = {
        id: store.id,
        layoutConfig: layoutConfig,
        // Use fresh store data for all fields
        storeName: freshStore.storeName || '',
        storeDescription: freshStore.storeDescription || '',
        storePhone: freshStore.storePhone || '',
        storeAddress: freshStore.storeAddress || '',
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        storeLogoUrl: freshStore.storeLogoUrl || '',
        themeType: theme.themeType,
        storeStatus: freshStore.storeStatus || 'Active',
        facebook: freshStore.facebook || '',
        instagram: freshStore.instagram || '',
        categoryId: freshStore.categoryId || null,
        createdAt: freshStore.createdAt || new Date().toISOString(),
        fontFamily: freshStore.fontFamily || 'Poppins',
        totalVisits: freshStore.totalVisits || 0
      };
      
      console.log('Updating store with status:', updateData.storeStatus);
      
      await storeAPI.update(updateData);
      
      showToast('Store layout saved successfully!', 'success');
      
      // Refresh store data
      if (refreshStore) {
        await refreshStore();
      }
      
    } catch (err) {
      console.error('Save layout error:', err);
      handleError(err);
      showToast(err.message || 'Failed to save layout', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  // Get available sections (those not already added)
  const getAvailableSections = () => {
    const allSections = [
      { type: 'BANNER', name: 'Banner', icon: Image, description: 'Add a promotional banner with images', color: 'blue' },
      { type: 'FEATURED_PRODUCTS', name: 'Featured Products', icon: ShoppingBag, description: 'Showcase your best products', color: 'purple' },
      { type: 'CATEGORIES', name: 'Categories', icon: Grid, description: 'Display product categories', color: 'green' },
      { type: 'FOOTER', name: 'Footer', icon: Layers, description: 'Add footer text', color: 'gray' }
    ];
    
    return allSections.filter(section => !existingSectionTypes.has(section.type));
  };
  
  // Render section by type
  const renderSection = (section, index) => {
    const commonProps = {
      section,
      onUpdate: (updates) => updateSection(section.id, updates),
      fileInputRefs,
      products,
      categories,
      theme,
      storeId: store?.id, // Pass storeId for image upload
    };
    
    switch (section.type) {
      case 'BANNER':
        return <BannerSection {...commonProps} />;
      case 'FEATURED_PRODUCTS':
        return <FeaturedProductsSection {...commonProps} />;
      case 'CATEGORIES':
        return <CategoriesSection {...commonProps} />;
      case 'FOOTER':
        return <FooterSection {...commonProps} />;
      default:
        return null;
    }
  };
  
  const availableSections = getAvailableSections();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading store builder...</p>
          <p className="text-sm text-gray-500 mt-2">Loading your saved layout</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      
      {/* Header with theme colors */}
      <div 
        className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b shadow-sm"
        style={{ borderBottomColor: `${theme.primaryColor}20` }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Link
                to="/vendor/store"
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Layout className="h-6 w-6 mr-2" style={{ color: theme.primaryColor }} />
                  Store Layout Builder
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Customize your store's homepage layout based on your theme
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                to={`/store/${store?.storeName}`}
                target="_blank"
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Preview</span>
              </Link>
              <button
                onClick={saveLayout}
                disabled={saving}
                className="px-5 py-2.5 text-white rounded-xl transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span className="text-sm font-medium">Save Layout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - Pages & Sections */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Theme Info Card */}
              <div 
                className="rounded-2xl p-6 border shadow-sm"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primaryColor}10, ${theme.secondaryColor}10)`,
                  borderColor: `${theme.primaryColor}20`
                }}
              >
                <h3 className="font-semibold text-gray-900 mb-2">Active Theme</h3>
                <p className="text-sm text-gray-600 mb-3">{theme.themeType}</p>
                <div className="flex items-center space-x-2">
                  <div 
                    className="h-6 w-6 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div 
                    className="h-6 w-6 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: theme.secondaryColor }}
                  />
                  <span className="text-xs text-gray-500 ml-2">Theme colors</span>
                </div>
              </div>
              
              {/* Pages Toggles */}
              <PageToggles
                pages={layout.pages}
                onTogglePage={togglePage}
                theme={theme}
              />
              
              {/* Add Sections */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Add Sections</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Click to add new sections to your store
                  <span className="block text-xs text-gray-400 mt-1">Each section type can only be added once</span>
                </p>
                
                {availableSections.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">All sections added!</p>
                    <p className="text-xs text-gray-400 mt-1">You've added all available sections</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.type}
                          onClick={() => addSection(section.type)}
                          disabled={!layout.pages.home}
                          className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all group text-left ${
                            !layout.pages.home
                              ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                              : 'bg-gray-50 hover:bg-indigo-50'
                          }`}
                        >
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform ${
                            !layout.pages.home ? 'bg-gray-200' : `bg-${section.color}-100 group-hover:scale-110`
                          }`}>
                            <Icon className={`h-6 w-6 ${!layout.pages.home ? 'text-gray-400' : `text-${section.color}-600`}`} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold ${!layout.pages.home ? 'text-gray-400' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                              {section.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{section.description}</div>
                          </div>
                          <Plus className={`h-5 w-5 ${!layout.pages.home ? 'text-gray-300' : 'text-gray-400 group-hover:text-indigo-600'}`} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Center - Sections Preview */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Store Sections</h2>
                  {layout.pages.home && layout.sections.length > 0 && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <GripVertical className="h-3 w-3" />
                      <span>Drag to reorder</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {!layout.pages.home ? (
                  <div className="text-center py-12">
                    <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Home Page is Disabled</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Enable the home page in the settings panel to start building your layout
                    </p>
                  </div>
                ) : layout.sections.length === 0 ? (
                  <div className="text-center py-12">
                    <Layout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sections added</h3>
                    <p className="text-sm text-gray-500 mb-6">Add sections from the left panel to start building</p>
                    {availableSections.length > 0 && (
                      <button
                        onClick={() => addSection(availableSections[0].type)}
                        className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        Add Your First Section
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {layout.sections.map((section, index) => (
                      <div
                        key={section.id}
                        draggable={layout.pages.home}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`transition-all ${layout.pages.home ? 'cursor-move' : ''}`}
                      >
                        <SectionWrapper
                          section={section}
                          onToggle={() => toggleSectionEnabled(section.id)}
                          onRemove={() => removeSection(section.id)}
                          isDisabled={!layout.pages.home}
                          theme={theme}
                        >
                          {renderSection(section, index)}
                        </SectionWrapper>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Panel - Tips & Summary */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div 
                className="rounded-2xl p-6 border"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primaryColor}05, ${theme.secondaryColor}05)`,
                  borderColor: `${theme.primaryColor}20`
                }}
              >
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 mt-0.5" style={{ color: theme.primaryColor }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Layout Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Each section type can only be added once</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Drag sections to reorder them</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Your layout will respect the selected theme</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Changes are saved to your store immediately</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Sections Summary */}
              {layout.sections.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Sections Summary</h3>
                  <div className="space-y-2">
                    {layout.sections.map((section, idx) => (
                      <div key={section.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${section.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-gray-600">
                            {section.type === 'BANNER' ? 'Banner' :
                             section.type === 'FEATURED_PRODUCTS' ? 'Featured Products' :
                             section.type === 'CATEGORIES' ? 'Categories' : 'Footer'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">Section {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default StoreBuilder;