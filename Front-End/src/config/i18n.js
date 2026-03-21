import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

function deepMerge(target, source) {
  // Minimal deep merge for translation objects.
  // Translation files are expected to have unique top-level keys (e.g. `common`, `landingPage`).
  if (!source || typeof source !== 'object') return target;
  const out = { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = out[key];
    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      out[key] = deepMerge(tgtVal, srcVal);
    } else {
      out[key] = srcVal;
    }
  }
  return out;
}

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem('lang');
    return saved === 'ar' ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

const enModules = import.meta.glob('../locales/en/**/*.json', { eager: true });
const arModules = import.meta.glob('../locales/ar/**/*.json', { eager: true });

function loadLocaleResources(lng) {
  const modules = lng === 'ar' ? arModules : enModules;
  let merged = {};

  for (const path in modules) {
    const mod = modules[path];
    const json = mod?.default ?? mod;
    merged = deepMerge(merged, json);
  }

  return merged;
}

const initialLng = getInitialLanguage();

const resources = {
  en: { translation: loadLocaleResources('en') },
  ar: { translation: loadLocaleResources('ar') },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;