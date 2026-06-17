import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-neutral-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={[
            "bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400",
            "rounded-lg text-sm h-9 transition-colors",
            "focus:outline-none focus:border-[#0E5E6F] focus:ring-1 focus:ring-[rgba(14,94,111,0.12)]",
            error ? "border-[#C0392B] focus:border-[#C0392B] focus:ring-[rgba(192,57,43,0.12)]" : "",
            leftIcon ? "pl-9" : "pl-3",
            rightIcon ? "pr-9" : "pr-3",
            fullWidth ? "w-full" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-[#C0392B]">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs text-neutral-400">{hint}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-neutral-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={[
          "w-full bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400",
          "rounded-lg text-sm px-3 py-2 transition-colors resize-none",
          "focus:outline-none focus:border-[#0E5E6F] focus:ring-1 focus:ring-[rgba(14,94,111,0.12)]",
          error ? "border-[#C0392B]" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#C0392B]">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}
