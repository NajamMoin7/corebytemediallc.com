'use client';

import { COUNTRIES } from '@/data/site';
import { US_STATES, stateLabel } from '@/data/us-states';
import { cn } from '@/lib/utils';

/**
 * Customer and shipping fields, in US address order.
 *
 * Validation state is owned by the parent so the whole form can be checked in
 * one place on submit; this component only renders fields and errors.
 */
export default function CheckoutForm({ values, errors, onChange }) {
  const stateOptions = US_STATES.map((state) => ({
    value: state.code,
    label: stateLabel(state),
  }));

  const countryOptions = COUNTRIES.map((country) => ({ value: country, label: country }));

  return (
    <div className="space-y-10">
      <Fieldset legend="Contact Information" step="01">
        <Field
          id="fullName"
          label="Full Name"
          value={values.fullName}
          error={errors.fullName}
          onChange={onChange}
          autoComplete="name"
          placeholder="Jordan Miller"
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
            hint="Order confirmation and tracking are sent here."
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
            placeholder="(512) 555-0123"
            hint="US number — used only if there is a delivery problem."
            required
          />
        </div>
      </Fieldset>

      <Fieldset legend="Shipping Address" step="02">
        <Field
          id="addressLine1"
          label="Address Line 1"
          value={values.addressLine1}
          error={errors.addressLine1}
          onChange={onChange}
          autoComplete="address-line1"
          placeholder="Street address or PO box"
          required
        />

        <Field
          id="addressLine2"
          label="Address Line 2"
          value={values.addressLine2}
          error={errors.addressLine2}
          onChange={onChange}
          autoComplete="address-line2"
          placeholder="Apartment, suite, unit, building, floor"
          hint="Optional."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            id="city"
            label="City"
            value={values.city}
            error={errors.city}
            onChange={onChange}
            autoComplete="address-level2"
            placeholder="Austin"
            required
          />
          <Field
            id="state"
            label="State"
            value={values.state}
            error={errors.state}
            onChange={onChange}
            autoComplete="address-level1"
            as="select"
            options={stateOptions}
            placeholder="Select a state"
            required
          />
          <Field
            id="zipCode"
            label="ZIP Code"
            value={values.zipCode}
            error={errors.zipCode}
            onChange={onChange}
            autoComplete="postal-code"
            placeholder="78758"
            inputMode="numeric"
            maxLength={10}
            required
          />
        </div>

        <Field
          id="country"
          label="Country"
          value={values.country}
          error={errors.country}
          onChange={onChange}
          autoComplete="country-name"
          as="select"
          options={countryOptions}
          hint={
            COUNTRIES.length === 1
              ? 'We currently ship to US addresses only.'
              : undefined
          }
          disabled={COUNTRIES.length === 1}
          required
        />

        <Field
          id="notes"
          label="Delivery Notes"
          value={values.notes}
          error={errors.notes}
          onChange={onChange}
          as="textarea"
          placeholder="Gate code, buzzer, safe place to leave the package, or anything else the carrier should know."
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
  disabled = false,
  ...rest
}) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(' ');

  const baseClasses = cn(
    'w-full rounded-lg border bg-charcoal/60 px-4 text-sm text-cream outline-none transition-colors placeholder:text-faint',
    error ? 'border-red-500/60 focus:border-red-500' : 'border-line focus:border-gold/55',
    disabled && 'cursor-not-allowed opacity-70',
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
            disabled={disabled}
            onChange={(event) => onChange(id, event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy || undefined}
            className={cn(baseClasses, 'h-12 appearance-none pr-10')}
            {...rest}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-graphite">
                {option.label}
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
