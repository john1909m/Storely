// src/pages/LandingPage.jsx
import React, { useEffect } from 'react';
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

const LandingPage = () => {
  const { isAuthenticated, role, store } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      switch (role?.toUpperCase()) {
        case 'ADMIN':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'VENDOR':
          // Check if vendor has store
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

  // Don't render landing page if user is authenticated
  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <ForVendors />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;