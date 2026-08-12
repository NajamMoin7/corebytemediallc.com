'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from './Icons';
import { cn } from '@/lib/utils';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

/**
 * Accessible dialog: portalled to <body>, closes on Escape and backdrop click,
 * traps Tab focus inside, restores focus to the trigger on close, and locks
 * background scroll while open.
 */
export default function Modal({
  open,
  onClose,
  title,
  description = null,
  size = 'md',
  children,
  footer = null,
  className = '',
}) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null,
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog once it has painted.
    const timer = window.setTimeout(() => {
      const panel = panelRef.current;
      const target = panel?.querySelector(FOCUSABLE) || panel;
      target?.focus?.();
    }, 20);

    return () => {
      document.body.style.overflow = overflow;
      window.clearTimeout(timer);
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 animate-fade-in bg-ink/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden border border-line bg-graphite shadow-2xl outline-none',
          'animate-scale-in rounded-t-2xl sm:rounded-2xl',
          SIZES[size] || SIZES.md,
          className,
        )}
      >
        <span className="rule-gold shrink-0" aria-hidden="true" />

        {(title || description) && (
          <header className="flex items-start justify-between gap-6 px-6 pt-6 sm:px-8">
            <div className="space-y-2">
              {title && (
                <h2 id={titleId} className="text-xl text-cream sm:text-2xl">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descriptionId} className="text-sm leading-relaxed text-muted">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="-mr-1 -mt-1 rounded-full border border-line p-2 text-muted transition-colors hover:border-gold/50 hover:text-gold"
            >
              <CloseIcon size={16} />
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">{children}</div>

        {footer && (
          <footer className="shrink-0 border-t border-line bg-charcoal/50 px-6 py-4 sm:px-8">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
