'use client';

import { COUNTRIES, PROVINCES } from '@/data/site';
import { cn } from '@/lib/utils';

/**
 * Customer and shipping fields.
 *
 * Validation state is owned by the parent so the whole form can be checked in
 * one place on submit; this component only renders fields and errors.
 */
export default function CheckoutForm({ values, errors, onChange }) {
  return (
    <div className="space-y-10">
      <Fieldset legend="Customer Information" step="01">
        <Field
          id="fullName"
          label="Full Name"
          value={values.fullName}
          error={errors.fullName}
          onChange={onChange}
          autoComplete="name"
          placeholder="Ayesha Rahman"
          required
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="email"
            label="Email Address"
            type="email"
            value={values.email}
            error={errors.email}
            onChange={onChange}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          <Field
            id="phone"
            label="Phone Number"
            type="tel"
            value={values.phone}
            error={errors.phone}
            onChange={onChange}
            autoComplete="tel"
            placeholder="0300 0000000"
            hint="The courier calls this number before delivery."
            required
          />
        </div>
      </Fieldset>

      <Fieldset legend="Shipping Address" step="02">
        <Field
          id="address"
          label="Street Address"
          value={values.address}
          error={errors.address}
          onChange={onChange}
          autoComplete="street-address"
          placeholder="House / flat number, street, area"
          as="textarea"
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="city"
            label="City"
            value={values.city}
            error={errors.city}
            onChange={onChange}
            autoComplete="address-level2"
            placeholder="Lahore"
            required
          />
          <Field
            id="province"
            label="Province / State"
            value={values.province}
            error={errors.province}
            onChange={onChange}
            autoComplete="address-level1"
            as="select"
            options={PROVINCES}
            placeholder="Select a province"
            required={values.country === 'Pakistan'}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="postalCode"
            label="Postal Code"
            value={values.postalCode}
            error={errors.postalCode}
            onChange={onChange}
            autoComplete="postal-code"
            placeholder="54000"
            inputMode="numeric"
          />
          <Field
            id="country"
            label="Country"
            value={values.country}
            error={errors.country}
            onChange={onChange}
            autoComplete="country-name"
            as="select"
            options={COUNTRIES}
            required
          />
        </div>

        <Field
          id="notes"
          label="Order Notes"
          value={values.notes}
          error={errors.notes}
          onChange={onChange}
          as="textarea"
          placeholder="Landmark, delivery timing, or anything else the courier should know."
          hint="Optional."
        />
      </Fieldset>
    </div>
  );
}

function Fieldset({ legend, step, children }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/35 text-xs font-semibold text-gold">
          {step}
        </span>
        <span className="text-lg text-cream">{legend}</span>
      </legend>
      {children}
    </fieldset>
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

  const baseClasses = cn(
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
          rows={3}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(baseClasses, 'resize-y py-3')}
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
            className={cn(baseClasses, 'h-12 appearance-none pr-10')}
            {...rest}
          >
            {placeholder && <option value="">{placeholder}</option>}
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
          className={cn(baseClasses, 'h-12')}
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
