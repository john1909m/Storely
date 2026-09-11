// components/Hero.jsx
import React from 'react';
import { Store, Rocket, Zap, Shield, Globe, Eye, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t('landing.hero.dashboardCard.stats.ordersToday'), value: '124', change: '+12%', percentage: 75 },
    { label: t('landing.hero.dashboardCard.stats.revenue'), value: `${t('landing.hero.dashboardCard.amountPrefix')}2,450`, change: '+8%', percentage: 60 },
  ];

  const orders = [
    { id: '1234', items: 2, customer: t('landing.hero.dashboardCard.customerJohn'), amount: 89.99 },
    { id: '1235', items: 3, customer: t('landing.hero.dashboardCard.customerJane'), amount: 129.99 },
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden" aria-label={t('landing.hero.ariaLabel')}>

      {/* ✅ Decorative blurred circles — static, behind content */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#a8002b]/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-[450px] h-[450px] bg-[#800020]/40 rounded-full blur-[120px] pointer-events-none"></div>

      {/* ✅ Decorative ring — thin circle */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full border border-white/[0.06] pointer-events-none hidden lg:block"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none hidden lg:block -translate-y-[100px]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-8">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span className="text-xs font-medium text-white/85 tracking-wide uppercase">
                  {t('landing.hero.badge', 'Launch in minutes')}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold mb-6 tracking-tight leading-[1.05]">
                <span className="block text-white">{t('landing.hero.headline.launchYour')}</span>
                <span className="block mt-2 text-white/95">{t('landing.hero.headline.onlineStore')}</span>
                <span className="block mt-2 text-white/60">{t('landing.hero.headline.inMinutes')}</span>
              </h1>

              <div className="w-16 h-1 bg-white/30 rounded-full mb-6 mx-auto lg:mx-0"></div>

              <p className="text-lg sm:text-xl text-white/70 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t('landing.hero.description')}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-12 justify-center lg:justify-start">
                <Link to="/signup" className="w-full sm:w-auto">
                  <button className="group w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-[#800020] font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl flex items-center justify-center space-x-2">
                    <span>{t('landing.hero.buttons.startNow')}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>

                <Link to="/pricing" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/5 text-white font-semibold border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm">
                    {t('landing.hero.buttons.viewPricing')}
                  </button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
                {[
                  { icon: Zap, text: t('landing.hero.trust.noCode') },
                  { icon: Shield, text: t('landing.hero.trust.secure') },
                  { icon: Globe, text: t('landing.hero.trust.global') },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
                      <item.icon className="h-3.5 w-3.5 text-white/90" />
                    </div>
                    <span className="text-sm text-white/75 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Dashboard Card */}
            <div className="relative hidden lg:block">
              {/* Glow behind card */}
              <div className="absolute -inset-8 bg-[#a8002b]/20 rounded-[40px] blur-3xl"></div>

              <div className="relative bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-11 w-11 rounded-xl bg-[#800020] flex items-center justify-center shadow-sm">
                        <Store className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-gray-900 font-semibold text-[15px]">
                          {t('landing.hero.dashboardCard.storeDashboard')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {t('landing.hero.dashboardCard.storeUrl')}
                        </div>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                        {t('landing.hero.dashboardCard.live')}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                          <div className="flex items-center text-[11px] font-medium text-emerald-600">
                            <TrendingUp className="h-3 w-3 mr-0.5" />
                            {stat.change}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-3">{stat.label}</div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#800020] to-[#a8002b] rounded-full" style={{ width: `${stat.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Orders */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center">
                        <Eye className="h-3.5 w-3.5 mr-2 text-[#800020]" />
                        {t('landing.hero.dashboardCard.recentOrders')}
                      </h3>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {orders.length} {t('landing.hero.dashboardCard.newLabel', 'new')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {orders.map((order, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200">
                          <div>
                            <div className="text-sm text-gray-900 font-medium">
                              {t('landing.hero.dashboardCard.orderPrefix', { id: order.id })}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {t('landing.hero.dashboardCard.orderMeta', { items: order.items, customer: order.customer })}
                            </div>
                          </div>
                          <span className="text-sm text-[#800020] font-semibold">
                            {t('landing.hero.dashboardCard.amountPrefix')}{order.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating mini-card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl shadow-black/40 p-3 border border-gray-100 flex items-center space-x-2.5">
                <div className="h-9 w-9 rounded-lg bg-[#800020] flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-medium leading-tight uppercase tracking-wide">Faster launch</div>
                  <div className="text-base font-bold text-gray-900 leading-tight">10x</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;