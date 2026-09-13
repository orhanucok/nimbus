'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Reusable empty-state placeholder. Centered icon + headline +
 * description + optional CTA. Used in:
 *  - Sidebar (no chats yet)
 *  - Landing chat input (no image selected)
 *  - Provider switcher "block" variant (no providers configured)
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-12 text-muted-foreground ${
        className ?? ''
      }`}
      role="status"
    >
      {icon && (
        <div className="mb-4 opacity-50" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

export default EmptyState;
