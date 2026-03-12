// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, Lock, Truck,
  MapPin, User, Mail, Phone,
  CheckCircle, Shield, Loader2,
  ShoppingBag, AlertCircle, Package, Palette, Ruler, ChevronDown,
  Wallet, Camera, Upload, X, Smartphone, Copy
} from 'lucide-react';
import { orderAPI } from '../../api/order.api';
import { customerAPI } from '../../api/customer.api';
import { shippingAPI } from '../../api/shipping.api';
import { storeAPI } from '../../api/store.api';
import StoreFooter from '../../components/StoreFooter';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { se } from 'date-fns/locale';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [depositSettings, setDepositSettings] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositProof, setDepositProof] = useState(null);
  const [depositProofPreview, setDepositProofPreview] = useState(null);
  const [uploadingDeposit, setUploadingDeposit] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [depositError, setDepositError] = useState(null);
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
      console.log('Deposit settings:', settings);
      setDepositSettings(settings);
    } catch (err) {
      console.error('Error fetching deposit settings:', err);
      // Don't show error, deposit might be optional
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
      setStep(2);
      return;
    }

    if (step === 2) {
      
      // في حالة عدم وجود deposit مطلوب
      if(!depositSettings.depositRequired) {
        setIsLoading(true);
        setError(null);

        try {
          const orderResponse = await createOrder();

          if (!orderResponse || !orderResponse.id) {
            throw new Error('Failed to create order');
          }

          // إظهار Modal التأكيد
          setDepositSuccess(true);
          
          // تأخير قبل التوجيه
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
      }else{
        const amount = calculateDepositAmount();
        setDepositAmount(amount);
        setShowDepositModal(true);
      }
      
    }

    
  };

  const handleDepositProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // تحقق من حجم الصورة (5MB كحد أقصى)
      if (file.size > 5 * 1024 * 1024) {
        setDepositError('File too large. Maximum size is 5MB');
        return;
      }
      
      // تحقق من نوع الصورة
      if (!file.type.startsWith('image/')) {
        setDepositError('Please upload an image file');
        return;
      }
      
      setDepositProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDepositProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text, type) => {
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

    const orderData = {
      storeId: cartData.storeId,
      customerId: customerResponse.id,
      shippingCost: shippingCost,
      governorateId: selectedShipping?.governorateId || null,
      governorateName: selectedShipping?.governorateName || null,
      subtotal: subtotal,
      totalPrice: totalPrice,
      depositAmount: depositAmount,
      depositRequired: depositSettings?.depositRequired || false,
      depositStatus: depositSettings?.depositRequired ? 'pending' : 'not_required',
      items: cartData.items.map(item => ({
        productId: item.productId || item.id,
        price: item.price,
        quantity: item.quantity,
        color: item.color || null,
        size: item.size || null,
        variantId: item.variantId || null
      })),
    };

    const orderResponse = await orderAPI.checkout(orderData);
    return orderResponse;
  };

  const handleDepositConfirm = async () => {
    if (!depositProof) {
      setDepositError('Please upload proof of payment');
      return;
    }

    setUploadingDeposit(true);
    setDepositError(null);

    let createdOrderId = null;

    try {
      // 1. إنشاء الطلب
      console.log('📝 Creating order with deposit...');
      const orderResponse = await createOrder();
      
      if (!orderResponse || !orderResponse.id) {
        throw new Error('Failed to create order');
      }

      createdOrderId = orderResponse.id;
      console.log('✅ Order created:', createdOrderId);

      // 2. محاولة رفع صورة الإيداع
      try {
        const formData = new FormData();
        formData.append('screenshot', depositProof); // ✅ اسم الحقل "file" مهم
        
        // للتصحيح
        console.log('📤 Uploading file:', depositProof.name);
        console.log('📤 File size:', depositProof.size);
        console.log('📤 File type:', depositProof.type);
        
        await orderAPI.uploadDepositProof(createdOrderId, formData);
        console.log('✅ Deposit proof uploaded successfully');

      } catch (uploadError) {
        // لو فشل رفع الصورة، نحذف الطلب اللي اتعمل
        console.error('❌ Upload failed, deleting order:', createdOrderId);
        
        try {
          // حذف الطلب
          await orderAPI.delete(createdOrderId);
          console.log('✅ Order deleted successfully');
        } catch (deleteError) {
          console.error('❌ Failed to delete order:', deleteError);
          // هنا ممكن تسجل error للـ admin
        }
        
        // نرمي الخطأ عشان نعرضه للمستخدم
        throw new Error('فشل رفع صورة الدفع. تم إلغاء الطلب.');
      }

      // 3. كل حاجة تمام
      setDepositSuccess(true);
      
      // 4. تنظيف الـ localStorage والتحويل بعد 3 ثواني
      setTimeout(() => {
        localStorage.removeItem('checkout_cart');
        if (cartData.storeName) localStorage.removeItem(`cart_${cartData.storeName}`);
        navigate(`/store/${cartData.storeName}?order=success`);
      }, 3000);

    } catch (err) {
      console.error('❌ Transaction error:', err);
      setDepositError(err.message || 'فشلت العملية. الرجاء المحاولة مرة أخرى.');
    } finally {
      setUploadingDeposit(false);
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

  const handleDepositModalClose = () => {
    if (!uploadingDeposit && !depositSuccess) {
      setShowDepositModal(false);
      setDepositProof(null);
      setDepositProofPreview(null);
      setDepositError(null);
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
      {/* Deposit Modal */}
      {showDepositModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleDepositModalClose}
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
                  <p className="text-sm text-gray-500">Complete payment to confirm order</p>
                </div>
              </div>
              {!uploadingDeposit && !depositSuccess && (
                <button
                  onClick={handleDepositModalClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>

            <div className="p-6 space-y-6">
              {depositSuccess ? (
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
                  {/* Deposit Amount */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white">
                    <h4 className="font-medium mb-2">Amount to Pay</h4>
                    <div className="text-3xl font-bold">{formatPrice(depositAmount)}</div>
                    <p className="text-sm text-amber-100 mt-1">
                      {depositSettings?.depositType === 'SHIPPING' 
                        ? 'Deposit equals shipping cost'
                        : `${depositSettings?.depositValue}% of order total`}
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Payment Methods</h4>
                    
                    {depositSettings?.instapayNumber && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-5 w-5 text-amber-600" />
                            <span className="font-medium">Instapay</span>
                          </div>
                          <button
                            onClick={() => handleCopy(depositSettings.instapayNumber, 'instapay')}
                            className="text-sm text-amber-600 hover:text-amber-700 flex items-center space-x-1"
                          >
                            <Copy className="h-4 w-4" />
                            <span>{copiedInstapay ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-lg font-mono text-gray-900">{depositSettings.instapayNumber}</p>
                      </div>
                    )}

                    {depositSettings?.vodafoneCashNumber && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-amber-600" />
                            <span className="font-medium">Vodafone Cash</span>
                          </div>
                          <button
                            onClick={() => handleCopy(depositSettings.vodafoneCashNumber, 'vodafone')}
                            className="text-sm text-amber-600 hover:text-amber-700 flex items-center space-x-1"
                          >
                            <Copy className="h-4 w-4" />
                            <span>{copiedVodafone ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-lg font-mono text-gray-900">{depositSettings.vodafoneCashNumber}</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Proof */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Upload Payment Proof</h4>
                    
                    {!depositProofPreview ? (
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-1">Click to upload screenshot</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleDepositProofUpload}
                            className="hidden"
                          />
                        </div>
                      </label>
                    ) : (
                      <div className="relative">
                        <img 
                          src={depositProofPreview} 
                          alt="Deposit proof" 
                          className="w-full rounded-xl border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setDepositProof(null);
                            setDepositProofPreview(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {depositError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm">{depositError}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleDepositModalClose}
                      disabled={uploadingDeposit}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDepositConfirm}
                      disabled={uploadingDeposit || !depositProof}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {uploadingDeposit ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>Confirm Payment</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* رسالة تحذير للمستخدم */}
                  {uploadingDeposit && (
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

      {/* باقي الكود زي ما هو ... */}
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
                      disabled={isLoading || shippingOptions.length === 0}
                      className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Review Order
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h3>

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

                    {/* Deposit Info - if required */}
                    {depositSettings?.depositRequired && (
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
                        {depositSettings?.depositRequired && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Deposit:</span>
                            <span className="font-medium text-amber-600">{formatPrice(calculateDepositAmount())}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span className="text-indigo-600">{formatPrice(getTotal())}</span>
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
                        type="submit" disabled={isLoading}
                        className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <CheckCircle className="h-5 w-5" />
                        <span>Place Order</span>
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
                {depositSettings?.depositRequired && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit</span>
                    <span className="font-medium text-amber-600">
                      {selectedShipping ? formatPrice(calculateDepositAmount()) : '—'}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">{formatPrice(getTotal())}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">All prices in Egyptian Pound (EGP)</p>
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