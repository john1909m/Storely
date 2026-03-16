// components/Footer.jsx (Vision Pro AR Style)
import React, { useState } from 'react';
import { 
  ShoppingCart, Instagram, Mail, Heart, 
  ChevronRight, Sparkles, Zap, Shield, Globe,
  Facebook, Twitter, Linkedin, Youtube,
  MapPin, Phone, Clock, Award,  Eye
} from 'lucide-react';

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const quickLinks = [
    { name: 'About Us', href: '#', ariaLabel: 'Learn about Storely', icon: <Globe className="h-4 w-4" /> },
    { name: 'Features', href: '#features', ariaLabel: 'View all features', icon: <Sparkles className="h-4 w-4" /> },
    { name: 'Pricing', href: '/pricing', ariaLabel: 'View pricing plans', icon: <Zap className="h-4 w-4" /> },
    { name: 'Contact', href: '/contact', ariaLabel: 'Contact us', icon: <Mail className="h-4 w-4" /> },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#', ariaLabel: 'Read privacy policy' },
    { name: 'Terms of Service', href: '#', ariaLabel: 'Read terms of service' },
    { name: 'Cookie Policy', href: '#', ariaLabel: 'Read cookie policy' },
  ];

  const socialLinks = [
    { 
      icon: <Instagram className="h-5 w-5" />, 
      href: 'https://www.instagram.com/storely_platform/',
      name: 'Instagram',
      ariaLabel: 'Follow us on Instagram',
      color: 'pink'
    },
    { 
      icon: <Facebook className="h-5 w-5" />, 
      href: 'https://www.facebook.com/profile.php?id=61585122357618',
      name: 'Facebook',
      ariaLabel: 'Follow us on Facebook',
      color: 'blue'
    },
    
  ];

  const contactInfo = [
    { icon: <MapPin className="h-4 w-4" />, text: 'Cairo, Egypt', color: 'blue' },
    { icon: <Phone className="h-4 w-4" />, text: '+20 103 599 9541', color: 'green' },
    { icon: <Mail className="h-4 w-4" />, text: 'johnemil21@yahoo.com', color: 'purple' },
    { icon: <Clock className="h-4 w-4" />, text: '24/7 Support', color: 'orange' },
  ];

  return (
    <footer 
      className="relative bg-gray-950 pt-20 pb-8 overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* 3D Background */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
        
        {/* 3D Grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) scale(2)',
          transformOrigin: 'top',
        }}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/10 rounded-full animate-float-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 perspective-1000">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 group relative">
              <div className={`absolute inset-0 bg-blue-400/20 blur-2xl rounded-full transition-opacity duration-500 ${
                hoveredLink === 'logo' ? 'opacity-100' : 'opacity-0'
              }`}></div>
              <div 
                className="relative h-14 w-14 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-2xl transform-gpu group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                onMouseEnter={() => setHoveredLink('logo')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Storely</span>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the future of e-commerce with our immersive 3D platform. Empowering vendors worldwide with cutting-edge technology.
            </p>
            
            {/* 3D Stats Mini */}
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-gray-900 flex items-center justify-center transform-gpu hover:scale-110 transition-all duration-300"
                  >
                    <span className="text-xs text-white">👤</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400">
                <span className="text-white font-semibold">100+</span> vendors
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <ChevronRight className="h-5 w-5 text-blue-400 mr-1 animate-pulse" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group relative inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300"
                    aria-label={link.ariaLabel}
                    onMouseEnter={() => setHoveredLink(`quick-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <div className={`absolute -left-4 w-0 h-0.5 bg-blue-400 group-hover:w-8 transition-all duration-300 ${
                      hoveredLink === `quick-${index}` ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                    <span className={`transform-gpu group-hover:translate-x-2 transition-transform duration-300 ${
                      hoveredLink === `quick-${index}` ? 'text-blue-400' : ''
                    }`}>
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Shield className="h-5 w-5 text-purple-400 mr-2 animate-pulse" />
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group relative inline-flex items-center text-gray-400 hover:text-white transition-all duration-300"
                    aria-label={link.ariaLabel}
                    onMouseEnter={() => setHoveredLink(`legal-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className={`absolute -left-2 w-1.5 h-1.5 rounded-full bg-purple-400 transition-all duration-300 ${
                      hoveredLink === `legal-${index}` ? 'opacity-100 scale-150' : 'opacity-0'
                    }`}></span>
                    <span className="transform-gpu group-hover:translate-x-3 transition-transform duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Globe className="h-5 w-5 text-pink-400 mr-2 animate-spin-slow" />
              Connect
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-300"
                  onMouseEnter={() => setHoveredLink(`contact-${index}`)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <div className={`h-8 w-8 rounded-lg bg-${item.color}-400/10 border border-${item.color}-400/20 flex items-center justify-center transform-gpu group-hover:scale-110 transition-all duration-300`}>
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            
            {/* Social Links with 3D effects */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="group relative"
                  aria-label={social.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <div className={`absolute inset-0 bg-${social.color}-400/20 blur-xl rounded-xl transition-opacity duration-500 ${
                    hoveredSocial === index ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                  <div className={`relative h-10 w-10 rounded-xl bg-${social.color}-400/10 border border-${social.color}-400/30 flex items-center justify-center transform-gpu hover:scale-110 hover:rotate-3 transition-all duration-300`}>
                    <div className={`text-${social.color}-400`}>
                      {social.icon}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Trust Badge */}
            
          </div>
        </div>

        {/* 3D Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent h-px"></div>
          <div className="absolute left-1/2 -translate-x-1/2 -top-3">
            
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative perspective-1000">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transform-gpu hover:translate-z-5 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400 order-2 md:order-1 flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-400" />
                <span>© {new Date().getFullYear()} Storely. All rights reserved.</span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400 order-1 md:order-2">
                <span className="flex items-center space-x-1 group">
                  <span>Made with</span>
                  <Heart className="h-4 w-4 text-red-400 mx-1 fill-current group-hover:scale-125 transition-transform" />
                  <span>for vendors</span>
                </span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  <span>v3.0.0</span>
                </span>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-blue-400/5 rounded-full blur-2xl animate-float"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-purple-400/5 rounded-full blur-2xl animate-float animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;