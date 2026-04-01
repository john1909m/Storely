// src/components/themes/MinimalTheme.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, Search, Grid, List, Menu, X, ShoppingBag, 
  Eye, ArrowRight, Filter, Heart 
} from 'lucide-react';
import ProductCard from '../ProductCard';
import CartSidebar from '../CartSidebar';

const MinimalTheme = ({
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
  themeType = 'MINIMAL',
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
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // If this is All Products page
  if (isAllProductsPage) {
    return (
      <>
        <div className="min-h-screen bg-white">
          {/* Header */}
          <div className={`border-b border-gray-100 sticky top-0 bg-white z-30 transition-all duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16 lg:h-20">
                <Link to={`/store/${store.storeName}`} className="flex items-center gap-3">
                  {store.storeLogoUrl ? (
                    <img src={store.storeLogoUrl} alt={store.storeName} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="h-8 w-8 bg-gray-900 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="text-lg font-light tracking-wide text-gray-900">{store.storeName}</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                  <Link to={`/store/${store.storeName}`} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Home
                  </Link>
                  <span className="text-gray-900 text-sm font-medium">All Products</span>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowSearchBar(true)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowCart(true)}
                    className="relative text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-2 -right-2 h-4 w-4 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                        {getCartItemCount()}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="lg:hidden text-gray-600 hover:text-gray-900"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="container mx-auto px-4 py-8">
            <div className={`max-w-md mx-auto transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-gray-400 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="border-t border-gray-100">
            <div className="container mx-auto px-4 py-4 overflow-x-auto">
              <div className="flex gap-6 text-sm justify-center">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'text-gray-900 font-medium border-b-2 border-gray-900 pb-2'
                      : 'text-gray-500 hover:text-gray-700'
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
                        ? 'text-gray-900 font-medium border-b-2 border-gray-900 pb-2'
                        : 'text-gray-500 hover:text-gray-700'
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
              <p className="text-sm text-gray-500">{filteredProducts.length} products</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 transition-colors ${viewMode === 'grid' ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1 transition-colors ${viewMode === 'list' ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-none bg-transparent focus:outline-none text-gray-600"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
      <div className="min-h-screen bg-white">
        <div className={`border-b border-gray-100 sticky top-0 bg-white z-30 transition-all duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <Link to={`/store/${store.storeName}`} className="flex items-center gap-3">
                {store.storeLogoUrl ? (
                  <img src={store.storeLogoUrl} alt={store.storeName} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-white" />
                  </div>
                )}
                <span className="text-lg font-light tracking-wide text-gray-900">{store.storeName}</span>
              </Link>

              <div className="hidden lg:flex items-center gap-8">
                <span className="text-gray-900 text-sm font-medium">Home</span>
                <button onClick={onViewAllProducts} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  All Products
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowCart(true)}
                  className="relative text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 w-4 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gray-50 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              {store.storeName}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {store.storeDescription || "Quality products, simple shopping"}
            </p>
            <div className="mt-8">
              <button
                onClick={onViewAllProducts}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
              >
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Layout Sections */}
        {renderLayoutSections && renderLayoutSections()}
        
        {/* View All Products CTA */}
        {products.length > 0 && (
          <div className="container mx-auto px-4 py-12 text-center">
            <button
              onClick={onViewAllProducts}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
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

export default MinimalTheme;