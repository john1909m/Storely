// src/pages/admin/PricingManagement.jsx
import React, { useState } from 'react';
import {
  Plus, Edit, Trash2, ToggleLeft, ToggleRight,
  Check, X, DollarSign, Users, Zap, BarChart
} from 'lucide-react';

const PricingManagement = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Starter',
      description: 'Perfect for new vendors',
      price: 0,
      commission: 10,
      status: 'active',
      features: [
        '1 Store',
        '50 Products',
        'Basic Analytics',
        'Store Customization'
      ],
      limits: {
        stores: 1,
        products: 50,
        storage: '1GB',
        support: 'Email Only'
      }
    },
    {
      id: 2,
      name: 'Professional',
      description: 'Best for growing businesses',
      price: 29,
      commission: 7,
      status: 'active',
      popular: true,
      features: [
        '3 Stores',
        'Unlimited Products',
        'Advanced Analytics',
        'Custom Domain',
        'Email Marketing',
        'Discount Codes'
      ],
      limits: {
        stores: 3,
        products: 'Unlimited',
        storage: '10GB',
        support: 'Priority Email'
      }
    },
    {
      id: 3,
      name: 'Business',
      description: 'For established businesses',
      price: 99,
      commission: 5,
      status: 'active',
      features: [
        'Unlimited Stores',
        'Unlimited Products',
        'Enterprise Analytics',
        'Multiple Domains',
        'API Access',
        'White Label',
        'Dedicated Support',
        'Custom Commission'
      ],
      limits: {
        stores: 'Unlimited',
        products: 'Unlimited',
        storage: '100GB',
        support: '24/7 Dedicated'
      }
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const togglePlanStatus = (planId) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        return { ...plan, status: plan.status === 'active' ? 'inactive' : 'active' };
      }
      return plan;
    }));
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this pricing plan?')) {
      setPlans(plans.filter(plan => plan.id !== planId));
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

  const handleSavePlan = (planData) => {
    if (editingPlan) {
      // Update existing plan
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...planData } : p));
    } else {
      // Add new plan
      const newPlan = {
        id: plans.length + 1,
        ...planData,
        status: 'active'
      };
      setPlans([...plans, newPlan]);
    }
    setShowForm(false);
    setEditingPlan(null);
  };

  const stats = [
    { label: 'Total Plans', value: plans.length, icon: DollarSign },
    { label: 'Active Plans', value: plans.filter(p => p.status === 'active').length, icon: Users },
    { label: 'Most Popular', value: 'Professional', icon: Zap },
    { label: 'Avg. Commission', value: '7.3%', icon: BarChart }
  ];

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
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Plan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-indigo-600" />
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
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border ${
                plan.popular ? 'border-indigo-300 relative' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`h-2 ${
                plan.status === 'active' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  : 'bg-gray-300'
              }`}></div>

              <div className="p-8">
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => togglePlanStatus(plan.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        plan.status === 'active' ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        plan.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                    <span className={`text-sm font-medium ${
                      plan.status === 'active' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <div className="text-gray-600">
                    + {plan.commission}% commission on sales
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limits */}
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-900 mb-3">Plan Limits</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900">{plan.limits.stores}</div>
                      <div className="text-xs text-gray-600">Stores</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900">{plan.limits.products}</div>
                      <div className="text-xs text-gray-600">Products</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900">{plan.limits.storage}</div>
                      <div className="text-xs text-gray-600">Storage</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900">{plan.limits.support}</div>
                      <div className="text-xs text-gray-600">Support</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleEditPlan(plan)}
                    className="flex-1 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-5 w-5" />
                    <span>Edit Plan</span>
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingPlan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const planData = {
                  name: formData.get('name'),
                  description: formData.get('description'),
                  price: parseFloat(formData.get('price')),
                  commission: parseFloat(formData.get('commission')),
                  popular: formData.get('popular') === 'on',
                  features: formData.get('features').split('\n').filter(f => f.trim()),
                  limits: {
                    stores: formData.get('stores'),
                    products: formData.get('products'),
                    storage: formData.get('storage'),
                    support: formData.get('support')
                  }
                };
                handleSavePlan(planData);
              }}>
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plan Name
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
                        Monthly Price ($)
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      defaultValue={editingPlan?.description}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Best for growing businesses"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      name="commission"
                      defaultValue={editingPlan?.commission}
                      required
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features (one per line)
                    </label>
                    <textarea
                      name="features"
                      defaultValue={editingPlan?.features?.join('\n')}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="3 Stores&#10;Unlimited Products&#10;Custom Domain"
                    />
                  </div>

                  {/* Limits */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stores Limit
                      </label>
                      <input
                        type="text"
                        name="stores"
                        defaultValue={editingPlan?.limits?.stores}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="3 or Unlimited"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Products Limit
                      </label>
                      <input
                        type="text"
                        name="products"
                        defaultValue={editingPlan?.limits?.products}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="Unlimited"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage Limit
                      </label>
                      <input
                        type="text"
                        name="storage"
                        defaultValue={editingPlan?.limits?.storage}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="10GB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Level
                      </label>
                      <input
                        type="text"
                        name="support"
                        defaultValue={editingPlan?.limits?.support}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="Priority Email"
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
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
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
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700"
                  >
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Commission Settings */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Commission Settings</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Commission Rate
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  defaultValue="10"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <span className="ml-3 text-gray-600">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Commission
              </label>
              <div className="flex items-center">
                <span className="text-gray-600 mr-3">$</span>
                <input
                  type="number"
                  defaultValue="0.50"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Calculation
              </label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                <option>On total order amount</option>
                <option>On subtotal only</option>
                <option>Excluding shipping</option>
              </select>
            </div>
          </div>
          <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
            Update Commission Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingManagement;