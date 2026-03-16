// src/pages/customer/Contact.jsx
import React, { useState, useEffect } from 'react';
import {
  Mail, MessageSquare, HelpCircle,
  CheckCircle, Send, Clock, Phone, MessageCircle,
  Headphones, MapPin, Globe, Users, Award,
  ChevronRight, Sparkles, Zap, Shield, Star,
  Layers, Box, Compass, Heart, Gift, Rocket
} from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import Navbar from '../../components/Navbar';

// إضافة أنماط CSS للـ 3D animations
const contactStyles = `
  @keyframes float-3d {
    0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
    25% { transform: translateY(-20px) rotateX(5deg) rotateY(5deg); }
    75% { transform: translateY(20px) rotateX(-5deg) rotateY(-5deg); }
  }

  @keyframes float-particle {
    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(100px) scale(0); opacity: 0; }
  }

  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.5; }
  }

  @keyframes shine-3d {
    0% { background-position: -200px; transform: skewX(-15deg); }
    100% { background-position: 200px; transform: skewX(-15deg); }
  }

  @keyframes glow-pulse {
    0%, 100% { filter: brightness(1) blur(20px); }
    50% { filter: brightness(1.5) blur(30px); }
  }

  .animate-float-3d {
    animation: float-3d 8s ease-in-out infinite;
    transform-style: preserve-3d;
  }

  .animate-float-particle {
    animation: float-particle 8s linear infinite;
  }

  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }

  .animate-shine-3d {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    background-size: 200px 100%;
    animation: shine-3d 3s infinite;
  }

  .animate-glow-pulse {
    animation: glow-pulse 3s ease-in-out infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .perspective-2000 {
    perspective: 2000px;
  }

  .transform-gpu {
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  .transform-style-3d {
    transform-style: preserve-3d;
  }

  .hover-lift-3d {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-lift-3d:hover {
    transform: translateY(-5px) translateZ(20px) rotateX(2deg);
    box-shadow: 0 30px 40px -20px rgba(79, 70, 229, 0.3);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .glass-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .text-shadow-3d {
    text-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.3);
  }

  .grid-3d {
    background-image: 
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
`;

