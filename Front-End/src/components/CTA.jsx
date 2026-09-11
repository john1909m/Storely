// components/CTA.jsx
import React from 'react';
import { ArrowRight, Star, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CTA = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 overflow-hidden" aria-label={t('landing.cta.ariaLabel')}>

      {/* ✅ Decorative circles + rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#a8002b]/25 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.06] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.04] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          <div className="flex justify-center space-x-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-7 w-7 text-yellow-400 fill-current" />
            ))}
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            <span className="text-xs font-medium text-white/85 tracking-wide uppercase">
              {t('landing.cta.badge')}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
            <span className="block text-white">{t('landing.cta.headlineLine1')}</span>
            <span className="block mt-2 text-white/60">{t('landing.cta.headlineLine2')}</span>
          </h2>

          <div className="w-16 h-1 bg-white/30 rounded-full mb-6 mx-auto"></div>

          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('landing.cta.description')}
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10">
            {[
              { icon: Zap, text: t('landing.cta.benefitBadges.noCreditCardRequired') },
              { icon: Globe, text: t('landing.cta.benefitBadges.instantSetup') },
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
                  <benefit.icon className="h-3.5 w-3.5 text-white/90" />
                </div>
                <span className="text-sm text-white/75 font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#800020] font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl inline-flex items-center justify-center space-x-2">
                <span>{t('landing.cta.buttons.startSellingToday')}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>

            <Link to="/pricing" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 text-white font-semibold border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm">
                {t('landing.cta.buttons.viewPricing')}
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            {[
              t('landing.cta.benefits.noHiddenFees'),
              t('landing.cta.benefits.securePlatform'),
              t('landing.cta.benefits.support'),
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                <span className="text-white/70">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;