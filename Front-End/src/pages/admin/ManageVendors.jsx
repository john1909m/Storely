// Admin Manage Vendors Page
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';

const ManageVendors = () => {
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Vendors</h1>
              <p className="text-gray-600">View and manage all vendors</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-600">Vendor management features will be available here</p>
        </div>
      </div>
    </div>
  );
};

export default ManageVendors;
