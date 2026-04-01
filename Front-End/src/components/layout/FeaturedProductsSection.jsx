// src/components/layout/FeaturedProductsSection.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import ProductCard from '../ProductCard';

const FeaturedProductsSection = ({
  section,
  products,
  formatPrice,
  onAddToCart,
  onToggleWishlist,
  viewMode = 'grid',
  isInWishlist,
  onViewDetails,
  colors,
  themeType,
  t
}) => {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const containerRef = React.useRef(null);
  
  if (!section.enabled) return null;
  
  // Get featured products based on productIds
  const featuredProducts = section.productIds && section.productIds.length > 0
    ? products.filter(p => section.productIds.includes(p.id))
    : products.slice(0, 8);
  
  if (featuredProducts.length === 0) return null;
  
  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  const getSectionStyle = () => {
    if (themeType === 'MODERN') {
      return 'bg-[#181818] text-white';
    }
    return 'bg-gray-50';
  };
  
  return (
    <div className={`py-12 ${getSectionStyle()}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-gray-500">Hand-picked just for you</p>
        </div>
        
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full shadow-lg hover:shadow-xl transition ${themeType === 'MODERN' ? 'bg-white/5 backdrop-blur-sm border border-white/10' : 'bg-white border border-gray-200'}`}
          >
            <ChevronLeft className={`w-5 h-5 ${themeType === 'MODERN' ? 'text-white' : 'text-gray-900'}`} />
          </button>
          
          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map(product => (
              <div key={product.id} className="flex-shrink-0 w-64">
                <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={() => onAddToCart(product)}
                    isInWishlist={isInWishlist(product.id)}
                    onViewDetails={() => onViewDetails(product)}
                    formatPrice={formatPrice}
                    colors={colors}
                    themeType={themeType}
                    t={t}
                  />
              </div>
            ))}
          </div>
          
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full shadow-lg hover:shadow-xl transition ${themeType === 'MODERN' ? 'bg-white/5 backdrop-blur-sm border border-white/10' : 'bg-white border border-gray-200'}`}
          >
            <ChevronRight className={`w-5 h-5 ${themeType === 'MODERN' ? 'text-white' : 'text-gray-900'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsSection;