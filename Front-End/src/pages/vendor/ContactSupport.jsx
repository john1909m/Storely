// src/pages/vendor/ContactSupport.jsx
import React, { useState } from 'react';
import {
  Mail, Phone, MessageSquare, Clock,
  FileText, HelpCircle, CheckCircle,
  Upload, Send, AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactSupport = () => {
  const { t } = useTranslation();
  const [contactType, setContactType] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal',
    orderId: '',
    attachments: []
  });

  const contactTypes = [
    { id: 'general', label: t('vendor.contactSupport.contactTypes.general'), icon: HelpCircle },
    { id: 'technical', label: t('vendor.contactSupport.contactTypes.technical'), icon: AlertCircle },
    { id: 'billing', label: t('vendor.contactSupport.contactTypes.billing'), icon: FileText },
    { id: 'account', label: t('vendor.contactSupport.contactTypes.account'), icon: CheckCircle },
    { id: 'feature', label: t('vendor.contactSupport.contactTypes.feature'), icon: MessageSquare },
    { id: 'other', label: t('vendor.contactSupport.contactTypes.other'), icon: HelpCircle }
  ];

  const faqs = [
    {
      q: t('vendor.contactSupport.faqs.changePlan.q'),
      a: t('vendor.contactSupport.faqs.changePlan.a')
    },
    {
      q: t('vendor.contactSupport.faqs.commissionFees.q'),
      a: t('vendor.contactSupport.faqs.commissionFees.a')
    },
    {
      q: t('vendor.contactSupport.faqs.storeApproval.q'),
      a: t('vendor.contactSupport.faqs.storeApproval.a')
    },
    {
      q: t('vendor.contactSupport.faqs.digitalProducts.q'),
      a: t('vendor.contactSupport.faqs.digitalProducts.a')
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.slice(0, 3)] // Limit to 3 files
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('vendor.contactSupport.success.title')}</h1>
            <p className="text-gray-600 mb-6">
              {t('vendor.contactSupport.success.thankYou')}
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="font-semibold text-gray-900 mb-1">
                  {t('vendor.contactSupport.success.referenceLabel')} SUP-{Date.now().toString().slice(-6)}
                </div>
                <div className="text-sm text-gray-600">{t('vendor.contactSupport.success.keepForRecords')}</div>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                {t('vendor.contactSupport.success.sendAnother')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('vendor.contactSupport.header.title')}</h1>
              <p className="text-gray-600">{t('vendor.contactSupport.header.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{t('vendor.contactSupport.header.responseTime')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('vendor.contactSupport.form.title')}</h2>

              {/* Contact Type Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {t('vendor.contactSupport.form.helpNeeded')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {contactTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setContactType(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          contactType === type.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                            contactType === type.id
                              ? 'bg-indigo-100 text-indigo-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="font-medium text-gray-900">{type.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('vendor.contactSupport.form.nameLabel')}
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
                      {t('vendor.contactSupport.form.emailLabel')}
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
                        placeholder="vendor@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject & Priority */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('vendor.contactSupport.form.subjectLabel')}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('vendor.contactSupport.form.priorityLabel')}
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    >
                      <option value="low">{t('vendor.contactSupport.priorityOptions.low')}</option>
                      <option value="normal">{t('vendor.contactSupport.priorityOptions.normal')}</option>
                      <option value="high">{t('vendor.contactSupport.priorityOptions.high')}</option>
                      <option value="critical">{t('vendor.contactSupport.priorityOptions.critical')}</option>
                    </select>
                  </div>
                </div>

                {/* Order ID (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vendor.contactSupport.form.orderIdLabel')}
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="ORD-1234"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vendor.contactSupport.form.messageLabel')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Please provide as much detail as possible about your issue..."
                  />
                </div>

                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vendor.contactSupport.form.attachmentsLabel')}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      {t('vendor.contactSupport.form.uploadHint')}
                    </p>
                    <input
                      type="file"
                      id="attachments"
                      onChange={handleFileUpload}
                      multiple
                      className="hidden"
                    />
                    <label
                      htmlFor="attachments"
                      className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 cursor-pointer"
                    >
                      {t('vendor.contactSupport.form.chooseFiles')}
                    </label>
                    <p className="text-sm text-gray-500 mt-4">
                      {t('vendor.contactSupport.form.maxFilesNote')}
                    </p>
                  </div>

                  {/* Attached Files Preview */}
                  {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            {t('vendor.contactSupport.form.remove')}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('vendor.contactSupport.form.sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>{t('vendor.contactSupport.form.send')}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Contact Info & FAQ */}
          <div>
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
              <h3 className="font-semibold text-gray-900 mb-6">{t('vendor.contactSupport.sidebar.contactInfoTitle')}</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('vendor.contactSupport.sidebar.emailSupport')}</div>
                    <div className="text-gray-600">{t('vendor.contactSupport.sidebar.emailValue')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('vendor.contactSupport.sidebar.liveChat')}</div>
                    <div className="text-gray-600">{t('vendor.contactSupport.sidebar.liveChatValue')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('vendor.contactSupport.sidebar.phoneSupport')}</div>
                    <div className="text-gray-600">{t('vendor.contactSupport.sidebar.phoneValue')}</div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="font-medium text-gray-900">{t('vendor.contactSupport.sidebar.businessHours')}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('vendor.contactSupport.sidebar.monFri')}</span>
                    <span className="font-medium">{t('vendor.contactSupport.sidebar.monFriValue')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('vendor.contactSupport.sidebar.sat')}</span>
                    <span className="font-medium">{t('vendor.contactSupport.sidebar.satValue')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('vendor.contactSupport.sidebar.sun')}</span>
                    <span className="font-medium">{t('vendor.contactSupport.sidebar.closed')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-6">{t('vendor.contactSupport.sidebar.faqTitle')}</h3>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <div className="font-medium text-gray-900 mb-2">{faq.q}</div>
                    <div className="text-sm text-gray-600">{faq.a}</div>
                    {index < faqs.length - 1 && (
                      <div className="mt-4 border-t border-gray-100"></div>
                    )}
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 text-indigo-600 hover:text-indigo-500 font-medium">
                {t('vendor.contactSupport.sidebar.viewAllFaqs')}
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('vendor.contactSupport.sidebar.quickLinksTitle')}</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-700 hover:text-indigo-600">
                  {t('vendor.contactSupport.sidebar.quickLinks.docs')}
                </a>
                <a href="#" className="block text-gray-700 hover:text-indigo-600">
                  {t('vendor.contactSupport.sidebar.quickLinks.api')}
                </a>
                <a href="#" className="block text-gray-700 hover:text-indigo-600">
                  {t('vendor.contactSupport.sidebar.quickLinks.forum')}
                </a>
                <a href="#" className="block text-gray-700 hover:text-indigo-600">
                  {t('vendor.contactSupport.sidebar.quickLinks.status')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;