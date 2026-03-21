// components/CTA.jsx (Vision Pro AR Style)
import React, { useState } from 'react';
import { ArrowRight, Star, Sparkles, Rocket, Zap, Shield, Globe, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CTA = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();

  const benefits = [
    { icon: Zap, text: t('landing.cta.benefitBadges.noCreditCardRequired'), color: 'blue' },
    { icon: Globe, text: t('landing.cta.benefitBadges.instantSetup'), color: 'pink' },
  ];

  return (
    <section 
      className="py-24 relative overflow-hidden"
      aria-label={t('landing.cta.ariaLabel')}
      onMouseMove={(e) => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20,
        });
      }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-indigo-950/100 to-purple-950/50">
        {/* Floating orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
        
        {/* 3D Grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 3D Stars */}
          <div 
            className="flex justify-center space-x-2 mb-6 perspective-1000"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="transform-gpu hover:scale-150 hover:rotate-12 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
                onMouseEnter={() => setHoveredCard(`star-${i}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Star className={`h-8 w-8 text-yellow-400 fill-current transition-all duration-300 ${
                  hoveredCard === `star-${i}` ? 'drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]' : ''
                }`} />
              </div>
            ))}
          </div>
          
          {/* 3D Badge */}
          <div 
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-2xl text-blue-300 px-4 py-2 rounded-full mb-8 border border-white/20 shadow-2xl transform-gpu hover:scale-105 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('badge')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 'badge' ? 'perspective(1000px) rotateX(5deg) translateZ(20px)' : 'perspective(1000px) rotateX(0) translateZ(0)',
            }}
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">{t('landing.cta.badge')}</span>
          </div>
          
          {/* 3D Main Text */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <div 
              className="transform-gpu hover:translate-z-10 transition-transform duration-300"
              style={{
                textShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.3)',
              }}
            >
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent block">
                {t('landing.cta.headlineLine1')}
              </span>
            </div>
            <div 
              className="transform-gpu hover:translate-z-20 transition-transform duration-300 mt-2"
              style={{
                textShadow: '0 15px 40px rgba(0,0,0,0.5), 0 0 60px rgba(168,85,247,0.3)',
              }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                {t('landing.cta.headlineLine2')}
              </span>
            </div>
          </h2>
          
          <p className="text-xl text-blue-100/70 mb-10 max-w-2xl mx-auto">
            {t('landing.cta.description')}
          </p>
          
          {/* 3D Benefits badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 perspective-1000">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="transform-gpu hover:scale-110 hover:-translate-y-2 transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(`benefit-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`relative bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 hover:border-${benefit.color}-400/30 transition-all duration-300`}>
                  <div className={`absolute inset-0 bg-${benefit.color}-400/20 blur-xl rounded-full transition-opacity duration-500 ${
                    hoveredCard === `benefit-${index}` ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                  <div className="relative flex items-center space-x-2">
                    <benefit.icon className={`h-4 w-4 text-${benefit.color}-400`} />
                    <span className="text-sm text-gray-300">{benefit.text}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 3D Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 perspective-1000">
            <Link to="/signup" className="w-full sm:w-auto">
              <button 
                className="group relative w-full sm:w-auto px-10 py-5 rounded-2xl overflow-hidden transform-gpu hover:scale-110 hover:rotate-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard('cta1')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: hoveredCard === 'cta1' ? 'perspective(1000px) rotateX(5deg) translateZ(30px)' : 'perspective(1000px) rotateX(0) translateZ(0)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredCard === 'cta1' ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
                </div>
                
                <span className="relative z-10 flex items-center justify-center space-x-3 text-white font-bold text-lg">
                  <span>{t('landing.cta.buttons.startSellingToday')}</span>
                  <Rocket className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </button>
            </Link>
            
            <Link to="/pricing" className="w-full sm:w-auto">
              <button 
                className="group relative w-full sm:w-auto px-10 py-5 rounded-2xl overflow-hidden transform-gpu hover:scale-110 hover:-rotate-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard('cta2')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: hoveredCard === 'cta2' ? 'perspective(1000px) rotateX(5deg) translateZ(20px)' : 'perspective(1000px) rotateX(0) translateZ(0)',
                }}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl border border-white/20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <span className="relative z-10 text-white font-bold text-lg">{t('landing.cta.buttons.viewPricing')}</span>
              </button>
            </Link>
          </div>
          
          {/* 3D Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {[
              { text: t('landing.cta.benefits.noHiddenFees'), color: 'blue' },
              { text: t('landing.cta.benefits.securePlatform'), color: 'purple' },
              { text: t('landing.cta.benefits.support'), color: 'pink' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 transform-gpu hover:scale-110 transition-all duration-300"
                onMouseEnter={() => setHoveredCard(`trust-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`h-2 w-2 bg-${item.color}-400 rounded-full animate-pulse`}></div>
                <span className="text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;