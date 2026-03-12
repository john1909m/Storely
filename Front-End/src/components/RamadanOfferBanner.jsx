// src/components/RamadanOfferBanner.jsx
import React, { useState, useEffect } from 'react';
import { Gift, Star, X, Sparkles } from 'lucide-react';

const RamadanOfferBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 text-white py-2 px-4 relative z-40 pt-24">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Gift className="h-4 w-4 text-yellow-300" />
            <span className="font-semibold">Eid El-Fitr Special</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-300 fill-current" />
            <span className="font-medium">خصم 50%</span>
            <Star className="h-3 w-3 text-yellow-300 fill-current" />
          </div>
          
          <span className="text-emerald-100">على أول شهر اشتراك</span>
          
          <a
            href="/pricing"
            className="bg-yellow-400 text-emerald-900 px-4 py-1 rounded-full text-xs font-bold hover:bg-yellow-300 transition-colors inline-flex items-center space-x-1"
          >
            <Sparkles className="h-3 w-3" />
            <span>استفد الآن</span>
          </a>
        </div>
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default RamadanOfferBanner;