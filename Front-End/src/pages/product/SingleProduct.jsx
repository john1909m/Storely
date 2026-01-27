// src/pages/product/SingleProduct.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Star, ShoppingCart, Heart, Share2, Truck,
  Shield, CheckCircle, ArrowLeft, Package,
  Edit, Trash2, BarChart, Tag, AlertCircle
} from 'lucide-react';

// Customer View Component
const CustomerProductView = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const product = {
    id: productId,
    name: 'Wireless Bluetooth Headphones Premium',
    description: 'Premium noise-canceling wireless headphones with 40-hour battery life, premium sound quality, and comfortable over-ear design. Perfect for music lovers and professionals.',
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.5,
    reviews: 124,
    stock: 42,
    category: 'Electronics',
    brand: 'AudioTech',
    sku: 'PROD-00124',
    images: ['🎧', '🎧', '🎧', '🎧'], // Emoji placeholders
    features: [
      'Active Noise Cancellation',
      '40-hour battery life',
      'Bluetooth 5.2',
      'Hi-Res Audio support',
      'Foldable design',
      'Carrying case included'
    ],
    specifications: {
      'Connectivity': 'Bluetooth 5.2',
      'Battery Life': '40 hours',
      'Charging Time': '2 hours',
      'Weight': '265g',
      'Warranty': '1 year'
    }
  };

  const relatedProducts = [
    { id: 2, name: 'Wireless Earbuds Pro', price: 89.99, image: '🎵' },
    { id: 3, name: 'Premium Smart Watch', price: 249.99, image: '⌚' },
    { id: 4, name: 'Portable Bluetooth Speaker', price: 69.99, image: '🔊' },
  ];

  const handleAddToCart = () => {
    console.log(`Added ${quantity} ${product.name} to cart`);
    // Add to cart logic here
  };

  const handleBuyNow = () => {
    console.log(`Buying ${quantity} ${product.name}`);
    // Buy now logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to store
            </button>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <Share2 className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsInWishlist(!isInWishlist)}
                className={`${isInWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
              >
                <Heart className="h-5 w-5" />
              </button>
              <button className="relative text-gray-600 hover:text-gray-900">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center mb-6">
              <div className="text-9xl">{product.images[selectedImage]}</div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 rounded-xl flex items-center justify-center ${
                    selectedImage === index
                      ? 'ring-2 ring-indigo-500 bg-indigo-50'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl">{image}</div>
                </button>
              ))}
            </div>

            {/* Store Info */}
            <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <div className="text-2xl">🏪</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">TechGadget Store</div>
                  <div className="text-sm text-gray-500">4.8 ★ (124 reviews)</div>
                </div>
                <button className="ml-auto px-4 py-2 text-indigo-600 hover:text-indigo-700 text-sm">
                  Visit Store →
                </button>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            {/* Category & Brand */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-sm text-gray-600">by {product.brand}</span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-700">{product.rating} ({product.reviews} reviews)</span>
              <span className="text-green-600 font-medium">✓ In Stock</span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="text-4xl font-bold text-gray-900">${product.price}</div>
              <div className="text-lg text-gray-500 line-through">${product.originalPrice}</div>
              <div className="text-sm text-green-600 font-medium mt-2">
                Save ${(product.originalPrice - product.price).toFixed(2)} (28% off)
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center space-x-6">
                {/* Quantity Selector */}
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 bg-gray-100 rounded-l-xl hover:bg-gray-200 flex items-center justify-center"
                  >
                    -
                  </button>
                  <div className="h-12 w-16 bg-gray-50 flex items-center justify-center font-semibold">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 bg-gray-100 rounded-r-xl hover:bg-gray-200 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Stock Info */}
                <div className="text-gray-600">
                  <span className="font-medium">{product.stock}</span> units available
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                <Truck className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Free Shipping</div>
                  <div className="text-sm text-gray-600">Over $50</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">1 Year Warranty</div>
                  <div className="text-sm text-gray-600">Full coverage</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">30-Day Returns</div>
                  <div className="text-sm text-gray-600">Easy returns</div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all">
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-6xl">{relatedProduct.image}</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h3>
                <div className="text-xl font-bold text-gray-900 mb-4">${relatedProduct.price}</div>
                <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Vendor View Component
const VendorProductView = () => {
  const { productId } = useParams();
  const [product] = useState({
    id: productId,
    name: 'Wireless Bluetooth Headphones Premium',
    description: 'Premium noise-canceling wireless headphones...',
    price: 129.99,
    cost: 89.99,
    sku: 'PROD-00124',
    category: 'Electronics',
    status: 'active',
    stock: 42,
    minStock: 10,
    sales: 124,
    revenue: '$16,119',
    images: ['🎧', '🎧', '🎧'],
    variants: [
      { name: 'Color', options: ['Black', 'White', 'Blue'] },
      { name: 'Size', options: ['Standard', 'XL'] }
    ]
  });

  const stats = [
    { label: 'Total Sales', value: product.sales, change: '+12%' },
    { label: 'Revenue', value: product.revenue, change: '+18%' },
    { label: 'Avg. Rating', value: '4.5', change: '+0.2' },
    { label: 'Conversion', value: '4.8%', change: '+0.5%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <button className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
              </div>
              <p className="text-gray-600">SKU: {product.sku}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Edit Product</span>
              </button>
              <button className="px-6 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 flex items-center space-x-2">
                <Trash2 className="h-5 w-5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-6">
                    <div className="text-7xl">🎧</div>
                  </div>
                  <div className="flex space-x-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-2xl">{image}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Basic Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <div className="text-3xl font-bold text-gray-900">${product.price}</div>
                      <div className="text-sm text-gray-500">Cost: ${product.cost} | Margin: ${(product.price - product.cost).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                      <div className="flex items-center space-x-4">
                        <div className={`px-4 py-2 rounded-lg font-medium ${
                          product.stock > product.minStock * 2
                            ? 'bg-green-100 text-green-800'
                            : product.stock > product.minStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} units
                        </div>
                        <div className="text-sm text-gray-600">Min: {product.minStock} units</div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <div className="text-gray-900">{product.category}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h3>
                  <div className="space-y-6">
                    {product.variants.map((variant, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {variant.name}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {variant.options.map((option) => (
                            <button
                              key={option}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              {option}
                            </button>
                          ))}
                          <button className="px-4 py-2 text-indigo-600 hover:text-indigo-700">
                            + Add Option
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Stats */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Product Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                    <div className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div>
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 flex items-center justify-center space-x-2">
                  <BarChart className="h-5 w-5" />
                  <span>View Analytics</span>
                </button>
                <button className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center justify-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>Edit Product</span>
                </button>
                <button className="w-full py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 flex items-center justify-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Create Promotion</span>
                </button>
                <button className="w-full py-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 flex items-center justify-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Update Stock</span>
                </button>
              </div>
            </div>

            {/* Stock Alert */}
            <div className="bg-white rounded-2xl p-6 border border-amber-100 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Stock Alert</div>
                  <div className="text-sm text-gray-600">Reordering soon</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Current Stock</span>
                    <span className="font-medium">{product.stock} units</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className={`h-2 rounded-full ${
                      product.stock > 30 ? 'bg-green-500' :
                      product.stock > 10 ? 'bg-amber-500' : 'bg-red-500'
                    }`} style={{ width: `${(product.stock / 50) * 100}%` }}></div>
                  </div>
                </div>
                <button className="w-full py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100">
                  Reorder Now
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">SKU</div>
                  <div className="font-medium text-gray-900">{product.sku}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Created</div>
                  <div className="font-medium text-gray-900">Jan 15, 2024</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Last Updated</div>
                  <div className="font-medium text-gray-900">Mar 8, 2024</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Product Views</div>
                  <div className="font-medium text-gray-900">2,847</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
                  <div className="font-medium text-green-600">4.8%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main SingleProduct Component
const SingleProduct = ({ viewType = 'customer' }) => {
  return viewType === 'vendor' ? <VendorProductView /> : <CustomerProductView />;
};

export default SingleProduct;