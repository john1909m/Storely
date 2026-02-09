// pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../../api/product.api';
import { storeAPI } from '../../api/store.api';

const ProductDetail = () => {
  const { storeName, productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProductData();
  }, [storeName, productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      
      // Fetch store first
      const storeData = await storeAPI.getByName(storeName);
      if (!storeData) throw new Error('Store not found');
      setStore(storeData);

      // Fetch product
      const productData = await productAPI.getById(productId,storeData.id);
      if (!productData || productData.storeId !== storeData.id) {
        throw new Error('Product not found in this store');
      }
      setProduct(productData);

    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const cartKey = `cart_${storeName}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        ...product,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    
    // Show success message
    alert(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`);
    
    // Navigate to cart or stay on page
    navigate(`/store/${storeName}?addedToCart=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This product does not exist or has been removed.'}</p>
          <button
            onClick={() => navigate(`/store/${storeName}`)}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/store/${storeName}`)}
          className="mb-6 flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
        >
          <span>←</span>
          <span>Back to {store?.storeName}</span>
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
                {product.images && product.images[selectedImageIndex] ? (
                  <img 
                    src={product.images[selectedImageIndex]} 
                    alt={product.productName || product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-6xl">📦</div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index 
                          ? 'border-indigo-600' 
                          : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.productName} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-3">
                    {product.category?.categoryName || product.category?.name || 'Uncategorized'}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.productName || product.name}
                  </h1>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  product.quantity > 10 
                    ? 'bg-green-100 text-green-800'
                    : product.quantity > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.quantity > 10 ? 'In Stock' : product.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${(product.price || 0).toFixed(2)}
                </div>
                {product.quantity > 0 && (
                  <div className="text-sm text-gray-600">
                    {product.quantity} units available
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="h-12 w-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="text-xl">-</span>
                    </button>
                    <span className="h-12 w-16 flex items-center justify-center font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => Math.min(product.quantity, prev + 1))}
                      disabled={quantity >= product.quantity}
                      className="h-12 w-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Max: {product.quantity} units
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.quantity <= 0}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  product.quantity > 0
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {product.quantity > 0
                  ? `Add to Cart - $${((product.price || 0) * quantity).toFixed(2)}`
                  : 'Out of Stock'
                }
              </button>

              {/* Store Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    {store?.logoUrl ? (
                      <img 
                        src={store.logoUrl} 
                        alt={store.storeName}
                        className="h-full w-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-xl">🏪</span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sold by {store?.storeName}</div>
                    <div className="text-sm text-gray-600">
                      {store?.storeDescription || 'Verified seller'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;