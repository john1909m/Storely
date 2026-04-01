// src/components/vendor/StoreBuilder/sections/FeaturedProductsSection.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Check, ShoppingBag } from 'lucide-react';

const FeaturedProductsSection = ({ section, onUpdate, products }) => {
  const { t } = useTranslation();
  const toggleProduct = (productId) => {
    const currentIds = section.productIds || [];
    if (currentIds.includes(productId)) {
      onUpdate({
        productIds: currentIds.filter(id => id !== productId)
      });
    } else {
      onUpdate({
        productIds: [...currentIds, productId]
      });
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  const selectedProductIds = section.productIds || [];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Select products to showcase in the featured section
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {selectedProductIds.length} product(s) selected
          </p>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No products found</p>
          <p className="text-xs text-gray-400 mt-1">Add products first to feature them</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {products.map(product => {
            const isSelected = selectedProductIds.includes(product.id);
            
            return (
              <div
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border border-indigo-200'
                    : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <div className="h-12 w-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {product.imageUrls?.[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-gray-400 m-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-indigo-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Preview */}
      {selectedProductIds.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Preview ({selectedProductIds.length} products)
          </h4>
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {selectedProductIds.slice(0, 5).map(productId => {
              const product = products.find(p => p.id === productId);
              if (!product) return null;
              
              return (
                <div key={productId} className="flex-shrink-0 w-24 text-center">
                  <div className="h-20 w-20 bg-gray-200 rounded-lg overflow-hidden mx-auto">
                    {product.imageUrls?.[0] ? (
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400 m-6" />
                    )}
                  </div>
                  <p className="text-xs text-gray-900 truncate mt-2">{product.name}</p>
                  <p className="text-xs text-indigo-600">{formatPrice(product.price)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProductsSection;