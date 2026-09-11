// components/ForVendors.jsx
import React from 'react';
import { CheckCircle, TrendingUp, Users, Zap, Clock, Headphones, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForVendors = () => {
  const { t } = useTranslation();

  const benefits = [
    { icon: <Zap className="h-5 w-5" />, title: t('landing.forVendors.benefits.noSkills.title'), description: t('landing.forVendors.benefits.noSkills.description'), stat: t('landing.forVendors.benefits.noSkills.stat') },
    { icon: <TrendingUp className="h-5 w-5" />, title: t('landing.forVendors.benefits.growBusiness.title'), description: t('landing.forVendors.benefits.growBusiness.description'), stat: t('landing.forVendors.benefits.growBusiness.stat') },
    { icon: <Users className="h-5 w-5" />, title: t('landing.forVendors.benefits.reachCustomers.title'), description: t('landing.forVendors.benefits.reachCustomers.description'), stat: t('landing.forVendors.benefits.reachCustomers.stat') },
    { icon: <CheckCircle className="h-5 w-5" />, title: t('landing.forVendors.benefits.easyOrders.title'), description: t('landing.forVendors.benefits.easyOrders.description'), stat: t('landing.forVendors.benefits.easyOrders.stat') },
  ];

  const stats = [
    { value: '85%', label: t('landing.forVendors.metrics.labels.fasterSetup'), icon: <Clock className="h-5 w-5" />, percentage: 85 },
    { value: '2.5x', label: t('landing.forVendors.metrics.labels.higherConversion'), icon: <TrendingUp className="h-5 w-5" />, percentage: 65 },
    { value: '24/7', label: t('landing.forVendors.metrics.labels.support'), icon: <Headphones className="h-5 w-5" />, percentage: 100 },
  ];

  return (
    <section id="for-vendors" className="relative py-24 overflow-hidden" aria-labelledby="for-vendors-heading">

      {/* ✅ Decorative circles */}
      <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-[#a8002b]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-[#800020]/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left */}
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              <span className="text-xs font-medium text-white/85 tracking-wide uppercase">
                {t('landing.forVendors.badge')}
              </span>
            </div>

            <h2 id="for-vendors-heading" className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
              <span className="block text-white">{t('landing.forVendors.headingLine1')}</span>
              <span className="block mt-2 text-white/60">{t('landing.forVendors.headingLine2')}</span>
            </h2>

            <div className="w-16 h-1 bg-white/30 rounded-full mb-6"></div>

            <p className="text-lg text-white/70 leading-relaxed mb-8">
              {t('landing.forVendors.description')}
            </p>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 p-5 hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="h-11 w-11 rounded-lg bg-[#800020]/10 flex items-center justify-center flex-shrink-0">
                      <div className="text-[#800020]">{benefit.icon}</div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{benefit.title}</h3>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#800020]/10 text-[#800020]">
                          {benefit.stat}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Stats Card */}
          <div className="space-y-6 relative">
            {/* Glow behind stats card */}
            <div className="absolute -inset-6 bg-[#a8002b]/15 rounded-[40px] blur-3xl pointer-events-none"></div>

            <div className="relative bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-[#800020]" />
                  {t('landing.forVendors.metrics.title')}
                </h3>

                <div className="space-y-5">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-lg bg-[#800020]/10 flex items-center justify-center">
                            <div className="text-[#800020]">{stat.icon}</div>
                          </div>
                          <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mb-3">{stat.label}</div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#800020] to-[#a8002b] rounded-full" style={{ width: `${stat.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/signup">
              <button className="group w-full px-8 py-4 rounded-xl bg-white text-[#800020] font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl inline-flex items-center justify-center space-x-2">
                <span>{t('landing.forVendors.cta')}</span>
                <Rocket className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ForVendors;