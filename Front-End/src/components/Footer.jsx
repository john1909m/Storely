// components/Footer.jsx
import React from 'react';
import { ShoppingCart, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '/pricing' },

  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ];

  const socialLinks = [
    { icon: <Instagram className="h-5 w-5" />, href: 'https://www.instagram.com/storely_platform/' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <ShoppingCart className="h-8 w-8 text-indigo-400" />
              <span className="text-2xl font-bold">Storely</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering vendors worldwide to create beautiful online stores and grow their businesses with our multi-vendor e-commerce platform.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Follow to get tips and updates about Storely.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Storely. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made with ❤️ for vendors</span>
              <span>•</span>
              <span>v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;