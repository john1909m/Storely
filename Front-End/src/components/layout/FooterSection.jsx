// src/components/layout/FooterSection.jsx
import React from 'react';
import { Facebook, Instagram, Phone, MapPin, Mail, ShoppingBag } from 'lucide-react';

const FooterSection = ({ section, store, colors, themeType, t }) => {
  if (!section.enabled) return null;
  
  const getFooterStyle = () => {
    if (themeType === 'MODERN') {
      return 'bg-[#181818] text-white border-t border-white/10';
    }
    return 'bg-gray-900 text-gray-300';
  };
  
  return (
    <footer className={`${getFooterStyle()} py-12`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {store.storeLogoUrl ? (
                <img src={store.storeLogoUrl} alt={store.storeName} className="h-8 w-8 rounded-lg object-cover" />
              ) : (
                <ShoppingBag className="h-6 w-6" style={{ color: colors.primary }} />
              )}
              <span className="font-bold text-lg">{store.storeName}</span>
            </div>
            <p className="text-sm opacity-75">{store.storeDescription || "Your trusted online store"}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#products" className="opacity-75 hover:opacity-100 transition">Products</a></li>
              <li><a href="#categories" className="opacity-75 hover:opacity-100 transition">Categories</a></li>
              <li><a href="#about" className="opacity-75 hover:opacity-100 transition">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            {store.storePhone && (
              <p className="flex items-center gap-2 text-sm opacity-75 mb-2">
                <Phone className="h-4 w-4" />
                <span>{store.storePhone}</span>
              </p>
            )}
            {store.storeAddress && (
              <p className="flex items-center gap-2 text-sm opacity-75">
                <MapPin className="h-4 w-4" />
                <span>{store.storeAddress}</span>
              </p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {store.facebook && (
                <a href={store.facebook} target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 transition">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {store.instagram && (
                <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 transition">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm opacity-75">
          {section.text || `© ${new Date().getFullYear()} ${store.storeName}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;