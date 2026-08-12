'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { QuantitySelector } from './ProductOptions';
import { TrashIcon } from './ui/Icons';

/** A single cart line on the full cart page. */
export default function CartItem({ item, onQuantityChange, onRemove }) {
  const lineTotal = item.unitPrice * item.quantity;
  const options = [item.size, item.color].filter(Boolean).join(' · ');

  return (
    <li className="flex flex-col gap-5 py-6 sm:flex-row">
      <div className="relative h-40 w-32 shrink-0 self-center overflow-hidden rounded-lg border border-line bg-obsidian sm:self-start">
        {item.image && (
          <Image src={item.image} alt="" fill sizes="128px" className="object-cover" />
        )}
        {item.custom?.artwork && (
          <span className="absolute inset-0 flex items-center justify-center">
            {/* Customer artwork is a local object/data URL, so next/image cannot optimise it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.custom.artwork}
              alt=""
              className="max-h-[36%] max-w-[44%] object-contain"
              style={
                item.custom.transform
                  ? {
                      transform: `rotate(${item.custom.transform.rotation}deg) scale(${item.custom.transform.scale})`,
                    }
                  : undefined
              }
            />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {item.slug ? (
              <Link
                href={`/products/${item.slug}`}
                className="text-base text-cream transition-colors hover:text-gold"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-base text-cream">{item.name}</span>
            )}

            {options && <p className="mt-1 text-sm text-muted">{options}</p>}

            {item.custom && (
              <div className="mt-2 space-y-1">
                <span className="inline-block rounded border border-gold/35 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-gold">
                  Custom design
                </span>
                {item.custom.fileName && (
                  <p className="truncate text-xs text-faint">Artwork: {item.custom.fileName}</p>
                )}
              </div>
            )}

            <p className="mt-2 text-sm text-faint">
              {formatPrice(item.unitPrice)} each
              {item.listPrice && item.listPrice > item.unitPrice && (
                <span className="ml-2 line-through">{formatPrice(item.listPrice)}</span>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.key)}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 rounded-lg border border-line p-2 text-faint transition-colors hover:border-red-500/50 hover:text-red-400"
          >
            <TrashIcon size={16} />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          <QuantitySelector
            value={item.quantity}
            onChange={(next) => onQuantityChange(item.key, next)}
          />
          <span className="text-lg font-semibold text-gold">{formatPrice(lineTotal)}</span>
        </div>
      </div>
    </li>
  );
}