const CustomerContact = () => {
  // Formspree hook
  const [state, handleSubmit] = useForm("xvzbwzaw");
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [hoveredField, setHoveredField] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState(null);

  // بيانات التواصل
  const contactInfo = {
    phone: '+201069700293',
    whatsapp: '201035999541',
    email: 'johnemil21@yahoo.com',
    supportHours: '9AM - 6PM (Egypt Time)',
    address: 'Cairo, Egypt',
    responseTime: {
      email: 'Within 24 hours',
      whatsapp: 'Within 2 hours',
      phone: 'Instant during hours'
    }
  };

  // FAQ data with 3D style
  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'My Orders' section. You'll receive email updates with tracking information once your order ships.",
      color: "blue",
      gradient: "from-blue-400 to-cyan-400"
    },
    
    {
      question: "How can I become a vendor?",
      answer: "Visit our Pricing page and click 'Create Your Store'. You can start selling in minutes with our simple setup process.",
      color: "green",
      gradient: "from-green-400 to-emerald-400"
    },
    
  ];

  // Contact methods with 3D styling
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      value: contactInfo.email,
      link: `mailto:${contactInfo.email}`,
      response: contactInfo.responseTime.email,
      color: "blue",
      gradient: "from-blue-400 to-cyan-400",
      depth: 30
    },
    {
      icon: Phone,
      title: "Phone Support",
      value: contactInfo.phone,
      link: `tel:${contactInfo.phone}`,
      response: contactInfo.supportHours,
      color: "green",
      gradient: "from-green-400 to-emerald-400",
      depth: 40
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Chat on WhatsApp",
      link: `https://wa.me/${contactInfo.whatsapp}`,
      response: contactInfo.responseTime.whatsapp,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-400",
      depth: 50
    },
    {
      icon: MapPin,
      title: "Our Location",
      value: contactInfo.address,
      link: null,
      response: "Headquarters",
      color: "purple",
      gradient: "from-purple-400 to-pink-400",
      depth: 60
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // لو الفورم اتقدم بنجاح
  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md perspective-1000">
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-10 text-center border border-white/20 shadow-2xl transform-gpu animate-float-3d">
            {/* 3D Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-emerald-400/20 rounded-3xl blur-3xl animate-glow-pulse"></div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center h-24 w-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl mb-6 shadow-2xl transform-gpu hover:scale-110 hover:rotate-3 transition-all duration-300">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 text-shadow-3d">Message Received!</h1>
              <p className="text-blue-100/70 mb-8">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl hover:shadow-3d relative overflow-hidden group"
              >
                <span className="relative z-10">Send Another Message</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{contactStyles}</style>
      <Navbar />
      
      <div 
        className="min-h-screen bg-black relative overflow-hidden"
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
          <div className="absolute inset-0 opacity-20 grid-3d" style={{
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

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          {/* Hero Section with 3D effect */}
          <div className="text-center max-w-3xl mx-auto mb-12 perspective-1000">
            <div 
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-2xl text-blue-300 px-4 py-2 rounded-full mb-6 border border-white/20 shadow-2xl transform-gpu hover:scale-105 transition-all duration-300"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
              }}
            >
              <Compass className="h-4 w-4" />
              <span className="text-sm font-medium">3D Contact Experience</span>
            </div>
            
            <h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-shadow-3d"
            >
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent block">
                How Can We Help?
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-2">
                Get in Touch
              </span>
            </h1>
            
            <p className="text-lg text-blue-100/70">
              Reach out to our support team or explore our FAQ for instant answers
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { icon: Award, text: "5-Star Support", color: "blue" },
                { icon: Zap, text: "Fast Response", color: "purple" },
                { icon: Headphones, text: "24/7 Available", color: "green" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                >
                  <stat.icon className={`h-4 w-4 text-${stat.color}-400`} />
                  <span className="text-sm text-gray-300">{stat.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 perspective-2000">
            {/* Contact Form - الجانب الأيسر */}
            <div className="lg:col-span-2">
              <div 
                className="relative transform-gpu transition-all duration-500"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`,
                }}
              >
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden">
                  {/* 3D Lighting */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                  
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <MessageSquare className="h-6 w-6 mr-2 text-blue-400" />
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          onMouseEnter={() => setHoveredField('name')}
                          onMouseLeave={() => setHoveredField(null)}
                          required
                          className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-400 ${
                            focusedField === 'name' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                          }`}
                          placeholder="John Doe"
                          style={{
                            transform: hoveredField === 'name' ? 'translateZ(20px)' : 'translateZ(0)',
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('email')}
                            onMouseLeave={() => setHoveredField(null)}
                            required
                            className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-400 ${
                              focusedField === 'email' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                            }`}
                            placeholder="customer@example.com"
                            style={{
                              transform: hoveredField === 'email' ? 'translateZ(20px)' : 'translateZ(0)',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        What can we help you with?
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-white"
                      >
                        <option value="general" className="bg-gray-900">General Inquiry</option>
                        <option value="order" className="bg-gray-900">Orders Issue</option>
                        <option value="product" className="bg-gray-900">Product Question</option>
                        <option value="returns" className="bg-gray-900">Returns & Refunds</option>
                        <option value="account" className="bg-gray-900">Account Help</option>
                        <option value="vendor" className="bg-gray-900">Become a Vendor</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        onMouseEnter={() => setHoveredField('subject')}
                        onMouseLeave={() => setHoveredField(null)}
                        required
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-400 ${
                          focusedField === 'subject' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                        }`}
                        placeholder="Brief description of your inquiry"
                        style={{
                          transform: hoveredField === 'subject' ? 'translateZ(20px)' : 'translateZ(0)',
                        }}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        onMouseEnter={() => setHoveredField('message')}
                        onMouseLeave={() => setHoveredField(null)}
                        required
                        rows={5}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all resize-none text-white placeholder-gray-400 ${
                          focusedField === 'message' ? 'border-blue-400 bg-white/10' : 'border-white/10'
                        }`}
                        placeholder="Please provide details about your inquiry..."
                        style={{
                          transform: hoveredField === 'message' ? 'translateZ(20px)' : 'translateZ(0)',
                        }}
                      />
                    </div>

                    {/* Validation Errors */}
                    <ValidationError 
                      prefix="Email" 
                      field="email"
                      errors={state.errors}
                      className="text-sm text-red-400 mt-1"
                    />
                    <ValidationError 
                      prefix="Message" 
                      field="message"
                      errors={state.errors}
                      className="text-sm text-red-400 mt-1"
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="w-full py-4 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl hover:shadow-3d disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      {state.submitting ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="relative z-10">Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                          <span className="relative z-10">Send Message</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* 3D Corner decoration */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <Layers className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info & FAQ - الجانب الأيمن */}
            <div className="space-y-6">
              {/* Contact Methods Cards */}
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="relative transform-gpu transition-all duration-500"
                  style={{
                    transform: `perspective(1000px) rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg) translateZ(${hoveredCard === index ? method.depth : 0}px)`,
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative bg-white/10 backdrop-blur-2xl rounded-2xl p-5 border border-white/20 shadow-xl overflow-hidden group">
                    {/* Floating particles on hover */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredCard === index ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float-3d"></div>
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float-3d animation-delay-2000"></div>
                    </div>

                    <div className="flex items-start space-x-4 relative z-10">
                      <div className={`h-14 w-14 rounded-xl bg-gradient-to-r ${method.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <method.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">{method.title}</div>
                        {method.link ? (
                          <a 
                            href={method.link}
                            target={method.link.startsWith('http') ? "_blank" : undefined}
                            rel={method.link.startsWith('http') ? "noopener noreferrer" : undefined}
                            className={`text-sm text-${method.color}-300 hover:text-white transition-colors break-all`}
                          >
                            {method.value}
                          </a>
                        ) : (
                          <p className={`text-sm text-${method.color}-300`}>{method.value}</p>
                        )}
                        <div className="text-xs text-gray-400 mt-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {method.response}
                        </div>
                      </div>
                    </div>

                    {/* 3D Corner decoration */}
                    <div className={`absolute bottom-2 right-2 opacity-10 group-hover:opacity-30 transition-opacity`}>
                      <Gift className={`h-6 w-6 text-${method.color}-400`} />
                    </div>
                  </div>
                </div>
              ))}

              {/* FAQ Section */}
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-purple-400" />
                  Quick Answers
                </h3>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="group relative p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white mb-1">{faq.question}</p>
                          <p className="text-xs text-gray-400">{faq.answer}</p>
                        </div>
                        <ChevronRight className={`h-4 w-4 text-${faq.color}-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1`} />
                      </div>
                      
                      {/* Gradient line on hover */}
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${faq.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span className="font-semibold text-white">Why choose us?</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Star, text: "24/7 Support", color: "yellow" },
                    { icon: Zap, text: "Fast Response", color: "blue" },
                    { icon: Award, text: "5-Star Rating", color: "purple" }
                  ].map((badge, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <badge.icon className={`h-4 w-4 text-${badge.color}-400`} />
                      <span className="text-xs text-gray-300">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3D Stats Bar */}
          <div className="mt-12 relative perspective-1000">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 transform-gpu hover:translate-z-10 transition-all duration-300">
              <div className="flex flex-wrap justify-center items-center gap-8">
                {[
                  { icon: Globe, text: "Serving vendors worldwide", color: "blue" },
                  { icon: Heart, text: "Made with ❤️ in Egypt", color: "red" },
                  { icon: Rocket, text: "24/7 Support Available", color: "purple" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 group">
                    <div className={`p-2 rounded-lg bg-${item.color}-400/10 border border-${item.color}-400/20 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                    </div>
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerContact;