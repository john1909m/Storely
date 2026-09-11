// components/HowItWorks.jsx
import React from 'react';
import { UserPlus, Store, Package, Share2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    { number: '01', icon: <UserPlus className="h-6 w-6" />, title: t('landing.howItWorks.steps.01.title'), description: t('landing.howItWorks.steps.01.description'), details: t('landing.howItWorks.steps.01.details') },
    { number: '02', icon: <Store className="h-6 w-6" />, title: t('landing.howItWorks.steps.02.title'), description: t('landing.howItWorks.steps.02.description'), details: t('landing.howItWorks.steps.02.details') },
    { number: '03', icon: <Package className="h-6 w-6" />, title: t('landing.howItWorks.steps.03.title'), description: t('landing.howItWorks.steps.03.description'), details: t('landing.howItWorks.steps.03.details') },
    { number: '04', icon: <Share2 className="h-6 w-6" />, title: t('landing.howItWorks.steps.04.title'), description: t('landing.howItWorks.steps.04.description'), details: t('landing.howItWorks.steps.04.details') },
    { number: '05', icon: <ShoppingCart className="h-6 w-6" />, title: t('landing.howItWorks.steps.05.title'), description: t('landing.howItWorks.steps.05.description'), details: t('landing.howItWorks.steps.05.details') },
  ];

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden" aria-labelledby="how-it-works-heading">

      {/* ✅ Decorative circles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#a8002b]/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            <span className="text-xs font-medium text-white/85 tracking-wide uppercase">
              {t('landing.howItWorks.section.badge')}
            </span>
          </div>

          <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
            <span className="block text-white">{t('landing.howItWorks.section.headlineLine1')}</span>
            <span className="block mt-2 text-white/60">{t('landing.howItWorks.section.headlineLine2')}</span>
          </h2>

          <div className="w-16 h-1 bg-white/30 rounded-full mb-6 mx-auto"></div>

          <p className="text-lg text-white/70 leading-relaxed">
            {t('landing.howItWorks.section.description')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* ✅ Connecting line behind cards (desktop only) */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 overflow-hidden hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>

              <div className="p-6 pt-10 relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                  <div className="h-10 w-10 rounded-full bg-[#800020] flex items-center justify-center shadow-lg ring-4 ring-white">
                    <span className="text-white font-bold text-xs">{step.number}</span>
                  </div>
                </div>

                <div className="h-14 w-14 rounded-xl bg-[#800020]/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-[#800020] transition-colors duration-300">
                  <div className="text-[#800020] group-hover:text-white transition-colors duration-300">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-base font-bold text-center mb-2 text-gray-900">{step.title}</h3>

                <p className="text-sm text-gray-500 text-center leading-relaxed mb-3">{step.description}</p>

                <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  <p className="text-xs text-gray-500 text-center leading-relaxed">{step.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/signup">
            <button className="group px-8 py-4 rounded-xl bg-white text-[#800020] font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl inline-flex items-center justify-center space-x-2">
              <span>{t('landing.howItWorks.cta')}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;