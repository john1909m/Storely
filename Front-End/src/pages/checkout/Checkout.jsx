// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, CreditCard, Lock, Truck,
  MapPin, User, Mail, Phone,
  CheckCircle, Shield, Loader2,
  ShoppingBag, AlertCircle, Package, Palette, Ruler, ChevronDown,
  Wallet, Camera, Upload, X, Smartphone, Copy,
  DollarSign, Banknote, QrCode
} from 'lucide-react';
import { orderAPI } from '../../api/order.api';
import { customerAPI } from '../../api/customer.api';
import { shippingAPI } from '../../api/shipping.api';
import { storeAPI } from '../../api/store.api';
import { paymentAPI } from '../../api/payment.api';
import StoreFooter from '../../components/StoreFooter';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const Checkout = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [depositSettings, setDepositSettings] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [themeType, setThemeType] = useState('CLASSIC');
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  
  // Shared states
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [copiedInstapay, setCopiedInstapay] = useState(false);
  const [copiedVodafone, setCopiedVodafone] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    whatsappNumber: '',
    address: '',
    city: '',
    country: 'Egypt'
  });
  const { handleError } = useErrorHandler();

  // Theme-specific style helpers
  const getThemeColors = () => {
    switch (themeType) {
      case 'MODERN':
        return {
          background: 'bg-[#181818]',
          backgroundAlt: 'bg-[#252525]',
          text: 'text-white',
          textSecondary: 'text-gray-400',
          border: 'border-white/10',
          input: 'bg-[#252525] border-white/10 text-white',
          card: 'bg-[#252525] border-white/10',
          gradient: `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`,
          button: 'text-white',
          buttonSecondary: 'bg-white/10 text-white hover:bg-white/20',
        };
      case 'MINIMAL':
        return {
          background: 'bg-white',
          backgroundAlt: 'bg-gray-50',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          border: 'border-gray-100',
          input: 'bg-gray-50 border-gray-200 text-gray-900',
          card: 'bg-white border-gray-100',
          gradient: `linear-gradient(to right, #000000, #404040)`,
          button: 'text-white',
          buttonSecondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        };
      case 'CLASSIC':
      default:
        return {
          background: 'bg-gray-50',
          backgroundAlt: 'bg-white',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          border: 'border-gray-100',
          input: 'bg-gray-50 border-gray-200 text-gray-900',
          card: 'bg-white border-gray-100',
          gradient: `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`,
          button: 'text-white',
          buttonSecondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        };
    }
  };

  const themeColors = getThemeColors();

  useEffect(() => {
    const savedCart = localStorage.getItem('checkout_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && parsedCart.items.length > 0) {
          setCartData(parsedCart);
          fetchStoreShippingCosts(parsedCart.storeId);
          fetchDepositSettings(parsedCart.storeId);
          fetchPaymentMethods(parsedCart.storeId);
          fetchStoreColors(parsedCart.storeId);
        } else {
          navigate(`/store/${parsedCart.storeName}`);
        }
      } catch (err) {
        handleError(err);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchStoreColors = async (storeId) => {
    try {
      const storeData = await storeAPI.getById(storeId);
      setThemeType(storeData.themeType || 'CLASSIC');
      setCartData(prev => ({
        ...prev,
        primaryColor: storeData.primaryColor || '#4f46e5',
        secondaryColor: storeData.secondaryColor || '#8b5cf6'
      }));
    } catch (err) {
      console.error('Error fetching store colors:', err);
    }
  };

  const fetchStoreShippingCosts = async (storeId) => {
    try {
      setIsLoading(true);
      const shippingCosts = await shippingAPI.get(storeId);
      setCartData(prev => ({
        ...prev,
        shippingCosts: shippingCosts || []
      }));
    } catch (err) {
      console.error('Error fetching shipping costs:', err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepositSettings = async (storeId) => {
    try {
      const response = await storeAPI.getDepositSettings(storeId);
      const settings = await response.json();
      console.log('📦 Deposit settings from API:', settings);
      
      setDepositSettings({
        depositType: settings.depositType || 'PERCENTAGE',
        depositValue: settings.depositValue || 0,
        instapayNumber: settings.instapayNumber || '',
        vodafoneCashNumber: settings.vodafoneCashNumber || '',
        depositRequired: settings.depositRequired || false
      });
    } catch (err) {
      console.error('Error fetching deposit settings:', err);
      setDepositSettings(null);
    }
  };

  const fetchPaymentMethods = async (storeId) => {
    try {
      const methods = await paymentAPI.getPaymentMethods(storeId);
      console.log('📦 Payment methods from API:', methods);
      
      const activeMethods = methods.filter(m => m.isActive);
      setPaymentMethods(activeMethods);
      
      if (activeMethods.length > 0) {
        setSelectedPaymentMethod(activeMethods[0]);
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
    }
  };

  const handleGovernorateChange = (e) => {
    const selectedId = parseInt(e.target.value);
    if (!selectedId) {
      setSelectedShipping(null);
      setCustomerInfo(prev => ({ ...prev, city: '' }));
      return;
    }

    const shippingOption = cartData?.shippingCosts?.find(s => s.governorateId === selectedId);
    if (shippingOption) {
      setSelectedShipping(shippingOption);
      setCustomerInfo(prev => ({ ...prev, city: shippingOption.governorateName }));
    }
  };

  const calculateDepositAmount = () => {
    if (!depositSettings || !depositSettings.depositRequired) return 0;
    
    const subtotal = getSubtotal();
    
    if (depositSettings.depositType === 'SHIPPING') {
      return selectedShipping?.price || 0;
    } else if (depositSettings.depositType === 'PERCENTAGE') {
      return (subtotal * (depositSettings.depositValue / 100));
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!selectedShipping) {
        setError(t('checkout.errors.selectGovernorate'));
        return;
      }
      if (paymentMethods.length === 0) {
        setError(t('checkout.errors.noPaymentMethods'));
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (selectedPaymentMethod?.paymentMethodName === 'COD') {
        if (depositSettings===null || !depositSettings?.depositRequired) {
          await placeOrderWithoutPayment();
        } else {
          const amount = calculateDepositAmount();
          setPaymentAmount(amount);
          setShowDepositModal(true);
        }
      } else {
        setPaymentAmount(getTotal());
        setShowPaymentModal(true);
      }
    }
  };

  const placeOrderWithoutPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const orderResponse = await createOrder();

      if (!orderResponse || !orderResponse.id) {
        throw new Error(t('checkout.errors.createOrderFailed'));
      }

      setPaymentSuccess(true);
      
      setTimeout(() => {
        localStorage.removeItem('checkout_cart');
        if (cartData.storeName) localStorage.removeItem(`cart_${cartData.storeName}`);
        navigate(`/store/${cartData.storeName}?order=success`);
      }, 500);

    } catch (err) {
      console.error('Order error:', err);
      setError(err.message || t('checkout.errors.orderFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPaymentError(t('checkout.errors.fileTooLarge'));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setPaymentError(t('checkout.errors.notImageFile'));
        return;
      }
      
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'instapay') {
      setCopiedInstapay(true);
      setTimeout(() => setCopiedInstapay(false), 2000);
    } else {
      setCopiedVodafone(true);
      setTimeout(() => setCopiedVodafone(false), 2000);
    }
  };

  const createOrder = async () => {
    const subtotal = getSubtotal();
    const shippingCost = selectedShipping?.price || 0;
    const totalPrice = subtotal + shippingCost;
    const depositAmount = calculateDepositAmount();

    const customerData = {
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      phoneNumber: customerInfo.phoneNumber.startsWith('+') ? customerInfo.phoneNumber : `+${customerInfo.phoneNumber}`,
      whatsappNumber: customerInfo.whatsappNumber.startsWith('+') ? customerInfo.whatsappNumber : `+${customerInfo.whatsappNumber}`,
      address: customerInfo.address,
      city: selectedShipping?.governorateName || customerInfo.city,
      storeIds: [cartData.storeId]
    };

    const customerResponse = await customerAPI.add(customerData);
    if (!customerResponse || !customerResponse.id) throw new Error(t('checkout.errors.createCustomerFailed'));

    const paymentMethodId = selectedPaymentMethod?.paymentMethodId || 
      (selectedPaymentMethod?.paymentMethodName === 'COD' ? 3 : 
       selectedPaymentMethod?.paymentMethodName === 'INSTAPAY' ? 1 : 2);

    const orderData = {
      storeId: cartData.storeId,
      customerId: customerResponse.id,
      paymentMethodId: paymentMethodId,
      shippingCost: shippingCost,
      governorateId: selectedShipping?.governorateId || null,
      governorateName: selectedShipping?.governorateName || null,
      subtotal: subtotal,
      totalPrice: totalPrice,
      depositAmount: depositAmount,
      depositRequired: depositSettings?.depositRequired || false,
      depositStatus: (selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired) ? 'PENDING' : 'NOT_REQUIRED',
      items: cartData.items.map(item => ({
        productId: item.productId || item.id,
        price: item.price,
        quantity: item.quantity,
        color: item.color || null,
        size: item.size || null,
        variantId: item.variantId || null
      })),
    };

    console.log('📤 Order data:', orderData);
    const orderResponse = await orderAPI.checkout(orderData);
    return orderResponse;
  };

  const handlePaymentConfirm = async () => {
    if (paymentAmount === 0) {
      await placeOrderWithoutPayment();
      return;
    }

    if (!paymentProof) {
      setPaymentError(t('checkout.errors.uploadProofRequired'));
      return;
    }

    setUploadingPayment(true);
    setPaymentError(null);

    let createdOrderId = null;

    try {
      console.log('📝 Creating order with payment...');
      const orderResponse = await createOrder();
      
      if (!orderResponse || !orderResponse.id) {
        throw new Error(t('checkout.errors.createOrderFailed'));
      }

      createdOrderId = orderResponse.id;
      console.log('✅ Order created:', createdOrderId);

      try {
        const formData = new FormData();
        formData.append('screenshot', paymentProof);
        
        console.log('📤 Uploading file:', paymentProof.name);
        console.log('📤 File size:', paymentProof.size);
        console.log('📤 File type:', paymentProof.type);
        
        await orderAPI.uploadDepositProof(createdOrderId, formData);
        console.log('✅ Payment proof uploaded successfully');

      } catch (uploadError) {
        console.error('❌ Upload failed, deleting order:', createdOrderId);
        
        try {
          await orderAPI.delete(createdOrderId);
          console.log('✅ Order deleted successfully');
        } catch (deleteError) {
          console.error('❌ Failed to delete order:', deleteError);
        }
        
        throw new Error(t('checkout.errors.uploadFailedOrderCancelled'));
      }

      setPaymentSuccess(true);
      
      setTimeout(() => {
        localStorage.removeItem('checkout_cart');
        if (cartData.storeName) localStorage.removeItem(`cart_${cartData.storeName}`);
        navigate(`/store/${cartData.storeName}?order=success`);
      }, 3000);

    } catch (err) {
      console.error('❌ Transaction error:', err);
      setPaymentError(err.message || t('checkout.errors.transactionFailed'));
    } finally {
      setUploadingPayment(false);
    }
  };

  const getSubtotal = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal() + (selectedShipping?.price || 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const formatPrice = (price) => {
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getVariantDisplay = (item) => {
    if (item.color && item.size) return `${item.color} / ${item.size}`;
    if (item.color) return item.color;
    if (item.size) return item.size;
    return null;
  };

  const handleModalClose = () => {
    if (!uploadingPayment && !paymentSuccess) {
      setShowPaymentModal(false);
      setShowDepositModal(false);
      setPaymentProof(null);
      setPaymentProofPreview(null);
      setPaymentError(null);
    }
  };

  const getPaymentMethodIcon = (methodName) => {
    switch(methodName) {
      case 'INSTAPAY':
        return <img className='scale-200' src="instapay.png" alt="Instapay" />;
      case 'VODAFONE_CASH':
        return <img className='scale-200' src="vodafoneCash.png" alt="Vodafone Cash" />;
      case 'COD':
        return <Banknote className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentMethodColor = (methodName) => {
    switch(methodName) {
      case 'INSTAPAY':
        return 'emerald';
      case 'VODAFONE_CASH':
        return 'red';
      case 'COD':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getPaymentMethodDisplayName = (methodName) => {
    switch(methodName) {
      case 'INSTAPAY':
        return t('instapay');
      case 'VODAFONE_CASH':
        return t('vodafone Cash');
      case 'COD':
        return t("Cash on Delivery");
      default:
        return methodName;
    }
  };

  if (isLoading && !cartData) {
    return (
      <div className={`min-h-screen ${themeColors.background} flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className={themeColors.textSecondary}>{t('checkout.loading.checkout')}</p>
        </div>
      </div>
    );
  }

  if (!cartData) {
    return (
      <div className={`min-h-screen ${themeColors.background} flex items-center justify-center`}>
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className={themeColors.textSecondary}>{t('checkout.loading.cart')}</p>
        </div>
      </div>
    );
  }

  const shippingOptions = cartData.shippingCosts || [];

  return (
    <div className={`min-h-screen ${themeColors.background}`}>
      {/* Payment Modal - Full Payment */}
      {showPaymentModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div 
            className={`${themeColors.backgroundAlt} rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in border ${themeColors.border}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`sticky top-0 ${themeColors.backgroundAlt} border-b ${themeColors.border} p-6 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${themeColors.text}`}>{t('checkout.modal.fullPayment.title')}</h3>
                  <p className={`text-sm ${themeColors.textSecondary}`}>{t('checkout.modal.fullPayment.description')}</p>
                </div>
              </div>
              {!uploadingPayment && !paymentSuccess && (
                <button
                  onClick={handleModalClose}
                  className={`p-2 hover:bg-${themeType === 'MODERN' ? 'white/10' : 'gray-100'} rounded-lg transition-colors`}
                >
                  <X className={`h-5 w-5 ${themeType === 'MODERN' ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              )}
            </div>

            <div className="p-6 space-y-6">
              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className={`text-xl font-bold ${themeColors.text} mb-2`}>{t('checkout.modal.fullPayment.successTitle')}</h4>
                  <p className={`${themeColors.textSecondary} mb-4`}>{t('checkout.modal.fullPayment.successMessage')}</p>
                  <p className={`text-sm ${themeColors.textSecondary}`}>{t('checkout.modal.redirecting')}</p>
                </div>
              ) : (
                <>
                  <div 
                    className="rounded-xl p-5 text-white"
                    style={{
                      background: `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`
                    }}
                  >
                    <h4 className="font-medium mb-2">{t('checkout.modal.amountToPay')}</h4>
                    <div className="text-3xl font-bold">{formatPrice(paymentAmount)}</div>
                    <p className="text-sm opacity-80 mt-1">{t('checkout.modal.totalOrderAmount')}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className={`font-semibold ${themeColors.text}`}>{t('checkout.modal.paymentDetails')}</h4>
                    
                    {selectedPaymentMethod?.paymentMethodName === 'INSTAPAY' && (
                      <>
                        {depositSettings?.instapayNumber ? (
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Smartphone className="h-5 w-5 text-emerald-600" />
                                <span className="font-medium">{t('instapay')}</span>
                              </div>
                              <button
                                onClick={() => handleCopy(depositSettings.instapayNumber, 'instapay')}
                                className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                              >
                                <Copy className="h-4 w-4" />
                                <span>{copiedInstapay ? t('checkout.modal.copied') : t('checkout.modal.copy')}</span>
                              </button>
                            </div>
                            <p className="text-lg font-mono text-gray-900">{depositSettings.instapayNumber}</p>
                            {selectedPaymentMethod?.accountName && (
                              <p className="text-sm text-gray-500 mt-2">{t('checkout.modal.account')}: {selectedPaymentMethod.accountName}</p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-sm text-yellow-700">{t('checkout.errors.instapayNotConfigured')}</p>
                          </div>
                        )}
                      </>
                    )}

                    {selectedPaymentMethod?.paymentMethodName === 'VODAFONE_CASH' && (
                      <>
                        {depositSettings?.vodafoneCashNumber ? (
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <img src="vodafoneCash.png" alt="Vodafone Cash" />
                                <span className="font-medium">{t('vodafoneCash')}</span>
                              </div>
                              <button
                                onClick={() => handleCopy(depositSettings.vodafoneCashNumber, 'vodafone')}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                              >
                                <Copy className="h-4 w-4" />
                                <span>{copiedVodafone ? t('checkout.modal.copied') : t('checkout.modal.copy')}</span>
                              </button>
                            </div>
                            <p className="text-lg font-mono text-gray-900">{depositSettings.vodafoneCashNumber}</p>
                            {selectedPaymentMethod?.accountName && (
                              <p className="text-sm text-gray-500 mt-2">{t('checkout.modal.account')}: {selectedPaymentMethod.accountName}</p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-sm text-yellow-700">{t('checkout.errors.vodafoneNotConfigured')}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className={`font-semibold ${themeColors.text}`}>{t('checkout.modal.uploadScreenshot')}</h4>
                    
                    {!paymentProofPreview ? (
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-1">{t('checkout.modal.clickToUpload')}</p>
                          <p className="text-xs text-gray-500">{t('checkout.modal.imageRequirements')}</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePaymentProofUpload}
                            className="hidden"
                          />
                        </div>
                      </label>
                    ) : (
                      <div className="relative">
                        <img 
                          src={paymentProofPreview} 
                          alt="Payment proof" 
                          className="w-full rounded-xl border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setPaymentProof(null);
                            setPaymentProofPreview(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {paymentError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm">{paymentError}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleModalClose}
                      disabled={uploadingPayment}
                      className={`flex-1 py-3 ${themeColors.buttonSecondary} rounded-xl transition-colors disabled:opacity-50`}
                    >
                      {t('checkout.modal.cancel')}
                    </button>
                    <button
                      onClick={handlePaymentConfirm}
                      disabled={uploadingPayment || !paymentProof}
                      className="flex-1 py-3 text-white rounded-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                      style={{
                        background: `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`
                      }}
                    >
                      {uploadingPayment ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>{t('checkout.modal.processing')}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>{t('checkout.modal.confirmPayment')}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {uploadingPayment && (
                    <div className="text-center py-2">
                      <p className={`text-xs ${themeColors.textSecondary}`}>{t('checkout.modal.processingMessage')}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div 
            className={`${themeColors.backgroundAlt} rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in border ${themeColors.border}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`sticky top-0 ${themeColors.backgroundAlt} border-b ${themeColors.border} p-6 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${themeColors.text}`}>{t('checkout.modal.deposit.title')}</h3>
                  <p className={`text-sm ${themeColors.textSecondary}`}>{t('checkout.modal.deposit.description')}</p>
                </div>
              </div>
              {!uploadingPayment && !paymentSuccess && (
                <button
                  onClick={handleModalClose}
                  className={`p-2 hover:bg-${themeType === 'MODERN' ? 'white/10' : 'gray-100'} rounded-lg transition-colors`}
                >
                  <X className={`h-5 w-5 ${themeType === 'MODERN' ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              )}
            </div>

            <div className="p-6 space-y-6">
              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className={`text-xl font-bold ${themeColors.text} mb-2`}>{t('checkout.modal.deposit.successTitle')}</h4>
                  <p className={`${themeColors.textSecondary} mb-4`}>{t('checkout.modal.deposit.successMessage')}</p>
                  <p className={`text-sm ${themeColors.textSecondary}`}>{t('checkout.modal.redirecting')}</p>
                </div>
              ) : (
                <>
                  <div 
                    className="rounded-xl p-5 text-white"
                    style={{
                      background: `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`
                    }}
                  >
                    <h4 className="font-medium mb-2">{t('checkout.modal.deposit.amount')}</h4>
                    <div className="text-3xl font-bold">{formatPrice(paymentAmount)}</div>
                    <p className="text-sm opacity-80 mt-1">
                      {depositSettings?.depositType === 'SHIPPING' 
                        ? t('checkout.modal.deposit.equalsShipping')
                        : `${depositSettings?.depositValue}% ${t('checkout.modal.deposit.ofOrderTotal')}`}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className={`font-semibold ${themeColors.text}`}>{t('checkout.modal.deposit.sendTo')}</h4>
                    
                    {depositSettings?.instapayNumber && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-5 w-5 text-emerald-600" />
                            <span className="font-medium">{t('instapay')}</span>
                          </div>
                          <button
                            onClick={() => handleCopy(depositSettings.instapayNumber, 'instapay')}
                            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                          >
                            <Copy className="h-4 w-4" />
                            <span>{copiedInstapay ? t('checkout.modal.copied') : t('checkout.modal.copy')}</span>
                          </button>
                        </div>
                        <p className="text-lg font-mono text-gray-900">{depositSettings.instapayNumber}</p>
                      </div>
                    )}

                    {depositSettings?.vodafoneCashNumber && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-red-600" />
                            <span className="font-medium">{t('vodafoneCash')}</span>
                          </div>
                          <button
                            onClick={() => handleCopy(depositSettings.vodafoneCashNumber, 'vodafone')}
                            className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                          >
                            <Copy className="h-4 w-4" />
                            <span>{copiedVodafone ? t('checkout.modal.copied') : t('checkout.modal.copy')}</span>
                          </button>
                        </div>
                        <p className="text-lg font-mono text-gray-900">{depositSettings.vodafoneCashNumber}</p>
                      </div>
                    )}
                  </div>

                  {!depositSettings?.instapayNumber && !depositSettings?.vodafoneCashNumber && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-sm text-yellow-700">{t('checkout.errors.noPaymentMethodsConfigured')}</p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Banknote className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">
                          {t('checkout.modal.deposit.payAmount', { amount: formatPrice(paymentAmount) })}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {t('checkout.modal.deposit.remainingOnDelivery', { amount: formatPrice(getTotal() - paymentAmount) })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className={`font-semibold ${themeColors.text}`}>{t('checkout.modal.deposit.uploadProof')}</h4>
                    
                    {!paymentProofPreview ? (
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-1">{t('checkout.modal.clickToUpload')}</p>
                          <p className="text-xs text-gray-500">{t('checkout.modal.imageRequirements')}</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePaymentProofUpload}
                            className="hidden"
                          />
                        </div>
                      </label>
                    ) : (
                      <div className="relative">
                        <img 
                          src={paymentProofPreview} 
                          alt="Payment proof" 
                          className="w-full rounded-xl border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setPaymentProof(null);
                            setPaymentProofPreview(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {paymentError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm">{paymentError}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleModalClose}
                      disabled={uploadingPayment}
                      className={`flex-1 py-3 ${themeColors.buttonSecondary} rounded-xl transition-colors disabled:opacity-50`}
                    >
                      {t('checkout.modal.cancel')}
                    </button>
                    <button
                      onClick={handlePaymentConfirm}
                      disabled={uploadingPayment || !paymentProof}
                      className="flex-1 py-3 text-white rounded-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                      style={{
                        background: `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`
                      }}
                    >
                      {uploadingPayment ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>{t('checkout.modal.processing')}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>{t('checkout.modal.deposit.confirmDeposit')}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {uploadingPayment && (
                    <div className="text-center py-2">
                      <p className={`text-xs ${themeColors.textSecondary}`}>{t('checkout.modal.processingMessage')}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`${themeColors.backgroundAlt} shadow-sm border-b ${themeColors.border}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate(-1)} className={`${themeColors.textSecondary} hover:${themeColors.text} transition-colors`}>
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className={`text-3xl font-bold ${themeColors.text}`}>{t('checkout.title')}</h1>
                <p className={themeColors.textSecondary}>{t('checkout.subtitle', { storeName: cartData.storeName })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className={`flex items-center text-indigo-600`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-100' : 'bg-gray-100'}`}>1</div>
                <span className="ml-2 text-sm font-medium">{t('checkout.steps.customerInfo')}</span>
              </div>
              <div className={`h-1 w-8 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center text-indigo-600`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-100' : 'bg-gray-100'}`}>2</div>
                <span className="ml-2 text-sm font-medium">{t('checkout.steps.reviewConfirm')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6">
            <div className={`bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center justify-between`}>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900">×</button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className={`${themeColors.backgroundAlt} rounded-2xl p-8 border ${themeColors.border}`}>
              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <>
                    <h3 className={`text-xl font-bold ${themeColors.text} mb-6`}>{t('checkout.customerInformation.title')}</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium ${themeColors.text} mb-2`}>{t('checkout.customerInformation.firstName')} *</label>
                        <div className="relative">
                          <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeColors.textSecondary}`} />
                          <input
                            type="text" name="firstName" required
                            value={customerInfo.firstName} onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${themeColors.text} mb-2`}>{t('checkout.customerInformation.lastName')} *</label>
                        <div className="relative">
                          <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeColors.textSecondary}`} />
                          <input
                            type="text" name="lastName" required
                            value={customerInfo.lastName} onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className={`block text-sm font-medium ${themeColors.text} mb-2`}>{t('checkout.customerInformation.phoneNumber')} *</label>
                        <div className="relative">
                          <Phone className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeColors.textSecondary}`} />
                          <input
                            type="tel" name="phoneNumber" required
                            value={customerInfo.phoneNumber} onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                            placeholder="01234567890"
                          />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${themeColors.text} mb-2`}>{t('checkout.customerInformation.whatsappNumber')} *</label>
                        <div className="relative">
                          <Phone className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeColors.textSecondary}`} />
                          <input
                            type="tel" name="whatsappNumber" required
                            value={customerInfo.whatsappNumber} onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                            placeholder="01234567890"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className={`block text-sm font-medium ${themeColors.text} mb-2`}>{t('checkout.customerInformation.address')} *</label>
                      <div className="relative">
                        <MapPin className={`absolute left-4 top-4 h-5 w-5 ${themeColors.textSecondary}`} />
                        <textarea
                          name="address" required
                          value={customerInfo.address} onChange={handleInputChange}
                          rows={3}
                          className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                          placeholder="123 Main Street, Apartment 4B"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className={`block text-sm font-medium ${themeColors.text} mb-2`}>
                        {t('checkout.customerInformation.governorate')} * <span className={`${themeColors.textSecondary} text-xs`}>({t('checkout.customerInformation.shippingHint')})</span>
                      </label>
                      {shippingOptions.length === 0 ? (
                        <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm`}>
                          {t('checkout.errors.noShippingOptions')}
                        </div>
                      ) : (
                        <div className="relative">
                          <MapPin className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeColors.textSecondary} z-10`} />
                          <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeColors.textSecondary} z-10 pointer-events-none`} />
                          <select
                            required
                            onChange={handleGovernorateChange}
                            value={selectedShipping?.governorateId || ''}
                            className={`w-full pl-12 pr-10 py-3 ${themeColors.input} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none`}
                          >
                            <option value="" disabled>{t('checkout.customerInformation.selectGovernorate')}</option>
                            {shippingOptions.map(option => (
                              <option key={option.governorateId} value={option.governorateId}>
                                {option.governorateName} - {formatPrice(option.price)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {selectedShipping && (
                        <div className={`mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between`}>
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm text-indigo-700">
                              {t('checkout.customerInformation.shippingTo')} {selectedShipping.governorateName}
                            </span>
                          </div>
                          <span className="font-semibold text-indigo-700">{formatPrice(selectedShipping.price)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <label className={`block text-sm font-medium ${themeColors.text} mb-4`}>
                        {t('checkout.paymentMethod.title')} *
                      </label>
                      {paymentMethods.length === 0 ? (
                        <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm`}>
                          {t('checkout.errors.noPaymentMethods')}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {paymentMethods.map(method => {
                            const color = getPaymentMethodColor(method.paymentMethodName);
                            const isSelected = selectedPaymentMethod?.paymentMethodId === method.paymentMethodId;
                            
                            return (
                              <div
                                key={method.paymentMethodId}
                                onClick={() => setSelectedPaymentMethod(method)}
                                className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                                  isSelected 
                                    ? `border-${color}-500 bg-${color}-50` 
                                    : `border-${themeColors.border} hover:border-gray-300 ${themeColors.backgroundAlt}`
                                }`}
                              >
                                <div className="flex flex-col items-center text-center">
                                  <div className={`h-12 w-12 rounded-full bg-${color}-100 flex items-center justify-center mb-2`}>
                                    {getPaymentMethodIcon(method.paymentMethodName)}
                                  </div>
                                  <span className={`text-sm font-medium ${
                                    isSelected ? `text-${color}-700` : themeColors.text
                                  }`}>
                                    {getPaymentMethodDisplayName(method.paymentMethodName)}
                                  </span>
                                  {method.paymentMethodName === 'COD' && depositSettings?.depositRequired && (
                                    <span className="text-xs text-amber-600 mt-1">{t('checkout.paymentMethod.depositRequired')}</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <label className={`block text-sm font-medium ${themeColors.text} mb-2`}>{t('checkout.customerInformation.country')}</label>
                      <input
                        type="text" name="country"
                        value={customerInfo.country} readOnly
                        className={`w-full px-4 py-3 ${themeType === 'MODERN' ? 'bg-white/10' : themeType === 'MINIMAL' ? 'bg-gray-100' : 'bg-gray-100'} border ${themeColors.border} rounded-xl ${themeColors.textSecondary}`}
                      />
                    </div>

                    <button
                      type="submit" 
                      disabled={isLoading || shippingOptions.length === 0 || paymentMethods.length === 0 || !selectedPaymentMethod}
                      className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: (!isLoading && shippingOptions.length > 0 && paymentMethods.length > 0 && selectedPaymentMethod) 
                          ? `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`
                          : 'rgb(107, 114, 128)'
                      }}
                    >
                      {t('checkout.buttons.reviewOrder')}
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className={`text-xl font-bold ${themeColors.text} mb-6`}>{t('checkout.review.title')}</h3>

                    {/* Payment Method Summary */}
                    {selectedPaymentMethod && (
                      <div className={`mb-6 p-4 bg-${getPaymentMethodColor(selectedPaymentMethod.paymentMethodName)}-50 border border-${getPaymentMethodColor(selectedPaymentMethod.paymentMethodName)}-200 rounded-xl`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`h-10 w-10 rounded-full bg-${getPaymentMethodColor(selectedPaymentMethod.paymentMethodName)}-100 flex items-center justify-center`}>
                              {getPaymentMethodIcon(selectedPaymentMethod.paymentMethodName)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {getPaymentMethodDisplayName(selectedPaymentMethod.paymentMethodName)}
                              </div>
                              <div className={`text-xs text-${getPaymentMethodColor(selectedPaymentMethod.paymentMethodName)}-600`}>
                                {selectedPaymentMethod.paymentMethodName === 'COD' 
                                  ? depositSettings?.depositRequired ? t('checkout.paymentMethod.depositRequired') : t('checkout.paymentMethod.payOnDelivery')
                                  : t('checkout.paymentMethod.onlinePayment')}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            {t('checkout.buttons.change')}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div className="mb-8">
                      <h4 className={`font-semibold ${themeColors.text} mb-4`}>{t('checkout.review.orderItems', { count: cartData.items.length })}</h4>
                      <div className="space-y-4">
                        {cartData.items.map((item, index) => {
                          const variantDisplay = getVariantDisplay(item);
                          return (
                            <div key={index} className={`flex items-center justify-between p-4 ${themeColors.backgroundAlt} rounded-xl border ${themeColors.border}`}>
                              <div className="flex items-center space-x-4">
                                <div className={`h-16 w-16 ${themeColors.backgroundAlt} rounded-lg flex items-center justify-center overflow-hidden`}>
                                  {item.imageUrls && item.imageUrls[0] ? (
                                    <img src={item.imageUrls[0]} alt={item.productName || item.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <Package className="h-8 w-8 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <div className={`font-medium ${themeColors.text}`}>{item.productName || item.name}</div>
                                  {variantDisplay && (
                                    <div className="flex items-center gap-2 mt-1">
                                      {item.color && (
                                        <div className="flex items-center text-xs text-indigo-600">
                                          <Palette className="h-3 w-3 mr-1" />{item.color}
                                        </div>
                                      )}
                                      {item.size && (
                                        <div className="flex items-center text-xs text-indigo-600">
                                          <Ruler className="h-3 w-3 mr-1" />{item.size}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  <div className={`text-sm ${themeColors.textSecondary} mt-1`}>
                                    {t('checkout.review.qty')}: {item.quantity} × {formatPrice(item.price)}
                                  </div>
                                </div>
                              </div>
                              <div className={`font-semibold text-lg ${themeColors.text}`}>{formatPrice(item.price * item.quantity)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shipping Summary */}
                    {selectedShipping && (
                      <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Truck className="h-5 w-5 text-indigo-600" />
                          <div>
                            <div className="font-medium text-indigo-900">{t('checkout.review.shippingTo', { governorate: selectedShipping.governorateName })}</div>
                            <div className="text-sm text-indigo-600">{t('checkout.review.deliveryTime')}</div>
                          </div>
                        </div>
                        <span className="font-semibold text-indigo-700">{formatPrice(selectedShipping.price)}</span>
                      </div>
                    )}

                    {/* Customer Info Summary */}
                    <div className="mb-8">
                      <h4 className={`font-semibold ${themeColors.text} mb-4`}>{t('checkout.review.shippingInformation')}</h4>
                      <div className={`${themeColors.backgroundAlt} rounded-xl p-6 border ${themeColors.border}`}>
                        <div className={`${themeColors.text} font-medium mb-2`}>{customerInfo.firstName} {customerInfo.lastName}</div>
                        <div className={`${themeColors.textSecondary} mb-1`}>{customerInfo.address}</div>
                        <div className={`${themeColors.textSecondary} mb-1`}>
                          <span className="font-medium">{t('checkout.review.city')}:</span> {selectedShipping?.governorateName || customerInfo.city}
                        </div>
                        <div className={`${themeColors.textSecondary} mb-1`}>{customerInfo.country}</div>
                        <div className={`${themeColors.textSecondary} mb-1`}>{customerInfo.phoneNumber}</div>
                        <div className={themeColors.textSecondary}>{customerInfo.whatsappNumber}</div>
                      </div>
                    </div>

                    {/* Deposit Info */}
                    {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired && (
                      <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <Wallet className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-900 mb-1">{t('checkout.review.depositRequired')}</h4>
                            <p className="text-sm text-amber-700 mb-2">
                              {depositSettings.depositType === 'SHIPPING' 
                                ? t('checkout.review.depositEqualsShipping', { amount: formatPrice(selectedShipping?.price || 0) })
                                : t('checkout.review.depositPercentage', { percentage: depositSettings.depositValue, amount: formatPrice(calculateDepositAmount()) })}
                            </p>
                            <p className="text-xs text-amber-600">{t('checkout.review.depositInstruction')}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className={`mb-8 p-4 ${themeColors.backgroundAlt} rounded-xl border ${themeColors.border}`}>
                      <h4 className={`font-semibold ${themeColors.text} mb-3`}>{t('checkout.review.priceBreakdown')}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={themeColors.textSecondary}>{t('checkout.review.subtotal')}:</span>
                          <span className={`font-medium ${themeColors.text}`}>{formatPrice(getSubtotal())}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={themeColors.textSecondary}>{t('checkout.review.shipping')} ({selectedShipping?.governorateName}):</span>
                          <span className="font-medium text-indigo-600">{formatPrice(selectedShipping?.price || 0)}</span>
                        </div>
                        {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired && (
                          <div className="flex justify-between text-sm">
                            <span className={themeColors.textSecondary}>{t('checkout.review.deposit')}:</span>
                            <span className="font-medium text-amber-600">{formatPrice(calculateDepositAmount())}</span>
                          </div>
                        )}
                        <div className={`border-t ${themeColors.border} pt-2 mt-2`}>
                          <div className="flex justify-between font-bold">
                            <span className={themeColors.text}>
                              {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired
                                ? t('checkout.review.remainingOnDelivery')
                                : t('checkout.review.total')}:
                            </span>
                            <span className="text-indigo-600">
                              {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired
                                ? formatPrice(getTotal() - calculateDepositAmount())
                                : formatPrice(getTotal())}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="mb-8">
                      <div className="flex items-start">
                        <input type="checkbox" id="terms" required className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 mt-1" />
                        <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                          {t('checkout.review.termsAgreement')}
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button" onClick={() => setStep(1)} disabled={isLoading}
                        className={`flex-1 py-3 ${themeColors.buttonSecondary} rounded-xl transition-colors disabled:opacity-50`}
                      >
                        {t('checkout.buttons.back')}
                      </button>
                      <button
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                        style={{
                          background: `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`
                        }}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>{t('checkout.buttons.processing')}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            <span>{t('checkout.buttons.placeOrder')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className={`${themeColors.backgroundAlt} rounded-2xl p-8 border ${themeColors.border} sticky top-8`}>
              <div className="flex items-center space-x-3 mb-6">
                {cartData.storeLogo ? (
                  <img src={cartData.storeLogo} alt={cartData.storeName} className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className={`h-10 w-10 ${themeColors.backgroundAlt} rounded-xl flex items-center justify-center`}>
                    <ShoppingBag className={`h-5 w-5 ${themeType === 'MODERN' ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                )}
                <h3 className={`text-xl font-bold ${themeColors.text}`}>{cartData.storeName}</h3>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className={themeColors.textSecondary}>{t('checkout.summary.subtotal')}</span>
                  <span className={`font-medium ${themeColors.text}`}>{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className={themeColors.textSecondary}>{t('checkout.summary.shippingCost')}</span>
                  <span className={`font-medium ${selectedShipping ? themeColors.text : themeColors.textSecondary}`}>
                    {selectedShipping ? formatPrice(selectedShipping.price) : t('checkout.summary.selectGovernorate')}
                  </span>
                </div>
                {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired && (
                  <div className="flex justify-between">
                    <span className={themeColors.textSecondary}>{t('checkout.summary.deposit')}</span>
                    <span className="font-medium text-amber-600">
                      {selectedShipping ? formatPrice(calculateDepositAmount()) : '—'}
                    </span>
                  </div>
                )}
                <div className={`border-t ${themeColors.border} pt-4`}>
                  <div className="flex justify-between text-xl font-bold">
                    <span className={themeColors.text}>
                      {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired
                        ? t('checkout.summary.toPayNow')
                        : t('checkout.summary.total')}
                    </span>
                    <span className="text-indigo-600">
                      {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired
                        ? formatPrice(calculateDepositAmount())
                        : formatPrice(getTotal())}
                    </span>
                  </div>
                  {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired && (
                    <p className={`text-sm ${themeColors.textSecondary} mt-2`}>
                      {t('checkout.summary.remainingOnDelivery', { amount: formatPrice(getTotal() - calculateDepositAmount()) })}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">{t('checkout.summary.estimatedDelivery')}</div>
                    <div className="text-sm text-blue-700">{t('checkout.summary.deliveryTime')}</div>
                  </div>
                </div>
              </div>

              <div className={`p-4 ${themeColors.backgroundAlt} rounded-xl border ${themeColors.border}`}>
                <h4 className={`text-sm font-medium ${themeColors.text} mb-2`}>{t('checkout.summary.orderProcess')}</h4>
                <div className="space-y-2">
                  <div className={`flex items-center text-sm ${themeColors.textSecondary}`}>
                    <div className="h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</div>
                    <span>{t('checkout.summary.step1')}</span>
                  </div>
                  <div className={`flex items-center text-sm ${themeColors.textSecondary}`}>
                    <div className="h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">2</div>
                    <span>{t('checkout.summary.step2')}</span>
                  </div>
                  <div className={`flex items-center text-sm ${themeColors.textSecondary}`}>
                    <div className="h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">3</div>
                    <span>{t('checkout.summary.step3')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />

      {/* Animation styles */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Checkout;