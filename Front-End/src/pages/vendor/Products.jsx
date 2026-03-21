// src/pages/vendor/VendorProducts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Search, Edit, Trash2, Eye, Plus, Package, Tag, TrendingUp,
  ArrowLeft, AlertCircle, X, Save, Image, DollarSign, Hash,
  BookOpen, Globe, Layers, Check, Move, Loader2, FileTypeCorner,
  Upload, XCircle, ArrowUp, ArrowDown, GripVertical,
  ChevronRight, Menu, Grid, List, Filter, Download,
  Sparkles, Clock, BadgePercent, Camera, Film, FolderOpen, Star, Store, Brush, MapPin, Facebook, Globe as GlobeIcon,
  Palette, Ruler, Layers as VariantsIcon, PlusCircle, MinusCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productAPI } from '../../api/product.api';
import { categoryAPI } from '../../api/category.api';
import { format } from 'date-fns';
import StoreFooter from '../../components/StoreFooter';
import { id } from 'date-fns/locale';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import useAuthStore from '../../store/authStore';
import { useTranslation } from 'react-i18next';

const VendorProducts = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Image upload states
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  
  // State for managing existing photos in edit mode
  const [existingPhotos, setExistingPhotos] = useState([]);
  
  // Product variants states
  const [hasColors, setHasColors] = useState(false);
  const [hasSizes, setHasSizes] = useState(false);
  const [variants, setVariants] = useState([]);
  
  // Available colors and sizes for selection
  const [availableColors, setAvailableColors] = useState([
    { id: 'red', name: 'Red', value: '#FF0000' },
    { id: 'blue', name: 'Blue', value: '#0000FF' },
    { id: 'green', name: 'Green', value: '#00FF00' },
    { id: 'black', name: 'Black', value: '#000000' },
    { id: 'white', name: 'White', value: '#FFFFFF' },
    { id: 'yellow', name: 'Yellow', value: '#FFFF00' },
    { id: 'purple', name: 'Purple', value: '#800080' },
    { id: 'orange', name: 'Orange', value: '#FFA500' },
    { id: 'gray', name: 'Gray', value: '#808080' },
    { id: 'brown', name: 'Brown', value: '#A52A2A' },
    { id: 'pink', name: 'Pink', value: '#FFC0CB' },
    { id: 'gold', name: 'Gold', value: '#FFD700' }
  ]);
  
  const [availableSizes, setAvailableSizes] = useState([
    { id: 'xs', name: 'XS' },
    { id: 's', name: 'S' },
    { id: 'm', name: 'M' },
    { id: 'l', name: 'L' },
    { id: 'xl', name: 'XL' },
    { id: 'xxl', name: 'XXL' },
    { id: 'xxxl', name: 'XXXL' },
    {id:'4xl',name:'4XL'},
    { id:'5',name:'5'}, { id:'6',name:'6'}, { id:'7',name:'7'}, { id:'8',name:'8'},
    { id:'9',name:'9'}, { id:'10',name:'10'}, { id:'11',name:'11'}, { id:'12',name:'12'},
    { id:'13',name:'13'}, { id:'14',name:'14'}, { id:'15',name:'15'}, { id:'16',name:'16'},
    { id:'17',name:'17'}, { id:'18',name:'18'}, { id:'19',name:'19'}, { id:'20',name:'20'},
    { id:'21',name:'21'}, { id:'22',name:'22'}, { id:'23',name:'23'}, { id:'24',name:'24'},
    { id:'25',name:'25'}, { id:'26',name:'26'}, { id:'27',name:'27'}, { id:'28',name:'28'},
    { id:'29',name:'29'}, { id:'30',name:'30'}, { id:'32',name:'32'}, { id:'33',name:'33'},
    { id:'34',name:'34'}, { id:'35',name:'35'}, { id:'36',name:'36'}, { id:'37',name:'37'},
    { id:'38',name:'38'}, { id:'39',name:'39'}, { id:'40',name:'40'}, { id:'41',name:'41'},
    { id:'42',name:'42'}, { id:'43',name:'43'}, { id:'44',name:'44'}, { id:'45',name:'45'},
    { id:'46',name:'46'}, { id:'47',name:'47'}, { id:'48',name:'48'}, { id:'49',name:'49'},
    { id:'50',name:'50'},
  ]);
  
  const { 
    store, 
    isVendor, 
    isLoading: authLoading, 
    isAuthenticated,
    setStore 
  } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const { handleError } = useErrorHandler();

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    quantity: '',
    categoryId: '',
    storeId: store?.id || '',
    variants: []
  });

  // Edit product form state
  const [editProduct, setEditProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    quantity: '',
    categoryId: '',
    categoryName: '',
    storeId: store?.id || '',
    variants: []
  });

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !isVendor) {
      setError(t('vendor.products.errors.accessDenied'));
      setIsLoading(false);
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!store || !store.id) {
      setError(t('vendor.products.errors.storeRequired'));
      setIsLoading(false);
      navigate('/vendor/store/create');
      return;
    }

    setNewProduct(prev => ({ ...prev, storeId: store.id }));
    setEditProduct(prev => ({ ...prev, storeId: store.id }));
    
    fetchData();
  }, [authLoading, isAuthenticated, isVendor, store, navigate, location, t]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const storeProducts = await productAPI.getAll(store.id);
      const formattedProducts = storeProducts.map(p => ({
      ...p,
      categoryId: p.categoryId || p.category?.id || null,
      categoryName: p.categoryName || p.category?.name || null,
      quantity:p.quantity || 0
    }));
      setProducts(Array.isArray(formattedProducts) ? formattedProducts : []);
      
      const storeCategories = await categoryAPI.getByStore(store.id);
      const validCategories = storeCategories.map(cat => ({
      ...cat,
      id: cat.id || cat.categoryId,
    }));
      setCategories(Array.isArray(validCategories) ? validCategories : []);
      
    } catch (err) {
      handleError(err);
      setProducts([]);
      setCategories([]);
      
      if (err.message?.includes('not found') || err.response?.status === 404) {
        setError(t('vendor.products.errors.storeNotFound'));
        setStore(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ============ CLOUDFLARE R2 IMAGE UPLOAD FUNCTIONS ============

  const uploadMultipleImagesToR2 = async (files, productId) => {
    if (!store?.id) throw new Error('Store not found');
    if (!productId) throw new Error('Product ID is required');

    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('files', file);
      console.log(`📦 Appending file ${index + 1}: ${file.name}`);
    });

    console.log(`📤 Uploading ${files.length} images to Cloudflare R2 in one request...`);

    try {
      const response = await productAPI.uploadProductImage(productId, formData);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to upload images');
      }

      const data = await response.json();
      console.log(`✅ Uploaded ${data.url?.length || 0} images successfully:`, data.url);
      
      return data.url;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const uploadSelectedImages = async (productId) => {
    if (selectedImages.length === 0) return [];
    
    setUploadingImages(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`Image ${file.name} is too large. Max size is 5MB.`);
        }
        
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image.`);
        }
      }

      setUploadProgress(50);
      
      const imageUrls = await uploadMultipleImagesToR2(selectedImages, productId);
      
      setUploadProgress(100);
      
      const uploadedImages = imageUrls.map((url, index) => ({
        url: url,
        position: index,
        altText: `Product image ${index + 1}`
      }));
      
      setUploadSuccess(`${uploadedImages.length} ${t('vendor.products.imageUpload.images')} ${t('vendor.products.imageUpload.uploadedSuccess')}`);
      setTimeout(() => setUploadSuccess(null), 3000);
      
      return uploadedImages;
      
    } catch (err) {
      handleError(err);
      setUploadError(err.message);
      throw err;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files);
    
    const validImages = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File ${file.name} ${t('vendor.products.imageUpload.fileTooLarge')}`);
        setTimeout(() => setUploadError(null), 3000);
        return false;
      }
      
      if (!file.type.startsWith('image/')) {
        setUploadError(`File ${file.name} ${t('vendor.products.imageUpload.notImage')}`);
        setTimeout(() => setUploadError(null), 3000);
        return false;
      }
      
      return true;
    });
    
    if (validImages.length > 0) {
      setSelectedImages(prev => [...prev, ...validImages]);
      setUploadError(null);
    }
    
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      handleImageSelection({ target: { files } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImageUp = (index) => {
    if (index === 0) return;
    
    const newImages = [...selectedImages];
    [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    setSelectedImages(newImages);
  };

  const moveImageDown = (index) => {
    if (index === selectedImages.length - 1) return;
    
    const newImages = [...selectedImages];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setSelectedImages(newImages);
  };

  const clearAllImages = () => {
    setSelectedImages([]);
    setUploadProgress(0);
  };

  const removeExistingPhoto = (index) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const moveExistingPhotoUp = (index) => {
    if (index === 0) return;
    
    const newPhotos = [...existingPhotos];
    [newPhotos[index], newPhotos[index - 1]] = [newPhotos[index - 1], newPhotos[index]];
    setExistingPhotos(newPhotos);
  };

  const moveExistingPhotoDown = (index) => {
    if (index === existingPhotos.length - 1) return;
    
    const newPhotos = [...existingPhotos];
    [newPhotos[index], newPhotos[index + 1]] = [newPhotos[index + 1], newPhotos[index]];
    setExistingPhotos(newPhotos);
  };

  // ============ PRODUCT VARIANTS FUNCTIONS ============

  const resetVariantState = () => {
    setHasColors(false);
    setHasSizes(false);
    setVariants([]);
  };

  const handleHasColorsChange = (checked) => {
    setHasColors(checked);
    if (!checked) {
      setHasSizes(false);
      setVariants([]);
    } else {
      if (!hasSizes) {
        setVariants([{ productColor: '', productSize: null, quantity: 0 }]);
      }
    }
  };

  const handleHasSizesChange = (checked) => {
    setHasSizes(checked);
    if (!checked && hasColors) {
      const colorOnlyVariants = [];
      const uniqueColors = [...new Set(variants.map(v => v.productColor).filter(Boolean))];
      
      uniqueColors.forEach(color => {
        const totalQuantity = variants
          .filter(v => v.productColor === color)
          .reduce((sum, v) => sum + (v.quantity || 0), 0);
        
        if (totalQuantity > 0) {
          colorOnlyVariants.push({ productColor: color, productSize: null, quantity: totalQuantity });
        }
      });
      
      setVariants(colorOnlyVariants.length > 0 ? colorOnlyVariants : [{ productColor: '', productSize: null, quantity: 0 }]);
    } else if (checked && hasColors) {
      generateVariantMatrix();
    } else if (!checked && !hasColors) {
      setVariants([]);
    }
  };

  const generateVariantMatrix = () => {
    if (!hasColors || !hasSizes) return;
    
    const colors = [...new Set(variants.map(v => v.productColor).filter(Boolean))];
    const sizes = [...new Set(variants.map(v => v.productSize).filter(Boolean))];
    
    if (colors.length === 0 || sizes.length === 0) return;
    
    const matrix = [];
    
    colors.forEach(color => {
      sizes.forEach(size => {
        const existingVariant = variants.find(
          v => v.productColor === color && v.productSize === size
        );
        
        matrix.push({
          productColor: color,
          productSize: size,
          quantity: existingVariant ? existingVariant.quantity : 0
        });
      });
    });
    
    setVariants(matrix);
  };

  const addColor = () => {
    setVariants([...variants, { productColor: '', productSize: hasSizes ? '' : null, quantity: 0 }]);
  };

  const addSize = () => {
    if (!hasColors || !hasSizes) return;
    
    const newSize = prompt(t('vendor.products.prompts.enterNewSizeName'));
    if (!newSize) return;
    
    const newVariants = [];
    const colors = [...new Set(variants.map(v => v.productColor).filter(Boolean))];
    
    if (colors.length === 0) {
      setVariants([...variants, { productColor: '', productSize: newSize, quantity: 0 }]);
      return;
    }
    
    colors.forEach(color => {
      newVariants.push({
        productColor: color,
        productSize: newSize,
        quantity: 0
      });
    });
    
    setVariants([...variants, ...newVariants]);
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    
    if (field === 'quantity' && value < 0) {
      updatedVariants[index].quantity = 0;
    }
    
    setVariants(updatedVariants);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      setVariants([{ productColor: '', productSize: hasSizes ? '' : null, quantity: 0 }]);
      return;
    }
    
    setVariants(variants.filter((_, i) => i !== index));
  };

  const validateVariants = () => {
    if (hasColors && !hasSizes) {
      const colors = variants.map(v => v.productColor).filter(Boolean);
      const hasDuplicates = colors.some((color, index) => 
        colors.indexOf(color) !== index && color
      );
      
      if (hasDuplicates) {
        alert(t('vendor.products.errors.duplicateColors'));
        return false;
      }
    }
    
    if (hasColors && hasSizes) {
      const combinations = variants.map(v => `${v.productColor}|${v.productSize}`).filter(c => !c.includes('|'));
      const hasDuplicates = combinations.some((combo, index) => 
        combinations.indexOf(combo) !== index
      );
      
      if (hasDuplicates) {
        alert(t('vendor.products.errors.duplicateCombinations'));
        return false;
      }
    }
    
    const hasNegative = variants.some(v => v.quantity < 0);
    if (hasNegative) {
      alert(t('vendor.products.errors.negativeQuantity'));
      return false;
    }
    
    return true;
  };

  const getTotalVariantQuantity = () => {
    return variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
  };

  // ============ PRODUCT CRUD OPERATIONS ============

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProduct(true);
      
      if (!store?.id) {
        alert(t('vendor.products.errors.storeNotFound'));
        return;
      }

      let categoryIdValue = null;
      if (newProduct.categoryId && newProduct.categoryId !== '' && !isNaN(newProduct.categoryId)) {
        categoryIdValue = newProduct.categoryId;
      } else if (newProduct.categoryId && newProduct.categoryId !== '') {
        categoryIdValue = newProduct.categoryId;
      }
      
      if (hasColors && !validateVariants()) {
        setIsSavingProduct(false);
        return;
      }
      
      let finalVariants = [];
      if (hasColors) {
        if (hasSizes) {
          finalVariants = variants.filter(v => v.productColor && v.productSize && v.quantity > 0)
          .map(v => ({
            productColor: v.productColor,
            productSize: v.productSize,
            quantity: v.quantity,
            price:null
          }));
        } else {
          finalVariants = variants.filter(v => v.productColor && v.quantity > 0)
          .map(v => ({
            productColor: v.productColor,
            productSize: null,
            quantity: v.quantity,
            price:null
          }));
        }
      }
      
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        oldPrice: parseFloat(newProduct.oldPrice) || null,
        quantity: hasColors ? null : Number(newProduct.quantity) || 0,
        categoryId: newProduct.categoryId || null,
        storeId: store.id,
        variants: finalVariants,
        imageUrls: [],
        position: [],
        altText: []
      };
      
      const createdProduct = await productAPI.add(productData);
      
      let uploadedImages = [];
      
      if (selectedImages.length > 0) {
        try {
          uploadedImages = await uploadSelectedImages(createdProduct.id);
          
          const imageUrls = uploadedImages.map(img => img.url);
          const positions = uploadedImages.map(img => img.position);
          const altTexts = uploadedImages.map(img => img.altText);
          
          const updatedProduct = await productAPI.update({
            ...createdProduct,
            imageUrls: imageUrls,
            position: positions,
            altText: altTexts
          });
          
          setProducts(prev => [...prev, updatedProduct]);
        } catch (uploadErr) {
          setProducts(prev => [...prev, createdProduct]);
          handleError(uploadErr);
        }
      } else {
        setProducts(prev => [...prev, createdProduct]);
      }
      
      resetAddProductModal();
      
    } catch (err) {
      handleError(err);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProduct(true);
      
      if (!store?.id || !editProduct.id) {
        alert(t('vendor.products.errors.productOrStoreNotFound'));
        return;
      }

      let categoryIdValue = null;
      if (editProduct.categoryId && editProduct.categoryId !== '' && !isNaN(editProduct.categoryId)) {
        categoryIdValue = editProduct.categoryId;
      } else if (editProduct.categoryId && editProduct.categoryId !== '') {
        categoryIdValue = editProduct.categoryId;
      }

      if (hasColors && !validateVariants()) {
        setIsSavingProduct(false);
        return;
      }
      
      let finalVariants = [];
      if (hasColors) {
        if (hasSizes) {
          finalVariants = variants.filter(v => v.productColor && v.productSize && v.quantity > 0)
          .map(v => ({
            id: v.id,
            productColor: v.productColor,
            productSize: v.productSize,
            quantity: v.quantity,
            price:null
          }));
        } else {
          finalVariants = variants.filter(v => v.productColor && v.quantity > 0)
          .map(v => ({
            id: v.id,
            productColor: v.productColor,
            productSize: v.productSize,
            quantity: v.quantity,
            price:null
          }));
        }
      }
      
      let uploadedImages = [];
      
      if (selectedImages.length > 0) {
        try {
          uploadedImages = await uploadSelectedImages(editProduct.id);
        } catch (uploadErr) {
          handleError(uploadErr);
          setIsSavingProduct(false);
          return;
        }
      }
      
      const allImages = [...existingPhotos, ...uploadedImages];
      
      const imageUrls = allImages.map(img => img.url);
      const positions = allImages.map((_, index) => index);
      const altTexts = allImages.map((img, index) => img.altText || `${t('vendor.products.imageUpload.productImage')} ${index + 1}`);
      
      const productData = {
        id: editProduct.id,
        name: editProduct.name,
        description: editProduct.description,
        price: parseFloat(editProduct.price),
        oldPrice: parseFloat(editProduct.oldPrice) || null,
        quantity: hasColors ? null : Number(editProduct.quantity) || 0,
        categoryId: editProduct.categoryId || null,
        variants: finalVariants,
        imageUrls: imageUrls,
        position: positions,
        altText: altTexts,
        storeId: store.id
      };
      
      const updatedProduct = await productAPI.update(productData);
      
      setProducts(prev => prev.map(p => 
        p.id === editProduct.id ? updatedProduct : p
      ));
      
      resetEditProductModal();
      
    } catch (err) {
      handleError(err);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      setIsSavingCategory(true);
      
      if (!store?.id) {
        alert(t('vendor.products.errors.storeNotFound'));
        return;
      }
      
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        storeId: store.id
      };
      
      const createdCategory = await categoryAPI.add(categoryData);
      setCategories(prev => [...prev, createdCategory]);
      
      setNewCategory({
        name: '',
        description: ''
      });
      setShowAddCategoryModal(false);
      
    } catch (err) {
      handleError(err);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm(t('vendor.products.confirmDelete'))) {
      return;
    }

    try {
      await productAPI.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    } catch (err) {
      handleError(err);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(t('vendor.products.confirmBulkDelete', { count: selectedProducts.length }))) {
      return;
    }

    try {
      await Promise.all(selectedProducts.map(id => productAPI.delete(id)));
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    } catch (err) {
      handleError(err);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    
    setSelectedImages([]);
    setUploadProgress(0);
    
    const images = product.imageUrls || product.images || [];
    const positions = product.position || [];
    const altTexts = product.altText || [];
    
    const loadedPhotos = images.map((url, index) => ({
      url: typeof url === 'string' ? url : url.url,
      position: positions[index] || index,
      altText: altTexts[index] || `${t('vendor.products.imageUpload.productImage')} ${index + 1}`
    }));
    
    setExistingPhotos(loadedPhotos);
    
    const productVariants = product.variants || [];
    const hasVariants = productVariants.length > 0;
    
    if (hasVariants) {
      const hasSizesInVariants = productVariants.some(v => v.productSize);
      const hasColorsInVariants = productVariants.some(v => v.productColor);
      
      setHasColors(hasColorsInVariants);
      setHasSizes(hasSizesInVariants);
      
      const mappedVariants = productVariants.map(v => ({
        productColor: v.productColor || '',
        productSize: v.productSize || null,
        quantity: v.quantity || 0
      }));
      
      setVariants(mappedVariants);
    } else {
      resetVariantState();
    }
    
    setEditProduct({
      id: product.id,
      name: product.productName || product.name || '',
      description: product.description || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      quantity: product.quantity || '',
      categoryId: product.categoryId || product.category?.id || '',
      categoryName: product.categoryName || product.category?.name || '',
      storeId: store.id,
      variants: product.variants || []
    });
    
    setShowEditProductModal(true);
  };

  const resetAddProductModal = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      quantity: '',
      categoryId: '',
      storeId: store.id,
      variants: []
    });
    setSelectedImages([]);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(null);
    resetVariantState();
    setShowAddProductModal(false);
  };

  const resetEditProductModal = () => {
    setEditProduct({
      id: '',
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      quantity: '',
      categoryId: '',
      storeId: store.id,
      variants: []
    });
    setSelectedImages([]);
    setExistingPhotos([]);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(null);
    setEditingProduct(null);
    resetVariantState();
    setShowEditProductModal(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format number
  const formatNumber = (num) => {
    const localeCode = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(localeCode).format(num || 0);
  };

  // Calculate product stock based on variants
  const getProductStock = (product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
    }
    return product.quantity || 0;
  };

  // Calculate stats
  const stats = {
    total: products.length,
    inStock: products.filter(p => getProductStock(p) > 0).length,
    lowStock: products.filter(p => getProductStock(p) > 0 && getProductStock(p) < 10).length,
    outOfStock: products.filter(p => getProductStock(p) === 0).length,
    totalRevenue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.soldQuantity || 0)), 0),
    totalValue: products.reduce((sum, p) => sum + ((p.price || 0) * getProductStock(p)), 0),
    withVariants: products.filter(p => p.variants && p.variants.length > 0).length
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      (product.productName || product.name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id?.toString().includes(searchQuery) ||
      (product.categoryName || product.category?.name)?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      product.categoryId?.toString() === selectedCategory ||
      product.category?.id?.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // ============ VARIANTS BUILDER COMPONENT ============
  
  const VariantsBuilder = ({ isEditMode = false }) => {
    const totalQuantity = getTotalVariantQuantity();
    
    return (
      <div className="space-y-4 border-t border-gray-200 pt-6 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <VariantsIcon className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">{t('vendor.products.variants.title')}</h3>
          </div>
          
          {hasColors && (
            <div className="text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
              {t('vendor.products.variants.totalStock')}: <span className="font-bold text-indigo-600">{totalQuantity}</span> {t('vendor.products.variants.units')}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasColors}
                onChange={(e) => handleHasColorsChange(e.target.checked)}
                className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700 flex items-center">
                <Palette className="h-4 w-4 mr-1 text-gray-500" />
                {t('vendor.products.variants.hasColors')}
              </span>
            </label>
            
            {hasColors && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSizes}
                  onChange={(e) => handleHasSizesChange(e.target.checked)}
                  className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <Ruler className="h-4 w-4 mr-1 text-gray-500" />
                  {t('vendor.products.variants.hasSizes')}
                </span>
              </label>
            )}
          </div>
          
          {hasColors && (
            <p className="text-xs text-gray-500 mt-2">
              {hasSizes 
                ? t('vendor.products.variants.colorSizeHelp')
                : t('vendor.products.variants.colorOnlyHelp')
              }
            </p>
          )}
        </div>
        
        {hasColors && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={addColor}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                {t('vendor.products.variants.addColor')}
              </button>
              
              {hasSizes && (
                <button
                  type="button"
                  onClick={addSize}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  {t('vendor.products.variants.addSize')}
                </button>
              )}
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('vendor.products.variants.color')}</th>
                    {hasSizes && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('vendor.products.variants.size')}</th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('vendor.products.variants.quantity')}</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('vendor.products.variants.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {variants.map((variant, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <select
                          value={variant.productColor}
                          onChange={(e) => updateVariant(index, 'productColor', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                        >
                          <option value="">{t('vendor.products.variants.selectColor')}</option>
                          {availableColors.map(color => (
                            <option key={color.id} value={color.name}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      
                      {hasSizes && (
                        <td className="px-4 py-3">
                          <select
                            value={variant.productSize || ''}
                            onChange={(e) => updateVariant(index, 'productSize', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                          >
                            <option value="">{t('vendor.products.variants.selectSize')}</option>
                            {availableSizes.map(size => (
                              <option key={size.id} value={size.name}>
                                {size.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                      
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          value={variant.quantity}
                          onChange={(e) => updateVariant(index, 'quantity', Number(e.target.value) || 0)}
                          className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                        />
                      </td>
                      
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('vendor.products.variants.removeVariant')}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 flex items-start space-x-3">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {t('vendor.products.variants.totalInventory')}: {totalQuantity} {t('vendor.products.variants.units')}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {hasSizes 
                    ? t('vendor.products.variants.colorSizeInventoryHelp')
                    : t('vendor.products.variants.colorOnlyInventoryHelp')
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============ IMAGE UPLOAD COMPONENT ============
  
  const ImageUploadSection = ({ isEditMode = false }) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-700">
            {t('vendor.products.imageUpload.title')}
            <span className="text-gray-500 text-xs ml-2 font-normal">
              {t('vendor.products.imageUpload.maxSizeHint')}
            </span>
          </label>
        </div>
        
        {uploadSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between animate-slide-down">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-600" />
              <span className="text-sm font-medium">{uploadSuccess}</span>
            </div>
            <button onClick={() => setUploadSuccess(null)} className="text-green-800 hover:text-green-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between animate-slide-down">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              <span className="text-sm font-medium">{uploadError}</span>
            </div>
            <button onClick={() => setUploadError(null)} className="text-red-800 hover:text-red-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <div 
          className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 group cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('product-images')?.click()}
        >
          <input
            id="product-images"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageSelection}
          />
          
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">
                {t('vendor.products.imageUpload.dropOrClick')}
              </p>
              <p className="text-sm text-gray-500">
                {t('vendor.products.imageUpload.supportedFormats')}
              </p>
            </div>
          </div>
        </div>

        {selectedImages.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t('vendor.products.imageUpload.newImages')} ({selectedImages.length})
                </h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {t('vendor.products.imageUpload.notUploaded')}
                </span>
              </div>
              <button
                type="button"
                onClick={clearAllImages}
                className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <XCircle className="h-4 w-4" />
                <span>{t('vendor.products.imageUpload.clearAll')}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group animate-scale-in">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-indigo-500 transition-all">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-lg shadow-lg">
                    #{index + 1}
                  </div>
                  
                  {index === 0 && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-lg shadow-lg flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-white" />
                      {t('vendor.products.imageUpload.main')}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <div className="flex flex-col space-y-2">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                        title={t('vendor.products.imageUpload.removeImage')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                          title={t('vendor.products.imageUpload.moveUp')}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImageDown(index)}
                          disabled={index === selectedImages.length - 1}
                          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                          title={t('vendor.products.imageUpload.moveDown')}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 truncate">{image.name}</p>
                    <p className="text-xs text-gray-400">{(image.size / 1024 / 1024).toFixed(2)}MB</p>
                  </div>
                </div>
              ))}
              
              <label className="cursor-pointer">
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center group">
                  <Plus className="h-8 w-8 text-gray-400 group-hover:text-indigo-600 transition-colors mb-2" />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-700">{t('vendor.products.imageUpload.addMore')}</span>
                  <span className="text-xs text-gray-400 mt-1">{t('vendor.products.imageUpload.clickToSelect')}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelection}
                  />
                </div>
              </label>
            </div>
          </div>
        )}

        {isEditMode && existingPhotos.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t('vendor.products.imageUpload.existingImages')} ({existingPhotos.length})
                </h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {t('vendor.products.imageUpload.uploaded')}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {existingPhotos.map((photo, index) => (
                <div key={index} className="relative group animate-scale-in">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-indigo-500 transition-all">
                    <img
                      src={photo.url}
                      alt={photo.altText}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-lg shadow-lg">
                    #{index + 1}
                  </div>
                  
                  {index === 0 && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-lg shadow-lg flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-white" />
                      {t('vendor.products.imageUpload.main')}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <div className="flex flex-col space-y-2">
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                        title={t('vendor.products.imageUpload.removeImage')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => moveExistingPhotoUp(index)}
                          disabled={index === 0}
                          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                          title={t('vendor.products.imageUpload.moveUp')}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveExistingPhotoDown(index)}
                          disabled={index === existingPhotos.length - 1}
                          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                          title={t('vendor.products.imageUpload.moveDown')}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 left-2 p-1.5 bg-black/50 rounded-lg cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(uploadingImages || uploadProgress > 0) && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                <span className="text-sm font-medium text-gray-700">
                  {uploadingImages ? t('vendor.products.imageUpload.uploading') : t('vendor.products.imageUpload.processing')}
                </span>
              </div>
              <span className="text-sm font-semibold text-indigo-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <Camera className="h-3 w-3 mr-1" />
              {t('vendor.products.imageUpload.uploadingImagesCount', { count: selectedImages.length })}
            </p>
          </div>
        )}
        
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                {isEditMode 
                  ? t('vendor.products.imageUpload.managingImages')
                  : t('vendor.products.imageUpload.uploadMultipleHint')
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ RENDER ============

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 font-medium">{t('vendor.products.loading')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('vendor.products.pleaseWait')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-xl border border-gray-100">
          <div className="text-center">
            <div className="bg-red-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('vendor.products.errors.accessDenied')}</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full px-6 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
              >
                {t('vendor.products.goToLogin')}
              </Link>
              <Link
                to="/vendor/store"
                className="block w-full px-6 py-3.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                {t('vendor.products.backToStore')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <style>{styles}</style>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Link
                to="/vendor/store"
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Package className="h-6 w-6 mr-2 text-indigo-600" />
                  {t('vendor.products.title')}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {store?.storeName} • {stats.total} {t('vendor.products.products')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={t('vendor.products.gridView')}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={t('vendor.products.listView')}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl hover:from-emerald-700 hover:to-green-600 transition-all shadow-md flex items-center space-x-2"
                >
                  <Tag className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('vendor.products.category')}</span>
                </button>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('vendor.products.addProduct')}</span>
                </button>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Panel */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden animate-slide-left">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <Package className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{t('vendor.products.productManagement')}</div>
                      <div className="text-xs text-gray-500">{store?.storeName}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {t('vendor.products.viewMode')}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setViewMode('grid');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex-1 flex flex-col items-center p-4 rounded-xl transition-all ${
                          viewMode === 'grid'
                            ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200'
                            : 'bg-gray-50 text-gray-600 border-2 border-transparent'
                        }`}
                      >
                        <Grid className="h-6 w-6 mb-2" />
                        <span className="text-sm font-medium">{t('vendor.products.gridView')}</span>
                      </button>
                      <button
                        onClick={() => {
                          setViewMode('list');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex-1 flex flex-col items-center p-4 rounded-xl transition-all ${
                          viewMode === 'list'
                            ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200'
                            : 'bg-gray-50 text-gray-600 border-2 border-transparent'
                        }`}
                      >
                        <List className="h-6 w-6 mb-2" />
                        <span className="text-sm font-medium">{t('vendor.products.listView')}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {t('vendor.products.quickActions')}
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowAddProductModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                      >
                        <div className="flex items-center">
                          <Plus className="h-5 w-5 mr-3" />
                          <span className="text-sm font-medium">{t('vendor.products.addNewProduct')}</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowAddCategoryModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl hover:from-emerald-700 hover:to-green-600 transition-all"
                      >
                        <div className="flex items-center">
                          <Tag className="h-5 w-5 mr-3" />
                          <span className="text-sm font-medium">{t('vendor.products.addNewCategory')}</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {t('vendor.products.storeStats')}
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('vendor.products.totalProducts')}</span>
                        <span className="font-semibold text-gray-900">{stats.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('vendor.products.inStock')}</span>
                        <span className="font-semibold text-green-600">{stats.inStock}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('vendor.products.lowStock')}</span>
                        <span className="font-semibold text-amber-600">{stats.lowStock}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('vendor.products.withVariants')}</span>
                        <span className="font-semibold text-indigo-600">{stats.withVariants}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Store className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{store?.storeName}</div>
                    <div className="text-xs text-gray-500">{t('vendor.products.cloudflareR2Storage')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 animate-slide-down">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="p-1.5 hover:bg-red-200 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-red-800" />
              </button>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {t('vendor.products.total')}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{formatNumber(stats.total)}</div>
            <div className="text-xs sm:text-sm text-gray-600">{t('vendor.products.totalProducts')}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              {stats.lowStock > 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  {stats.lowStock} {t('vendor.products.low')}
                </span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{formatNumber(stats.inStock)}</div>
            <div className="text-xs sm:text-sm text-gray-600">{t('vendor.products.inStock')}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {((stats.lowStock / stats.total) * 100 || 0).toFixed(0)}%
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{formatNumber(stats.lowStock)}</div>
            <div className="text-xs sm:text-sm text-gray-600">{t('vendor.products.lowStock')}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.totalValue)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">{t('vendor.products.inventoryValue')}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('vendor.products.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-48 pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all focus:bg-white"
                >
                  <option value="all">{t('vendor.products.allCategories')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName || cat.name} ({products.filter(p => p.categoryId === cat.id).length})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedProducts.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-3.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md flex items-center space-x-2"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="text-sm font-medium hidden sm:inline">{t('vendor.products.delete')} ({selectedProducts.length})</span>
                </button>
              )}
            </div>
          </div>
          
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">{t('vendor.products.activeFilters')}:</span>
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                  {t('vendor.products.search')}: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="ml-2 hover:text-indigo-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                  {t('vendor.products.category')}: {categories.find(c => c.id.toString() === selectedCategory)?.categoryName || selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="ml-2 hover:text-indigo-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-200/80 shadow-sm text-center">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('vendor.products.noProductsFound')}</h3>
              <p className="text-gray-600 mb-8">
                {searchQuery || selectedCategory !== 'all' 
                  ? t('vendor.products.adjustFilters') 
                  : t('vendor.products.addFirstProduct')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl hover:from-emerald-700 hover:to-green-600 transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <Tag className="h-5 w-5" />
                  <span>{t('vendor.products.addCategoryFirst')}</span>
                </button>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>{t('vendor.products.addFirstProduct')}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Bulk Actions Bar */}
            {selectedProducts.length > 0 && (
              <div className="mb-6 animate-slide-down">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">
                      {selectedProducts.length} {t('vendor.products.productSelected', { count: selectedProducts.length })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedProducts([])}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
                    >
                      {t('vendor.products.clearSelection')}
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{t('vendor.products.deleteSelected')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => {
                  const productName = product.productName || product.name;
                  const productPrice = product.price || 0;
                  const productOldPrice = product.oldPrice || 0;
                  const discountPercentage = productOldPrice > productPrice
                    ? Math.round(((productOldPrice - productPrice) / productOldPrice) * 100)
                    : 0;
                  const productQuantity = getProductStock(product);
                  const hasVariants = product.variants && product.variants.length > 0;
                  const variantCount = product.variants?.length || 0;
                  const stockStatus = productQuantity === 0 ? 'out' : productQuantity < 10 ? 'low' : 'in';
                  const mainImage = product.imageUrls?.[0] || product.images?.[0] || null;
                  const imageCount = product.imageUrls?.length || product.images?.length || 0;
                  
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={product.altText?.[0] || productName}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Camera className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                        
                        {imageCount > 0 && (
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1.5 rounded-lg flex items-center shadow-lg">
                            <Image className="h-3 w-3 mr-1" />
                            {imageCount}
                          </div>
                        )}
                        
                        {hasVariants && (
                          <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-2 py-1.5 rounded-lg flex items-center shadow-lg">
                            <VariantsIcon className="h-3 w-3 mr-1" />
                            {variantCount} {t('vendor.products.variants')}
                          </div>
                        )}
                        
                        <div className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg ${
                          stockStatus === 'in' ? 'bg-green-500 text-white' :
                          stockStatus === 'low' ? 'bg-amber-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {stockStatus === 'in' ? t('vendor.products.inStockStatus') : 
                           stockStatus === 'low' ? t('vendor.products.lowStockStatus') : 
                           t('vendor.products.outOfStockStatus')}
                        </div>
                        
                        <div className="absolute bottom-3 right-3">
                          <label className="relative cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleSelectProduct(product.id)}
                              className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                          </label>
                        </div>
                        
                        <div className="md:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => navigate(`/store/${store?.storeName}/product/${product.id}`)}
                              className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-colors shadow-lg"
                              title={t('vendor.products.view')}
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(product)}
                              className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                              title={t('vendor.products.edit')}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                              title={t('vendor.products.delete')}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center space-x-2">
                          <button
                            onClick={() => navigate(`/store/${store?.storeName}/product/${product.id}`)}
                            className="p-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                            title={t('vendor.products.view')}
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                            title={t('vendor.products.edit')}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                            title={t('vendor.products.delete')}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                              {productName}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col justify-between mt-3">
                          <div className='flex flex-col gap-1 mb-3'>
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(productPrice)}
                            </span>
                            {productOldPrice > productPrice && (
                              <div>
                                <span className='line-through text-sm text-gray-500'>
                                  {formatCurrency(productOldPrice)}
                                </span> 
                                {discountPercentage > 0 && (
                                  <span className="text-xs text-red-500 ml-2 bg-red-600 p-1 px-2 rounded-2xl text-white">
                                    {discountPercentage}% {t('vendor.products.off')}
                                  </span>
                                )}
                              </div>
                            )}
                            <span className="text-xs text-gray-500 ml-2">
                              {productQuantity} {t('vendor.products.leftInStock')}
                              {hasVariants && ` ${t('vendor.products.acrossVariants')}`}
                            </span>
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full w-fit">
                            {product.categoryName || product.category?.name || t('vendor.products.uncategorized')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-6 w-12">
                          <input
                            type="checkbox"
                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                            onChange={handleSelectAll}
                            className="h-5 w-5 text-indigo-600 rounded"
                          />
                        </th>
                        <th className="text-left p-6 font-semibold text-gray-900">{t('vendor.products.product')}</th>
                        <th className="text-left p-6 font-semibold text-gray-900">{t('vendor.products.category')}</th>
                        <th className="text-left p-6 font-semibold text-gray-900">{t('vendor.products.price')}</th>
                        <th className="text-left p-6 font-semibold text-gray-900">{t('vendor.products.stock')}</th>
                        <th className="text-left p-6 font-semibold text-gray-900">{t('vendor.products.variants')}</th>
                        <th className="text-left p-6 font-semibold text-gray-900">{t('vendor.products.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const productName = product.productName || product.name;
                        const productPrice = product.price || 0;
                        const productOldPrice = product.oldPrice || 0;
                        const discountPercentage = productOldPrice > productPrice
                          ? Math.round(((productOldPrice - productPrice) / productOldPrice) * 100)
                          : 0;
                        const productQuantity = getProductStock(product);
                        const hasVariants = product.variants && product.variants.length > 0;
                        const variantCount = product.variants?.length || 0;
                        const stockStatus = productQuantity === 0 ? 'out' : productQuantity < 10 ? 'low' : 'in';
                        const mainImage = product.imageUrls?.[0] || product.images?.[0] || null;
                        
                        return (
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-6">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => handleSelectProduct(product.id)}
                                className="h-5 w-5 text-indigo-600 rounded"
                              />
                             </td>
                            <td className="p-6">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  {mainImage ? (
                                    <img 
                                      src={mainImage} 
                                      alt={product.altText?.[0] || productName}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <Camera className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                                    {productName}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    ID: {product.id} • {product.imageUrls?.length || 0} {t('vendor.products.images')}
                                  </div>
                                </div>
                              </div>
                             </td>
                            <td className="p-6">
                              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                {product.categoryName || product.category?.name || t('vendor.products.uncategorized')}
                              </span>
                             </td>
                            <td className="p-6">
                              <div className="font-semibold flex flex-col text-gray-900">
                                {formatCurrency(productPrice)}
                                {productOldPrice > productPrice && (
                                  <div className="text-xs text-red-500 mt-1">
                                    <span className="line-through">{formatCurrency(productOldPrice)}</span>
                                    <span className="ml-2">({discountPercentage}% {t('vendor.products.off')})</span>
                                  </div>
                                )}
                              </div>
                             </td>
                            <td className="p-6">
                              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                                stockStatus === 'in' ? 'bg-green-100 text-green-800' :
                                stockStatus === 'low' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {productQuantity} {t('vendor.products.units')}
                              </div>
                             </td>
                            <td className="p-6">
                              {hasVariants ? (
                                <div className="flex items-center space-x-1 text-indigo-600">
                                  <VariantsIcon className="h-4 w-4" />
                                  <span className="text-sm">{variantCount}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                             </td>
                            <td className="p-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => navigate(`/store/${store?.storeName}/product/${product.id}`)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title={t('vendor.products.view')}
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleEditClick(product)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title={t('vendor.products.edit')}
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title={t('vendor.products.delete')}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                             </td>
                           </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="mt-6 flex items-center justify-between text-sm">
              <div className="text-gray-600">
                {t('vendor.products.showing')} <span className="font-semibold text-gray-900">{filteredProducts.length}</span> {t('vendor.products.of')} {' '}
                <span className="font-semibold text-gray-900">{products.length}</span> {t('vendor.products.products')}
              </div>
              <div className="text-gray-500">
                {categories.length} {categories.length === 1 ? t('vendor.products.category') : t('vendor.products.categories')} • {stats.withVariants} {t('vendor.products.withVariants')}
              </div>
            </div>
            <StoreFooter />
          </>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full my-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <Plus className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('vendor.products.addNewProduct')}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t('vendor.products.fillProductDetails')}</p>
                </div>
              </div>
              <button
                onClick={resetAddProductModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('vendor.products.productName')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                      placeholder={t('vendor.products.enterProductName')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('vendor.products.description')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      required
                      rows={4}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white resize-none"
                      placeholder={t('vendor.products.describeProduct')}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('vendor.products.price')} (EGP) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('vendor.products.oldPrice')} (EGP)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={newProduct.oldPrice}
                        onChange={(e) => setNewProduct({...newProduct, oldPrice: e.target.value})}
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {!hasColors && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('vendor.products.stockQuantity')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                        required={!hasColors}
                        min="0"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('vendor.products.category')} <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddProductModal(false);
                        setShowAddCategoryModal(true);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t('vendor.products.addNew')}</span>
                    </button>
                  </div>
                  {categories.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                      <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                      <p className="text-amber-700 font-medium mb-4">{t('vendor.products.noCategoriesFound')}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddProductModal(false);
                          setShowAddCategoryModal(true);
                        }}
                        className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        {t('vendor.products.addFirstCategory')}
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={newProduct.categoryId}
                        onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                        required
                        className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all focus:bg-white"
                      >
                        <option value="">{t('vendor.products.selectCategory')}</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.categoryName || cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <VariantsBuilder />

                <ImageUploadSection isEditMode={false} />
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSavingProduct || uploadingImages || categories.length === 0}
                  className="sm:flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all shadow-lg"
                >
                  {isSavingProduct ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-medium">{t('vendor.products.addingProduct')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span className="font-medium">{t('vendor.products.addProduct')}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetAddProductModal}
                  disabled={isSavingProduct || uploadingImages}
                  className="sm:flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all"
                >
                  {t('vendor.products.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full my-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <Edit className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('vendor.products.editProduct')}</h2>
                  <p className="text-sm text-gray-500 mt-1">{editingProduct.productName || editingProduct.name}</p>
                </div>
              </div>
              <button
                onClick={resetEditProductModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleEditProduct} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('vendor.products.productName')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                      placeholder={t('vendor.products.enterProductName')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('vendor.products.description')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={editProduct.description}
                      onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                      required
                      rows={4}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white resize-none"
                      placeholder={t('vendor.products.describeProduct')}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('vendor.products.price')} (EGP) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={editProduct.price}
                        onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('vendor.products.oldPrice')} (EGP)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={editProduct.oldPrice}
                        onChange={(e) => setEditProduct({...editProduct, oldPrice: e.target.value})}
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {!hasColors && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('vendor.products.stockQuantity')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={editProduct.quantity}
                        onChange={(e) => setEditProduct({...editProduct, quantity: e.target.value})}
                        required={!hasColors}
                        min="0"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('vendor.products.category')}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditProductModal(false);
                        setShowAddCategoryModal(true);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t('vendor.products.addNew')}</span>
                    </button>
                  </div>
                  {categories.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                      <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                      <p className="text-amber-700 font-medium mb-4">{t('vendor.products.noCategoriesFound')}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditProductModal(false);
                          setShowAddCategoryModal(true);
                        }}
                        className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        {t('vendor.products.addFirstCategory')}
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={editProduct.categoryId || ''}
                        onChange={(e) => setEditProduct({...editProduct, categoryId: e.target.value})}
                        className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all focus:bg-white"
                      >
                        <option value="">{t('vendor.products.uncategorized')}</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.categoryName || cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <VariantsBuilder isEditMode={true} />

                <ImageUploadSection isEditMode={true} />
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSavingProduct || uploadingImages}
                  className="sm:flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all shadow-lg"
                >
                  {isSavingProduct ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-medium">{t('vendor.products.updatingProduct')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span className="font-medium">{t('vendor.products.updateProduct')}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetEditProductModal}
                  disabled={isSavingProduct || uploadingImages}
                  className="sm:flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all"
                >
                  {t('vendor.products.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                  <Tag className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('vendor.products.addNewCategory')}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t('vendor.products.organizeProducts')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('vendor.products.categoryName')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all focus:bg-white"
                      placeholder={t('vendor.products.categoryPlaceholder')}
                    />
                  </div>
                </div>

                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t('vendor.products.existingCategories')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <div 
                          key={cat.id} 
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-emerald-300 transition-all"
                        >
                          <FolderOpen className="h-6 w-6 text-emerald-600 mb-2" />
                          <span className="font-medium text-gray-900 text-sm truncate w-full">
                            {cat.categoryName || cat.name}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {products.filter(p => p.categoryId === cat.id).length} {t('vendor.products.products')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSavingCategory}
                  className="sm:flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl hover:from-emerald-700 hover:to-green-600 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shadow-lg"
                >
                  {isSavingCategory ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-medium">{t('vendor.products.addingCategory')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span className="font-medium">{t('vendor.products.addCategory')}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  disabled={isSavingCategory}
                  className="sm:flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all"
                >
                  {t('vendor.products.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Add Button - FAB */}
      <button
        onClick={() => setShowAddProductModal(true)}
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center z-30 animate-bounce-subtle"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

// CSS styles
const styles = `
  @keyframes slideLeft {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bounceSubtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  .animate-slide-left {
    animation: slideLeft 0.3s ease-out;
  }

  .animate-slide-down {
    animation: slideDown 0.3s ease-out;
  }

  .animate-scale-in {
    animation: scaleIn 0.2s ease-out;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-bounce-subtle {
    animation: bounceSubtle 2s infinite;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export default VendorProducts;