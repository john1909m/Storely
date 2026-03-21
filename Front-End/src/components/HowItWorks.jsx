// components/HowItWorks.jsx (Vision Pro AR Style)
import React, { useState } from 'react';
import { 
  UserPlus, Store, Package, Share2, ShoppingCart, 
  CheckCircle, Sparkles, ArrowRight, Zap, Eye, 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      icon: <UserPlus className="h-6 w-6" />,
      title: t('landing.howItWorks.steps.01.title'),
      description: t('landing.howItWorks.steps.01.description'),
      color: 'blue',
      gradient: 'from-blue-400 to-cyan-400',
      details: t('landing.howItWorks.steps.01.details'),
      depth: 10,
    },
    {
      number: '02',
      icon: <Store className="h-6 w-6" />,
      title: t('landing.howItWorks.steps.02.title'),
      description: t('landing.howItWorks.steps.02.description'),
      color: 'purple',
      gradient: 'from-purple-400 to-pink-400',
      details: t('landing.howItWorks.steps.02.details'),
      depth: 20,
    },
    {
      number: '03',
      icon: <Package className="h-6 w-6" />,
      title: t('landing.howItWorks.steps.03.title'),
      description: t('landing.howItWorks.steps.03.description'),
      color: 'green',
      gradient: 'from-green-400 to-emerald-400',
      details: t('landing.howItWorks.steps.03.details'),
      depth: 30,
    },
    {
      number: '04',
      icon: <Share2 className="h-6 w-6" />,
      title: t('landing.howItWorks.steps.04.title'),
      description: t('landing.howItWorks.steps.04.description'),
      color: 'orange',
      gradient: 'from-orange-400 to-red-400',
      details: t('landing.howItWorks.steps.04.details'),
      depth: 40,
    },
    {
      number: '05',
      icon: <ShoppingCart className="h-6 w-6" />,
      title: t('landing.howItWorks.steps.05.title'),
      description: t('landing.howItWorks.steps.05.description'),
      color: 'indigo',
      gradient: 'from-indigo-400 to-blue-400',
      details: t('landing.howItWorks.steps.05.details'),
      depth: 50,
    },
  ];

  return (
    <section 
      id="how-it-works" 
      className="py-24 relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-indigo-950/100 to-purple-950/30">
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
        
        {/* 3D Grid */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg) scale(2)',
          transformOrigin: 'top',
        }}></div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* 3D Badge */}
          <div 
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-2xl text-blue-300 px-4 py-2 rounded-full mb-6 border border-white/20 shadow-2xl transform-gpu hover:scale-105 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('badge')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            
            <span className="text-sm font-medium">{t('landing.howItWorks.section.badge')}</span>
          </div>
          
          {/* 3D Text */}
          <h2 
            id="how-it-works-heading"
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              textShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.3)',
            }}
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent block">
              {t('landing.howItWorks.section.headlineLine1')}
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-2">
              {t('landing.howItWorks.section.headlineLine2')}
            </span>
          </h2>
          
          <p className="text-lg text-blue-100/70">
            {t('landing.howItWorks.section.description')}
          </p>
        </div>

        {/* 3D Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 perspective-1000">
          {/* 3D Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-400/30 transform -translate-y-1/2 blur-sm"></div>
          
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative group transform-gpu transition-all duration-500"
              style={{
                transform: `perspective(1000px) rotateY(${hoveredStep === index ? 0 : 0}deg) translateZ(${hoveredStep === index ? step.depth : 0}px)`,
                transition: 'transform 0.3s ease-out',
              }}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* 3D Card */}
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-2xl overflow-hidden">
                {/* 3D Lighting */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                
                {/* Floating particles on hover */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredStep === index ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute top-0 left-0 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-float"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-float animation-delay-2000"></div>
                </div>
                
                {/* Number Badge with 3D effect */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-2xl transform-gpu group-hover:scale-110 group-hover:rotate-12 transition-all opacity-100 duration-300 border-2 border-white/20`}>
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>
                </div>
                
                {/* Icon with 3D effect */}
                <div className={`h-16 w-16 rounded-xl bg-${step.color}-400/20 border border-${step.color}-400/30 flex items-center justify-center mb-4 mx-auto mt-6 transform-gpu group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <div className={`text-${step.color}-400`}>
                    {step.icon}
                  </div>
                </div>
                
                {/* Title with depth */}
                <h3 className={`text-lg font-bold text-center mb-2 transition-colors duration-300 ${
                  hoveredStep === index ? `text-${step.color}-400` : 'text-white'
                }`}>
                  {step.title}
                </h3>
                
                <p className="text-sm text-gray-300 text-center leading-relaxed mb-3">
                  {step.description}
                </p>
                
                {/* 3D Details card */}
                <div className="relative mt-4 transform-gpu group-hover:translate-y-[-5px] transition-transform duration-300">
                  <div className="absolute inset-0 bg-white/5 blur-xl rounded-lg"></div>
                  <p className="relative text-xs text-gray-400 text-center bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                    {step.details}
                  </p>
                </div>
                
                {/* 3D Success indicator */}
                <div className={`absolute bottom-2 right-2 transition-all duration-300 transform-gpu ${
                  hoveredStep === index ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
                }`}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400/20 blur-lg rounded-full"></div>
                    <CheckCircle className={`h-5 w-5 text-green-400 relative z-10`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D CTA Button */}
        <div className="text-center mt-12 perspective-1000">
          <Link to="/signup">
            <button 
              className="group relative px-10 py-5 rounded-2xl overflow-hidden transform-gpu hover:scale-110 hover:rotate-1 transition-all duration-300"
              onMouseEnter={() => setHoveredCard('cta')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transform: hoveredCard === 'cta' ? 'perspective(1000px) rotateX(5deg) translateZ(30px)' : 'perspective(1000px) rotateX(0) translateZ(0)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredCard === 'cta' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
              </div>
              
              <span className="relative z-10 flex items-center justify-center space-x-2 text-white font-bold text-lg">
                <span>{t('landing.howItWorks.cta')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;