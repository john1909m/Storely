// components/CTA.jsx
import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Stars */}
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-300 fill-current" />
            ))}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Launch Your Online Store?
          </h2>
          
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of successful vendors who trust Storely to power their online business. 
            No coding, no complex setup — just results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-10 py-5 bg-white text-indigo-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-3">
              <span>Start Selling Today</span>
              <ArrowRight className="h-6 w-6" />
            </button>
            <button className="px-10 py-5 bg-transparent border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm">
              Schedule a Demo
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-white/90">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-2xl font-bold mb-2">Free</div>
              <div className="text-sm">14-day trial</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-2xl font-bold mb-2">No Setup Fees</div>
              <div className="text-sm">Start immediately</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-2xl font-bold mb-2">24/7 Support</div>
              <div className="text-sm">Always here to help</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;