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
import RamadanOffer from '../components/RamadanOffer';
import RamadanOfferBanner from '../components/RamadanOfferBanner';
// import RamadanOffer from './../components/RamadanOffer';

// إضافة أنماط CSS للـ animations
const scrollAnimationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .scroll-fade-up {
    opacity: 0;
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .scroll-fade-up.visible {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .scroll-fade-left {
    opacity: 0;
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .scroll-fade-left.visible {
    animation: fadeInLeft 0.8s ease-out forwards;
  }

  .scroll-fade-right {
    opacity: 0;
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .scroll-fade-right.visible {
    animation: fadeInRight 0.8s ease-out forwards;
  }

  .scroll-fade-scale {
    opacity: 0;
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .scroll-fade-scale.visible {
    animation: fadeInScale 0.8s ease-out forwards;
  }

  /* تأخيرات متدرجة */
  .delay-1 { transition-delay: 0.1s; }
  .delay-2 { transition-delay: 0.2s; }
  .delay-3 { transition-delay: 0.3s; }
  .delay-4 { transition-delay: 0.4s; }
  .delay-5 { transition-delay: 0.5s; }
`;

const LandingPage = () => {
  const { isAuthenticated, role, store } = useAuth();
  const navigate = useNavigate();
  
  // Refs للأقسام المختلفة
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const forVendorsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // State لتتبع العناصر المرئية
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    features: false,
    howItWorks: false,
    forVendors: false,
    cta: false
  });

  useEffect(() => {
    if (isAuthenticated) {
      switch (role?.toUpperCase()) {
        case 'ADMIN':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'VENDOR':
          if (store) {
            navigate('/vendor/store', { replace: true });
          } else {
            navigate('/vendor/create-store', { replace: true });
          }
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, role, store, navigate]);

  // إعداد Intersection Observer
  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.2 // 20% من العنصر ظاهر
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.dataset.section;
          setVisibleSections(prev => ({
            ...prev,
            [sectionId]: true
          }));
          
          // يمكن إلغاء المراقبة بعد الرؤية الأولى
          // observer.unobserve(entry.target);
        }
      });
    }, options);

    // مراقبة العناصر
    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (forVendorsRef.current) observer.observe(forVendorsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    // تنظيف
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (howItWorksRef.current) observer.unobserve(howItWorksRef.current);
      if (forVendorsRef.current) observer.unobserve(forVendorsRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  // Don't render landing page if user is authenticated
  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
      {/* إضافة أنماط CSS */}
      <style>{scrollAnimationStyles}</style>
      
      <SEO 
        title="Storely - منصة المتاجر المستقلة"
        description="أنشئ متجرك الإلكتروني وابدأ البيع في دقائق. Storely هي المنصة الأولى للمتاجر المستقلة في مصر والوطن العربي."
        keywords="متجر إلكتروني, إنشاء متجر, تجارة إلكترونية, بيع اونلاين, منصة متاجر, Storely"
        image="https://storely-eg.com/og-image.jpg"
        url="https://storely-eg.com"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Storely",
          "description": "منصة المتاجر المستقلة",
          "url": "https://storely.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://storely-eg.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      
      {/* Navbar - بدون تأثير لأنها ثابتة */}
      

     
      <Navbar />
      
      
      
      {/* Hero Section - Fade Up */}
      <div 
        ref={heroRef}
        data-section="hero"
        className={`scroll-fade-up ${visibleSections.hero ? 'visible' : ''} `}
      >
        <Hero />
      </div>

      {/* Features Section - Fade Left */}
      <div 
        ref={featuresRef}
        data-section="features"
        className={`scroll-fade-left ${visibleSections.features ? 'visible' : ''}`}
      >
        <Features />
      </div>

      {/* How It Works Section - Fade Right */}
      <div 
        ref={howItWorksRef}
        data-section="howItWorks"
        className={`scroll-fade-right ${visibleSections.howItWorks ? 'visible' : ''}`}
      >
        <HowItWorks />
      </div>

      {/* For Vendors Section - Fade Scale */}
      <div 
        ref={forVendorsRef}
        data-section="forVendors"
        className={`scroll-fade-scale ${visibleSections.forVendors ? 'visible' : ''}`}
      >
        <ForVendors />
      </div>

      {/* CTA Section - Fade Up مع تأخير */}
      <div 
        ref={ctaRef}
        data-section="cta"
        className={`scroll-fade-up ${visibleSections.cta ? 'visible' : ''}`}
      >
        <CTA />
      </div>

      {/* Footer - بدون تأثير */}
      <Footer />
      
      {/* مؤشر التمرير (اختياري) */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 hidden md:block">
        <div className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-gray-900/5 shadow-lg rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;