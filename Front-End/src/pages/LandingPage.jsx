// src/pages/LandingPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import ForVendors from '../components/ForVendors';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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