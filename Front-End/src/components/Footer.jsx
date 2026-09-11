// components/Footer.jsx
import React from 'react';
import { Instagram, Mail, Heart, ChevronRight, Shield, Globe, MapPin, Phone, Clock, Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { name: t('landing.footer.quickLinks.aboutUs.name'), href: '#', ariaLabel: t('landing.footer.quickLinks.aboutUs.ariaLabel') },
    { name: t('landing.footer.quickLinks.features.name'), href: '#features', ariaLabel: t('landing.footer.quickLinks.features.ariaLabel') },
    { name: t('landing.footer.quickLinks.pricing.name'), href: '/pricing', ariaLabel: t('landing.footer.quickLinks.pricing.ariaLabel') },
    { name: t('landing.footer.quickLinks.contact.name'), href: '/contact', ariaLabel: t('landing.footer.quickLinks.contact.ariaLabel') },
  ];

  const legalLinks = [
    { name: t('landing.footer.legalLinks.privacyPolicy.name'), href: '#', ariaLabel: t('landing.footer.legalLinks.privacyPolicy.ariaLabel') },
    { name: t('landing.footer.legalLinks.termsOfService.name'), href: '#', ariaLabel: t('landing.footer.legalLinks.termsOfService.ariaLabel') },
    { name: t('landing.footer.legalLinks.cookiePolicy.name'), href: '#', ariaLabel: t('landing.footer.legalLinks.cookiePolicy.ariaLabel') },
  ];

  const socialLinks = [
    { icon: <Instagram className="h-4 w-4" />, href: 'https://www.instagram.com/storely_platform/', name: t('landing.footer.social.instagram.name'), ariaLabel: t('landing.footer.social.instagram.ariaLabel') },
    { icon: <Facebook className="h-4 w-4" />, href: 'https://www.facebook.com/profile.php?id=61585122357618', name: t('landing.footer.social.facebook.name'), ariaLabel: t('landing.footer.social.facebook.ariaLabel') },
  ];

  const contactInfo = [
    { icon: <MapPin className="h-4 w-4" />, text: t('landing.footer.contactInfo.cairo') },
    { icon: <Phone className="h-4 w-4" />, text: t('landing.footer.contactInfo.phone') },
    { icon: <Mail className="h-4 w-4" />, text: t('landing.footer.contactInfo.email') },
    { icon: <Clock className="h-4 w-4" />, text: t('landing.footer.contactInfo.supportHours') },
  ];

  return (
    <footer className="relative pt-20 pb-8 overflow-hidden" role="contentinfo" aria-label={t('landing.footer.ariaLabel')}>
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                <img src="Logo_new_w.png" alt="Storely" className="h-6 w-6 object-contain" />
              </div>
              <span className="text-xl font-bold text-white">{t('landing.footer.brandName')}</span>
            </div>

            <p className="text-white/60 text-sm leading-relaxed">
              {t('landing.footer.description')}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full bg-[#800020] border-2 border-white/10 flex items-center justify-center">
                    <span className="text-xs text-white">👤</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-white/60">
                <span className="text-white font-semibold">{t('landing.footer.stats.vendorsCount')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-white mb-5 flex items-center">
              <ChevronRight className="h-4 w-4 text-white/60 mr-1" />
              {t('landing.footer.quickLinksTitle')}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-white/60 hover:text-white transition-colors duration-200 inline-flex items-center" aria-label={link.ariaLabel}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base font-semibold text-white mb-5 flex items-center">
              <Shield className="h-4 w-4 text-white/60 mr-2" />
              {t('landing.footer.legalTitle')}
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-white/60 hover:text-white transition-colors duration-200" aria-label={link.ariaLabel}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-white mb-5 flex items-center">
              <Globe className="h-4 w-4 text-white/60 mr-2" />
              {t('landing.footer.connectTitle')}
            </h3>

            <div className="space-y-2.5 mb-5">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-2.5 text-sm text-white/60">
                  <div className="h-7 w-7 rounded-md bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className="h-9 w-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-colors duration-200" aria-label={social.ariaLabel} target="_blank" rel="noopener noreferrer">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-white/60 order-2 md:order-1">
            {t('landing.footer.bottom.copyrightPrefix', { year: new Date().getFullYear() })}
          </div>

          <div className="flex items-center space-x-4 text-sm text-white/60 order-1 md:order-2">
            <span className="flex items-center space-x-1">
              <span>{t('landing.footer.bottom.madeWith')}</span>
              <Heart className="h-3.5 w-3.5 text-red-400 mx-1 fill-current" />
              <span>{t('landing.footer.bottom.forVendors')}</span>
            </span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span>{t('landing.footer.bottom.version')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;