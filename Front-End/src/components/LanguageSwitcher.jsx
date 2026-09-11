import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const current = i18n.language === 'ar' ? 'ar' : 'en';
  const nextLang = current === 'ar' ? 'en' : 'ar';

  const setDir = (lng) => {
    const dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.dir = dir;
  };

  const toggleLanguage = async () => {
    await i18n.changeLanguage(nextLang);
    try {
      localStorage.setItem('lang', nextLang);
    } catch {
      // Ignore storage issues
    }
    setDir(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      aria-label={
        nextLang === 'ar'
          ? t('common.switchToArabic', 'Switch to Arabic')
          : t('common.switchToEnglish', 'Switch to English')
      }
      title={
        nextLang === 'ar'
          ? t('common.switchToArabic', 'Switch to Arabic')
          : t('common.switchToEnglish', 'Switch to English')
      }
      className="fixed bottom-4 left-4 z-50 group h-11 w-11 rounded-full bg-[#800020] hover:bg-[#6a001a] border border-white/20 flex items-center justify-center text-white transition-colors duration-200 shadow-lg shadow-black/20"
    >
      <Languages className="h-5 w-5" />

      {/* Language badge — flips to white on burgundy button */}
      <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold bg-white text-[#800020] rounded-full h-4 w-4 flex items-center justify-center uppercase leading-none border border-[#800020]/20">
        {current}
      </span>
    </button>
  );
};

export default LanguageSwitcher;