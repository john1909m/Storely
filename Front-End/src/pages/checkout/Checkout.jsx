// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [depositSettings, setDepositSettings] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  
  // Modal states - مودالين منفصلين
  const [showPaymentModal, setShowPaymentModal] = useState(false); // للدفع الكامل
  const [showDepositModal, setShowDepositModal] = useState(false); // للإيداع
  
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
        setError('Please select a governorate for shipping.');
        return;
      }
      if (paymentMethods.length === 0) {
        setError('No payment methods available for this store.');
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
          setShowDepositModal(true); // فتح مودال الإيداع
        }
      } else {
        setPaymentAmount(getTotal());
        setShowPaymentModal(true); // فتح مودال الدفع الكامل
      }
    }
  };

  const placeOrderWithoutPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const orderResponse = await createOrder();

      if (!orderResponse || !orderResponse.id) {
        throw new Error('Failed to create order');
      }

      setPaymentSuccess(true);
      
      setTimeout(() => {
        localStorage.removeItem('checkout_cart');
        if (cartData.storeName) localStorage.removeItem(`cart_${cartData.storeName}`);
        navigate(`/store/${cartData.storeName}?order=success`);
      }, 500);

    } catch (err) {
      console.error('Order error:', err);
      setError(err.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPaymentError('File too large. Maximum size is 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setPaymentError('Please upload an image file');
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
    if (!customerResponse || !customerResponse.id) throw new Error('Failed to create customer');

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
      setPaymentError('Please upload proof of payment');
      return;
    }

    setUploadingPayment(true);
    setPaymentError(null);

    let createdOrderId = null;

    try {
      console.log('📝 Creating order with payment...');
      const orderResponse = await createOrder();
      
      if (!orderResponse || !orderResponse.id) {
        throw new Error('Failed to create order');
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
        
        throw new Error('فشل رفع صورة الدفع. تم إلغاء الطلب.');
      }

      setPaymentSuccess(true);
      
      setTimeout(() => {
        localStorage.removeItem('checkout_cart');
        if (cartData.storeName) localStorage.removeItem(`cart_${cartData.storeName}`);
        navigate(`/store/${cartData.storeName}?order=success`);
      }, 3000);

    } catch (err) {
      console.error('❌ Transaction error:', err);
      setPaymentError(err.message || 'فشلت العملية. الرجاء المحاولة مرة أخرى.');
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
    return new Intl.NumberFormat('en-eg', {
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
        return 'Instapay';
      case 'VODAFONE_CASH':
        return 'Vodafone Cash';
      case 'COD':
        return 'Cash on Delivery';
      default:
        return methodName;
    }
  };

  if (isLoading && !cartData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cartData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const shippingOptions = cartData.shippingCosts || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* مودال الدفع الكامل (Instapay / Vodafone Cash) */}
      {showPaymentModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
                  <p className="text-sm text-gray-500">Pay total amount to confirm your order</p>
                </div>
              </div>
              {!uploadingPayment && !paymentSuccess && (
                <button
                  onClick={handleModalClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>

            <div className="p-6 space-y-6">
              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Payment Confirmed!</h4>
                  <p className="text-gray-600 mb-4">
                    Your payment has been received. The vendor will process your order shortly.
                  </p>
                  <p className="text-sm text-gray-500">Redirecting to store...</p>
                </div>
              ) : (
                <>
                  {/* المبلغ كامل */}
                  <div 
                    className="rounded-xl p-5 text-white"
                    style={{
                      background: `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`
                    }}
                  >
                    <h4 className="font-medium mb-2">Amount to Pay</h4>
                    <div className="text-3xl font-bold">{formatPrice(paymentAmount)}</div>
                    <p className="text-sm opacity-80 mt-1">Total order amount</p>
                  </div>

                  {/* Payment Details - منفصلة */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Payment Details</h4>
                    
                    {/* Instapay */}
                    {selectedPaymentMethod?.paymentMethodName === 'INSTAPAY' && (
                      <>
                        {depositSettings?.instapayNumber ? (
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Smartphone className="h-5 w-5 text-emerald-600" />
                                <span className="font-medium">Instapay</span>
                              </div>
                              <button
                                onClick={() => handleCopy(depositSettings.instapayNumber, 'instapay')}
                                className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                              >
                                <Copy className="h-4 w-4" />
                                <span>{copiedInstapay ? 'Copied!' : 'Copy'}</span>
                              </button>
                            </div>
                            <p className="text-lg font-mono text-gray-900">{depositSettings.instapayNumber}</p>
                            {selectedPaymentMethod?.accountName && (
                              <p className="text-sm text-gray-500 mt-2">Account: {selectedPaymentMethod.accountName}</p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-sm text-yellow-700">Instapay number not configured by vendor.</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Vodafone Cash */}
                    {selectedPaymentMethod?.paymentMethodName === 'VODAFONE_CASH' && (
                      <>
                        {depositSettings?.vodafoneCashNumber ? (
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <img src="vodafoneCash.png" alt="Vodafone Cash" />
                                <span className="font-medium">Vodafone Cash</span>
                              </div>
                              <button
                                onClick={() => handleCopy(depositSettings.vodafoneCashNumber, 'vodafone')}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                              >
                                <Copy className="h-4 w-4" />
                                <span>{copiedVodafone ? 'Copied!' : 'Copy'}</span>
                              </button>
                            </div>
                            <p className="text-lg font-mono text-gray-900">{depositSettings.vodafoneCashNumber}</p>
                            {selectedPaymentMethod?.accountName && (
                              <p className="text-sm text-gray-500 mt-2">Account: {selectedPaymentMethod.accountName}</p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-sm text-yellow-700">Vodafone Cash number not configured by vendor.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Upload Proof */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Upload Payment Screenshot</h4>
                    
                    {!paymentProofPreview ? (
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-1">Click to upload screenshot</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
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

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleModalClose}
                      disabled={uploadingPayment}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
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
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>Confirm Payment</span>
                        </>
                      )}
                    </button>
                  </div>

                  {uploadingPayment && (
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-500">
                        Please don't close this window while we process your order...
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* مودال الإيداع (Deposit) - منفصل */}
      {showDepositModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Deposit Required</h3>
                  <p className="text-sm text-gray-500">Pay deposit to confirm your order</p>
                </div>
              </div>
              {!uploadingPayment && !paymentSuccess && (
                <button
                  onClick={handleModalClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>

            <div className="p-6 space-y-6">
              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Deposit Submitted!</h4>
                  <p className="text-gray-600 mb-4">
                    Your deposit proof has been uploaded. The vendor will confirm your payment shortly.
                  </p>
                  <p className="text-sm text-gray-500">Redirecting to store...</p>
                </div>
              ) : (
                <>
                  {/* مبلغ الإيداع */}
                  <div 
                    className="rounded-xl p-5 text-white"
                    style={{
                      background: `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`
                    }}
                  >
                    <h4 className="font-medium mb-2">Deposit Amount</h4>
                    <div className="text-3xl font-bold">{formatPrice(paymentAmount)}</div>
                    <p className="text-sm opacity-80 mt-1">
                      {depositSettings?.depositType === 'SHIPPING' 
                        ? 'Deposit equals shipping cost'
                        : `${depositSettings?.depositValue}% of order total`}
                    </p>
                  </div>

                  {/* Payment Details للإيداع - هنا الأرقام */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Send deposit to</h4>
                    
                    {/* Instapay - هنا يظهر الرقم */}
                    {depositSettings?.instapayNumber && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-5 w-5 text-emerald-600" />
                            <span className="font-medium">Instapay</span>
                          </div>
                          <button
                            onClick={() => handleCopy(depositSettings.instapayNumber, 'instapay')}
                            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                          >
                            <Copy className="h-4 w-4" />
                            <span>{copiedInstapay ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-lg font-mono text-gray-900">{depositSettings.instapayNumber}</p>
                      </div>
                    )}

                    {/* Vodafone Cash - هنا يظهر الرقم */}
                    {depositSettings?.vodafoneCashNumber && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-red-600" />
                            <span className="font-medium">Vodafone Cash</span>
                          </div>
                          <button
                            onClick={() => handleCopy(depositSettings.vodafoneCashNumber, 'vodafone')}
                            className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                          >
                            <Copy className="h-4 w-4" />
                            <span>{copiedVodafone ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-lg font-mono text-gray-900">{depositSettings.vodafoneCashNumber}</p>
                      </div>
                    )}
                  </div>

                  {/* رسالة لو مفيش أرقام */}
                  {!depositSettings?.instapayNumber && !depositSettings?.vodafoneCashNumber && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-sm text-yellow-700">No payment methods configured for deposit.</p>
                    </div>
                  )}

                  {/* رسالة COD */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Banknote className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">
                          Pay {formatPrice(paymentAmount)} as deposit
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          The remaining {formatPrice(getTotal() - paymentAmount)} will be paid upon delivery.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Proof */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Upload Deposit Proof</h4>
                    
                    {!paymentProofPreview ? (
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-1">Click to upload screenshot</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
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

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleModalClose}
                      disabled={uploadingPayment}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
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
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>Confirm Deposit</span>
                        </>
                      )}
                    </button>
                  </div>

                  {uploadingPayment && (
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-500">
                        Please don't close this window while we process your order...
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* باقي الكود زي ما هو */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-600">Complete your purchase from {cartData.storeName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-100' : 'bg-gray-100'}`}>1</div>
                <span className="ml-2 text-sm font-medium">Customer Info</span>
              </div>
              <div className={`h-1 w-8 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-100' : 'bg-gray-100'}`}>2</div>
                <span className="ml-2 text-sm font-medium">Review & Confirm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center justify-between">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text" name="firstName" required
                            value={customerInfo.firstName} onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text" name="lastName" required
                            value={customerInfo.lastName} onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel" name="phoneNumber" required
                            value={customerInfo.phoneNumber} onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="01234567890"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Whatsapp Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel" name="whatsappNumber" required
                            value={customerInfo.whatsappNumber} onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="01234567890"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <textarea
                          name="address" required
                          value={customerInfo.address} onChange={handleInputChange}
                          rows={3}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="123 Main Street, Apartment 4B"
                        />
                      </div>
                    </div>

                    {/* Governorate Select */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Governorate * <span className="text-gray-400 text-xs">(Shipping cost will be calculated)</span>
                      </label>
                      {shippingOptions.length === 0 ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
                          No shipping options available for this store.
                        </div>
                      ) : (
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                          <select
                            required
                            onChange={handleGovernorateChange}
                            value={selectedShipping?.governorateId || ''}
                            className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none"
                          >
                            <option value="" disabled>Select your governorate</option>
                            {shippingOptions.map(option => (
                              <option key={option.governorateId} value={option.governorateId}>
                                {option.governorateName} - {formatPrice(option.price)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {selectedShipping && (
                        <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm text-indigo-700">
                              Shipping to {selectedShipping.governorateName}
                            </span>
                          </div>
                          <span className="font-semibold text-indigo-700">{formatPrice(selectedShipping.price)}</span>
                        </div>
                      )}
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Payment Method *
                      </label>
                      {paymentMethods.length === 0 ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
                          No payment methods available for this store.
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
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex flex-col items-center text-center">
                                  <div className={`h-12 w-12 rounded-full bg-${color}-100 flex items-center justify-center mb-2`}>
                                    {getPaymentMethodIcon(method.paymentMethodName)}
                                  </div>
                                  <span className={`text-sm font-medium ${
                                    isSelected ? `text-${color}-700` : 'text-gray-700'
                                  }`}>
                                    {getPaymentMethodDisplayName(method.paymentMethodName)}
                                  </span>
                                  {method.paymentMethodName === 'COD' && depositSettings?.depositRequired && (
                                    <span className="text-xs text-amber-600 mt-1">Deposit required</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text" name="country"
                        value={customerInfo.country} readOnly
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600"
                      />
                    </div>

                    <button
                      type="submit" 
                      disabled={isLoading || shippingOptions.length === 0 || paymentMethods.length === 0 || !selectedPaymentMethod}
                      className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Review Order
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h3>

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
                                  ? depositSettings?.depositRequired ? 'Deposit required' : 'Pay on delivery'
                                  : 'Online payment'}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Order Items ({cartData.items.length})</h4>
                      <div className="space-y-4">
                        {cartData.items.map((item, index) => {
                          const variantDisplay = getVariantDisplay(item);
                          return (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  {item.imageUrls && item.imageUrls[0] ? (
                                    <img src={item.imageUrls[0]} alt={item.productName || item.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <Package className="h-8 w-8 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{item.productName || item.name}</div>
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
                                  <div className="text-sm text-gray-600 mt-1">
                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                  </div>
                                </div>
                              </div>
                              <div className="font-semibold text-lg">{formatPrice(item.price * item.quantity)}</div>
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
                            <div className="font-medium text-indigo-900">Shipping to {selectedShipping.governorateName}</div>
                            <div className="text-sm text-indigo-600">Standard delivery 2-4 business days</div>
                          </div>
                        </div>
                        <span className="font-semibold text-indigo-700">{formatPrice(selectedShipping.price)}</span>
                      </div>
                    )}

                    {/* Customer Info Summary */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Shipping Information</h4>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="text-gray-900 font-medium mb-2">{customerInfo.firstName} {customerInfo.lastName}</div>
                        <div className="text-gray-600 mb-1">{customerInfo.address}</div>
                        <div className="text-gray-600 mb-1">
                          <span className="font-medium">City:</span> {selectedShipping?.governorateName || customerInfo.city}
                        </div>
                        <div className="text-gray-600 mb-1">{customerInfo.country}</div>
                        <div className="text-gray-600 mb-1">{customerInfo.phoneNumber}</div>
                        <div className="text-gray-600">{customerInfo.whatsappNumber}</div>
                      </div>
                    </div>

                    {/* Deposit Info - if required for COD */}
                    {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired && (
                      <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <Wallet className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-900 mb-1">Deposit Required</h4>
                            <p className="text-sm text-amber-700 mb-2">
                              {depositSettings.depositType === 'SHIPPING' 
                                ? `Deposit equals shipping cost: ${formatPrice(selectedShipping?.price || 0)}`
                                : `Deposit is ${depositSettings.depositValue}% of order total: ${formatPrice(calculateDepositAmount())}`}
                            </p>
                            <p className="text-xs text-amber-600">
                              You'll need to complete the deposit payment before confirming your order.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium text-gray-900">{formatPrice(getSubtotal())}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipping ({selectedShipping?.governorateName}):</span>
                          <span className="font-medium text-indigo-600">{formatPrice(selectedShipping?.price || 0)}</span>
                        </div>
                        {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Deposit:</span>
                            <span className="font-medium text-amber-600">{formatPrice(calculateDepositAmount())}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>
                              {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired
                                ? 'Remaining (on delivery):'
                                : 'Total:'}
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
                          I agree to the Terms of Service and Privacy Policy. I understand that this order is subject to vendor approval and shipping times.
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button" onClick={() => setStep(1)} disabled={isLoading}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                        style={{
                          background: `linear-gradient(to right, ${cartData?.primaryColor || '#4f46e5'}, ${cartData?.secondaryColor || '#8b5cf6'})`
                        }}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            <span>Place Order</span>
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
            <div className="bg-white rounded-2xl p-8 border border-gray-100 sticky top-8">
              <div className="flex items-center space-x-3 mb-6">
                {cartData.storeLogo ? (
                  <img src={cartData.storeLogo} alt={cartData.storeName} className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-gray-600" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{cartData.storeName}</h3>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Cost</span>
                  <span className={`font-medium ${selectedShipping ? 'text-gray-900' : 'text-gray-400'}`}>
                    {selectedShipping ? formatPrice(selectedShipping.price) : '— Select governorate'}
                  </span>
                </div>
                {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit</span>
                    <span className="font-medium text-amber-600">
                      {selectedShipping ? formatPrice(calculateDepositAmount()) : '—'}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>
                      {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired
                        ? 'To Pay Now'
                        : 'Total'}
                    </span>
                    <span className="text-indigo-600">
                      {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired
                        ? formatPrice(calculateDepositAmount())
                        : formatPrice(getTotal())}
                    </span>
                  </div>
                  {selectedPaymentMethod?.paymentMethodName === 'COD' && depositSettings?.depositRequired && (
                    <p className="text-sm text-gray-500 mt-2">
                      Remaining {formatPrice(getTotal() - calculateDepositAmount())} on delivery
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Estimated Delivery</div>
                    <div className="text-sm text-blue-700">2-4 business days within Egypt</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Order Process</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</div>
                    <span>Create Customer Account</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">2</div>
                    <span>Create Order with Items & Variants</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">3</div>
                    <span>Send Order Confirmation</span>
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