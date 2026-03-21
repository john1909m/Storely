import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const current = i18n.language === 'ar' ? 'ar' : 'en';

  const setDir = (lng) => {
    const dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    // Compatibility with existing code that reads `document.dir`
    document.dir = dir;
  };

  const onChange = async (e) => {
    const nextLang = e.target.value === 'ar' ? 'ar' : 'en';
    await i18n.changeLanguage(nextLang);
    try {
      localStorage.setItem('lang', nextLang);
    } catch {
      // Ignore storage issues (e.g., privacy mode)
    }
    setDir(nextLang);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 shadow-2xl">
        <label className="block text-xs text-white/70 mb-1">{t('common.language')}</label>
        <select
          aria-label={t('common.language')}
          value={current}
          onChange={onChange}
          className="w-36 bg-black/30 border border-white/10 text-white rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="en">{t('common.languages.en')}</option>
          <option value="ar">{t('common.languages.ar')}</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

