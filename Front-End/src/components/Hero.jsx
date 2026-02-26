// components/Hero.jsx
import React from 'react';
import { ArrowRight, Store, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section 
      className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-24 container mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Hero section"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <div 
              className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 animate-pulse-slow"
              role="status"
              aria-label="Platform type"
            >
              <Store className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium">Multi-Vendor Platform</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
              Launch Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 block sm:inline"> Online Store</span>
              <br className="hidden sm:block" />in Minutes
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xl">
              Storely helps vendors create branded online stores, manage products, and receive orders — all in one place. 
              Start selling today with zero technical skills required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Link to="/signup" className="w-full sm:w-auto">
                <button 
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-label="Create your store now"
                >
                  <span>Create Your Store</span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </Link>
              
              
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                <span>No code required</span>
              </div>
              
            </div>
          </div>
          
          {/* Right Illustration - محسن للوصول */}
          <div className="relative mt-8 md:mt-0 animate-fade-in">
            <div 
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl hover:shadow-3xl transition-shadow duration-500"
              role="img"
              aria-label="Store dashboard preview"
            >
              {/* Mock Dashboard */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Store className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-gray-900">My Store Dashboard</div>
                      <div className="text-xs sm:text-sm text-gray-500 break-all">storely-eg.com/mystore</div>
                    </div>
                  </div>
                  <div 
                    className="h-2 w-16 sm:h-3 sm:w-20 bg-green-100 rounded-full"
                    role="progressbar"
                    aria-valuenow={75}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="h-2 sm:h-3 w-12 sm:w-16 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-indigo-50 p-2 sm:p-4 rounded-lg sm:rounded-xl hover:scale-105 transition-transform">
                    <div className="text-lg sm:text-2xl font-bold text-indigo-700">124</div>
                    <div className="text-xs sm:text-sm text-gray-600">Orders Today</div>
                  </div>
                  <div className="bg-purple-50 p-2 sm:p-4 rounded-lg sm:rounded-xl hover:scale-105 transition-transform">
                    <div className="text-lg sm:text-2xl font-bold text-purple-700">$2,450</div>
                    <div className="text-xs sm:text-sm text-gray-600">Revenue</div>
                  </div>
                </div>
                
                {/* Recent Orders */}
                <div className="space-y-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Recent Orders</h3>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-xs sm:text-sm font-medium">Order #1234</span>
                    <span className="text-xs sm:text-sm text-green-600 font-medium">$89.99</span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-xs sm:text-sm font-medium">Order #1235</span>
                    <span className="text-xs sm:text-sm text-green-600 font-medium">$129.99</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements - Decorative */}
            <div 
              className="absolute -top-4 -left-4 h-16 w-16 sm:h-24 sm:w-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-xl animate-float"
              aria-hidden="true"
            ></div>
            <div 
              className="absolute -bottom-4 -right-4 h-20 w-20 sm:h-32 sm:w-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-float-delayed"
              aria-hidden="true"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;