// src/components/themes/ThemeRenderer.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import ClassicTheme from './ClassicTheme';
import ModernTheme from './ModernTheme';
import MinimalTheme from './MinimalTheme';

const ThemeRenderer = ({
  themeType,
  store,
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  filteredProducts,
  formatPrice,
  colors,
  getCartItemCount,
  setShowCart,
  setShowMobileMenu,
  showMobileMenu,
  setShowSearchBar,
  setShowCategoriesDrawer,
  handleAddToCart,
  handleToggleWishlist,
  isInWishlist,
  onViewDetails,
  t,
  pageLoaded
}) => {
  const commonProps = {
    store,
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    filteredProducts,
    formatPrice,
    colors,
    getCartItemCount,
    setShowCart,
    setShowMobileMenu,
    showMobileMenu,
    setShowSearchBar,
    setShowCategoriesDrawer,
    handleAddToCart,
    handleToggleWishlist,
    isInWishlist,
    onViewDetails,
    t,
    pageLoaded
  };

  switch (themeType) {
    case 'MODERN':
      return <ModernTheme {...commonProps} />;
    case 'MINIMAL':
      return <MinimalTheme {...commonProps} />;
    case 'CLASSIC':
    default:
      return <ClassicTheme {...commonProps} />;
  }
};

export default ThemeRenderer;