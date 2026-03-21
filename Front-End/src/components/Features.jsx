// components/Features.jsx (Vision Pro AR Style)
import React, { useState } from 'react';
import { 
  Link, Package, ShoppingBag, Smartphone, BarChart, 
  Sparkles, Check, Zap, Shield, Globe, Rocket, Eye,
  Layers, Box, Palette, Repeat, Clock, Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();

  const features = [
    {
      icon: <Link className="h-7 w-7" />,
      title: t('landing.features.items.customStoreLinks.title'),
      description: t('landing.features.items.customStoreLinks.description'),
      color: 'blue',
      gradient: 'from-blue-400 to-cyan-400',
      benefits: t('landing.features.items.customStoreLinks.benefits', { returnObjects: true }),
      depth: 30,
      
    },
    {
      icon: <Package className="h-7 w-7" />,
      title: t('landing.features.items.productManagement.title'),
      description: t('landing.features.items.productManagement.description'),
      color: 'purple',
      gradient: 'from-purple-400 to-pink-400',
      benefits: t('landing.features.items.productManagement.benefits', { returnObjects: true }),
      depth: 40,
     
    },
    {
      icon: <ShoppingBag className="h-7 w-7" />,
      title: t('landing.features.items.orderSystem.title'),
      description: t('landing.features.items.orderSystem.description'),
      color: 'green',
      gradient: 'from-green-400 to-emerald-400',
      benefits: t('landing.features.items.orderSystem.benefits', { returnObjects: true }),
      depth: 50,
      
    },
    {
      icon: <Smartphone className="h-7 w-7" />,
      title: t('landing.features.items.mobileFriendly.title'),
      description: t('landing.features.items.mobileFriendly.description'),
      color: 'orange',
      gradient: 'from-orange-400 to-red-400',
      benefits: t('landing.features.items.mobileFriendly.benefits', { returnObjects: true }),
      depth: 60,
      stats: t('landing.features.items.mobileFriendly.stats'),
    },
    {
      icon: <BarChart className="h-7 w-7" />,
      title: t('landing.features.items.analyticsDashboard.title'),
      description: t('landing.features.items.analyticsDashboard.description'),
      color: 'teal',
      gradient: 'from-teal-400 to-cyan-400',
      benefits: t('landing.features.items.analyticsDashboard.benefits', { returnObjects: true }),
      depth: 70,
      stats: t('landing.features.items.analyticsDashboard.stats'),
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: t('landing.features.items.securePlatform.title'),
      description: t('landing.features.items.securePlatform.description'),
      color: 'indigo',
      gradient: 'from-indigo-400 to-blue-400',
      benefits: t('landing.features.items.securePlatform.benefits', { returnObjects: true }),
      depth: 80,
      stats: t('landing.features.items.securePlatform.stats'),
    },
  ];

  return (
    <div className='bg-black'>
      <section 
      id="features" 
      className="py-24 relative overflow-hidden"
      aria-labelledby="features-heading"
      onMouseMove={(e) => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20,
        });
      }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-indigo-950/100 to-purple-950/60">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* 3D Grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: `perspective(500px) rotateX(60deg) scale(2)`,
          transformOrigin: 'top',
        }}></div>
        
        {/* Floating particles */}
        {[...Array(40)].map((_, i) => (
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 perspective-1000">
          <div 
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-2xl text-blue-300 px-4 py-2 rounded-full mb-6 border border-white/20 shadow-2xl transform-gpu hover:scale-105 transition-all duration-300"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
            }}
          >
            
            <span className="text-sm font-medium">{t('landing.features.sectionTitle.pill')}</span>
          </div>
          
          <h2 
            id="features-heading"
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              textShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.3)',
            }}
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent block">
              {t('landing.features.sectionTitle.line1')}
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-2">
              {t('landing.features.sectionTitle.line2')}
            </span>
          </h2>
          
          <p className="text-lg text-blue-100/70">
            {t('landing.features.description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-2000">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative transform-gpu transition-all duration-500"
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg) translateZ(${hoveredFeature === index ? feature.depth : 0}px)`,
                transition: 'transform 0.3s ease-out',
              }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* 3D Card */}
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden h-full">
                {/* 3D Lighting */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                
                {/* Floating particles on hover */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredFeature === index ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
                </div>
                
                {/* 3D Icon Container */}
                <div className="relative mb-8">
                  <div className={`absolute inset-0 bg-${feature.color}-400/20 blur-2xl rounded-2xl transition-opacity duration-500 ${
                    hoveredFeature === index ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                  <div className={`relative h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 border border-${feature.color}-400/30 flex items-center justify-center transform-gpu group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <div className={`text-${feature.color}-400`}>
                      {feature.icon}
                    </div>
                  </div>
                </div>
                
                {/* Title with 3D effect */}
                <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                  hoveredFeature === index ? `text-${feature.color}-400` : 'text-white'
                }`}>
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                {/* Benefits with 3D checkmarks */}
                <div className="space-y-3 mb-8">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center space-x-3 group/benefit">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-green-400/20 blur-md rounded-full transition-opacity duration-300 opacity-0 group-hover/benefit:opacity-100`}></div>
                        <Check className={`h-5 w-5 text-green-400 relative z-10`} />
                      </div>
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                {/* Stats badge with 3D effect */}
                <div className="relative mt-auto">
                  <div className="absolute inset-0 bg-white/5 blur-lg rounded-lg"></div>
                  <div className="relative flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                    <span className="text-xs text-gray-400">{t('landing.features.activeUsers')}</span>
                    <span className={`text-sm font-semibold text-${feature.color}-400`}>{feature.stats}</span>
                  </div>
                </div>
                
                {/* 3D Corner decoration */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Layers className={`h-8 w-8 text-${feature.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Stats Bar */}
        
      </div>
    </section>
    </div>
  );
};

export default Features;