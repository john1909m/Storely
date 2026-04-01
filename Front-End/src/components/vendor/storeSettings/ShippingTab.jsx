// src/components/vendor/StoreSettings/ShippingTab.jsx
import React from 'react';
import { Truck, Loader2, Check, X, Edit3 } from 'lucide-react';

const ShippingTab = ({
  governorates,
  shippingCosts,
  loadingGovernorates,
  editingShippingId,
  tempShippingPrice,
  t,
  formatPrice,
  getGovernorateName,
  getShippingCost,
  isShippingSelected,
  handleShippingToggle,
  startEditingShipping,
  saveEditingShipping,
  cancelEditingShipping,
  setTempShippingPrice
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
          <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
            <Truck className="h-5 w-5 text-blue-600" />
          </div>
          {t('vendorStoreDetails.shipping.title')}
        </h2>
      </div>

      {loadingGovernorates ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">{t('vendorStoreDetails.shipping.settingsTitle')}</h3>
                <p className="text-sm text-blue-700">
                  {t('vendorStoreDetails.shipping.settingsDescription', { configured: shippingCosts.length, total: governorates.length })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {governorates.map((gov) => {
              const isSelected = isShippingSelected(gov.id);
              const cost = getShippingCost(gov.id);
              const isEditing = editingShippingId === gov.id;

              return (
                <div
                  key={gov.id}
                  className={`bg-gray-50 rounded-xl p-4 border transition-all ${
                    isSelected 
                      ? 'border-indigo-300 bg-indigo-50/30' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleShippingToggle(gov.id)}
                        className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{getGovernorateName(gov.id)}</h4>
                        <p className="text-xs text-gray-500">ID: {gov.id}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">EGP</span>
                              <input
                                type="number"
                                value={tempShippingPrice}
                                onChange={(e) => setTempShippingPrice(e.target.value)}
                                min="0"
                                step="1"
                                className="w-28 pl-12 pr-3 py-2 bg-white border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                autoFocus
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    saveEditingShipping(gov.id);
                                  }
                                }}
                              />
                            </div>
                            <button
                              onClick={() => saveEditingShipping(gov.id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditingShipping}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatPrice(cost)}
                              </span>
                            </div>
                            <button
                              onClick={() => startEditingShipping({ governorateId: gov.id, price: cost })}
                              className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ShippingTab;