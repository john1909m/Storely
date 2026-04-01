// src/components/vendor/StoreSettings/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { storeAPI } from '../../api/store.api';
import { categoryAPI } from '../../api/category.api';
import { shippingAPI } from '../../api/shipping.api';
import { paymentAPI } from '../../api/payment.api';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import useAuthStore from '../../store/authStore';
import BasicInfoTab from './storeSettings/BasicInfoTab';
import ShippingTab from './storeSettings/ShippingTab';
import DepositTab from './storeSettings/DepositTab';
import PaymentTab from './storeSettings/PaymentTab';
import BrandingTab from './storeSettings/BrandingTab';
import ContactTab from './storeSettings/ContactTab';
import SocialTab from './storeSettings/SocialTab';
import DomainTab from './storeSettings/DomainTab';
import { Store } from 'lucide-react';

const StoreSettings = ({ activeTab, setActiveTab, store, vendor, saveButtonRef, showToast }) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { handleError } = useErrorHandler();
  const savingRef = useRef(false);

  // Store info state
  const [storeInfo, setStoreInfo] = useState({
    storeName: '',
    storeDescription: '',
    storePhone: '',
    storeAddress: '',
    categoryId: '',
    createdAt: '',
    storeStatus: store.storeStatus || 'Inactive',
    fontFamily: 'Poppins',
    totalVisits: 0
  });

  // Branding state
  const [branding, setBranding] = useState({
    primaryColor: '#4f46e5',
    secondaryColor: '#8b5cf6',
    storeLogoUrl: '',
    themeType: 'CLASSIC'
  });

  // Social media state
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: '',
  });

  // Deposit state
  const [depositSettings, setDepositSettings] = useState({
    depositType: 'PERCENTAGE',
    depositValue: 10,
    instapayNumber: '',
    vodafoneCashNumber: '',
    depositRequired: true
  });

  // Shipping state
  const [governorates, setGovernorates] = useState([]);
  const [shippingCosts, setShippingCosts] = useState([]);
  const [loadingGovernorates, setLoadingGovernorates] = useState(false);
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [tempShippingPrice, setTempShippingPrice] = useState('');

  // Available categories
  const [categories, setCategories] = useState([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentStats, setPaymentStats] = useState({
    totalActive: 0,
    instapayConfigured: false,
    vodafoneConfigured: false,
    codEnabled: false
  });

  const availableMethods = [
    { id: 1, name: 'INSTAPAY', displayName: t('vendorStoreDetails.paymentMethods.instapay'), icon: '/instapay.webp', color: 'emerald', description: t('vendorStoreDetails.paymentMethods.instapayDescription') },
    { id: 2, name: 'VODAFONE_CASH', displayName: t('vendorStoreDetails.paymentMethods.vodafoneCash'), icon: '/vodafoneCash.webp', color: 'red', description: t('vendorStoreDetails.paymentMethods.vodafoneCashDescription') },
    { id: 3, name: 'COD', displayName: t('vendorStoreDetails.paymentMethods.cod'), icon: null, color: 'blue', description: t('vendorStoreDetails.paymentMethods.codDescription') }
  ];

  // Payment methods handlers
  const getMethodByName = (name) => {
    return paymentMethods.find(m => m.paymentMethodName === name) || {
      paymentMethodName: name,
      isActive: false,
      accountNumber: '',
      accountName: ''
    };
  };

  const isMethodActive = (name) => {
    const method = paymentMethods.find(m => m.paymentMethodName === name);
    return method?.isActive || false;
  };

  const getMethodAccount = (name, field) => {
    const method = paymentMethods.find(m => m.paymentMethodName === name);
    return method?.[field] || '';
  };

  const updateMethod = (name, field, value) => {
    setPaymentMethods(prev => {
      const index = prev.findIndex(m => m.paymentMethodName === name);
      
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      } else {
        // تعيين الـ paymentMethodId بناءً على الاسم
        let methodId = null;
        if (name === 'INSTAPAY') methodId = 1;
        else if (name === 'VODAFONE_CASH') methodId = 2;
        else if (name === 'COD') methodId = 3;
        
        const newMethod = {
          id: null,
          storeId: store?.id,
          paymentMethodId: methodId,
          paymentMethodName: name,
          accountNumber: field === 'accountNumber' ? value : '',
          accountName: field === 'accountName' ? value : '',
          isActive: field === 'isActive' ? value : false
        };
        
        return [...prev, newMethod];
      }
    });
  };

  const toggleMethod = (name) => {
    const currentActive = isMethodActive(name);
    updateMethod(name, 'isActive', !currentActive);
  };

  useEffect(() => {
    fetchAllData();
  }, [store]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      await Promise.all([
        fetchStoreData(),
        fetchGovernorates(),
        fetchShippingCosts(),
        fetchPaymentMethods()
      ]);

    } catch (err) {
      handleError(err);
      showToast(err.message || t('vendorStoreDetails.errors.fetchFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreData = async () => {
    try {
      if (store?.id) {
        const storeData = await storeAPI.getById(store.id);
        
        setStoreInfo({
          storeName: storeData.storeName || '',
          storeDescription: storeData.storeDescription || '',
          storePhone: storeData.storePhone || '',
          storeAddress: storeData.storeAddress || '',
          categoryId: storeData.categoryId || '',
          createdAt: storeData.createdAt || new Date().toISOString(),
          storeStatus: storeData.storeStatus || 'Inactive',
          fontFamily: storeData.fontFamily || 'Poppins',
          totalVisits: storeData.totalVisits || 0
        });

        setBranding({
          primaryColor: storeData.primaryColor || '#4f46e5',
          secondaryColor: storeData.secondaryColor || '#8b5cf6',
          storeLogoUrl: storeData.storeLogoUrl || '',
          themeType: storeData.themeType || 'CLASSIC'
        });

        setSocialMedia({
          facebook: storeData.facebook || '',
          instagram: storeData.instagram || '',
        });
        
        // Fetch deposit settings separately
        try {
          const depositResponse = await storeAPI.getDepositSettings(store.id);
          const depositData = await depositResponse.json();
          console.log('Fetched deposit settings:', depositData);
          if (depositData) {
            setDepositSettings({
              depositType: depositData.depositType || 'PERCENTAGE',
              depositValue: depositData.depositValue || 10,
              instapayNumber: depositData.instapayNumber || '',
              vodafoneCashNumber: depositData.vodafoneCashNumber || '',
              depositRequired: depositData.depositRequired !== false
            });
          }
          else{
            setDepositSettings(prev => ({
              ...prev,
              depositType: 'PERCENTAGE',
              depositValue: 10,
              instapayNumber: '',
              vodafoneCashNumber: '',
              depositRequired: false
            }));

          }
        } catch (depositErr) {
          console.error('Failed to fetch deposit settings:', depositErr);
        }
      }

      const storeCategories = await categoryAPI.getByStore(store.id);
      setCategories(storeCategories || []);

    } catch (err) {
      console.error('Failed to fetch store data:', err);
      handleError(err);
      showToast(err.message || t('vendorStoreDetails.errors.fetchFailed'), 'error');
    }
  };

  const fetchGovernorates = async () => {
    try {
      setLoadingGovernorates(true);
      const data = await shippingAPI.get_governments();
      setGovernorates(data || []);
    } catch (err) {
      handleError(err);
      showToast(err.message || t('vendorStoreDetails.errors.fetchGovernoratesFailed'), 'error');
    } finally {
      setLoadingGovernorates(false);
    }
  };

  const fetchShippingCosts = async () => {
    try {
      if (store?.id) {
        const data = await shippingAPI.get(store.id);
        const unique = (data || []).reduce((acc, cost) => {
          const exists = acc.find(c => c.governorateId === cost.governorateId);
          if (!exists) acc.push(cost);
          return acc;
        }, []);
        setShippingCosts(unique);
      }
    } catch (err) {
      handleError(err);
      showToast(err.message || t('vendorStoreDetails.errors.fetchShippingFailed'), 'error');
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      if (!store?.id) return;

      const response = await paymentAPI.getPaymentMethods(store.id);
      
      let data = response;
      if (response && typeof response.json === 'function') {
        data = await response.json();
      }
      
      const methods = (data || []).map(method => ({
        id: method.id,
        storeId: method.storeId,
        paymentMethodId: method.paymentMethodId || 
                         (method.paymentMethodName === 'INSTAPAY' ? 1 : 
                          method.paymentMethodName === 'VODAFONE_CASH' ? 2 : 
                          method.paymentMethodName === 'COD' ? 3 : null),
        paymentMethodName: method.paymentMethodName,
        accountNumber: method.accountNumber || '',
        accountName: method.accountName || '',
        isActive: method.isActive || false
      }));

      setPaymentMethods(methods);

      const activeCount = methods.filter(m => m.isActive).length;
      const instapay = methods.find(m => m.paymentMethodName === 'INSTAPAY');
      const vodafone = methods.find(m => m.paymentMethodName === 'VODAFONE_CASH');
      const cod = methods.find(m => m.paymentMethodName === 'COD');

      setPaymentStats({
        totalActive: activeCount,
        instapayConfigured: instapay?.isActive || false,
        vodafoneConfigured: vodafone?.isActive || false,
        codEnabled: cod?.isActive || false
      });

    } catch (err) {
      console.error('Fetch payment methods error:', err);
      handleError(err);
      showToast(err.message || t('vendorStoreDetails.errors.fetchPaymentFailed'), 'error');
    }
  };

  const handleStoreInfoChange = (field, value) => {
    setStoreInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleBrandingChange = (field, value) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (field, value) => {
    setSocialMedia(prev => ({ ...prev, [field]: value }));
  };

  const handleDepositChange = (field, value) => {
    setDepositSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingToggle = (governorateId) => {
    setShippingCosts(prev => {
      const exists = prev.find(c => c.governorateId === governorateId);
      if (exists) {
        return prev.filter(c => c.governorateId !== governorateId);
      } else {
        return [...prev, { governorateId, price: 0 }];
      }
    });
  };

  const handleShippingPriceChange = (governorateId, price) => {
    setShippingCosts(prev => 
      prev.map(c => 
        c.governorateId === governorateId 
          ? { ...c, price: parseFloat(price) || 0 }
          : c
      )
    );
  };

  const startEditingShipping = (cost) => {
    setEditingShippingId(cost.governorateId);
    setTempShippingPrice(cost.price.toString());
  };

  const saveEditingShipping = (governorateId) => {
    handleShippingPriceChange(governorateId, tempShippingPrice);
    setEditingShippingId(null);
    setTempShippingPrice('');
  };

  const cancelEditingShipping = () => {
    setEditingShippingId(null);
    setTempShippingPrice('');
  };

  const getGovernorateName = (id) => {
    const gov = governorates.find(g => g.id === id);
    return gov ? gov.name : t('vendorStoreDetails.governoratePrefix') + id;
  };

  const getShippingCost = (governorateId) => {
    const cost = shippingCosts.find(c => c.governorateId === governorateId);
    return cost ? cost.price : null;
  };

  const isShippingSelected = (governorateId) => {
    return shippingCosts.some(c => c.governorateId === governorateId);
  };

  const getStoreUrl = () => {
    if (!store?.storeName) return '';
    return `${window.location.origin}/store/${store.storeName}`;
  };

  const handleSaveDeposit = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    
    try {
      setSaving(true);

      if (!store?.id) {
        showToast(t('vendorStoreDetails.errors.storeNotFound'), 'error');
        return;
      }

      if (depositSettings.depositRequired && 
          !depositSettings.instapayNumber && 
          !depositSettings.vodafoneCashNumber) {
        showToast(t('vendorStoreDetails.errors.depositPaymentRequired'), 'error');
        return;
      }

      const depositData = {
        storeId: store.id,
        depositType: depositSettings.depositType,
        depositValue: depositSettings.depositValue,
        instapayNumber: depositSettings.instapayNumber,
        vodafoneCashNumber: depositSettings.vodafoneCashNumber,
        depositRequired: depositSettings.depositRequired
      };

      await storeAPI.updateDepositSettings(depositData);
      
      showToast(t('vendorStoreDetails.success.depositSaved'), 'success');
    } catch (err) {
      handleError(err);
      showToast(err.message || t('vendorStoreDetails.errors.saveDepositFailed'), 'error');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const handleSavePaymentMethods = async () => {

    
    if (savingRef.current) return;
    savingRef.current = true;

    try {
      setSaving(true);

      if (!store?.id) {
        showToast(t('vendorStoreDetails.errors.storeNotFound'), 'error');
        return;
      }

      // تأكد من البيانات قبل الإرسال
      const methodsToSend = paymentMethods
    .filter(method => method.paymentMethodId !== null && method.paymentMethodName !== null) // ← أضف دي
    .map(method => {
        let paymentMethodId = method.paymentMethodId;
        if (!paymentMethodId) {
            if (method.paymentMethodName === 'INSTAPAY') paymentMethodId = 1;
            else if (method.paymentMethodName === 'VODAFONE_CASH') paymentMethodId = 2;
            else if (method.paymentMethodName === 'COD') paymentMethodId = 3;
        }
        return {
            id: method.id,
            storeId: store.id,
            paymentMethodId: paymentMethodId,
            paymentMethodName: method.paymentMethodName,
            accountNumber: method.accountNumber || '',
            accountName: method.accountName || '',
            isActive: method.isActive || false
        };
    });
console.log('paymentMethods state:', paymentMethods); // ← شوف الـ paymentMethodId موجود ولا null
    console.log('methodsToSend:', methodsToSend);
      const response = await paymentAPI.addPaymentMethod(store.id, methodsToSend);
      
      if (response && typeof response.json === 'function') {
        const data = await response.json();
        if (response.ok) {
          await fetchPaymentMethods();
          showToast(t('vendorStoreDetails.success.paymentMethodsSaved'), 'success');
        } else {
          throw new Error(data.message_en || data.message || 'Save failed');
        }
      } else if (response) {
        await fetchPaymentMethods();
        showToast(t('vendorStoreDetails.success.paymentMethodsSaved'), 'success');
      }

    } catch (err) {
      console.error('Save payment methods error:', err);
      handleError(err);
      showToast(err.message || t('vendorStoreDetails.errors.savePaymentFailed'), 'error');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    
    try {
      setSaving(true);

      const uniqueShippingCosts = shippingCosts.reduce((acc, cost) => {
        const exists = acc.find(c => c.governorateId === cost.governorateId);
        if (!exists) {
          acc.push(cost);
        }
        return acc;
      }, []);

      if (!store?.id) {
        showToast(t('vendorStoreDetails.errors.storeNotFound'), 'error');
        return;
      }

      const updateData = {
        id: store.id,
        vendorId: vendor?.id,
        vendorName: vendor?.name,
        storeName: storeInfo.storeName,
        storeDescription: storeInfo.storeDescription,
        storePhone: storeInfo.storePhone,
        storeAddress: storeInfo.storeAddress,
        createdAt: storeInfo.createdAt || new Date().toISOString(),
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        storeLogoUrl: branding.storeLogoUrl,
        themeType: branding.themeType,
        fontFamily: storeInfo.fontFamily || 'Poppins',
        facebook: socialMedia.facebook,
        instagram: socialMedia.instagram,
        storeStatus: storeInfo.storeStatus,
        products: store?.products || [],
        categories: categories || [],
        orders: store?.orders || [],
        customerIds: [],
        shippingCosts: uniqueShippingCosts.map(cost => ({
          governorateId: cost.governorateId,
          price: parseFloat(cost.price) || 0
        })),
        depositType: depositSettings.depositType,
        depositValue: depositSettings.depositValue,
        instapayNumber: depositSettings.instapayNumber,
        vodafoneCashNumber: depositSettings.vodafoneCashNumber,
        depositRequired: depositSettings.depositRequired
      };

      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      await storeAPI.update(updateData);
      
      showToast(t('vendorStoreDetails.success.storeDetailsSaved'), 'success');
    } catch (err) {
      handleError(err);
      showToast(err.message || t('vendorStoreDetails.errors.saveFailed'), 'error');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const handleImageUpload = async (file, type) => {
    try {
      type === "logo" && setUploadingLogo(true);

      const MAX_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        showToast(t('vendorStoreDetails.errors.fileTooLarge'), 'error');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await storeAPI.uploadImage(store.id, formData);
      const data = await response.json();

      if (data.url) {
        if (type === "logo") {
          setBranding(prev => ({ ...prev, storeLogoUrl: data.url }));
        }
        showToast(t('vendorStoreDetails.success.imageUploaded'), 'success');
      } else {
        throw new Error('No URL returned');
      }

    } catch (err) {
      handleError(err);
      showToast(err.message || t('vendorStoreDetails.errors.uploadFailed'), 'error');
    } finally {
      type === "logo" && setUploadingLogo(false);
    }
  };

  const handleRemoveImage = async (type) => {
    try {
      if (!window.confirm(t('vendorStoreDetails.confirm.removeImage', { type }))) {
        return;
      }

      if (type === 'logo') {
        setBranding(prev => ({ ...prev, storeLogoUrl: '' }));
        
        await storeAPI.update({
          id: store.id,
          storeLogoUrl: ''
        });
      }

      showToast(t('vendorStoreDetails.success.imageRemoved'), 'success');
    } catch (err) {
      handleError(err);
      showToast(err.message || t('vendorStoreDetails.errors.removeFailed'), 'error');
    }
  };

  const handleDownloadQR = () => {
    if (!getStoreUrl()) {
      showToast(t('vendorStoreDetails.errors.urlNotSet'), 'error');
      return;
    }

    const storeUrl = getStoreUrl();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(storeUrl)}`;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${storeInfo.storeName || 'store'}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(t('vendorStoreDetails.success.qrDownloaded'), 'success');
  };

  const handleCopyStoreLink = async () => {
    if (!getStoreUrl()) {
      showToast(t('vendorStoreDetails.errors.urlNotSet'), 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(getStoreUrl());
      showToast(t('vendorStoreDetails.success.linkCopied'), 'success');
    } catch (err) {
      handleError(err);
      showToast(t('vendorStoreDetails.errors.copyFailed'), 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return date.toLocaleDateString(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const commonProps = {
    storeInfo,
    branding,
    socialMedia,
    depositSettings,
    shippingCosts,
    governorates,
    loadingGovernorates,
    editingShippingId,
    tempShippingPrice,
    categories,
    uploadingLogo,
    paymentMethods,
    paymentStats,
    isMethodActive,
    toggleMethod,
    getMethodAccount,
    updateMethod,
    t,
    formatDate,
    formatPrice,
    getStoreUrl,
    getGovernorateName,
    getShippingCost,
    isShippingSelected,
    handleStoreInfoChange,
    handleBrandingChange,
    handleSocialMediaChange,
    handleDepositChange,
    handleShippingToggle,
    handleShippingPriceChange,
    startEditingShipping,
    saveEditingShipping,
    cancelEditingShipping,
    handleSaveDeposit,
    handleSavePaymentMethods,
    handleSave,
    handleImageUpload,
    handleRemoveImage,
    handleDownloadQR,
    handleCopyStoreLink,
    saving,
    setTempShippingPrice
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <Store className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 font-medium">{t('vendorStoreDetails.loading.storeSettings')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('vendorStoreDetails.loading.pleaseWait')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeTab === 'basic' && <BasicInfoTab {...commonProps} />}
      {activeTab === 'shipping' && <ShippingTab {...commonProps} />}
      {activeTab === 'deposit' && <DepositTab {...commonProps} />}
      {activeTab === 'payment' && <PaymentTab {...commonProps} />}
      {activeTab === 'branding' && <BrandingTab {...commonProps} />}
      {activeTab === 'contact' && <ContactTab {...commonProps} />}
      {activeTab === 'social' && <SocialTab {...commonProps} />}
      {activeTab === 'domain' && <DomainTab {...commonProps} />}
      <button
        ref={saveButtonRef}
        onClick={handleSave}
        className="store-settings-save hidden"
      />
    </div>
  );
};

export default StoreSettings;