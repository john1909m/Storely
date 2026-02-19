// Vendor Orders Page - Real data from APIs
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Eye, Package, Truck,
  CheckCircle, XCircle, Clock, AlertCircle,
  Download, Printer, MessageSquare, ArrowLeft,
  ChevronDown, ChevronUp, User, Mail, Phone, MapPin,
  ShoppingBag, Tag, DollarSign, CreditCard, Calendar,
  Truck as Shipping, Box, Hash, FileText,Store, Receipt,
  Menu, X, FilterX, RefreshCw, ChevronRight,
  TrendingUp, Users, ShoppingCart, BarChart,
  Copy, Check, MoreVertical, Edit, Trash2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderAPI } from '../../api/order.api';
import { customerAPI } from '../../api/customer.api';
import { Link } from 'react-router-dom';
import StoreFooter from '../../components/StoreFooter';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import useAuthStore from '../../store/authStore';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [printOrder, setPrintOrder] = useState(null);
  const printFrameRef = useRef(null);
  const { store, vendor } = useAuth();
  const navigate = useNavigate();
    const { handleError } = useErrorHandler();
      const {authInialized,isAuthenticated} = useAuthStore();


  useEffect(() => {
    if (store?.id && authInialized) {
      fetchOrders();
    } else {
      setError('Store not found. Please create a store first.');
      setIsLoading(false);
    }
  }, [store, authInialized]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const storeOrders = await orderAPI.getByStore(store.id);
      const ordersList = Array.isArray(storeOrders) ? storeOrders : [];
      setOrders(ordersList);

      const customerMap = {};
      
      for (const order of ordersList) {
        if (order.customerId) {
          try {
            const customer = await customerAPI.getById(order.customerId);
            if (customer) {
              customerMap[order.customerId] = customer;
            }
          } catch (err) {
            handleError(err);
            if (order.customer) {
              customerMap[order.customerId] = order.customer;
            }
          }
        }
      }
      
      setCustomers(customerMap);
    } catch (err) {
      handleError(err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const updatedOrder = {
        ...order,
        status: newStatus
      };

      await orderAPI.update(updatedOrder);
      
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
    } catch (err) {
      handleError(err);
    }
  };

  const handlePrintReceipt = (order) => {
    const customer = customers[order.customerId] || order.customer;
    const items = order.items || order.orderItems || [];
    const orderDate = order.orderDate || order.createdAt || order.date;
    const orderTotal = order.totalPrice || order.total || order.amount || 0;
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    const receiptHTML = generateReceiptHTML(order, customer, items, orderDate, orderTotal, store);
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    
    printWindow.onload = function() {
      printWindow.print();
    };
  };

  const generateReceiptHTML = (order, customer, items, orderDate, orderTotal, store) => {
    const storeName = store?.storeName || 'Your Store';
    const storeEmail = store?.email || '';
    const storePhone = store?.phone || '';
    const storeAddress = store?.address || '';
    
    const orderNumber = order.orderNumber || order.id;
    const paymentMethod = order.paymentMethod || 'Cash on Delivery';
    const orderStatus = order.orderStatus || order.status || 'PENDING';
    
    const formattedDate = orderDate 
      ? new Date(orderDate).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'N/A';

    const itemsHTML = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="font-weight: 600; color: #333;">${item.productName || item.name}</div>
          ${item.variant ? `<div style="font-size: 12px; color: #666;">Variant: ${item.variant}</div>` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price || 0).toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - Order #${orderNumber}</title>
        <style>
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            margin: 0;
            padding: 20px 20px;
            background: #f5f5f5;
            color: #333;
          }
          
          .receipt {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
          }
          
          .store-name {
            font-size: 28px;
            font-weight: 700;
            color: #4f46e5;
            margin: 0 0 10px;
          }
          
          .order-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          
          .info-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          
          .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
          
          .customer-section {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #4f46e5;
            margin: 0 0 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          .items-table th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #ddd;
          }
          
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
          }
          
          .summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin-top: 30px;
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
          }
          
          .total-row {
            font-size: 20px;
            font-weight: 700;
            color: #4f46e5;
            border-top: 2px solid #ddd;
            margin-top: 8px;
            padding-top: 16px;
          }
          
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            background: ${orderStatus === 'DELIVERED' ? '#dcfce7' : orderStatus === 'PENDING' ? '#fef9c3' : orderStatus === 'CANCELLED' ? '#fee2e2' : '#e0e7ff'};
            color: ${orderStatus === 'DELIVERED' ? '#166534' : orderStatus === 'PENDING' ? '#854d0e' : orderStatus === 'CANCELLED' ? '#991b1b' : '#3730a3'};
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          
          .no-print {
            text-align: center;
            margin-top: 20px;
          }
          
          .print-button {
            background: #4f46e5;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1 class="store-name">${storeName}</h1>
            <p class="receipt-title">Order Receipt</p>
            
          </div>
          
          <div class="order-info">
            <div class="info-group">
              <div class="info-label">Order Number</div>
              <div class="info-value">#${orderNumber}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Order Date</div>
              <div class="info-value">${formattedDate}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Payment Method</div>
              <div class="info-value">${paymentMethod}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Order Status</div>
              <div><span class="status-badge">${orderStatus}</span></div>
            </div>
          </div>
          
          <div class="customer-section">
            <h2 class="section-title">Customer Details</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <div class="info-label">Name</div>
                <div class="info-value">${customer?.firstName || ''} ${customer?.lastName || ''}</div>
              </div>
              <div>
                <div class="info-label">Contact</div>
                <div class="info-value">${customer?.whatsappNumber || 'N/A'}</div>
                <div style="color: #666;">${customer?.phoneNumber}</div>
              </div>
            </div>
            ${customer?.address || order.shippingAddress ? `
            <div style="margin-top: 15px;">
              <div class="info-label">Shipping Address</div>
              <div class="info-value">${customer?.address || order.shippingAddress || ''}</div>
            </div>
            ` : ''}
          </div>
          
          <h2 class="section-title">Order Items</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th style="text-align: left;">Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span style="font-weight: 600;">$${orderTotal.toFixed(2)}</span>
            </div>
            ${order.shippingCost ? `
            <div class="summary-row">
              <span>Shipping:</span>
              <span>$${order.shippingCost.toFixed(2)}</span>
            </div>
            ` : ''}
            ${order.discount ? `
            <div class="summary-row" style="color: #16a34a;">
              <span>Discount:</span>
              <span>-$${order.discount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="summary-row total-row">
              <span>Total Amount:</span>
              <span>$${orderTotal.toFixed(2)}</span>
            </div>
          </div>
          
          
          
          <div class="no-print">
            <button onclick="window.print();" class="print-button">
              🖨️ Print Receipt
            </button>
            <button onclick="window.close();" class="print-button" style="background: #666; margin-left: 10px;">
              ✕ Close
            </button>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const getStatusIcon = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />;
      case 'PROCESSING': return <RefreshCw className="h-4 w-4" />;
      case 'SHIPPED': return <Truck className="h-4 w-4" />;
      case 'DELIVERED': return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border border-green-200';
      case 'PROCESSING': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'SHIPPED': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const toggleRowExpand = (orderId) => {
    setExpandedRows(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setDateRange({ start: '', end: '' });
  };

  // Calculate stats from real data
  const stats = {
    total: orders.length,
    pending: orders.filter(o => {
      const status = o.orderStatus || o.status;
      return status?.toUpperCase() === 'PENDING';
    }).length,
    confirmed: orders.filter(o => {
      const status = o.orderStatus || o.status;
      return status?.toUpperCase() === 'CONFIRMED';
    }).length,
    processing: orders.filter(o => {
      const status = o.orderStatus || o.status;
      return status?.toUpperCase() === 'PROCESSING';
    }).length,
    shipped: orders.filter(o => {
      const status = o.orderStatus || o.status;
      return status?.toUpperCase() === 'SHIPPED';
    }).length,
    delivered: orders.filter(o => {
      const status = o.orderStatus || o.status;
      return status?.toUpperCase() === 'DELIVERED';
    }).length,
    cancelled: orders.filter(o => {
      const status = o.orderStatus || o.status;
      return status?.toUpperCase() === 'CANCELLED';
    }).length,
    revenue: orders.reduce((sum, order) => sum + (order.totalPrice || order.total || order.amount || 0), 0)
  };

  const statusConfig = {
    all: { label: 'All Orders', color: 'indigo', count: stats.total, icon: Package },
    pending: { label: 'Pending', color: 'yellow', count: stats.pending, icon: Clock },
    confirmed: { label: 'Confirmed', color: 'green', count: stats.confirmed, icon: CheckCircle },
    processing: { label: 'Processing', color: 'indigo', count: stats.processing, icon: RefreshCw },
    shipped: { label: 'Shipped', color: 'yellow', count: stats.shipped, icon: Truck },
    delivered: { label: 'Delivered', color: 'green', count: stats.delivered, icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'red', count: stats.cancelled, icon: XCircle }
  };

  // Filter orders by status, search, and date range
  const filteredOrders = orders.filter(order => {
    const status = order.orderStatus || order.status;
    const matchesStatus = selectedStatus === 'all' || 
      status?.toUpperCase() === selectedStatus.toUpperCase();
    
    const customer = customers[order.customerId];
    const matchesSearch = !searchQuery || 
      order.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.phone?.toLowerCase().includes(searchQuery.toLowerCase());

    // Date range filtering
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const orderDate = new Date(order.orderDate || order.createdAt || order.date);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      end.setHours(23, 59, 59, 999);
      matchesDate = orderDate >= start && orderDate <= end;
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
                  Orders
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {store?.storeName} • {stats.total} total orders
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 ${
                    showFilters || searchQuery || selectedStatus !== 'all' || dateRange.start
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filters</span>
                </button>
                <button
                  onClick={fetchOrders}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center space-x-2"
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span className="text-sm font-medium">Print</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden animate-slide-left">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Package className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Orders Menu</div>
                      <div className="text-xs text-gray-500">{filteredOrders.length} orders</div>
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
                  <button
                    onClick={() => {
                      setShowFilters(!showFilters);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <Filter className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="font-medium text-gray-900">Filters</span>
                    </div>
                    {(searchQuery || selectedStatus !== 'all' || dateRange.start) && (
                      <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      fetchOrders();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">Refresh</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      window.print();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Printer className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">Print Page</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Store className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{store?.storeName}</div>
                    <div className="text-xs text-gray-500">Order Management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-2xl flex items-center justify-between animate-slide-down">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
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
        )}

        {/* Stats Cards - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              {stats.delivered > 0 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {Math.round((stats.delivered / stats.total) * 100 || 0)}%
                </span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stats.delivered}</div>
            <div className="text-xs sm:text-sm text-gray-600">Delivered</div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
              {stats.pending > 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  {stats.pending}
                </span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stats.pending}</div>
            <div className="text-xs sm:text-sm text-gray-600">Pending</div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.revenue)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Revenue</div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm mb-6 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-indigo-600" />
                Filter Orders
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
              >
                <FilterX className="h-4 w-4" />
                <span>Clear all</span>
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Date Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Start"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="End"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Order ID, customer, email..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Quick Filters
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Status Filters - Horizontal Scroll on Mobile */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-2 min-w-max">
            {Object.entries(statusConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key)}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 ${
                    selectedStatus === key
                      ? `bg-${config.color}-600 text-white shadow-md`
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{config.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedStatus === key
                      ? 'bg-white/20 text-white'
                      : `bg-${config.color}-100 text-${config.color}-800`
                  }`}>
                    {config.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedStatus !== 'all' || dateRange.start) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-2 hover:text-indigo-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus('all')} className="ml-2 hover:text-indigo-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {dateRange.start && (
              <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                From: {formatDate(dateRange.start)}
                <button onClick={() => setDateRange({...dateRange, start: ''})} className="ml-2 hover:text-indigo-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {dateRange.end && (
              <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                To: {formatDate(dateRange.end)}
                <button onClick={() => setDateRange({...dateRange, end: ''})} className="ml-2 hover:text-indigo-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Orders Table/Cards */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-200/80 shadow-sm text-center">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Found</h3>
              <p className="text-gray-600 mb-8">
                {searchQuery || selectedStatus !== 'all' || dateRange.start
                  ? 'Try adjusting your search or filter criteria'
                  : 'You haven\'t received any orders yet'}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Bulk Actions Bar */}
            {selectedOrders.length > 0 && (
              <div className="mb-6 animate-slide-down">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">
                      {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedOrders([])}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
                    >
                      Clear
                    </button>
                    <select 
                      className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium focus:ring-2 focus:ring-white"
                      onChange={(e) => {
                        if (e.target.value) {
                          selectedOrders.forEach(orderId => {
                            handleStatusUpdate(orderId, e.target.value);
                          });
                          setSelectedOrders([]);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Bulk Update</option>
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-6 w-12">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                          onChange={handleSelectAll}
                          className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                      </th>
                      <th className="p-6 w-12"></th>
                      <th className="text-left p-6 font-semibold text-gray-900">Order</th>
                      <th className="text-left p-6 font-semibold text-gray-900">Customer</th>
                      <th className="text-left p-6 font-semibold text-gray-900">Date</th>
                      <th className="text-left p-6 font-semibold text-gray-900">Total</th>
                      <th className="text-left p-6 font-semibold text-gray-900">Status</th>
                      <th className="text-left p-6 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const customer = customers[order.customerId] || order.customer;
                      const isExpanded = expandedRows.includes(order.id);
                      const status = order.orderStatus || order.status || 'PENDING';
                      const orderTotal = order.totalPrice || order.total || order.amount || 0;
                      const orderDate = order.orderDate || order.createdAt || order.date;
                      const items = order.items || order.orderItems || [];
                      
                      return (
                        <React.Fragment key={order.id}>
                          <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-6">
                              <input
                                type="checkbox"
                                checked={selectedOrders.includes(order.id)}
                                onChange={() => handleSelectOrder(order.id)}
                                className="h-5 w-5 text-indigo-600 rounded border-gray-300"
                              />
                            </td>
                            <td className="p-6">
                              <button
                                onClick={() => toggleRowExpand(order.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-all"
                              >
                                {isExpanded ? 
                                  <ChevronUp className="h-5 w-5 text-gray-600" /> : 
                                  <ChevronDown className="h-5 w-5 text-gray-600" />
                                }
                              </button>
                            </td>
                            <td className="p-6">
                              <div className="font-semibold text-gray-900">
                                #{order.orderNumber || order.id}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {items.length} items
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="font-medium text-gray-900">
                                {customer?.firstName || 'Guest'} {customer?.lastName || ''}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {customer?.email || 'No email'}
                              </div>
                            </td>
                            <td className="p-6 text-gray-700 text-sm">
                              {formatDate(orderDate)}
                            </td>
                            <td className="p-6">
                              <div className="font-bold text-gray-900">
                                {formatCurrency(orderTotal)}
                              </div>
                            </td>
                            <td className="p-6">
                              <select
                                value={status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 focus:ring-2 focus:ring-offset-2 ${getStatusColor(status)}`}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handlePrintReceipt(order)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Print Receipt"
                                >
                                  <Printer className="h-5 w-5" />
                                </button>
                               
                              </div>
                            </td>
                          </tr>
                          
                          {/* Expanded Details */}
                          {isExpanded && (
                            <tr className="bg-gray-50">
                              <td colSpan="8" className="p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                      <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                                      Order Summary
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Order ID:</span>
                                        <span className="font-medium text-gray-900">#{order.id}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Date:</span>
                                        <span className="font-medium text-gray-900">
                                          {new Date(orderDate).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Payment:</span>
                                        <span className="font-medium text-gray-900">
                                          {order.paymentMethod || 'Cash on Delivery'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                      <User className="h-5 w-5 mr-2 text-indigo-600" />
                                      Customer Info
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-medium text-gray-900">
                                          {customer?.firstName || ''} {customer?.lastName || ''}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Address:</span>
                                        <span className="font-medium text-gray-900">
                                          {customer?.address || 'N/A'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="font-medium text-gray-900">
                                          {customer?.phoneNumber || customer?.phone || 'N/A'} /  {customer?.whatsappNumber || 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Order Items */}
                                <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
                                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                    <ShoppingBag className="h-5 w-5 mr-2 text-indigo-600" />
                                    Order Items ({items.length})
                                  </h4>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="p-3 text-left text-gray-700">#Product ID</th>
                                          <th className="p-3 text-left text-gray-700">Product name</th>
                                          <th className="p-3 text-center text-gray-700">Qty</th>
                                          <th className="p-3 text-right text-gray-700">Price</th>
                                          <th className="p-3 text-right text-gray-700">Total</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {items.map((item, index) => (
                                          <tr key={index} className="border-t border-gray-100">
                                            <td className="p-3">
                                              <div className="font-medium text-gray-900">
                                                {item.productId || item.id || 'N/A'}
                                              </div>
                                            </td>
                                            <td className="p-3">
                                              <div className="font-medium text-gray-900">
                                                {item.productName || item.name}
                                              </div>
                                            </td>
                                            <td className="p-3 text-center">{item.quantity || 1}</td>
                                            <td className="p-3 text-right">{formatCurrency(item.price || 0)}</td>
                                            <td className="p-3 text-right font-medium">
                                              {formatCurrency((item.price || 0) * (item.quantity || 1))}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredOrders.map((order) => {
                const customer = customers[order.customerId] || order.customer;
                const status = order.orderStatus || order.status || 'PENDING';
                const orderTotal = order.totalPrice || order.total || order.amount || 0;
                const orderDate = order.orderDate || order.createdAt || order.date;
                const items = order.items || order.orderItems || [];
                const isExpanded = expandedRows.includes(order.id);
                
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => handleSelectOrder(order.id)}
                              className="h-5 w-5 text-indigo-600 rounded border-gray-300"
                            />
                            <span className="font-semibold text-gray-900">
                              #{order.orderNumber || order.id}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(orderDate)} • {items.length} items
                          </p>
                        </div>
                        <select
                          value={status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 ${getStatusColor(status)}`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            {customer?.firstName || 'Guest'} {customer?.lastName || ''}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(orderTotal)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handlePrintReceipt(order)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Print Receipt"
                          >
                            <Printer className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => navigate(`/vendor/orders/${order.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                        <button
                          onClick={() => toggleRowExpand(order.id)}
                          className="flex items-center space-x-1 text-sm text-indigo-600"
                        >
                          <span>{isExpanded ? 'Hide' : 'Show'} details</span>
                          {isExpanded ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </button>
                      </div>
                    </div>
                    
                    {/* Mobile Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50 p-5">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</h4>
                            <div className="space-y-2">
                              {items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    {item.productName || item.name} x{item.quantity || 1}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency((item.price || 0) * (item.quantity || 1))}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer</h4>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600">
                                {customer?.email || 'No email'}
                              </p>
                              <p className="text-gray-600">
                                {customer?.phoneNumber || customer?.phone || 'No phone'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Results Summary */}
            <div className="mt-6 flex items-center justify-between text-sm">
              <div className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{orders.length}</span> orders
              </div>
              <button
                onClick={fetchOrders}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
            <StoreFooter />
          </>
        )}
      </div>

      {/* Mobile FAB for Filters */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center z-30"
      >
        <Filter className="h-6 w-6" />
      </button>
    </div>
  );
};

// Add to global CSS
const styles = `
  @keyframes slideLeft {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-slide-left {
    animation: slideLeft 0.3s ease-out;
  }

  .animate-slide-down {
    animation: slideDown 0.3s ease-out;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default VendorOrders;