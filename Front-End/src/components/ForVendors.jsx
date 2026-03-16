// components/ForVendors.jsx (Vision Pro AR Style)
import React, { useState } from 'react';
import { 
  CheckCircle, TrendingUp, Users, Zap, Clock, Shield,
  Sparkles, Rocket, ArrowRight, Star, Award, Globe,
  BarChart, Settings, Headphones, Wallet,  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ForVendors = () => {
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const benefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'No Technical Skills Required',
      description: 'Our intuitive interface makes store setup a breeze.',
      stat: 'Zero coding',
      color: 'blue',
      gradient: 'from-blue-400 to-cyan-400',
      depth: 20,
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Grow Your Business',
      description: 'Access powerful analytics to make data-driven decisions.',
      stat: '+150% avg growth',
      color: 'green',
      gradient: 'from-green-400 to-emerald-400',
      depth: 30,
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Reach More Customers',
      description: 'Share your unique store link across social media and websites.',
      stat: '10k+ reach',
      color: 'purple',
      gradient: 'from-purple-400 to-pink-400',
      depth: 40,
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'Easy Order Management',
      description: 'Track and fulfill orders from a single dashboard.',
      stat: '99.9% uptime',
      color: 'indigo',
      gradient: 'from-indigo-400 to-blue-400',
      depth: 50,
    },
  ];

  const stats = [
    { value: '85%', label: 'Faster store setup', icon: <Clock className="h-6 w-6" />, color: 'blue' },
    { value: '2.5x', label: 'Higher conversion', icon: <TrendingUp className="h-6 w-6" />, color: 'green' },
    { value: '24/7', label: 'Platform support', icon: <Headphones className="h-6 w-6" />, color: 'purple' },
  ];

  const vendorTools = [
    { icon: <BarChart />, label: 'Analytics', color: 'blue' },
    { icon: <Settings />, label: 'Customization', color: 'purple' },
    { icon: <Wallet />, label: 'Payments', color: 'green' },
    { icon: <Shield />, label: 'Security', color: 'orange' },
  ];

  return (
    <section 
      id="for-vendors" 
      className="py-24 relative overflow-hidden"
      aria-labelledby="for-vendors-heading"
      onMouseMove={(e) => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20,
        });
      }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/100 to-indigo-950/60">
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
        
        {/* 3D Grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: `perspective(500px) rotateX(60deg) scale(2)`,
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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Content */}
          <div className="space-y-8 perspective-1000">
            {/* 3D Badge */}
            <div 
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-2xl text-purple-300 px-4 py-2 rounded-full border border-white/20 shadow-2xl transform-gpu hover:scale-105 transition-all duration-300"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
              }}
            >
              <Award className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-medium">Vendor Success Platform</span>
            </div>
            
            {/* 3D Heading */}
            <h2 
              id="for-vendors-heading"
              className="text-4xl md:text-5xl font-bold"
              style={{
                textShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(168,85,247,0.3)',
              }}
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent block">
                Built Specifically for
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent block mt-2">
                Modern Vendors
              </span>
            </h2>
            
            <p className="text-lg text-purple-100/70 leading-relaxed">
              Storely empowers entrepreneurs, small businesses, and creators to launch their online stores in a fully immersive 3D environment.
            </p>
            
            {/* 3D Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="group relative transform-gpu transition-all duration-300"
                  style={{
                    transform: `perspective(1000px) translateZ(${hoveredBenefit === index ? benefit.depth : 0}px)`,
                  }}
                  onMouseEnter={() => setHoveredBenefit(index)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                >
                  <div className="relative bg-white/10 backdrop-blur-2xl rounded-2xl p-5 border border-white/20 overflow-hidden">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-${benefit.color}-400/10 blur-2xl transition-opacity duration-500 ${
                      hoveredBenefit === index ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                    
                    <div className="flex items-start space-x-4">
                      {/* 3D Icon */}
                      <div className={`relative h-14 w-14 rounded-xl bg-${benefit.color}-400/20 border border-${benefit.color}-400/30 flex items-center justify-center flex-shrink-0 transform-gpu group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <div className={`text-${benefit.color}-400`}>
                          {benefit.icon}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                            hoveredBenefit === index ? `text-${benefit.color}-400` : 'text-white'
                          }`}>
                            {benefit.title}
                          </h3>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${benefit.color}-400/20 text-${benefit.color}-400 border border-${benefit.color}-400/30`}>
                            {benefit.stat}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Vendor Tools */}
            <div className="flex flex-wrap gap-3 pt-4">
              {vendorTools.map((tool, index) => (
                <div
                  key={index}
                  className="group relative"
                  onMouseEnter={() => setHoveredStat(`tool-${index}`)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div className={`absolute inset-0 bg-${tool.color}-400/20 blur-xl rounded-full transition-opacity duration-300 ${
                    hoveredStat === `tool-${index}` ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                  <div className="relative flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 group-hover:scale-105 transition-all duration-300">
                    
                    <span className="text-xs text-gray-300">{tool.label}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 3D Testimonials */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="relative group"
                    onMouseEnter={() => setHoveredStat(`avatar-${i}`)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div className={`absolute inset-0 bg-white/20 blur-md rounded-full transition-opacity duration-300 ${
                      hoveredStat === `avatar-${i}` ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                    <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white/20 flex items-center justify-center transform-gpu hover:scale-110 transition-all duration-300">
                      <span className="text-white font-medium">👤</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-400 ml-2">from 500+ reviews</span>
              </div>
            </div>
          </div>
          
          {/* Right Stats - 3D Cards */}
          <div className="space-y-6 perspective-1000">
            {/* Main Stats Card */}
            <div 
              className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl transform-gpu hover:translate-z-20 transition-all duration-300"
              style={{
                transform: `perspective(1000px) rotateY(${-mousePosition.x}deg) rotateX(${mousePosition.y}deg)`,
              }}
            >
              {/* 3D Lighting */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-3xl"></div>
              
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center relative z-10">
                <TrendingUp className="h-6 w-6 mr-2 text-purple-400" />
                Vendor Success Metrics
              </h3>
              
              <div className="space-y-6 relative z-10">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="group relative transform-gpu hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                    onMouseEnter={() => setHoveredStat(`stat-${index}`)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div className={`absolute inset-0 bg-${stat.color}-400/10 blur-xl rounded-2xl transition-opacity duration-500 ${
                      hoveredStat === `stat-${index}` ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                    
                    <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`h-12 w-12 rounded-xl bg-${stat.color}-400/20 border border-${stat.color}-400/30 flex items-center justify-center`}>
                            <div className={`text-${stat.color}-400`}>
                              {stat.icon}
                            </div>
                          </div>
                          <span className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</span>
                        </div>
                      </div>
                      <div className="text-lg text-gray-300 mb-3">{stat.label}</div>
                      
                      {/* 3D Progress bar */}
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-300 rounded-full transition-all duration-1000 group-hover:opacity-80`}
                          style={{ width: index === 0 ? '85%' : index === 1 ? '60%' : '100%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 3D Decorative Elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-float-3d"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
            </div>

            {/* CTA Button */}
            <div className="relative group perspective-1000">
              <Link to="/signup">
                <button 
                  className="group relative w-full px-8 py-6 rounded-2xl overflow-hidden transform-gpu hover:scale-105 hover:rotate-1 transition-all duration-300"
                  onMouseEnter={() => setHoveredStat('cta')}
                  onMouseLeave={() => setHoveredStat(null)}
                  style={{
                    transform: hoveredStat === 'cta' ? 'perspective(1000px) rotateX(5deg) translateZ(30px)' : 'perspective(1000px) rotateX(0) translateZ(0)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-90"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredStat === 'cta' ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
                  </div>
                  
                  <span className="relative z-10 flex items-center justify-center space-x-2 text-white font-bold text-lg">
                    <span>Join Successful Vendors</span>
                    <Rocket className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForVendors;