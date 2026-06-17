import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export default function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  fullWidth = true,
  className = "",
  id,
  ...props
}: SelectProps) {
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
        <select
          id={inputId}
          className={[
            "appearance-none bg-[#161b27] border border-[#252d40] text-slate-100",
            "rounded-md text-sm px-3 py-2 pr-8 transition-colors",
            "focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
            error ? "border-red-500/50" : "",
            fullWidth ? "w-full" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
