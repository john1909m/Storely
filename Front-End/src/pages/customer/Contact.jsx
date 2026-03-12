// src/pages/customer/Contact.jsx
import React, { useState, useEffect } from 'react';
import {
  Mail, MessageSquare, HelpCircle,
  CheckCircle, Send, Clock, Phone, MessageCircle,
  Headphones, MapPin, Globe, Users, Award,
  ChevronRight, Sparkles, Zap, Shield, Star
} from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import Navbar from '../../components/Navbar';

// إضافة أنماط CSS للـ animations
const contactStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes shine {
    0% { background-position: -100px; }
    40%, 100% { background-position: 200px; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-shine {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    background-size: 200px 100%;
    animation: shine 3s infinite;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.8s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.8s ease-out forwards;
    opacity: 0;
  }

  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }

  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

  // FAQ data
  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'My Orders' section. You'll receive email updates with tracking information once your order ships."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be unused and in original packaging. Visit our Returns page for detailed instructions."
    },
    {
      question: "How can I become a vendor?",
      answer: "Visit our Pricing page and click 'Create Your Store'. You can start selling in minutes with our simple setup process."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes! We ship to most countries worldwide. Shipping costs and delivery times vary by location."
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // لو الفورم اتقدم بنجاح
  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Received!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{contactStyles}</style>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section مع تحسينات */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
          {/* عناصر زخرفية متحركة */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl" style={{ animation: 'float 3s ease-in-out 1s infinite' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 py-16 md:py-20 text-center relative z-10">
            {/* شارة */}
            <div className="inline-flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in-up">
              
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 animate-fade-in-up delay-100">
              How Can We Help?
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-8 px-4 animate-fade-in-up delay-200">
              Get in touch with our support team or browse our FAQ for quick answers
            </p>
            
            {/* إحصائيات سريعة */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in-up delay-300">
              
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm">5-Star Support</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Fast Response</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16 -mt-8">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Contact Form - الجانب الأيسر */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 animate-slide-in-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2 text-indigo-600" />
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                          focusedField === 'name' ? 'border-indigo-300 bg-white' : 'border-gray-200'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          required
                          className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                            focusedField === 'email' ? 'border-indigo-300 bg-white' : 'border-gray-200'
                          }`}
                          placeholder="customer@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What can we help you with?
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="order">Orders Issue</option>
                      <option value="product">Product Question</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="account">Account Help</option>
                      <option value="vendor">Become a Vendor</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                        focusedField === 'subject' ? 'border-indigo-300 bg-white' : 'border-gray-200'
                      }`}
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={5}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none ${
                        focusedField === 'message' ? 'border-indigo-300 bg-white' : 'border-gray-200'
                      }`}
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  {/* Validation Errors */}
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                    className="text-sm text-red-600 mt-1"
                  />
                  <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                    className="text-sm text-red-600 mt-1"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group hover-lift"
                  >
                    {state.submitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info & FAQ - الجانب الأيمن */}
            <div className="space-y-6 animate-slide-in-right">
              {/* Contact Info Cards */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
                  Contact Information
                </h3>
                
                <div className="space-y-5">
                  {/* Email */}
                  <div className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Email Support</div>
                      <a 
                        href={`mailto:${contactInfo.email}`} 
                        className="text-sm text-gray-600 hover:text-indigo-600 break-all"
                      >
                        {contactInfo.email}
                      </a>
                      <div className="text-xs text-gray-500 mt-1">{contactInfo.responseTime.email}</div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Phone Support</div>
                      <a 
                        href={`tel:${contactInfo.phone}`} 
                        className="text-sm text-gray-600 hover:text-indigo-600"
                      >
                        {contactInfo.phone}
                      </a>
                      <div className="text-xs text-gray-500 mt-1">{contactInfo.supportHours}</div>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">WhatsApp</div>
                      <a 
                        href={`https://wa.me/${contactInfo.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-emerald-600"
                      >
                        Chat on WhatsApp
                      </a>
                      <div className="text-xs text-gray-500 mt-1">{contactInfo.responseTime.whatsapp}</div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Our Location</div>
                      <p className="text-sm text-gray-600">{contactInfo.address}</p>
                      <p className="text-xs text-gray-500 mt-1">Headquarters</p>
                    </div>
                  </div>
                </div>

                {/* Response Time Summary */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="h-5 w-5 text-indigo-600 animate-pulse-slow" />
                      <div className="font-medium text-gray-900">Average Response Time</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Email</div>
                        <div className="font-semibold text-green-600">&lt; 24h</div>
                      </div>
                      <div>
                        <div className="text-gray-500">WhatsApp</div>
                        <div className="font-semibold text-green-600">&lt; 2h</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              

              {/* Trust Badges */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Why choose us?</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Star className="h-4 w-4 fill-current text-yellow-300" />
                    <span>24/7 Customer Support</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="h-4 w-4" />
                    <span>Fast Response Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* خريطة الموقع (اختياري) */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <Globe className="h-4 w-4" />
              <span className="text-sm">Serving vendors worldwide • Made with ❤️ in Egypt</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerContact;