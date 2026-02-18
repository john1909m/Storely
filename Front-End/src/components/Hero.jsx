// components/Hero.jsx
import React from 'react';
import { ArrowRight, Store, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full mb-6">
              <Store className="h-4 w-4" />
              <span className="text-sm font-medium">Multi-Vendor Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Launch Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Online Store</span>
              <br />in Minutes
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Storely helps vendors create branded online stores, manage products, and receive orders — all in one place. 
              Start selling today with zero technical skills required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/signup">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>Create Your Store</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              </Link>
              
            </div>
            
            
          </div>
          
          {/* Right Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-2xl">
              {/* Mock Dashboard */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">My Store Dashboard</div>
                      <div className="text-sm text-gray-500">storely-eg.com/mystore</div>
                    </div>
                  </div>
                  <div className="h-3 w-16 bg-green-100 rounded-full">
                    <div className="h-3 w-12 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-indigo-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-indigo-700">124</div>
                    <div className="text-sm text-gray-600">Orders Today</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-purple-700">$2,450</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                </div>
                
                {/* Recent Orders */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Order #1234</div>
                    <div className="text-green-600 font-medium">$89.99</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Order #1235</div>
                    <div className="text-green-600 font-medium">$129.99</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 h-24 w-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;