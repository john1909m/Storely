// src/components/vendor/StoreSettings/DepositTab.jsx
import React from 'react';
import { Wallet, CreditCard, Truck, Info, Eye, Save, Loader2 } from 'lucide-react';

const DepositTab = ({
  depositSettings,
  t,
  formatPrice,
  saving,
  handleDepositChange,
  handleSaveDeposit
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
          <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center mr-3">
            <Wallet className="h-5 w-5 text-amber-600" />
          </div>
          {t('vendorStoreDetails.deposit.title')}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Deposit Required Toggle */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('vendorStoreDetails.deposit.requireDeposit')}</h3>
                <p className="text-sm text-gray-600">{t('vendorStoreDetails.deposit.requireDepositDescription')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={depositSettings.depositRequired}
                onChange={(e) => handleDepositChange('depositRequired', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
        </div>

        {/* Deposit Calculation Method */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t('vendorStoreDetails.deposit.calculationMethod')}
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleDepositChange('depositType', 'PERCENTAGE')}
              className={`p-4 border-2 rounded-xl transition-all flex flex-col items-center ${
                depositSettings.depositType === 'PERCENTAGE'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-2 ${
                depositSettings.depositType === 'PERCENTAGE' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <span className="text-xl font-bold">%</span>
              </div>
              <span className="font-medium text-gray-900">{t('vendorStoreDetails.deposit.percentage')}</span>
              <span className="text-xs text-gray-500 mt-1">{t('vendorStoreDetails.deposit.percentageDescription')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDepositChange('depositType', 'SHIPPING')}
              className={`p-4 border-2 rounded-xl transition-all flex flex-col items-center ${
                depositSettings.depositType === 'SHIPPING'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-2 ${
                depositSettings.depositType === 'SHIPPING' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <Truck className="h-6 w-6" />
              </div>
              <span className="font-medium text-gray-900">{t('vendorStoreDetails.deposit.shippingCost')}</span>
              <span className="text-xs text-gray-500 mt-1">{t('vendorStoreDetails.deposit.shippingCostDescription')}</span>
            </button>
          </div>
        </div>

        {/* Deposit Percentage */}
        {depositSettings.depositType === 'PERCENTAGE' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('vendorStoreDetails.deposit.percentageValue')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                %
              </span>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={depositSettings.depositValue}
                onChange={(e) => handleDepositChange('depositValue', parseFloat(e.target.value) || 0)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all focus:bg-white"
                placeholder="10"
              />
            </div>
          </div>
        )}

        {/* Shipping Info */}
        {depositSettings.depositType === 'SHIPPING' && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">{t('vendorStoreDetails.deposit.shippingInfoTitle')}</p>
                <p className="text-xs text-blue-600 mt-1">{t('vendorStoreDetails.deposit.shippingInfoDescription')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods for Deposit */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
            {t('vendorStoreDetails.deposit.paymentMethods')}
          </h3>
          
          {/* Instapay */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('vendorStoreDetails.deposit.instapayNumber')}
            </label>
            <div className="relative">
              <img className="absolute left-4 top-1/2 transform -translate-y-1/2 scale-150 h-5 w-5 text-gray-400" src="/instapay.webp" alt="Instapay" />
              <input
                type="text"
                value={depositSettings.instapayNumber}
                onChange={(e) => handleDepositChange('instapayNumber', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all focus:bg-white"
                placeholder="01012345678"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 flex items-center">
              <Info className="h-3 w-3 mr-1 text-amber-500" />
              {t('vendorStoreDetails.deposit.instapayHint')}
            </p>
          </div>

          {/* Vodafone Cash */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('vendorStoreDetails.deposit.vodafoneCashNumber')}
            </label>
            <div className="relative">
              <img className="absolute left-4 top-1/2 transform -translate-y-1/2 scale-125 h-5 w-7 text-gray-400" src="/vodafoneCash.webp" alt="Vodafone Cash" />
              <input
                type="text"
                value={depositSettings.vodafoneCashNumber}
                onChange={(e) => handleDepositChange('vodafoneCashNumber', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all focus:bg-white"
                placeholder="01012345678"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 flex items-center">
              <Info className="h-3 w-3 mr-1 text-amber-500" />
              {t('vendorStoreDetails.deposit.vodafoneCashHint')}
            </p>
          </div>

          {/* Help Text */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium">{t('vendorStoreDetails.deposit.important')}</p>
                <p className="text-xs text-amber-700 mt-1">{t('vendorStoreDetails.deposit.importantMessage')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Preview */}
        <div className="pt-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white">
            <h3 className="font-semibold mb-3 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              {t('vendorStoreDetails.deposit.preview')}
            </h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span>{t('vendorStoreDetails.deposit.orderTotalExample')}</span>
                <span className="font-bold">1,000 EGP</span>
              </div>
              <div className="flex justify-between items-center text-amber-100">
                <span>{t('vendorStoreDetails.deposit.deposit')}</span>
                <span className="font-bold text-white">
                  {depositSettings.depositType === 'PERCENTAGE' 
                    ? `${(1000 * (depositSettings.depositValue / 100)).toFixed(0)} EGP`
                    : depositSettings.depositType === 'SHIPPING'
                      ? t('vendorStoreDetails.deposit.shippingCostExample')
                      : `${depositSettings.depositValue} EGP`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveDeposit}
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t('vendorStoreDetails.buttons.saving')}</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>{t('vendorStoreDetails.buttons.saveDepositSettings')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositTab;