// src/components/RamadanOffer.jsx
import React, { useState, useEffect } from 'react';
import { Gift, Star, Calendar, Clock, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RamadanOffer = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // تاريخ نهاية العرض (مثلاً بعد 30 يوم من أول رمضان)
  const calculateTimeLeft = () => {
    // تاريخ انتهاء العرض (مثلاً 30 يوم من أول رمضان)
    // غير التاريخ ده حسب تاريخ انتهاء العرض الفعلي
    const endDate = new Date('2026-03-20T23:59:59'); // مثال: 20 مارس 2026
    const now = new Date();
    const difference = endDate - now;

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }
  };

  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;
 

  return (
    <div className='absolute w-full h-full justify-center items-center flex'>
      <div className="fixed z-50 max-w-sm animate-slide-up">
      <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl shadow-2xl border border-emerald-400/30 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute z-50 hover:scale-125 hover:text-white top-4 right-4 text-white/80 transition-colors"
            aria-label={t('landing.ramadanOffer.closeAriaLabel')}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-yellow-400/20 p-2 rounded-xl">
              <Gift className="h-6 w-6 text-yellow-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-300 fill-current" />
                <span className="text-white/90 text-sm font-medium">{t('landing.ramadanOffer.title')}</span>
                <Star className="h-4 w-4 text-yellow-300 fill-current" />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
            {t('landing.ramadanOffer.heading')}
          </h3>

          <p className="text-emerald-100 text-sm leading-relaxed">
            {t('landing.ramadanOffer.description')}
          </p>
        </div>

        {/* Timer */}
        <div className="bg-emerald-800/30 px-6 py-4 border-t border-emerald-400/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-emerald-100">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{t('landing.ramadanOffer.timerLabel')}</span>
            </div>
            <span className="text-xs text-emerald-200">{t('landing.ramadanOffer.discount')}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-emerald-900/50 rounded-lg p-2">
              <div className="text-xl font-bold text-white">{timeLeft.days}</div>
              <div className="text-xs text-emerald-200">{t('landing.ramadanOffer.days')}</div>
            </div>
            <div className="bg-emerald-900/50 rounded-lg p-2">
              <div className="text-xl font-bold text-white">{timeLeft.hours}</div>
              <div className="text-xs text-emerald-200">{t('landing.ramadanOffer.hours')}</div>
            </div>
            <div className="bg-emerald-900/50 rounded-lg p-2">
              <div className="text-xl font-bold text-white">{timeLeft.minutes}</div>
              <div className="text-xs text-emerald-200">{t('landing.ramadanOffer.minutes')}</div>
            </div>
            <div className="bg-emerald-900/50 rounded-lg p-2">
              <div className="text-xl font-bold text-white">{timeLeft.seconds}</div>
              <div className="text-xs text-emerald-200">{t('landing.ramadanOffer.seconds')}</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="p-6 pt-4">
          <a
            href="/pricing"
            className="block w-full py-3 px-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all text-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t('landing.ramadanOffer.cta')}
          </a>
          <p className="text-xs text-emerald-200 text-center mt-3">
            {t('landing.ramadanOffer.footnote')}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl"></div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
    </div>
  );
};

export default RamadanOffer;