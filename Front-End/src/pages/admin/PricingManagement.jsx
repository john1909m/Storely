// src/pages/admin/PricingManagement.jsx - Updated with API Integration
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, ToggleLeft, ToggleRight,
  Check, X, DollarSign, Users, Zap, BarChart,
  Save, Loader2
} from 'lucide-react';
import { pricingAPI } from '../../api/pricing.api';

const PricingManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pricingAPI.getPlans();
      setPlans(Array.isArray(data) 
      ? data.sort((a, b) => (a.price || 0) - (b.price || 0))
      : []);
    } catch (err) {
      setError(err.message || 'Failed to load pricing plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePlanStatus = async (plan) => {
    try {
      const newStatus = plan.isActive === true ? false : true;
      const updatedPlan = { ...plan, isActive: newStatus };
      
      await pricingAPI.updatePlan(updatedPlan);
      
      setPlans(plans.map(p => p.id === plan.id ? updatedPlan : p));
    } catch (err) {
      alert(`Failed to update plan status: ${err.message}`);
      console.error('Error updating plan status:', err);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this pricing plan? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(planId);
      await pricingAPI.deletePlan(planId);
      setPlans(plans.filter(plan => plan.id !== planId));
    } catch (err) {
      alert(`Failed to delete plan: ${err.message}`);
      console.error('Error deleting plan:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleAddPlan = () => {
    setEditingPlan(null);
    setShowForm(true);
  };

  const handleSavePlan = async (planData) => {
    try {
      setSaving(true);
      
      if (editingPlan) {
        // Update existing plan
        const updatedPlan = { 
          ...editingPlan, 
          ...planData,
          // Ensure isActive is preserved if not in planData
          isActive: editingPlan.isActive !== undefined ? editingPlan.isActive : true
        };
        
        const result = await pricingAPI.updatePlan(updatedPlan);
        setPlans(plans.map(p => p.id === editingPlan.id ? result : p));
        fetchPlans();
      } else {
        // Add new plan - Create proper object structure
        const newPlan = {
          name: planData.name || '',
          price: planData.price || 0,
          popular: planData.popular || false,
          features: Array.isArray(planData.features) ? planData.features : 
                   typeof planData.features === 'string' ? planData.features.split('\n').filter(f => f.trim()) : [],
          productLimit: planData.productLimit || 'Unlimited',
          isActive: true  
        };
        
        const createdPlan = await pricingAPI.addPlan(newPlan);
        // Make sure createdPlan has all required properties
        const completePlan = {
          ...createdPlan,
          features: createdPlan.features || newPlan.features,
          productLimit: createdPlan.productLimit || newPlan.productLimit,
          isActive: createdPlan.isActive !== undefined ? createdPlan.isActive : true
        };
        setPlans(prevPlans => [...prevPlans, completePlan]);
        fetchPlans();
      }
      
      setShowForm(false);
      setEditingPlan(null);
    } catch (err) {
      alert(`Failed to save plan: ${err.message}`);
      console.error('Error saving plan:', err);
    } finally {
      setSaving(false);
    }
  };



  const stats = [
    { 
      label: 'Total Plans', 
      value: plans.length, 
      icon: DollarSign,
      color: 'indigo'
    },
    { 
      label: 'Active Plans', 
      value: plans.filter(p => p.isActive === true).length, 
      icon: Users,
      color: 'green'
    },
    
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing plans...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing Management</h1>
              <p className="text-gray-600">Configure and manage pricing plans for vendors</p>
            </div>
            <button
              onClick={handleAddPlan}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center space-x-2 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Plan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={fetchPlans}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2  gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className={`h-12 w-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Plans */}
        {plans.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center mb-12">
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Pricing Plans Yet</h3>
            <p className="text-gray-600 mb-6">Create your first pricing plan to get started</p>
            <button
              onClick={handleAddPlan}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700"
            >
              Create First Plan
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl relative ${
                  plan.popular 
                    ? 'border-indigo-400 relative border-opacity-60' 
                    : 'border-gray-100 hover:border-indigo-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2  z-10 w-[215px] h-[20px]">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl animate-pulse border-2 border-white text-center">
                      ✨ MOST POPULAR ✨
                    </div>
                  </div>
                )}

                {/* Status Indicator Ribbon */}
                <div className={`absolute top-0 right-0 z-10 px-4 py-1.5 text-xs font-bold rounded-bl-lg shadow-md ${
                  plan.isActive === true 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-100'
                }`}>
                  {plan.isActive === true ? 'ACTIVE' : 'INACTIVE'}
                </div>

                {/* Gradient Header */}
                <div className={`relative overflow-hidden ${
                  plan.isActive === true 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                    : 'bg-gradient-to-r from-gray-300 to-gray-400'
                }`}>
                  <div className="absolute inset-0 bg-grid-white/10"></div>
                  <div className="p-8 relative">
                    <div className="flex items-center justify-between mb-4 mt-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">{plan.name}</h3>
                        <p className="text-indigo-100 text-opacity-90 mt-1">{plan.description}</p>
                      </div>
                      <button
                        onClick={() => togglePlanStatus(plan)}
                        disabled={saving}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${
                          plan.isActive === true 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                      >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                          plan.isActive === true ? 'translate-x-8' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 inline-block">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-white drop-shadow-lg">{plan.price || 0}</span>
                        <span className="text-indigo-100 ml-2 text-lg">EGP</span>
                        <span className="text-indigo-100 ml-1 text-sm opacity-90">/month</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Content */}
                <div className="p-8">
                  {/* Features Section */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <Check className="h-5 w-5 text-indigo-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Features Included</h4>
                    </div>
                    
                    <div className="space-y-3">
                      {(plan.features || []).map((feature, index) => (
                        <div 
                          key={index} 
                          className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors duration-200 group"
                        >
                          <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-gray-700 group-hover:text-indigo-700 transition-colors">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Limits Section */}
                  {plan.productLimit && (
                    <div className="mb-8 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900">Plan Limits</h4>
                        </div>
                        <div className="text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                          {plan.productLimit === 'Unlimited' ? 'UNLIMITED' : `${plan.productLimit} MAX`}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div className="relative w-full">
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                plan.productLimit === 'Unlimited' 
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                  : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                              }`}
                              style={{ 
                                width: plan.productLimit === 'Unlimited' 
                                  ? '100%' 
                                  : plan.productLimit <= 10 
                                    ? '25%' 
                                    : plan.productLimit <= 50 
                                      ? '50%' 
                                      : '75%' 
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-500">Products</span>
                            <span className="text-sm font-semibold text-gray-700">{plan.productLimit || 'Unlimited'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <Edit className="h-5 w-5" />
                      <span className="font-semibold">Edit Plan</span>
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      disabled={deletingId === plan.id}
                      className="p-3.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === plan.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-50"></div>
              </div>
            ))}
          </div>
        )}

        {/* Plan Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPlan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingPlan(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                const planData = {
                  name: formData.get('name'),
                  price: parseFloat(formData.get('price')) || 0,
                  popular: formData.get('popular') === 'on',
                  features: formData.get('features').split('\n').filter(f => f.trim()),
                  productLimit: formData.get('products'),
                };
                
                await handleSavePlan(planData);
              }}>
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plan Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingPlan?.name}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="Professional"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Price (EGP) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        defaultValue={editingPlan?.price}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features (one per line) *
                    </label>
                    <textarea
                      name="features"
                      defaultValue={editingPlan?.features?.join('\n')}
                      rows={4}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="3 Stores&#10;Unlimited Products&#10;Custom Domain"
                    />
                  </div>

                  {/* Limits */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Products Limit *
                      </label>
                      <input
                        type="text"
                        name="products"
                        defaultValue={editingPlan?.productLimit}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>

                  {/* Popular Plan Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="popular"
                      id="popular"
                      defaultChecked={editingPlan?.popular}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor="popular" className="ml-3 text-gray-700">
                      Mark as "Most Popular" plan
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPlan(null);
                    }}
                    disabled={saving}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>{editingPlan ? 'Update Plan' : 'Create Plan'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default PricingManagement;