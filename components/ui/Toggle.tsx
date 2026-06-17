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
          "focus:outline-none focus:ring-2 focus:ring-[#0E5E6F] focus:ring-offset-2 focus:ring-offset-white",
          checked ? "bg-[#0E5E6F]" : "bg-neutral-200",
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
            <p className="text-sm font-medium text-neutral-700">{label}</p>
          )}
          {description && (
            <p className="text-xs text-neutral-400 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
