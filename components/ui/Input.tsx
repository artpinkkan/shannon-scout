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
          className="block text-xs font-medium text-slate-400 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={[
            "bg-[#161b27] border border-[#252d40] text-slate-100 placeholder-slate-600",
            "rounded-md text-sm py-2 transition-colors",
            "focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
            error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "",
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
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
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
          className="block text-xs font-medium text-slate-400 mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={[
          "w-full bg-[#161b27] border border-[#252d40] text-slate-100 placeholder-slate-600",
          "rounded-md text-sm px-3 py-2 transition-colors resize-none",
          "focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
          error ? "border-red-500/50" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
