// src/components/themes/ModernTheme.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, Search, Grid, List, Menu, X, ShoppingBag, 
  Eye, ArrowRight, Filter, Heart, Star, Sparkles 
} from 'lucide-react';
import ProductCard from '../ProductCard';
import CartSidebar from '../CartSidebar';

const ModernTheme = ({
  store,
  products = [],
  categories = [],
  formatPrice,
  colors,
  getCartItemCount,
  setShowCart,
  setShowMobileMenu,
  showMobileMenu,
  setShowSearchBar,
  handleAddToCart,
  handleToggleWishlist,
  isInWishlist,
  onViewDetails,
  onViewAllProducts,
  t,
  pageLoaded,
  renderLayoutSections,
  isAllProductsPage = false,
  themeType = 'MODERN',
  searchQuery = '',
  setSearchQuery,
  selectedCategory = 'all',
  setSelectedCategory,
  viewMode = 'grid',
  setViewMode,
  sortBy = 'featured',
  setSortBy,
  filteredProducts = [],
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const getGradientStyle = (fromColor, toColor) => ({
    background: `linear-gradient(135deg, ${fromColor}, ${toColor})`
  });

  // If this is All Products page
  if (isAllProductsPage) {
    return (
      <>
        <div className="min-h-screen bg-[#181818]">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#181818] backdrop-blur-xl border-b border-white/10">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16 lg:h-20">
                <Link to={`/store/${store.storeName}`} className="flex items-center gap-3">
                  {store.storeLogoUrl ? (
                    <img src={store.storeLogoUrl} alt={store.storeName} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <span className="text-xl font-bold text-white tracking-tight">{store.storeName}</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                  <Link to={`/store/${store.storeName}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    Home
                  </Link>
                  <span className="text-white text-sm font-medium">All Products</span>
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={() => setShowSearchBar(true)} className="text-gray-400 hover:text-white">
                    <Search className="h-5 w-5" />
                  </button>
                  <button onClick={() => setShowCart(true)} className="relative text-gray-400 hover:text-white">
                    <ShoppingCart className="h-5 w-5" />
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                        {getCartItemCount()}
                      </span>
                    )}
                  </button>
                  <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden text-gray-400 hover:text-white">
                    <Menu className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pt-20">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="border-t border-white/10">
            <div className="container mx-auto px-4 py-4 overflow-x-auto">
              <div className="flex gap-6 text-sm justify-center">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'text-white border-b-2 border-indigo-500 pb-2'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id.toString())}
                    className={`whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id.toString()
                        ? 'text-white border-b-2 border-indigo-500 pb-2'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm text-gray-400">{filteredProducts.length} products</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${themeType === 'MODERN' ? 'bg-[#0e0e0e] text-black ' : 'bg-gray-100 text-gray-900'}`}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your search</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={() => handleAddToCart(product)}
                    onToggleWishlist={() => handleToggleWishlist(product)}
                    isInWishlist={isInWishlist(product.id)}
                    onViewDetails={() => onViewDetails(product)}
                    formatPrice={formatPrice}
                    colors={colors}
                    themeType={themeType}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        <CartSidebar
          isOpen={false}
          onClose={() => setShowCart(false)}
          cart={cart}
          store={store}
          formatPrice={formatPrice}
          colors={colors}
          themeType={themeType}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onCheckout={onCheckout}
          t={t}
        />
      </>
    );
  }

  // HOME PAGE
  return (
    <>
      <div className="min-h-screen bg-[#181818]">
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#181818]/80 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <Link to={`/store/${store.storeName}`} className="flex items-center gap-3">
                {store.storeLogoUrl ? (
                  <img src={store.storeLogoUrl} alt={store.storeName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                )}
                <span className="text-xl font-bold text-white tracking-tight">{store.storeName}</span>
              </Link>

              <div className="hidden lg:flex items-center gap-8">
                <span className="text-white text-sm font-medium">Home</span>
                <button onClick={onViewAllProducts} className="text-gray-300 hover:text-white transition-colors text-sm">
                  All Products
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => setShowCart(true)} className="relative text-gray-400 hover:text-white">
                  <ShoppingCart className="h-5 w-5" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </button>
                <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden text-gray-400 hover:text-white">
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative min-h-screen pt-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="container mx-auto px-4 pt-20 pb-32 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full mb-6 border border-white/10">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span className="text-sm text-gray-300">✨ Welcome to {store.storeName}</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {store.storeName}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Shop Smarter
                </span>
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                {store.storeDescription || "Discover the best products curated just for you."}
              </p>
              <button
                onClick={onViewAllProducts}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-xl inline-flex items-center gap-2 group"
              >
                Shop Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Layout Sections */}
        {renderLayoutSections && renderLayoutSections()}
        
        {/* View All Products CTA */}
        {products.length > 0 && (
          <div className="container mx-auto px-4 py-20 text-center">
            <button
              onClick={onViewAllProducts}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-xl inline-flex items-center gap-2"
            >
              Browse All Products
              <Eye className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={false}
        onClose={() => setShowCart(false)}
        cart={cart}
        store={store}
        formatPrice={formatPrice}
        colors={colors}
        themeType={themeType}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onCheckout={onCheckout}
        t={t}
      />
    </>
  );
};

export default ModernTheme;