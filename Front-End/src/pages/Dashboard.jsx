import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, LogOut, Package, Users, BarChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('storely_auth_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Store className="h-8 w-8 text-indigo-600" />
              <div>
                <div className="text-xl font-bold text-gray-900">Storely Dashboard</div>
                <div className="text-sm text-gray-500">{t('pages.dashboard.welcome')}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center space-x-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">42</div>
                <div className="text-gray-600">Total Products</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">128</div>
                <div className="text-gray-600">Total Orders</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">$4,280</div>
                <div className="text-gray-600">Revenue</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Your Vendor Dashboard
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This is a placeholder dashboard. In a real application, you would see:
            product management, order tracking, analytics, and store settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;