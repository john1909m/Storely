// src/pages/vendor/Pricing.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, X, Star, Users, Zap, Shield,
  BarChart, Globe, CreditCard, Tag
} from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for new vendors just getting started',
      price: { monthly: 0, yearly: 0 },
      commission: '10%',
      color: 'from-blue-500 to-cyan-500',
      features: [
        { included: true, text: '1 Store' },
        { included: true, text: '50 Products' },
        { included: true, text: 'Basic Analytics' },
        { included: true, text: 'Store Customization' },
        { included: false, text: 'Custom Domain' },
        { included: false, text: 'Advanced Analytics' },
        { included: false, text: 'Priority Support' },
        { included: false, text: 'Bulk Import/Export' },
      ]
    },
    {
      name: 'Professional',
      description: 'Best for growing businesses',
      price: { monthly: 29, yearly: 290 },
      commission: '7%',
      color: 'from-indigo-500 to-purple-500',
      popular: true,
      features: [
        { included: true, text: '3 Stores' },
        { included: true, text: 'Unlimited Products' },
        { included: true, text: 'Advanced Analytics' },
        { included: true, text: 'Custom Domain' },
        { included: true, text: 'Email Marketing' },
        { included: true, text: 'Discount Codes' },
        { included: false, text: 'API Access' },
        { included: false, text: 'White Label' },
      ]
    },
    {
      name: 'Business',
      description: 'For established businesses and teams',
      price: { monthly: 99, yearly: 990 },
      commission: '5%',
      color: 'from-purple-500 to-pink-500',
      features: [
        { included: true, text: 'Unlimited Stores' },
        { included: true, text: 'Unlimited Products' },
        { included: true, text: 'Enterprise Analytics' },
        { included: true, text: 'Multiple Custom Domains' },
        { included: true, text: 'API Access' },
        { included: true, text: 'White Label' },
        { included: true, text: 'Dedicated Support' },
        { included: true, text: 'Custom Commission Rate' },
      ]
    }
  ];

  const featuresComparison = [
    { name: 'Number of Stores', starter: '1', pro: '3', business: 'Unlimited' },
    { name: 'Products Limit', starter: '50', pro: 'Unlimited', business: 'Unlimited' },
    { name: 'Commission Rate', starter: '10%', pro: '7%', business: '5%' },
    { name: 'Custom Domain', starter: false, pro: true, business: true },
    { name: 'Advanced Analytics', starter: false, pro: true, business: true },
    { name: 'Email Marketing', starter: false, pro: true, business: true },
    { name: 'API Access', starter: false, pro: false, business: true },
    { name: 'Priority Support', starter: false, pro: true, business: '24/7 Dedicated' },
    { name: 'Bulk Operations', starter: false, pro: true, business: true },
    { name: 'Custom Commission', starter: false, pro: false, business: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Start selling for free, upgrade as you grow. Only pay commission on sales - no hidden fees.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full p-1 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white hover:text-indigo-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white hover:text-indigo-100'
              }`}
            >
              Yearly <span className="text-green-300">Save 16%</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">5,000+</div>
              <div className="text-indigo-200">Active Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">$2.5M+</div>
              <div className="text-indigo-200">Monthly Sales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-indigo-200">Platform Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-8">
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-3xl shadow-2xl overflow-hidden border ${
                plan.popular
                  ? 'border-indigo-300 relative'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`h-2 bg-gradient-to-r ${plan.color}`}></div>

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">
                      ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {plan.price.monthly > 0 && billingCycle === 'yearly' && (
                    <div className="text-green-600 font-medium mt-2">
                      Save ${(plan.price.monthly * 12 - plan.price.yearly).toFixed(0)} annually
                    </div>
                  )}
                  <div className="text-gray-600 mt-2">
                    + {plan.commission} commission on sales
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mr-3" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  to={plan.name === 'Starter' ? '/vendor/signup' : `/vendor/payment?plan=${plan.name.toLowerCase()}`}
                  className={`block w-full py-4 text-center font-semibold rounded-xl transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.name === 'Starter' ? 'Get Started Free' : 'Choose Plan'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison Table */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare All Features
          </h2>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-6 font-semibold text-gray-900">Feature</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Starter</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Professional</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {featuresComparison.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-6 font-medium text-gray-900">{feature.name}</td>
                      <td className="p-6 text-center">
                        {typeof feature.starter === 'boolean' ? (
                          feature.starter ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700">{feature.starter}</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700">{feature.pro}</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof feature.business === 'boolean' ? (
                          feature.business ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700">{feature.business}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Setup Fees</h3>
            <p className="text-gray-600">
              Start selling immediately with zero upfront costs. Only pay when you make sales.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Grow With You</h3>
            <p className="text-gray-600">
              Easily upgrade your plan as your business grows. No long-term contracts required.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">30-Day Money Back</h3>
            <p className="text-gray-600">
              Try any paid plan risk-free. Get a full refund within 30 days if not satisfied.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'How does the commission work?',
                a: 'We charge a percentage commission only on successful sales. No commission on shipping or taxes. The commission rate decreases as you upgrade to higher plans.'
              },
              {
                q: 'Can I switch plans later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated.'
              },
              {
                q: 'Is there a limit on sales volume?',
                a: 'No, there are no limits on how much you can sell. All plans include unlimited sales volume.'
              },
              {
                q: 'Do you offer custom pricing for high-volume sellers?',
                a: 'Yes, our Business plan includes custom commission rates. Contact our sales team for enterprise pricing.'
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Selling?</h2>
            <p className="text-indigo-100 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of successful vendors who trust Storely to power their online business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vendor/signup"
                className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 shadow-2xl"
              >
                Start Free Trial
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;