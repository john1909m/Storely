// hooks/useErrorHandler.js
import { useToast } from '../contexts/ToastContext';

export const useErrorHandler = () => {
  const toast = useToast();

  const handleError = (error) => {
    console.log('Error:', error);
    
    // استخراج الرسالة العربية باستخدام regex
    const errorString = String(error);
    const arabicMatch = errorString.match(/"message_ar":"([^"]+)"/);
    const englishMatch = errorString.match(/"message_en":"([^"]+)"/);
    
    if (arabicMatch && arabicMatch[1]) {
      toast.error(arabicMatch[1]); // "المستخدم غير موجود"
    } else if (englishMatch && englishMatch[1]) {
      toast.error(englishMatch[1]); // "User not found"
    } else {
      toast.error('An unexpected error occurred. Please try again.'); // رسالة عامة
    }
  };

  return { handleError };
};