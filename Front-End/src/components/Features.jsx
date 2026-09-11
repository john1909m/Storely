// components/Features.jsx
import React from 'react';
import { Link, Package, ShoppingBag, Smartphone, BarChart, Shield, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    { icon: <Link className="h-6 w-6" />, title: t('landing.features.items.customStoreLinks.title'), description: t('landing.features.items.customStoreLinks.description'), benefits: t('landing.features.items.customStoreLinks.benefits', { returnObjects: true }) },
    { icon: <Package className="h-6 w-6" />, title: t('landing.features.items.productManagement.title'), description: t('landing.features.items.productManagement.description'), benefits: t('landing.features.items.productManagement.benefits', { returnObjects: true }) },
    { icon: <ShoppingBag className="h-6 w-6" />, title: t('landing.features.items.orderSystem.title'), description: t('landing.features.items.orderSystem.description'), benefits: t('landing.features.items.orderSystem.benefits', { returnObjects: true }) },
    { icon: <Smartphone className="h-6 w-6" />, title: t('landing.features.items.mobileFriendly.title'), description: t('landing.features.items.mobileFriendly.description'), benefits: t('landing.features.items.mobileFriendly.benefits', { returnObjects: true }) },
    { icon: <BarChart className="h-6 w-6" />, title: t('landing.features.items.analyticsDashboard.title'), description: t('landing.features.items.analyticsDashboard.description'), benefits: t('landing.features.items.analyticsDashboard.benefits', { returnObjects: true }) },
    { icon: <Shield className="h-6 w-6" />, title: t('landing.features.items.securePlatform.title'), description: t('landing.features.items.securePlatform.description'), benefits: t('landing.features.items.securePlatform.benefits', { returnObjects: true }) },
  ];

  return (
    <section id="features" className="relative py-24 overflow-hidden" aria-labelledby="features-heading">

      {/* ✅ Decorative circles */}
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-[#a8002b]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-[#800020]/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            <span className="text-xs font-medium text-white/85 tracking-wide uppercase">
              {t('landing.features.sectionTitle.pill')}
            </span>
          </div>

          <h2 id="features-heading" className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
            <span className="block text-white">{t('landing.features.sectionTitle.line1')}</span>
            <span className="block mt-2 text-white/60">{t('landing.features.sectionTitle.line2')}</span>
          </h2>

          <div className="w-16 h-1 bg-white/30 rounded-full mb-6 mx-auto"></div>

          <p className="text-lg text-white/70 leading-relaxed">
            {t('landing.features.description')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 overflow-hidden hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>

              <div className="p-7">
                <div className="mb-6">
                  <div className="h-12 w-12 rounded-xl bg-[#800020]/10 flex items-center justify-center group-hover:bg-[#800020] transition-colors duration-300">
                    <div className="text-[#800020] group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>

                <p className="text-gray-500 leading-relaxed mb-6 text-[15px]">{feature.description}</p>

                <div className="space-y-2.5">
                  {Array.isArray(feature.benefits) && feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-2.5">
                      <div className="h-5 w-5 rounded-full bg-[#800020]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-[#800020]" />
                      </div>
                      <span className="text-sm text-gray-600 leading-relaxed">{benefit}</span>
                    </div>
                  ))}
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