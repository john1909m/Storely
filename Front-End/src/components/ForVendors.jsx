// components/ForVendors.jsx
import React from 'react';
import { CheckCircle, TrendingUp, Users, Zap } from 'lucide-react';

const ForVendors = () => {
  const benefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'No Technical Skills Required',
      description: 'Our intuitive interface makes store setup a breeze.'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Grow Your Business',
      description: 'Access powerful analytics to make data-driven decisions.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Reach More Customers',
      description: 'Share your unique store link across social media and websites.'
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'Easy Order Management',
      description: 'Track and fulfill orders from a single dashboard.'
    },
  ];

  return (
    <section id="for-vendors" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built Specifically for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Vendors</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Storely empowers entrepreneurs, small businesses, and creators to launch their online stores without the complexity of traditional e-commerce platforms. Focus on what you do best — we'll handle the technology.
            </p>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
                    <div className="text-indigo-600">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
              <div className="text-sm text-gray-600 mb-2">Success Story</div>
              <div className="text-lg font-semibold text-gray-900">
                "Storely helped me grow my handmade jewelry business by 300% in just 6 months!"
              </div>
              <div className="text-gray-600 mt-2">— Sarah Chen, Artisan Store</div>
            </div>
          </div>
          
          {/* Right Stats */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-8 text-center">
                Vendor Success Metrics
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl font-bold mb-2">85%</div>
                  <div className="text-white/90">Faster store setup compared to traditional platforms</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl font-bold mb-2">2.5x</div>
                  <div className="text-white/90">Higher conversion rates with branded store links</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-white/90">Platform support and automated order processing</div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="text-sm text-white/80 mb-2">Ready to join successful vendors?</div>
                <button className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForVendors;