import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1.5 mb-2">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-neutral-300">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-xs text-neutral-500">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-neutral-400">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}
