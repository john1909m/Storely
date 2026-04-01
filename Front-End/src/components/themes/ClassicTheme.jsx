// src/components/themes/ClassicTheme.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, Search, Grid, List, Menu, X, ShoppingBag, 
  Eye, ArrowRight, Filter, ChevronDown 
} from 'lucide-react';
import ProductCard from '../ProductCard';
import CartSidebar from '../CartSidebar';

const ClassicTheme = ({
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
  themeType = 'CLASSIC',
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

  const getGradientStyle = (fromColor, toColor) => ({
    background: `linear-gradient(to right, ${fromColor}, ${toColor})`
  });

  // Cart Sidebar Component (to be used in both pages)
  const CartSidebarComponent = () => (
    <CartSidebar
      isOpen={false} // This will be controlled from parent
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
  );

  // If this is All Products page
  if (isAllProductsPage) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className={`bg-white border-b border-gray-200 sticky top-0 z-30 transition-all duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="container mx-auto px-4">
              {/* Mobile Header */}
              <div className="flex items-center justify-between h-16 lg:hidden">
                <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
                  {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
                
                <Link to={`/store/${store.storeName}`} className="flex items-center gap-3">
                  {store.storeLogoUrl ? (
                    <img src={store.storeLogoUrl} alt={store.storeName} className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-900 line-clamp-1">{store.storeName}</div>
                    <div className="text-xs text-gray-500">Online Store</div>
                  </div>
                </Link>
                
                <button onClick={() => setShowCart(true)} className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                      {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between h-20">
                <Link to={`/store/${store.storeName}`} className="flex items-center gap-4">
                  {store.storeLogoUrl ? (
                    <img src={store.storeLogoUrl} alt={store.storeName} className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                  <h1 className="text-2xl font-bold text-gray-900">{store.storeName}</h1>
                </Link>
                
                <div className="flex items-center gap-6">
                  <Link to={`/store/${store.storeName}`} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Home
                  </Link>
                  <span className="text-gray-900 text-sm font-medium">All Products</span>
                  <button
                    onClick={() => setShowCart(true)}
                    className="relative px-4 py-2 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
                    style={getGradientStyle(colors.primary, colors.secondary)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart ({getCartItemCount()})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white border-b border-gray-100 sticky top-16 z-20">
            <div className="container mx-auto px-4 py-4">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': colors.primary }}
                  onFocus={(e) => e.target.style.setProperty('--tw-ring-color', colors.primary)}
                />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Categories */}
              <div className="lg:w-64">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-32">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Categories</h3>
                    <button 
                      onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Filter className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className={`space-y-2 ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setShowFiltersMobile(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === 'all' 
                          ? 'text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      style={selectedCategory === 'all' ? getGradientStyle(colors.primary, colors.secondary) : {}}
                    >
                      All Products ({products.length})
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id.toString());
                          setShowFiltersMobile(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          selectedCategory === cat.id.toString() 
                            ? 'text-white' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        style={selectedCategory === cat.id.toString() ? getGradientStyle(colors.primary, colors.secondary) : {}}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id.toString() === selectedCategory)?.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                      >
                        <Grid className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                      >
                        <List className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No products found</p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                  }>
                    {filteredProducts.map(product => (
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

  // HOME PAGE - With Layout Sections
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`bg-white border-b border-gray-200 sticky top-0 z-30 transition-all duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="container mx-auto px-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 lg:hidden">
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <Link to={`/store/${store.storeName}`} className="flex items-center gap-3">
                {store.storeLogoUrl ? (
                  <img src={store.storeLogoUrl} alt={store.storeName} className="h-10 w-10 rounded-lg object-cover" />
                ) : (
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-gray-600" />
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-900 line-clamp-1">{store.storeName}</div>
                  <div className="text-xs text-gray-500">Online Store</div>
                </div>
              </Link>
              
              <button onClick={() => setShowCart(true)} className="relative p-2 hover:bg-gray-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                    {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                  </span>
                )}
              </button>
            </div>
            
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between h-20">
              <Link to={`/store/${store.storeName}`} className="flex items-center gap-4">
                {store.storeLogoUrl ? (
                  <img src={store.storeLogoUrl} alt={store.storeName} className="h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-900">{store.storeName}</h1>
              </Link>
              
              <div className="flex items-center gap-6">
                <span className="text-gray-900 text-sm font-medium">Home</span>
                <button
                  onClick={onViewAllProducts}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  All Products
                </button>
                <button
                  onClick={() => setShowCart(true)}
                  className="relative px-4 py-2 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
                  style={getGradientStyle(colors.primary, colors.secondary)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart ({getCartItemCount()})</span>
                </button>
              </div>
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
              className="inline-flex items-center gap-2 px-8 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
              style={getGradientStyle(colors.primary, colors.secondary)}
            >
              View All Products
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

export default ClassicTheme;