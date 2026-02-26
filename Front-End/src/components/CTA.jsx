// components/CTA.jsx
import React from 'react';
import { ArrowRight, Star, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  const benefits = [
    
    
    'Cancel anytime',
    'Instant setup'
  ];

  return (
    <section 
      className="py-12 sm:py-16 md:py-24 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden"
      aria-label="Call to action"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Stars */}
          <div 
            className="flex justify-center space-x-1 mb-4 sm:mb-6"
            aria-label="5-star rating"
          >
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 100}ms` }}
                aria-hidden="true"
              />
            ))}
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Launch Your Online Store?
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4">
            Join successful vendors who trust Storely to power their online business. 
            No coding, no complex setup — just results.
          </p>
          
          {/* Benefits badges */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center space-x-1"
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 md:mb-12">
            <Link to="/signup" className="w-full sm:w-auto">
              <button 
                className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white text-indigo-600 font-bold text-sm sm:text-base md:text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                aria-label="Start selling today"
              >
                <span>Start Selling Today</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" aria-hidden="true" />
              </button>
            </Link>
            
            <Link to="/pricing" className="w-full sm:w-auto">
              <button 
                className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-transparent border-2 border-white text-white font-bold text-sm sm:text-base md:text-lg rounded-xl hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="View pricing plans"
              >
                View Pricing
              </button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-indigo-100">
            <div className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span>Secure platform</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span>5-star support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;