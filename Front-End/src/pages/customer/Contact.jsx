// src/pages/customer/Contact.jsx
import React, { useState } from 'react';
import {
  Mail, MessageSquare, HelpCircle,
  CheckCircle, Send, Clock, Phone, MessageCircle
} from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

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

  // بيانات التواصل
  const contactInfo = {
    phone: '+201200158852', // غير الرقم ده لرقمك الفعلي
    whatsapp: '201200158852', // رقم الواتساب بدون + (مثال: 201012345678)
    email: 'johnemil21@yahoo.com',
    supportHours: '9AM - 6PM (Egypt Time)'
  };

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // لو الفورم اتقدم بنجاح
  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Received!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How Can We Help?</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Get in touch with our support team or browse our FAQ for quick answers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                        required
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                {/* Validation Errors from Formspree */}
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
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {state.submitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email Support</div>
                    <a href={`mailto:${contactInfo.email}`} className="text-gray-600 hover:text-indigo-600">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {/* Phone - جديد */}
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Phone Support</div>
                    <a href={`tel:${contactInfo.phone}`} className="text-gray-600 hover:text-indigo-600">
                      {contactInfo.phone}
                    </a>
                    <div className="text-xs text-gray-500 mt-1">{contactInfo.supportHours}</div>
                  </div>
                </div>

                {/* WhatsApp - جديد */}
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">WhatsApp</div>
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-emerald-600"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Live Chat */}
                
              </div>

              {/* Response Time */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="font-medium text-gray-900">Response Time</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email/Form</span>
                    <span className="font-medium">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">WhatsApp</span>
                    <span className="font-medium">Within 2 hours</span>
                  </div>
                  
                </div>
              </div>
            </div>


            
          </div>
        </div>


        
      </div>
    </div>
  );
};

export default CustomerContact;