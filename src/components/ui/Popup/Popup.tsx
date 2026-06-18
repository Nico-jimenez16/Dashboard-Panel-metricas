'use client';

import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '../button/button';
import type { PopupProps } from './Popup.types';

const EXIT_MS = 180;

const SIZE_CLASS: Record<NonNullable<PopupProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-5xl',
};

export function Popup({
  isOpen,
  className,
  title,
  description,
  children,
  primaryButtonLabel,
  secondaryButtonLabel,
  primaryButtonDisabled = false,
  secondaryButtonDisabled = false,
  onClickPrimary,
  onClickSecondary,
  onClose,
  size = 'md',
}: PopupProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  const dismissHandler = onClose ?? onClickSecondary;
  const canDismiss = Boolean(dismissHandler) && !secondaryButtonDisabled;
  const hasActions = primaryButtonLabel || secondaryButtonLabel;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // RAF ensures the element is painted at opacity-0 before transitioning in
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    }

    setIsVisible(false);
    const timeoutId = window.setTimeout(() => setShouldRender(false), EXIT_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !canDismiss) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') dismissHandler?.();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canDismiss, dismissHandler]);

  const handleBackdropMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || !canDismiss) return;
    dismissHandler?.();
  };

  if (!shouldRender) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/40 transition-opacity duration-[180ms]',
        isVisible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
    >
      <section
        className={[
          'relative bg-white rounded-xl shadow-2xl w-full flex flex-col overflow-hidden max-h-[90vh]',
          'transition-all duration-[180ms]',
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          SIZE_CLASS[size],
          className ?? '',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'popup-title' : undefined}
      >
        {onClose && (
          <button
            type="button"
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors shadow-sm"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {(title || description) && (
            <div className="shrink-0 px-6 py-5 border-b border-gray-200">
              {title && (
                <h2 id="popup-title" className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          )}
          {children && <div className="flex-1 overflow-y-auto">{children}</div>}
        </div>

        {hasActions && (
          <div className="shrink-0 flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
            {secondaryButtonLabel && (
              <Button variant="outline" onClick={onClickSecondary} disabled={secondaryButtonDisabled}>
                {secondaryButtonLabel}
              </Button>
            )}
            {primaryButtonLabel && (
              <Button onClick={onClickPrimary} disabled={primaryButtonDisabled}>
                {primaryButtonLabel}
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
