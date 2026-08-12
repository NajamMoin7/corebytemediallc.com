'use client';

import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { CONTACT } from '@/data/site';
import { cn, isValidEmail, isValidPhone } from '@/lib/utils';
import Button from './ui/Button';
import { CheckCircleIcon } from './ui/Icons';

const SUBJECTS = [
  'General enquiry',
  'Order status',
  'Custom / bulk order',
  'Sizing help',
  'Returns or exchange',
  'Something went wrong',
];

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

/**
 * Contact form.
 *
 * There is no mail backend on this site, so the message is validated and
 * acknowledged client-side rather than being sent anywhere. The success state
 * says so plainly and gives the direct email address as the working route.
 */
export default function ContactForm() {
  const { toast } = useToast();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = 'Please enter your name.';
    if (!values.email.trim()) next.email = 'Please enter your email address.';
    else if (!isValidEmail(values.email)) next.email = 'That email address does not look right.';
    if (values.phone.trim() && !isValidPhone(values.phone))
      next.phone = 'Enter a valid phone number, or leave it blank.';
    if (!values.subject) next.subject = 'Please choose a subject.';
    if (!values.message.trim()) next.message = 'Please write your message.';
    else if (values.message.trim().length < 15)
      next.message = 'A little more detail will help us answer properly.';
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: 'Please check the highlighted fields',
        variant: 'error',
      });
      document.getElementById(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    setSubmitted(true);
    toast({ title: 'Message ready to send.', variant: 'success' });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-xl border border-gold/30 bg-gold/[0.06] p-10 text-center" role="status">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold">
          <CheckCircleIcon size={30} />
        </span>
        <div className="space-y-2">
          <h2 className="text-xl text-cream">Thanks, {values.name.split(' ')[0]}</h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            Your message has been validated and is ready to go.
          </p>
        </div>

        <p className="mx-auto max-w-md rounded-lg border border-line bg-charcoal/50 p-4 text-xs leading-relaxed text-muted">
          <span className="text-cream">One thing to know:</span> this storefront has no mail server
          connected yet, so nothing was actually transmitted. To reach us right now, email{' '}
          <a href={`mailto:${CONTACT.email}`} className="text-gold hover:text-champagne">
            {CONTACT.email}
          </a>{' '}
          directly — {CONTACT.responseTime.toLowerCase()}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setValues(EMPTY);
            setSubmitted(false);
          }}
        >
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Your Name"
          value={values.name}
          error={errors.name}
          onChange={update}
          autoComplete="name"
          placeholder="Ayesha Rahman"
          required
        />
        <Field
          id="email"
          label="Email Address"
          type="email"
          value={values.email}
          error={errors.email}
          onChange={update}
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="phone"
          label="Phone Number"
          type="tel"
          value={values.phone}
          error={errors.phone}
          onChange={update}
          autoComplete="tel"
          placeholder="0300 0000000"
          hint="Optional — only if you would rather we called."
        />
        <Field
          id="subject"
          label="Subject"
          value={values.subject}
          error={errors.subject}
          onChange={update}
          as="select"
          options={SUBJECTS}
          placeholder="Choose a subject"
          required
        />
      </div>

      <Field
        id="message"
        label="Message"
        value={values.message}
        error={errors.message}
        onChange={update}
        as="textarea"
        rows={6}
        placeholder="Tell us what you need. If it is about an order, include the order number."
        required
      />

      <Button type="submit" size="lg" fullWidth className="!h-13">
        Send Message
      </Button>

      <p className="text-xs leading-relaxed text-faint">
        We use your details only to answer your message. See our{' '}
        <a href="/privacy-policy" className="text-muted underline underline-offset-2 hover:text-gold">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  as = 'input',
  options = [],
  hint = null,
  required = false,
  placeholder = '',
  ...rest
}) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(' ');

  const base = cn(
    'w-full rounded-lg border bg-charcoal/60 px-4 text-sm text-cream outline-none transition-colors placeholder:text-faint',
    error ? 'border-red-500/60 focus:border-red-500' : 'border-line focus:border-gold/55',
  );

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs uppercase tracking-[0.14em] text-muted">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </label>

      {as === 'textarea' && (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(id, event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(base, 'resize-y py-3')}
          {...rest}
        />
      )}

      {as === 'select' && (
        <div className="relative">
          <select
            id={id}
            name={id}
            value={value}
            onChange={(event) => onChange(id, event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy || undefined}
            className={cn(base, 'h-12 appearance-none pr-10')}
            {...rest}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option} value={option} className="bg-graphite">
                {option}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint"
          >
            ▾
          </span>
        </div>
      )}

      {as === 'input' && (
        <input
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(id, event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(base, 'h-12')}
          {...rest}
        />
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-faint">
          {hint}
        </p>
      )}
    </div>
  );
}
