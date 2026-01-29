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

const LandingPage = () => {
  const { isAuthenticated, role, store } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users based on role
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
        case 'CUSTOMER':
          // Redirect to last visited store or homepage
          const lastStore = sessionStorage.getItem('lastVisitedStore');
          if (lastStore) {
            navigate(`/store/${lastStore}`, { replace: true });
          } else {
            // Stay on landing for customers to browse stores
            // Or redirect to a store listing page
          }
          break;
        default:
          // Stay on landing
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