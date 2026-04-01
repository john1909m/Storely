// src/components/layout/BannerDisplay.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerDisplay = ({ section, store, themeType, colors, t }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = section.images || [];
  
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length]);
  
  if (!section.enabled || images.length === 0) return null;
  
  const getBannerStyle = () => {
    if (images[currentSlide]) {
      return { backgroundImage: `url(${images[currentSlide]})` };
    }
    return { background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` };
  };
  
  const getThemeStyles = () => {
    if (themeType === 'MODERN') {
      return {
        overlay: 'bg-black/50',
        title: 'text-white',
        subtitle: 'text-gray-200'
      };
    }
    if (themeType === 'MINIMAL') {
      return {
        overlay: 'bg-black/30',
        title: 'text-white',
        subtitle: 'text-gray-100'
      };
    }
    return {
      overlay: 'bg-black/40',
      title: 'text-white',
      subtitle: 'text-white/90'
    };
  };
  
  const themeStyles = getThemeStyles();
  
  return (
    <div className="relative overflow-hidden">
      <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-cover bg-center bg-no-repeat transition-all duration-500" style={getBannerStyle()}>
        <div className={`absolute inset-0 ${themeStyles.overlay}`} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {section.title && (
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 animate-fade-in-up ${themeStyles.title}`}>
              {section.title}
            </h2>
          )}
          {section.subtitle && (
            <p className={`text-sm sm:text-base lg:text-lg max-w-2xl animate-fade-in-up animation-delay-200 ${themeStyles.subtitle}`}>
              {section.subtitle}
            </p>
          )}
        </div>
      </div>
      
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % images.length)}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all ${
                  idx === currentSlide 
                    ? 'bg-white w-3 sm:w-4' 
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerDisplay;