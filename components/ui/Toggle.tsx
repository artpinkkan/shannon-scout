"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export default function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out mt-0.5",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0f1117]",
          checked ? "bg-indigo-600" : "bg-[#252d40]",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out mt-[3px]",
            checked ? "translate-x-4" : "translate-x-[3px]",
          ].join(" ")}
        />
      </button>
      {(label || description) && (
        <div>
          {label && (
            <p className="text-sm font-medium text-slate-200">{label}</p>
          )}
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
