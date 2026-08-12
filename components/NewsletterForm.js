'use client';

import { useState } from 'react';
import { isValidEmail } from '@/lib/utils';
import { CheckCircleIcon } from './ui/Icons';

/**
 * Newsletter sign-up.
 *
 * There is no mailing-list backend on this site, so nothing is transmitted — the
 * form validates the address and confirms locally. Wiring it up later means
 * replacing the body of `handleSubmit` with a real request.
 */
export default function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | success
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('That email address does not look right.');
      return;
    }

    setStatus('success');
    setMessage('You are on the list. We will be in touch when something new drops.');
    setEmail('');
  }

  if (status === 'success') {
    return (
      <div
        className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/[0.07] p-4"
        role="status"
      >
        <CheckCircleIcon size={18} className="mt-0.5 shrink-0 text-gold" />
        <div>
          <p className="text-sm font-medium text-champagne">Subscribed</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={compact ? 'space-y-2.5' : 'space-y-3'}>
      <div className={compact ? 'space-y-2.5' : 'flex flex-col gap-3 sm:flex-row'}>
        <label htmlFor={compact ? 'newsletter-email-footer' : 'newsletter-email'} className="sr-only">
          Email address
        </label>
        <input
          id={compact ? 'newsletter-email-footer' : 'newsletter-email'}
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
          className={`h-12 w-full rounded-full border bg-charcoal/60 px-5 text-sm text-cream outline-none transition-colors placeholder:text-faint focus:border-gold/60 ${
            status === 'error' ? 'border-red-500/60' : 'border-line'
          } ${compact ? '' : 'sm:flex-1'}`}
        />
        <button
          type="submit"
          className={`h-12 rounded-full bg-gradient-to-br from-champagne via-gold to-gold-dark px-7 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:brightness-110 ${
            compact ? 'w-full' : 'shrink-0'
          }`}
        >
          Subscribe
        </button>
      </div>

      {status === 'error' && (
        <p id="newsletter-error" role="alert" className="text-xs text-red-400">
          {message}
        </p>
      )}

      {status === 'idle' && !compact && (
        <p className="text-xs text-faint">
          We only use your address for product updates. See our{' '}
          <a href="/privacy-policy" className="text-muted underline underline-offset-2 hover:text-gold">
            Privacy Policy
          </a>
          .
        </p>
      )}
    </form>
  );
}
