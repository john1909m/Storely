// components/HowItWorks.jsx
import React from 'react';
import { UserPlus, Store, Package, Share2, ShoppingCart, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Sign Up',
      description: 'Create your vendor account in under 2 minutes',
      color: 'from-blue-400 to-cyan-400',
      details: 'Quick registration with email or social media'
    },
    {
      number: '02',
      icon: <Store className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Create Store',
      description: 'Set up your branded store with custom URL',
      color: 'from-purple-400 to-pink-400',
      details: 'Customize colors, logo, and store information'
    },
    {
      number: '03',
      icon: <Package className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Add Products',
      description: 'Upload products with images, prices, and categories',
      color: 'from-green-400 to-emerald-400',
      details: 'Bulk upload or add products one by one'
    },
    {
      number: '04',
      icon: <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Share Link',
      description: 'Share your unique store link with customers',
      color: 'from-orange-400 to-red-400',
      details: 'Share via social media, email, or QR code'
    },
    {
      number: '05',
      icon: <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Receive Orders',
      description: 'Start accepting orders and earning revenue',
      color: 'from-indigo-400 to-blue-400',
      details: 'Real-time notifications and order tracking'
    },
  ];

  return (
    <section 
      id="how-it-works" 
      className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <span 
            className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4"
            role="status"
          >
            Simple Process
          </span>
          <h2 
            id="how-it-works-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
          >
            How Storely Works
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Start selling online in five simple steps. No technical expertise required.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line - Hidden on mobile */}
          <div 
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 transform -translate-y-1/2 -z-10"
            aria-hidden="true"
          ></div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent group">
                  {/* Number Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-white font-bold text-xs sm:text-sm md:text-base">{step.number}</span>
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 sm:mb-5 md:mb-6 mx-auto shadow-md group-hover:shadow-xl transition-all`}>
                    <div className="text-white" aria-hidden="true">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 text-center mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed mb-2 sm:mb-3">
                    {step.description}
                  </p>
                  
                  <p className="text-xs text-gray-500 text-center border-t border-gray-100 pt-2 sm:pt-3 mt-2">
                    {step.details}
                  </p>
                  
                  {/* Success indicator */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" aria-hidden="true" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        
      </div>
    </section>
  );
};

export default HowItWorks;