// components/Features.jsx
import React from 'react';
import { Link, Package, ShoppingBag, Smartphone, Shield, BarChart } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Link className="h-8 w-8" />,
      title: 'Custom Store Links',
      description: 'Each vendor gets a unique, branded store URL to share with customers.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: 'Product Management',
      description: 'Easily add, edit, and organize products with categories and variations.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: 'Order System',
      description: 'Complete checkout flow with order tracking and customer management.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Mobile-Friendly',
      description: 'Stores look great on all devices with responsive design.',
      color: 'from-orange-500 to-red-500'
    },
    // {
    //   icon: <Shield className="h-8 w-8" />,
    //   title: 'Secure Payments',
    //   description: 'Multiple payment gateways with PCI compliant security.',
    //   color: 'from-indigo-500 to-blue-500'
    // },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: 'Vendor Dashboard',
      description: 'Comprehensive analytics and insights about your store performance.',
      color: 'from-teal-500 to-cyan-500'
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Sell Online
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features designed specifically for multi-vendor e-commerce success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${feature.color} mr-2`}></div>
                  Learn more
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;