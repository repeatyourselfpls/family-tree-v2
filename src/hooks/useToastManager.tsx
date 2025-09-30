import { useEffect, useRef, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'none';

export interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export const useToastManager = (duration: number) => {
  const [toastState, setToastState] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'none',
  });

  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const showToast = (message: string, type: ToastType) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToastState({ visible: true, message, type });

    timerRef.current = setTimeout(() => {
      setToastState({ visible: false, message: '', type: 'none' });
    }, duration);
  };

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toastState, showToast };
};
