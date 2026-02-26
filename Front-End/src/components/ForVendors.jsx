// components/ForVendors.jsx
import React from 'react';
import { CheckCircle, TrendingUp, Users, Zap, Star, Clock, Shield } from 'lucide-react';

const ForVendors = () => {
  const benefits = [
    {
      icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'No Technical Skills Required',
      description: 'Our intuitive interface makes store setup a breeze.',
      stat: 'Zero coding'
    },
    {
      icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Grow Your Business',
      description: 'Access powerful analytics to make data-driven decisions.',
      stat: '+150% avg growth'
    },
    {
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Reach More Customers',
      description: 'Share your unique store link across social media and websites.',
      stat: '10k+ reach'
    },
    {
      icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Easy Order Management',
      description: 'Track and fulfill orders from a single dashboard.',
      stat: '99.9% uptime'
    },
  ];

  const stats = [
    { value: '85%', label: 'Faster store setup', icon: <Clock className="h-5 w-5" /> },
    { value: '2.5x', label: 'Higher conversion', icon: <TrendingUp className="h-5 w-5" /> },
    { value: '24/7', label: 'Platform support', icon: <Shield className="h-5 w-5" /> },
  ];

  return (
    <section 
      id="for-vendors" 
      className="py-12 sm:py-16 md:py-24"
      aria-labelledby="for-vendors-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-left">
            <span 
              className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4"
              role="status"
            >
              For Vendors
            </span>
            
            <h2 
              id="for-vendors-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
            >
              Built Specifically for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 block"> Vendors</span>
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Storely empowers entrepreneurs, small businesses, and creators to launch their online stores without the complexity of traditional e-commerce platforms. Focus on what you do best — we'll handle the technology.
            </p>
            
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 sm:space-x-4 group hover:bg-gray-50 p-3 sm:p-4 rounded-xl transition-all duration-300"
                  role="article"
                >
                  <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="text-indigo-600" aria-hidden="true">
                      {benefit.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        {benefit.stat}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Vendor testimonials */}
            
          </div>
          
          {/* Right Stats - محسن للوصول */}
          <div 
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl sm:shadow-2xl animate-fade-in-right"
            role="region"
            aria-label="Vendor success metrics"
          >
            <div className="max-w-md mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center flex items-center justify-center">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mr-2" aria-hidden="true" />
                Vendor Success Metrics
              </h3>
              
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                    role="article"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="text-white/80" aria-hidden="true">
                          {stat.icon}
                        </div>
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{stat.value}</span>
                      </div>
                    </div>
                    <div className="text-sm sm:text-base text-white/90">{stat.label}</div>
                    
                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full animate-pulse"
                        style={{ width: index === 0 ? '85%' : index === 1 ? '60%' : '100%' }}
                        role="progressbar"
                        aria-valuenow={index === 0 ? 85 : index === 1 ? 60 : 100}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 sm:mt-8 text-center">
                <a 
                  href="#join" 
                  className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Join successful vendors"
                >
                  <span>Join Successful Vendors</span>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForVendors;