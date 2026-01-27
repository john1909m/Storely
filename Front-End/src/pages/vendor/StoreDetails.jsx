// src/pages/vendor/StoreDetails.jsx
import React, { useState } from 'react';
import {
  Save, Upload, Palette, Globe, Store,
  MapPin, Phone, Mail, Facebook, Instagram,
  Twitter, Youtube, Eye, Image, Link
} from 'lucide-react';

const StoreDetails = () => {
  const [storeInfo, setStoreInfo] = useState({
    name: 'TechGadget Store',
    description: 'Premium electronics and gadgets with free shipping and 1-year warranty. We focus on quality and customer satisfaction.',
    email: 'contact@techgadget.com',
    phone: '(555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    category: 'Electronics',
    established: '2022',
    socialMedia: {
      facebook: 'techgadget',
      instagram: 'techgadget_official',
      twitter: 'techgadget',
      youtube: 'techgadgettv'
    }
  });

  const [branding, setBranding] = useState({
    primaryColor: '#4f46e5',
    secondaryColor: '#8b5cf6',
    logo: '🏪',
    favicon: '📱',
    storeUrl: 'storely.com/techgadget'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      console.log('Store details saved:', { storeInfo, branding });
    }, 1000);
  };

  const handleChange = (section, field, value) => {
    if (section === 'storeInfo') {
      setStoreInfo(prev => ({ ...prev, [field]: value }));
    } else if (section === 'branding') {
      setBranding(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSocialChange = (platform, value) => {
    setStoreInfo(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  const categories = ['Electronics', 'Fashion', 'Home & Living', 'Fitness', 'Food', 'Books', 'Beauty', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Settings</h1>
              <p className="text-gray-600">Customize your store details and branding</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={`https://${branding.storeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center space-x-2"
              >
                <Eye className="h-5 w-5" />
                <span>Preview Store</span>
              </a>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-8">
              <nav className="space-y-2">
                {[
                  { id: 'basic', label: 'Basic Info', icon: Store },
                  { id: 'branding', label: 'Branding', icon: Palette },
                  { id: 'contact', label: 'Contact Info', icon: Mail },
                  { id: 'social', label: 'Social Media', icon: Facebook },
                  { id: 'domain', label: 'Domain & URL', icon: Globe },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Store Preview */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Store Preview</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <div className="h-16 w-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-3xl">{branding.logo}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 mb-1">{storeInfo.name}</div>
                    <div className="text-sm text-gray-600">{branding.storeUrl}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'basic' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Store Information</h2>
                
                {/* Store Name */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={storeInfo.name}
                      onChange={(e) => handleChange('storeInfo', 'name', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    This will be displayed as your store name across the platform
                  </p>
                </div>

                {/* Store Description */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Description
                  </label>
                  <textarea
                    value={storeInfo.description}
                    onChange={(e) => handleChange('storeInfo', 'description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Describe your store and what makes it unique..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    This description appears on your store page. Maximum 500 characters.
                    <span className="ml-2">{storeInfo.description.length}/500</span>
                  </p>
                </div>

                {/* Store Category */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Category
                  </label>
                  <select
                    value={storeInfo.category}
                    onChange={(e) => handleChange('storeInfo', 'category', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Year Established */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <input
                    type="text"
                    value={storeInfo.established}
                    onChange={(e) => handleChange('storeInfo', 'established', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="2022"
                  />
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Branding</h2>
                
                {/* Logo */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Store Logo
                  </label>
                  <div className="flex items-center space-x-8">
                    <div className="h-32 w-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                      <div className="text-5xl">{branding.logo}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center space-x-2">
                          <Upload className="h-5 w-5" />
                          <span>Upload Logo</span>
                        </button>
                        <button className="px-6 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100">
                          Remove Logo
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Recommended size: 400x400px, PNG or JPG format, max 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Favicon */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Favicon
                  </label>
                  <div className="flex items-center space-x-8">
                    <div className="h-16 w-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                      <div className="text-2xl">{branding.favicon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center space-x-2">
                          <Image className="h-5 w-5" />
                          <span>Upload Favicon</span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Recommended size: 64x64px, ICO or PNG format
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Scheme</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <div
                          className="h-12 w-12 rounded-xl border-2 border-gray-200"
                          style={{ backgroundColor: branding.primaryColor }}
                        ></div>
                        <input
                          type="text"
                          value={branding.primaryColor}
                          onChange={(e) => handleChange('branding', 'primaryColor', e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="#4f46e5"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <div
                          className="h-12 w-12 rounded-xl border-2 border-gray-200"
                          style={{ backgroundColor: branding.secondaryColor }}
                        ></div>
                        <input
                          type="text"
                          value={branding.secondaryColor}
                          onChange={(e) => handleChange('branding', 'secondaryColor', e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Primary color is used for buttons and highlights. Secondary color for accents.
                  </p>
                </div>

                {/* Preview */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 mb-4">Brand Preview</h3>
                  <div className="flex items-center space-x-6">
                    <div className="h-20 w-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                      <div className="text-4xl">{branding.logo}</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-xl mb-2">{storeInfo.name}</div>
                      <div className="flex items-center space-x-4">
                        <div
                          className="h-8 w-32 rounded-lg"
                          style={{ backgroundColor: branding.primaryColor }}
                        ></div>
                        <div
                          className="h-8 w-32 rounded-lg"
                          style={{ backgroundColor: branding.secondaryColor }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                {/* Contact Details */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={storeInfo.email}
                        onChange={(e) => handleChange('storeInfo', 'email', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="contact@yourstore.com"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Customers will contact you at this email
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={storeInfo.phone}
                        onChange={(e) => handleChange('storeInfo', 'phone', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <textarea
                        value={storeInfo.address}
                        onChange={(e) => handleChange('storeInfo', 'address', e.target.value)}
                        rows={3}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="Enter your business address"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Displayed for customers and used for shipping calculations
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Media Profiles</h2>
                <p className="text-gray-600 mb-8">
                  Connect your social media accounts to build trust with customers
                </p>

                <div className="space-y-6">
                  {/* Facebook */}
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Facebook className="h-5 w-5 text-blue-600" />
                      <label className="text-sm font-medium text-gray-700">Facebook</label>
                    </div>
                    <div className="flex items-center">
                      <span className="px-4 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                        facebook.com/
                      </span>
                      <input
                        type="text"
                        value={storeInfo.socialMedia.facebook}
                        onChange={(e) => handleSocialChange('facebook', e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="yourstore"
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Instagram className="h-5 w-5 text-pink-600" />
                      <label className="text-sm font-medium text-gray-700">Instagram</label>
                    </div>
                    <div className="flex items-center">
                      <span className="px-4 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                        instagram.com/
                      </span>
                      <input
                        type="text"
                        value={storeInfo.socialMedia.instagram}
                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="yourstore"
                      />
                    </div>
                  </div>

                  {/* Twitter */}
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Twitter className="h-5 w-5 text-blue-400" />
                      <label className="text-sm font-medium text-gray-700">Twitter</label>
                    </div>
                    <div className="flex items-center">
                      <span className="px-4 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                        twitter.com/
                      </span>
                      <input
                        type="text"
                        value={storeInfo.socialMedia.twitter}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="yourstore"
                      />
                    </div>
                  </div>

                  {/* YouTube */}
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Youtube className="h-5 w-5 text-red-600" />
                      <label className="text-sm font-medium text-gray-700">YouTube</label>
                    </div>
                    <div className="flex items-center">
                      <span className="px-4 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                        youtube.com/
                      </span>
                      <input
                        type="text"
                        value={storeInfo.socialMedia.youtube}
                        onChange={(e) => handleSocialChange('youtube', e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="yourstore"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm text-blue-800">
                    Social media links will be displayed on your store page to help customers connect with you.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'domain' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Domain & Store URL</h2>
                
                {/* Store URL */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store URL
                  </label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                      https://
                    </span>
                    <input
                      type="text"
                      value={branding.storeUrl}
                      onChange={(e) => handleChange('branding', 'storeUrl', e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <span className="px-4 py-3 bg-gray-50 border border-l-0 border-gray-200 rounded-r-xl text-gray-500">
                      .storely.com
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Your store URL must be unique and can only contain letters, numbers, and hyphens
                  </p>
                </div>

                {/* Custom Domain */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Custom Domain (Premium Feature)
                  </label>
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Globe className="h-5 w-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">Custom Domain</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Connect your own domain (e.g., store.yourbrand.com)
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-2">Professional Plan</div>
                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                          Upgrade to Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Store QR Code
                  </label>
                  <div className="flex items-center space-x-8">
                    <div className="h-48 w-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <div className="text-sm text-gray-600">QR Code</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Share Your Store</h3>
                      <p className="text-gray-600 mb-4">
                        Share this QR code to help customers find your store easily.
                      </p>
                      <div className="flex items-center space-x-4">
                        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center space-x-2">
                          <Download className="h-5 w-5" />
                          <span>Download QR Code</span>
                        </button>
                        <button className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center space-x-2">
                          <Link className="h-5 w-5" />
                          <span>Copy Store Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;