// components/Features.jsx
import React from 'react';
import { Link, Package, ShoppingBag, Smartphone, Shield, BarChart, Sparkles, Check } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Link className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Custom Store Links',
      description: 'Each vendor gets a unique, branded store URL to share with customers.',
      color: 'from-blue-500 to-cyan-500',
      benefits: ['Branded URLs', 'Easy to share', 'SEO friendly']
    },
    {
      icon: <Package className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Product Management',
      description: 'Easily add, edit, and organize products with categories and variations.',
      color: 'from-purple-500 to-pink-500',
      benefits: ['Bulk upload', 'Categories', 'Variants']
    },
    {
      icon: <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Order System',
      description: 'Complete checkout flow with order tracking and customer management.',
      color: 'from-green-500 to-emerald-500',
      benefits: ['Track orders', 'Customer history', 'Invoices']
    },
    {
      icon: <Smartphone className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Mobile-Friendly',
      description: 'Stores look great on all devices with responsive design.',
      color: 'from-orange-500 to-red-500',
      benefits: ['Mobile optimized', 'Touch friendly', 'Fast loading']
    },
    {
      icon: <BarChart className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Vendor Dashboard',
      description: 'Comprehensive analytics and insights about your store performance.',
      color: 'from-teal-500 to-cyan-500',
      benefits: ['Sales reports', 'Visitor stats', 'Revenue tracking']
    },
  ];

  return (
    <section 
      id="features" 
      className="py-12 sm:py-16 md:py-24 bg-white"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <span 
            className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4"
            role="status"
          >
            Features
          </span>
          <h2 
            id="features-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
          >
            Everything You Need to Sell Online
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Powerful features designed specifically for multi-vendor e-commerce success.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <article
              key={index}
              className="group bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={`Feature: ${feature.title}`}
            >
              <div className={`inline-flex p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${feature.color} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <div className="text-white" aria-hidden="true">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {feature.title}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                {feature.description}
              </p>
              
              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6" aria-label={`Benefits of ${feature.title}`}>
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                <a 
                  href="#learn-more" 
                  className="inline-flex items-center text-xs sm:text-sm text-gray-500 hover:text-indigo-600 transition-colors group-hover:translate-x-1 transform duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1"
                  aria-label={`Learn more about ${feature.title}`}
                >
                  <div className={`h-1 w-6 sm:w-8 rounded-full bg-gradient-to-r ${feature.color} mr-2 transition-all group-hover:w-10`}></div>
                  Learn more
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;