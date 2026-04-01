// src/components/vendor/StoreSettings/PaymentTab.jsx
import React from 'react';
import { Info, Save, Loader2, CreditCard as CardIcon, DollarSign } from 'lucide-react';

const PaymentTab = ({
  paymentStats,
  saving,
  t,
  isMethodActive,
  toggleMethod,
  getMethodAccount,
  updateMethod,
  handleSavePaymentMethods
}) => {
  const availableMethods = [
    { 
      id: 1, 
      name: 'INSTAPAY', 
      displayName: t('vendorStoreDetails.paymentMethods.instapay'), 
      icon: '/instapay.webp', 
      color: 'emerald',
      description: t('vendorStoreDetails.paymentMethods.instapayDescription')
    },
    { 
      id: 2, 
      name: 'VODAFONE_CASH', 
      displayName: t('vendorStoreDetails.paymentMethods.vodafoneCash'), 
      icon: '/vodafoneCash.webp', 
      color: 'red',
      description: t('vendorStoreDetails.paymentMethods.vodafoneCashDescription')
    },
    { 
      id: 3, 
      name: 'COD', 
      displayName: t('vendorStoreDetails.paymentMethods.cod'), 
      icon: null, 
      color: 'blue',
      description: t('vendorStoreDetails.paymentMethods.codDescription')
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
          <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
            <CardIcon className="h-5 w-5 text-green-600" />
          </div>
          {t('vendorStoreDetails.payment.title')}
        </h2>
        <span className="hidden sm:inline text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          {paymentStats.totalActive} {t('vendorStoreDetails.payment.active')}
        </span>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Info className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-1">{t('vendorStoreDetails.payment.configureTitle')}</h3>
            <p className="text-sm text-green-700">{t('vendorStoreDetails.payment.configureDescription')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {availableMethods.map((method) => {
          const isActive = isMethodActive(method.name);
          const bgColor = method.color === 'emerald' ? 'bg-emerald-50' : method.color === 'red' ? 'bg-red-50' : 'bg-blue-50';
          const hoverBorderColor = method.color === 'emerald' ? 'hover:border-emerald-300' : method.color === 'red' ? 'hover:border-red-300' : 'hover:border-blue-300';
          const ringColor = method.color === 'emerald' ? 'ring-emerald-300' : method.color === 'red' ? 'ring-red-300' : 'ring-blue-300';
          const peerBgColor = method.color === 'emerald' ? 'peer-checked:bg-emerald-600' : method.color === 'red' ? 'peer-checked:bg-red-600' : 'peer-checked:bg-blue-600';
          
          return (
            <div key={method.id} className={`bg-gray-50 rounded-xl p-6 border border-gray-200 ${hoverBorderColor} transition-all`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`h-14 w-14 ${bgColor} rounded-xl flex items-center justify-center`}>
                    {method.icon ? (
                      <img src={method.icon} alt={method.displayName} className="h-10 w-10 object-contain" />
                    ) : (
                      <DollarSign className="h-7 w-7 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{method.displayName}</h3>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleMethod(method.name)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${ringColor} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${peerBgColor}`}></div>
                </label>
              </div>

              {isActive && method.name !== 'COD' && (
                <div className="space-y-4 mt-4 pt-4 border-t border-gray-200 animate-slide-down">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('vendorStoreDetails.payment.accountName')}
                    </label>
                    <input
                      type="text"
                      value={getMethodAccount(method.name, 'accountName')}
                      onChange={(e) => updateMethod(method.name, 'accountName', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      placeholder={t('vendorStoreDetails.payment.accountNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('vendorStoreDetails.payment.accountNumber')}
                    </label>
                    <input
                      type="text"
                      value={getMethodAccount(method.name, 'accountNumber')}
                      onChange={(e) => updateMethod(method.name, 'accountNumber', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      placeholder="01012345678"
                    />
                  </div>
                </div>
              )}

              {isActive && method.name === 'COD' && (
                <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-down">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800">{t('vendorStoreDetails.payment.codEnabledMessage')}</p>
                        <p className="text-xs text-blue-600 mt-1">{t('vendorStoreDetails.payment.codNote')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{paymentStats.totalActive}</div>
            <div className="text-xs text-gray-600">{t('vendorStoreDetails.payment.activeMethods')}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${paymentStats.instapayConfigured ? 'text-emerald-600' : 'text-gray-400'}`}>
              {paymentStats.instapayConfigured ? '✓' : '✗'}
            </div>
            <div className="text-xs text-gray-600">{t('vendorStoreDetails.paymentMethods.instapay')}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${paymentStats.vodafoneConfigured ? 'text-red-600' : 'text-gray-400'}`}>
              {paymentStats.vodafoneConfigured ? '✓' : '✗'}
            </div>
            <div className="text-xs text-gray-600">{t('vendorStoreDetails.paymentMethods.vodafoneCash')}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${paymentStats.codEnabled ? 'text-blue-600' : 'text-gray-400'}`}>
              {paymentStats.codEnabled ? '✓' : '✗'}
            </div>
            <div className="text-xs text-gray-600">{t('vendorStoreDetails.paymentMethods.cod')}</div>
          </div>
        </div>
      </div>

      {/* Save Payment Methods Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSavePaymentMethods}
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t('vendorStoreDetails.buttons.savingPaymentMethods')}</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>{t('vendorStoreDetails.buttons.savePaymentMethods')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentTab;