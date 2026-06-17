"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  footer,
}: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={[
          "relative w-full bg-[#161b27] border border-[#252d40] rounded-xl shadow-2xl",
          "animate-fade-in",
          sizeClasses[size],
        ].join(" ")}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#252d40]">
            <h2 className="text-base font-semibold text-slate-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-300 hover:bg-[#1e2535] rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t border-[#252d40] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
