"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const iconMap = {
    success: <CheckCircle className="w-4 h-4 text-[#1A7F4B]" />,
    error: <AlertCircle className="w-4 h-4 text-[#C0392B]" />,
    info: <Info className="w-4 h-4 text-[#0E5E6F]" />,
  };

  const borderMap = {
    success: "border-[#E8F5EE]",
    error: "border-[#FDECEA]",
    info: "border-[#E6F4F7]",
  };

  return (
    <div
      className={[
        "flex items-center gap-3 px-4 py-3 bg-white border rounded-lg shadow-sm",
        "animate-[slideUp_0.3s_ease-out]",
        borderMap[type],
      ].join(" ")}
    >
      {iconMap[type]}
      <span className="text-sm text-neutral-700">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-neutral-400 hover:text-neutral-700 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Toast container + manager
interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}

export function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => onRemove(t.id)}
        />
      ))}
    </div>
  );
}
