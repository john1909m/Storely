// src/pages/customer/Contact.jsx
import React, { useState } from 'react';
import {
  Mail, MessageSquare, HelpCircle,
  CheckCircle, Send, Clock, Phone, MessageCircle,
  Headphones, MapPin, Globe, Award,
  ChevronRight, Zap, Shield, Star, Heart, Rocket, Gift
} from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import Navbar from '../../components/Navbar';

const CustomerContact = () => {
  const [state, handleSubmit] = useForm("xvzbwzaw");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [focusedField, setFocusedField] = useState(null);

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

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'My Orders' section. You'll receive email updates with tracking information once your order ships.",
    },
    {
      question: "How can I become a vendor?",
      answer: "Visit our Pricing page and click 'Create Your Store'. You can start selling in minutes with our simple setup process.",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      value: contactInfo.email,
      link: `mailto:${contactInfo.email}`,
      response: contactInfo.responseTime.email,
    },
    {
      icon: Phone,
      title: "Phone Support",
      value: contactInfo.phone,
      link: `tel:${contactInfo.phone}`,
      response: contactInfo.supportHours,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Chat on WhatsApp",
      link: `https://wa.me/${contactInfo.whatsapp}`,
      response: contactInfo.responseTime.whatsapp,
    },
    {
      icon: MapPin,
      title: "Our Location",
      value: contactInfo.address,
      link: null,
      response: "Headquarters",
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Success state
  if (state.succeeded) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#800020]">
        {/* Background layers (matches Landing/Login) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2e000b]"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]"></div>
          <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]"></div>
        </div>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#a8002b]/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#800020]/40 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="relative bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>

            <div className="p-10 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-[#800020] rounded-2xl mb-6 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                Message Received!
              </h1>
              <p className="text-gray-500 mb-8">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-3.5 bg-[#800020] text-white font-semibold rounded-xl hover:bg-[#6a001a] transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen relative overflow-hidden bg-[#800020] pt-20">

        {/* ✅ Layer 1: Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2e000b]"></div>

        {/* ✅ Layer 2: Radial lights */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]"></div>
          <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]"></div>
        </div>

        {/* ✅ Layer 3: Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          }}
        ></div>

        {/* ✅ Layer 4: Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)',
          }}
        ></div>

        {/* ✅ Layer 5: Grain */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* ✅ Decorative circles */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#a8002b]/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#800020]/40 rounded-full blur-[120px] pointer-events-none"></div>

        {/* ✅ Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/[0.04] pointer-events-none hidden lg:block"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              <span className="text-xs font-medium text-white/85 tracking-wide uppercase">
                Contact Support
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
              <span className="block text-white">How Can We Help?</span>
              <span className="block mt-2 text-white/60">Get in Touch</span>
            </h1>

            <div className="w-16 h-1 bg-white/30 rounded-full mb-6 mx-auto"></div>

            <p className="text-lg text-white/70 leading-relaxed">
              Reach out to our support team or explore our FAQ for instant answers
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8">
              {[
                { icon: Award, text: "5-Star Support" },
                { icon: Zap, text: "Fast Response" },
                { icon: Headphones, text: "24/7 Available" }
              ].map((stat, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
                    <stat.icon className="h-3.5 w-3.5 text-white/90" />
                  </div>
                  <span className="text-sm text-white/75 font-medium">{stat.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* Contact Form — Left (2 cols) */}
            <div className="lg:col-span-2">
              <div className="relative bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>

                <div className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-[#800020]" />
                    Send us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                          className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 ${
                            focusedField === 'name'
                              ? 'border-[#800020] ring-2 ring-[#800020]/10'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                              focusedField === 'email' ? 'text-[#800020]' : 'text-gray-400'
                            }`}
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            required
                            className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 ${
                              focusedField === 'email'
                                ? 'border-[#800020] ring-2 ring-[#800020]/10'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            placeholder="customer@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        What can we help you with?
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none text-gray-900 focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/10 hover:border-gray-300 transition-all"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                        className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 ${
                          focusedField === 'subject'
                            ? 'border-[#800020] ring-2 ring-[#800020]/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                        className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all resize-none text-gray-900 placeholder-gray-400 ${
                          focusedField === 'message'
                            ? 'border-[#800020] ring-2 ring-[#800020]/10'
                            : 'border-gray-200 hover:border-gray-300'
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

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="w-full py-3.5 bg-[#800020] text-white font-semibold rounded-xl hover:bg-[#6a001a] transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {state.submitting ? (
                        <>
                          <div className="h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4.5 w-4.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right column — Contact Methods + FAQ + Trust */}
            <div className="space-y-6">

              {/* Contact Methods */}
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 p-5 hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="h-11 w-11 rounded-lg bg-[#800020]/10 flex items-center justify-center flex-shrink-0">
                      <method.icon className="h-5 w-5 text-[#800020]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 mb-1 text-sm">
                        {method.title}
                      </div>
                      {method.link ? (
                        <a
                          href={method.link}
                          target={method.link.startsWith('http') ? "_blank" : undefined}
                          rel={method.link.startsWith('http') ? "noopener noreferrer" : undefined}
                          className="text-sm text-[#800020] hover:text-[#660019] transition-colors break-all"
                        >
                          {method.value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-600">{method.value}</p>
                      )}
                      <div className="text-xs text-gray-400 mt-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {method.response}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* FAQ */}
              <div className="bg-white rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#800020] via-[#a8002b] to-[#800020]"></div>
                <div className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                    <HelpCircle className="h-4.5 w-4.5 mr-2 text-[#800020]" />
                    Quick Answers
                  </h3>

                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="group p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#800020]/20 hover:bg-[#800020]/5 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {faq.question}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[#800020] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 p-5">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-4.5 w-4.5 text-[#800020]" />
                  <span className="font-semibold text-gray-900 text-sm">Why choose us?</span>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Star, text: "24/7 Support" },
                    { icon: Zap, text: "Fast Response" },
                    { icon: Award, text: "5-Star Rating" }
                  ].map((badge, index) => (
                    <div key={index} className="flex items-center space-x-2.5">
                      <div className="h-7 w-7 rounded-md bg-[#800020]/10 flex items-center justify-center flex-shrink-0">
                        <badge.icon className="h-3.5 w-3.5 text-[#800020]" />
                      </div>
                      <span className="text-sm text-gray-600">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6">
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                {[
                  { icon: Globe, text: "Serving vendors worldwide" },
                  { icon: Heart, text: "Made with ❤️ in Egypt" },
                  { icon: Rocket, text: "24/7 Support Available" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="h-7 w-7 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
                      <item.icon className="h-3.5 w-3.5 text-white/90" />
                    </div>
                    <span className="text-sm text-white/75 font-medium">{item.text}</span>
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