// components/Footer.jsx
import React from 'react';
import { ShoppingCart, Facebook, Twitter, Instagram, Linkedin, Mail, Heart, ChevronRight } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '#', ariaLabel: 'Learn about Storely' },
    { name: 'Features', href: '#features', ariaLabel: 'View all features' },
    { name: 'Pricing', href: '/pricing', ariaLabel: 'View pricing plans' },
    { name: 'Contact', href: '/contact', ariaLabel: 'Contact us' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#', ariaLabel: 'Read privacy policy' },
    { name: 'Terms of Service', href: '#', ariaLabel: 'Read terms of service' },
    { name: 'Cookie Policy', href: '#', ariaLabel: 'Read cookie policy' },
  ];

  const socialLinks = [
    { 
      icon: <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />, 
      href: 'https://www.instagram.com/storely_platform/',
      name: 'Instagram',
      ariaLabel: 'Follow us on Instagram'
    },
  ];

  return (
    <footer 
      className="bg-gray-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          {/* Logo & Description */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">Storely</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 leading-relaxed">
              Empowering vendors worldwide to create beautiful online stores and grow their businesses with our multi-vendor e-commerce platform.
            </p>
            
            {/* Trust badge */}
            
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center">
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 mr-1" aria-hidden="true" />
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1"
                    aria-label={link.ariaLabel}
                  >
                    <span className="w-0 group-hover:w-2 transition-all overflow-hidden">•</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center">
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 mr-1" aria-hidden="true" />
              Legal
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1"
                    aria-label={link.ariaLabel}
                  >
                    <span className="w-0 group-hover:w-2 transition-all overflow-hidden">•</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Stay Updated</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              Follow to get tips and updates about Storely.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={social.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            {/* Contact email */}
            <a 
              href="mailto:support@storely.com"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1"
              aria-label="Email us at support@storely.com"
            >
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span>johnemil21@yahoo.com</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-400 order-2 md:order-1">
              © {new Date().getFullYear()} Storely. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400 order-1 md:order-2">
              <span className="flex items-center">
                Made with <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-400 mx-1 fill-current" aria-hidden="true" /> for vendors
              </span>
              <span aria-hidden="true">•</span>
              <span>v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;