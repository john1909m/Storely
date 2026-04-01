// Admin Settings Page
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/dashboard"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('adminPages.settings.title')}</h1>
              <p className="text-gray-600">{t('adminPages.settings.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('adminPages.settings.comingSoon')}</h3>
          <p className="text-gray-600">{t('adminPages.settings.message')}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
