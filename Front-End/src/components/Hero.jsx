// components/Hero.jsx (Vision Pro AR Style with Gyroscope support)
import React, { useState, useEffect } from 'react';
import { ArrowRight, Store, Sparkles, Rocket, Zap, Shield, Globe, Eye,  } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gyroscopePosition, setGyroscopePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [gyroscopeAvailable, setGyroscopeAvailable] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      return mobileRegex.test(userAgent);
    };
    
    setIsMobile(checkMobile());
  }, []);

  // Request gyroscope permission and setup
  useEffect(() => {
    if (isMobile && window.DeviceOrientationEvent) {
      // Check if we need to request permission (iOS 13+)
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS devices need permission
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleGyroscope);
              setGyroscopeAvailable(true);
            }
          })
          .catch(console.error);
      } else {
        // Android and older iOS
        window.addEventListener('deviceorientation', handleGyroscope);
        setGyroscopeAvailable(true);
      }
    }

    return () => {
      if (gyroscopeAvailable) {
        window.removeEventListener('deviceorientation', handleGyroscope);
      }
    };
  }, [isMobile]);

  // Handle mouse movement (desktop)
  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = (e) => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20,
        });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isMobile]);

  // Handle gyroscope movement (mobile)
  const handleGyroscope = (event) => {
    // beta = front-to-back tilt in degrees (-180 to 180)
    // gamma = left-to-right tilt in degrees (-90 to 90)
    const { beta, gamma } = event;
    
    if (beta !== null && gamma !== null) {
      // Normalize values to be between -10 and 10 for smoother effect
      const normalizedBeta = Math.max(-10, Math.min(10, (beta / 9) || 0));
      const normalizedGamma = Math.max(-10, Math.min(10, (gamma / 4.5) || 0));
      
      setGyroscopePosition({
        x: normalizedGamma,
        y: -normalizedBeta, // Invert for natural feel
      });
    }
  };

  // Get current transform values based on device
  const getTransform = () => {
    if (isMobile && gyroscopeAvailable) {
      return `perspective(1000px) rotateX(${gyroscopePosition.y * 0.5}deg) rotateY(${gyroscopePosition.x * 0.5}deg)`;
    }
    return `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`;
  };

  return (
    <div className='bg-black/90'>
      <section 
      className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-black"
      aria-label="Hero section"
      style={{
        
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Show gyroscope indicator on mobile */}
      {isMobile && gyroscopeAvailable && (
        <div className="fixed bottom-4 left-4 z-50 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/60">
          <span className="flex items-center">
            
            Move your device
          </span>
        </div>
      )}

      {/* 3D Floating Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-indigo-950/50 to-purple-950/50">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* 3D Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: `perspective(500px) rotateX(60deg) scale(2)`,
          transformOrigin: 'top',
        }}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content with 3D effects */}
            <div className="text-center lg:text-left">
              {/* 3D Badge */}
              
              
              {/* 3D Text with depth */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="block transform-gpu hover:translate-z-10 transition-transform duration-300" style={{
                  textShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.3)',
                }}>
                  <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Launch Your
                  </span>
                </span>
                <span className="block transform-gpu hover:translate-z-20 transition-transform duration-300 mt-2" style={{
                  textShadow: '0 15px 40px rgba(0,0,0,0.5), 0 0 60px rgba(168,85,247,0.3)',
                }}>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Online Store
                  </span>
                </span>
                <span className="block transform-gpu hover:translate-z-5 transition-transform duration-300 mt-2" style={{
                  textShadow: '0 5px 20px rgba(0,0,0,0.5)',
                }}>
                  <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    in Minutes
                  </span>
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-blue-100/70 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 drop-shadow-2xl">
                Experience the future of e-commerce. Create your branded store with zero technical skills in an immersive 3D environment.
              </p>
              
              {/* 3D Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                <Link to="/signup" className="w-full sm:w-auto">
                  <button 
                    className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl overflow-hidden transform-gpu hover:scale-105 hover:rotate-1 transition-all duration-300"
                    onMouseEnter={() => setHoveredCard('cta1')}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* 3D Gradient layers */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Floating particles */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredCard === 'cta1' ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="absolute top-0 left-0 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-float"></div>
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-float animation-delay-2000"></div>
                    </div>
                    
                    <span className="relative z-10 flex items-center justify-center space-x-2 text-white font-semibold">
                      <span>Start Now</span>
                      <Rocket className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </button>
                </Link>
                
                <Link to="/pricing" className="w-full sm:w-auto">
                  <button 
                    className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl overflow-hidden transform-gpu hover:scale-105 hover:-rotate-1 transition-all duration-300"
                    onMouseEnter={() => setHoveredCard('cta2')}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl border border-white/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <span className="relative z-10 text-white font-semibold">View Pricing</span>
                  </button>
                </Link>
              </div>
              
              {/* 3D Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                {[
                  { icon: Zap, text: 'No code', color: 'blue' },
                  { icon: Shield, text: 'Secure', color: 'green' },
                  { icon: Globe, text: 'Global', color: 'purple' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group relative transform-gpu hover:scale-110 hover:-translate-y-2 transition-all duration-300"
                    style={{ transitionDelay: `${index * 100}ms` }}
                    onMouseEnter={() => setHoveredCard(`trust-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`absolute inset-0 bg-${item.color}-400/20 blur-xl transition-opacity duration-500 rounded-full ${
                      hoveredCard === `trust-${index}` ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                    
                    <div className="relative flex items-center space-x-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
                      <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right 3D Illustration */}
            <div className="relative hidden lg:block perspective-1000">
              <div 
                className="relative z-10 transform-gpu transition-all duration-300"
                style={{
                  transform: `perspective(1000px) rotateY(${isMobile ? gyroscopePosition.x : mousePosition.x}deg) rotateX(${isMobile ? -gyroscopePosition.y : -mousePosition.y}deg) translateZ(50px)`,
                }}
              >
                {/* Main 3D Card */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 shadow-2xl relative overflow-hidden">
                  {/* 3D Lighting effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                  
                  {/* Floating elements inside card */}
                  <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-float-3d"></div>
                  <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
                  
                  <div className="relative z-10">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-2xl transform-gpu hover:rotate-12 transition-transform duration-300">
                          <Store className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-lg">My Store Dashboard</div>
                          <div className="text-sm text-blue-200/70">storely-eg.com/mystore</div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-green-400/20 border border-green-400/30 rounded-full backdrop-blur-sm">
                        <span className="text-xs text-green-300 font-medium flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse mr-1.5"></span>
                          Live
                        </span>
                      </div>
                    </div>
                    
                    {/* 3D Stats Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { label: 'Orders Today', value: '124', color: 'blue', percentage: 75 },
                        { label: 'Revenue', value: '$2,450', color: 'purple', percentage: 60 },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className="group relative transform-gpu hover:scale-105 hover:-translate-y-2 transition-all duration-300"
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <div className={`absolute inset-0 bg-${stat.color}-400/20 blur-xl rounded-2xl`}></div>
                          <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 overflow-hidden">
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-300 mb-3">{stat.label}</div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-300 rounded-full transition-all duration-1000`}
                                style={{ width: `${stat.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 3D Order List */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-300 flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-blue-400" />
                        Recent Orders
                      </h3>
                      <div className="space-y-2">
                        {[
                          { id: '1234', items: 2, customer: 'John Doe', amount: 89.99 },
                          { id: '1235', items: 3, customer: 'Jane Smith', amount: 129.99 },
                        ].map((order, index) => (
                          <div
                            key={index}
                            className="group relative transform-gpu hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                          >
                            <div className="absolute inset-0 bg-white/5 blur-xl rounded-xl"></div>
                            <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex items-center justify-between">
                              <div>
                                <span className="text-white font-medium">Order #{order.id}</span>
                                <div className="text-xs text-gray-400">{order.items} items • {order.customer}</div>
                              </div>
                              <span className="text-green-400 font-medium">${order.amount}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating 3D elements around card */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl rotate-12 opacity-30 blur-2xl animate-float-3d"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl -rotate-12 opacity-30 blur-2xl animate-float-3d animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Hero;