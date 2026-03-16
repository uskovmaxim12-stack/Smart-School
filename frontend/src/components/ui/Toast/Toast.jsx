import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'react-feather';
import styles from './Toast.module.css';

let toastId = 0;
const listeners = new Set();

export const toast = {
  success: (message) => {
    const id = toastId++;
    listeners.forEach(fn => fn({ id, type: 'success', message }));
    setTimeout(() => {
      listeners.forEach(fn => fn({ id, type: 'remove' }));
    }, 4000);
  },
  error: (message) => {
    const id = toastId++;
    listeners.forEach(fn => fn({ id, type: 'error', message }));
    setTimeout(() => {
      listeners.forEach(fn => fn({ id, type: 'remove' }));
    }, 4000);
  },
  info: (message) => {
    const id = toastId++;
    listeners.forEach(fn => fn({ id, type: 'info', message }));
    setTimeout(() => {
      listeners.forEach(fn => fn({ id, type: 'remove' }));
    }, 4000);
  },
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (toastData) => {
      if (toastData.type === 'remove') {
        setToasts(prev => prev.filter(t => t.id !== toastData.id));
      } else {
        setToasts(prev => [...prev, toastData]);
      }
    };
    listeners.add(handleToast);
    return () => listeners.delete(handleToast);
  }, []);

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span className={styles.icon}>
            {toast.type === 'success' && <CheckCircle size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
          </span>
          <span className={styles.message}>{toast.message}</span>
          <button className={styles.close} onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
