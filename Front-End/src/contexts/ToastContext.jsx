// contexts/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    // معالجة الرسالة لو كانت object
    let finalMessage = message;
    if (typeof message === 'object' && message !== null) {
      finalMessage = message.message_ar || message.message_en || JSON.stringify(message);
    }
    
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message: finalMessage, type }]);
    
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const success = (msg, duration) => showToast(msg, 'success', duration);
  const error = (msg, duration) => showToast(msg, 'error', duration);
  const warning = (msg, duration) => showToast(msg, 'warning', duration);
  const info = (msg, duration) => showToast(msg, 'info', duration);

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;
  
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const timer = setTimeout(handleClose, 4000);
    return () => clearTimeout(timer);
  }, []);

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 to-green-500',
          icon: '✅',
          iconBg: 'bg-emerald-600',
          border: 'border-emerald-400'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-rose-500',
          icon: '❌',
          iconBg: 'bg-red-600',
          border: 'border-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
          icon: '⚠️',
          iconBg: 'bg-amber-600',
          border: 'border-amber-400'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          icon: 'ℹ️',
          iconBg: 'bg-blue-600',
          border: 'border-blue-400'
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl shadow-2xl
        backdrop-blur-lg backdrop-filter
        border-l-4 ${styles.border}
        transform transition-all duration-300 
        pointer-events-auto
        ${isExiting ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}
      `}
    >
      {/* الخلفية المتدرجة */}
      <div className={`absolute inset-0 ${styles.bg} opacity-95`} />
      
      {/* تأثير الضوء */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
      
      {/* المحتوى */}
      <div className="relative p-4 flex items-start gap-3">
        {/* أيقونة مع خلفية دائرية */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-xl 
          ${styles.iconBg} bg-opacity-30 
          flex items-center justify-center
          backdrop-blur-sm border border-white/20
          shadow-lg
        `}>
          <span className="text-xl filter drop-shadow-lg">
            {styles.icon}
          </span>
        </div>
        
        {/* النص */}
        <div className="flex-1 min-w-0 pt-1">
          <p className={`
            text-sm font-medium text-white 
            drop-shadow-md leading-relaxed
            ${document.dir === 'rtl' ? 'text-right' : 'text-left'}
          `}>
            {toast.message}
          </p>
        </div>
        
        {/* زر الإغلاق */}
        <button
          onClick={handleClose}
          className="
            flex-shrink-0 w-8 h-8 rounded-lg
            bg-white/10 hover:bg-white/20
            flex items-center justify-center
            transition-all duration-200
            backdrop-blur-sm border border-white/10
            group
          "
        >
          <span className="text-white/70 group-hover:text-white transform transition-transform group-hover:rotate-90">
            ✕
          </span>
        </button>
      </div>
      
      {/* شريط التقدم */}
      <div className="relative h-1 bg-white/20">
        <div 
          className="absolute inset-y-0 left-0 bg-white/60 rounded-full animate-shrink"
          style={{ 
            width: '100%',
            animation: `shrink 4000ms linear forwards`
          }}
        />
      </div>
    </div>
  );
};

