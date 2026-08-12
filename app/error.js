'use client';

import Button from '@/components/ui/Button';
import { AlertIcon } from '@/components/ui/Icons';

export default function Error({ error, reset }) {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-8 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 text-gold">
        <AlertIcon size={28} />
      </span>

      <div className="space-y-4">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="text-3xl text-cream sm:text-4xl">We hit an unexpected error</h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          Try again — if it keeps happening, the details below help us track it down.
        </p>
        {error?.digest && (
          <p className="text-xs text-faint">
            Reference: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>Try Again</Button>
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
