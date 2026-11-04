'use client';

import Script from 'next/script';
import { useImperativeHandle, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './ui/LoadingSpinner';

const COLLECT_JS_URL =
  process.env.NEXT_PUBLIC_NMI_COLLECT_JS_URL || 'https://secure.nmi.com/token/Collect.js';
const TOKENIZATION_KEY = process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY;

const FIELDS = {
  ccnumber: { label: 'Card Number', placeholder: '1234 1234 1234 1234', missing: 'Please enter your card number.' },
  ccexp: { label: 'Expiry (MM / YY)', placeholder: 'MM / YY', missing: 'Please enter the expiry date.' },
  cvv: { label: 'Security Code', placeholder: 'CVV', missing: 'Please enter the security code.' },
};

/** Tokenisation gives up if NMI has not answered in this long. */
const TOKEN_TIMEOUT_MS = 15000;

/**
 * Card number, expiry and CVV fields rendered by NMI Collect.js.
 *
 * Each field is an iframe served by NMI, so card data never touches this site —
 * the parent calls `ref.current.tokenize()` and receives a single-use payment
 * token to send to `/api/checkout`.
 */
export default function CardFields({ ref, disabled = false }) {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [errors, setErrors] = useState({});
  const pending = useRef(null);

  function settle(action, value) {
    const request = pending.current;
    if (!request) return;
    pending.current = null;
    window.clearTimeout(request.timer);
    request[action](value);
  }

  function configure() {
    if (!window.CollectJS) return;
    setReady(false);

    // The input is square and borderless on purpose: the NMI iframe page is white,
    // so rounded corners inside it show white. The border, radius and focus and
    // error states live on the wrapper in CardField instead.
    const fieldCss = {
      'background-color': '#181a1e',
      color: '#f4f2ec',
      border: 'none',
      'border-radius': '0',
      outline: 'none',
      margin: '0',
      padding: '0 16px',
      height: '46px',
      'font-size': '14px',
      'font-family': 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
      width: '100%',
      'box-sizing': 'border-box',
    };

    window.CollectJS.configure({
      variant: 'inline',
      styleSniffer: false,
      customCss: fieldCss,
      focusCss: { outline: 'none' },
      invalidCss: {},
      validCss: {},
      placeholderCss: { color: '#6d6960' },
      fields: Object.fromEntries(
        Object.entries(FIELDS).map(([name, field]) => [
          name,
          {
            selector: `#nmi-${name}`,
            title: field.label,
            placeholder: field.placeholder,
            ...(name === 'cvv' ? { display: 'show' } : {}),
          },
        ]),
      ),
      fieldsAvailableCallback: () => setReady(true),
      validationCallback: (field, valid, message) => {
        setErrors((current) => {
          const next = { ...current };
          if (valid) delete next[field];
          else next[field] = message === 'Field is empty' ? FIELDS[field]?.missing : message;
          return next;
        });
        if (!valid && pending.current) {
          settle('reject', new Error('Please check your card details.'));
        }
      },
      timeoutDuration: TOKEN_TIMEOUT_MS,
      timeoutCallback: () =>
        settle('reject', new Error('The card check timed out. Please try again.')),
      callback: (response) => {
        if (response?.token) settle('resolve', { token: response.token, card: response.card });
        else settle('reject', new Error('Your card could not be verified. Please try again.'));
      },
    });
  }

  useImperativeHandle(ref, () => ({
    tokenize() {
      if (!window.CollectJS || !ready) {
        return Promise.reject(new Error('Card fields are still loading. Please wait a moment.'));
      }
      if (pending.current) settle('reject', new Error('Superseded.'));

      return new Promise((resolve, reject) => {
        const timer = window.setTimeout(
          () => settle('reject', new Error('The card check timed out. Please try again.')),
          TOKEN_TIMEOUT_MS + 2000,
        );
        pending.current = { resolve, reject, timer };
        window.CollectJS.startPaymentRequest();
      });
    },
  }));

  if (!TOKENIZATION_KEY) {
    return (
      <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
        Card payment is not configured. Set NEXT_PUBLIC_NMI_TOKENIZATION_KEY.
      </p>
    );
  }

  return (
    <div className={cn('space-y-5', disabled && 'pointer-events-none opacity-70')}>
      <Script
        src={COLLECT_JS_URL}
        data-tokenization-key={TOKENIZATION_KEY}
        data-variant="inline"
        strategy="afterInteractive"
        onReady={configure}
        onError={() => setLoadError('The secure card form could not be loaded. Please refresh and try again.')}
      />

      <CardField name="ccnumber" error={errors.ccnumber} />
      <div className="grid gap-5 sm:grid-cols-2">
        <CardField name="ccexp" error={errors.ccexp} />
        <CardField name="cvv" error={errors.cvv} />
      </div>

      {!ready && !loadError && (
        <p className="flex items-center gap-2 text-xs text-faint">
          <Spinner size={13} /> Loading secure card fields…
        </p>
      )}
      {loadError && (
        <p role="alert" className="text-xs text-red-400">
          {loadError}
        </p>
      )}
    </div>
  );
}

function CardField({ name, error }) {
  const field = FIELDS[name];
  return (
    <div className="space-y-2">
      <span id={`nmi-${name}-label`} className="block text-xs uppercase tracking-[0.14em] text-muted">
        {field.label}
        <span className="ml-1 text-gold">*</span>
      </span>
      {/* Styled like the other checkout inputs; the NMI iframe sits square inside. */}
      <div
        id={`nmi-${name}`}
        aria-labelledby={`nmi-${name}-label`}
        className={cn(
          'min-h-12 overflow-hidden rounded-lg border bg-[#181a1e] transition-colors [&_iframe]:block [&_iframe]:w-full',
          error ? 'border-red-500/60' : 'border-line focus-within:border-gold/55',
        )}
      />
      {error && (
        <p id={`nmi-${name}-error`} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
