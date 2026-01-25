// components/HowItWorks.jsx
import React from 'react';
import { UserPlus, Store, Package, Share2, ShoppingCart } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: <UserPlus className="h-6 w-6" />,
      title: 'Sign Up',
      description: 'Create your vendor account in under 2 minutes',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      number: '02',
      icon: <Store className="h-6 w-6" />,
      title: 'Create Store',
      description: 'Set up your branded store with custom URL',
      color: 'from-purple-400 to-pink-400'
    },
    {
      number: '03',
      icon: <Package className="h-6 w-6" />,
      title: 'Add Products',
      description: 'Upload products with images, prices, and categories',
      color: 'from-green-400 to-emerald-400'
    },
    {
      number: '04',
      icon: <Share2 className="h-6 w-6" />,
      title: 'Share Link',
      description: 'Share your unique store link with customers',
      color: 'from-orange-400 to-red-400'
    },
    {
      number: '05',
      icon: <ShoppingCart className="h-6 w-6" />,
      title: 'Receive Orders',
      description: 'Start accepting orders and earning revenue',
      color: 'from-indigo-400 to-blue-400'
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Storely Works
          </h2>
          <p className="text-lg text-gray-600">
            Start selling online in five simple steps. No technical expertise required.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 transform -translate-y-1/2 -z-10"></div>
          
          <div className="grid lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  {/* Number Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">{step.number}</span>
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`h-16 w-16 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 mx-auto`}>
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
            <span>Get Started Now</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;