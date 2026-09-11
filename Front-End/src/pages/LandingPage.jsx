// src/pages/LandingPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import ForVendors from '../components/ForVendors';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { isAuthenticated, role, store } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const forVendorsRef = useRef(null);
  const ctaRef = useRef(null);

  const [visibleSections, setVisibleSections] = useState({
    hero: false, features: false, howItWorks: false, forVendors: false, cta: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      switch (role?.toUpperCase()) {
        case 'ADMIN': navigate('/admin/dashboard', { replace: true }); break;
        case 'VENDOR':
          if (store) navigate('/vendor/store', { replace: true });
          else navigate('/vendor/create-store', { replace: true });
          break;
        default: break;
      }
    }
  }, [isAuthenticated, role, store, navigate]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({ ...prev, [entry.target.dataset.section]: true }));
        }
      });
    }, { threshold: 0.15 });

    [heroRef, featuresRef, howItWorksRef, forVendorsRef, ctaRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen overflow-x-hidden relative bg-[#2e000b]">

      {/* ✅ Layer 1: Base gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2e000b] pointer-events-none"></div>

      {/* ✅ Layer 2: Radial light sources */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]"></div>
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]"></div>
      </div>

      {/* ✅ Layer 3: Grid pattern (mesh) — كيبر الـ depth */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      ></div>

      {/* ✅ Layer 4: Dot pattern — بيدي إحساس dots في الـ background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 30%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 30%, black 30%, transparent 100%)',
        }}
      ></div>

      {/* ✅ Layer 5: Vignette — بيعمل darkening على الأطراف */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)',
        }}
      ></div>

      {/* ✅ Layer 6: Grain / noise texture */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <SEO
        title={t('landing.seo.title')}
        description={t('landing.seo.description')}
        keywords={t('landing.seo.keywords')}
        image="https://storely-eg.com/og-image.jpg"
        url="https://storely-eg.com"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: t('landing.seo.schema.name'),
          description: t('landing.seo.schema.description'),
          url: 'https://storely.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://storely-eg.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      <Navbar />

      <div className="relative z-10">
        <div ref={heroRef} data-section="hero" className={`transition-opacity duration-700 ${visibleSections.hero ? 'opacity-100' : 'opacity-0'}`}>
          <Hero />
        </div>

        <SectionDivider />

        <div ref={featuresRef} data-section="features" className={`transition-opacity duration-700 ${visibleSections.features ? 'opacity-100' : 'opacity-0'}`}>
          <Features />
        </div>

        <SectionDivider />

        <div ref={howItWorksRef} data-section="howItWorks" className={`transition-opacity duration-700 ${visibleSections.howItWorks ? 'opacity-100' : 'opacity-0'}`}>
          <HowItWorks />
        </div>

        <SectionDivider />

        <div ref={forVendorsRef} data-section="forVendors" className={`transition-opacity duration-700 ${visibleSections.forVendors ? 'opacity-100' : 'opacity-0'}`}>
          <ForVendors />
        </div>

        <SectionDivider />

        <div ref={ctaRef} data-section="cta" className={`transition-opacity duration-700 ${visibleSections.cta ? 'opacity-100' : 'opacity-0'}`}>
          <CTA />
        </div>

        <Footer />
      </div>
    </div>
  );
};

// ✅ Section Divider — خط + dot في النص
const SectionDivider = () => (
  <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative flex items-center justify-center py-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
      <div className="mx-4 flex items-center space-x-1.5">
        <div className="h-1 w-1 bg-white/30 rounded-full"></div>
        <div className="h-1.5 w-1.5 bg-white/50 rounded-full"></div>
        <div className="h-1 w-1 bg-white/30 rounded-full"></div>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
    </div>
  </div>
);

export default LandingPage;