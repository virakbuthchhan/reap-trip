'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'info' | 'error';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Modern Toast Dialog Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle2 size={19} color="var(--primary)" />}
              {toast.type === 'warning' && <AlertTriangle size={19} color="var(--accent-amber)" />}
              {toast.type === 'info' && <Info size={19} color="var(--accent-cyan)" />}
              {toast.type === 'error' && <AlertCircle size={19} color="var(--accent-red)" />}
            </div>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close-btn" onClick={() => removeToast(toast.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          top: 1.25rem;
          right: 1.25rem;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          pointer-events: none;
          max-width: 420px;
          width: calc(100% - 2.5rem);
        }

        .toast-card {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(15, 23, 42, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-glow);
          border-radius: var(--radius-md);
          padding: 0.85rem 1.15rem;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.15);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.9rem;
          animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .toast-card.toast-success {
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.2);
        }

        .toast-card.toast-warning {
          border-color: rgba(245, 158, 11, 0.5);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.2);
        }

        .toast-card.toast-info {
          border-color: rgba(6, 182, 212, 0.5);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(6, 182, 212, 0.2);
        }

        .toast-card.toast-error {
          border-color: rgba(239, 68, 68, 0.5);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.2);
        }

        .toast-message {
          flex: 1;
          line-height: 1.4;
          font-weight: 500;
        }

        .toast-close-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: var(--transition);
        }

        .toast-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
