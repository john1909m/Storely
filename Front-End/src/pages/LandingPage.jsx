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
import { Sparkles, Compass, Zap, Shield, Star, ArrowDown } from 'lucide-react';

// إضافة أنماط CSS للـ 3D animations
const scrollAnimationStyles = `
  @keyframes float-3d {
    0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
    25% { transform: translateY(-20px) rotateX(5deg) rotateY(5deg); }
    75% { transform: translateY(20px) rotateX(-5deg) rotateY(-5deg); }
  }

  @keyframes float-particle {
    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(100px) scale(0); opacity: 0; }
  }

  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.5; }
  }

  @keyframes glow-pulse {
    0%, 100% { filter: brightness(1) blur(20px); }
    50% { filter: brightness(1.5) blur(30px); }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px) translateZ(0);
    }
    to {
      opacity: 1;
      transform: translateY(0) translateZ(20px);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px) translateZ(0);
    }
    to {
      opacity: 1;
      transform: translateX(0) translateZ(20px);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px) translateZ(0);
    }
    to {
      opacity: 1;
      transform: translateX(0) translateZ(20px);
    }
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95) translateZ(0);
    }
    to {
      opacity: 1;
      transform: scale(1) translateZ(20px);
    }
  }

  .animate-float-3d {
    animation: float-3d 8s ease-in-out infinite;
    transform-style: preserve-3d;
  }

  .animate-float-particle {
    animation: float-particle 8s linear infinite;
  }

  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }

  .animate-glow-pulse {
    animation: glow-pulse 3s ease-in-out infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .perspective-2000 {
    perspective: 2000px;
  }

  .transform-gpu {
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  .transform-style-3d {
    transform-style: preserve-3d;
  }

  .text-shadow-3d {
    text-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.3);
  }

  .grid-3d {
    background-image: 
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  .scroll-fade-up {
    opacity: 0;
    transform: translateZ(0);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  }

  .scroll-fade-up.visible {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .scroll-fade-left {
    opacity: 0;
    transform: translateZ(0);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  }

  .scroll-fade-left.visible {
    animation: fadeInLeft 0.8s ease-out forwards;
  }

  .scroll-fade-right {
    opacity: 0;
    transform: translateZ(0);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  }

  .scroll-fade-right.visible {
    animation: fadeInRight 0.8s ease-out forwards;
  }

  .scroll-fade-scale {
    opacity: 0;
    transform: translateZ(0);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  }

  .scroll-fade-scale.visible {
    animation: fadeInScale 0.8s ease-out forwards;
  }

  /* تأخيرات متدرجة */
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }
  .delay-5 { animation-delay: 0.5s; }
`;

const LandingPage = () => {
  const { isAuthenticated, role, store } = useAuth();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
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
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.dataset.section;
          setVisibleSections(prev => ({
            ...prev,
            [sectionId]: true
          }));
        }
      });
    }, options);

    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (forVendorsRef.current) observer.observe(forVendorsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (howItWorksRef.current) observer.unobserve(howItWorksRef.current);
      if (forVendorsRef.current) observer.unobserve(forVendorsRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div 
      className="min-h-screen bg-black overflow-x-hidden relative"
      onMouseMove={(e) => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20,
        });
      }}
    >
      {/* إضافة أنماط CSS */}
      <style>{scrollAnimationStyles}</style>
      
      {/* 3D Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-indigo-950/100 to-purple-950/60 pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* 3D Grid */}
        <div className="absolute inset-0 opacity-20 grid-3d" style={{
          transform: `perspective(500px) rotateX(60deg) scale(2)`,
          transformOrigin: 'top',
        }}></div>
        
        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
      
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
      
      {/* 3D Floating Badge */}
      
      
      <Navbar />
      
      {/* Hero Section */}
      <div 
        ref={heroRef}
        data-section="hero"
        className={`scroll-fade-up relative z-10 ${visibleSections.hero ? 'visible' : ''}`}
      >
        <Hero />
      </div>

      {/* Features Section */}
      <div 
        ref={featuresRef}
        data-section="features"
        className={`scroll-fade-left relative z-10 ${visibleSections.features ? 'visible' : ''}`}
      >
        <Features />
      </div>

      {/* How It Works Section */}
      <div 
        ref={howItWorksRef}
        data-section="howItWorks"
        className={`scroll-fade-right relative z-10 ${visibleSections.howItWorks ? 'visible' : ''}`}
      >
        <HowItWorks />
      </div>

      {/* For Vendors Section */}
      <div 
        ref={forVendorsRef}
        data-section="forVendors"
        className={`scroll-fade-scale relative z-10 ${visibleSections.forVendors ? 'visible' : ''}`}
      >
        <ForVendors />
      </div>

      {/* CTA Section */}
      <div 
        ref={ctaRef}
        data-section="cta"
        className={`scroll-fade-up relative z-10 ${visibleSections.cta ? 'visible' : ''}`}
      >
        <CTA />
      </div>

      <Footer />
      
      {/* 3D Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 hidden md:block perspective-1000">
        <div 
          className="glass-card p-3 rounded-full border border-white/10 shadow-2xl transform-gpu cursor-pointer group hover:scale-110 transition-all duration-300"
          style={{
            transform: `perspective(1000px) rotateY(${mousePosition.x * 0.1}deg) rotateX(${-mousePosition.y * 0.1}deg)`,
          }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <ArrowDown className="h-6 w-6 text-blue-400 group-hover:text-white transition-colors animate-bounce" />
        </div>
      </div>

      {/* Progress Bar with 3D effect */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-white/5 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          style={{ 
            width: `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`,
            transition: 'width 0.1s ease-out'
          }}
        ></div>
      </div>

      {/* 3D Corner Decorations */}
      <div className="fixed top-40 left-0 opacity-20 pointer-events-none">
        <Compass className="h-32 w-32 text-blue-400 animate-float-3d" />
      </div>
      <div className="fixed bottom-40 right-0 opacity-20 pointer-events-none">
        <Star className="h-32 w-32 text-purple-400 animate-float-3d animation-delay-2000" />
      </div>

      {/* Floating Stats Bar */}
      
    </div>
  );
};

export default LandingPage;