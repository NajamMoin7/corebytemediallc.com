'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getCategoryName } from '@/lib/products';
import { discountPercent, formatPrice } from '@/lib/utils';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Rating from './ui/Rating';
import Badge from './ui/Badge';
import { ColorSelector, QuantitySelector, SizeSelector } from './ProductOptions';
import { ArrowRightIcon, CartIcon } from './ui/Icons';

/**
 * Condensed buy panel shown from a product card without leaving the page.
 *
 * The stateful panel is only mounted while the dialog is open, so each opening
 * starts from the product defaults without an effect to reset it.
 */
export default function QuickViewModal({ product, open, onClose }) {
  if (!open) return null;
  return <QuickViewPanel product={product} onClose={onClose} />;
}

function QuickViewPanel({ product, onClose }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]?.name ?? null);
  const [quantity, setQuantity] = useState(1);

  const activeColor = product.colors.find((item) => item.name === color) || product.colors[0];
  const image = activeColor?.image || product.images[0].src;
  const discount = discountPercent(product);

  function handleAdd() {
    addItem({ product, size, color, quantity, image });
    onClose();
  }

  return (
    <Modal open onClose={onClose} size="lg" title={null}>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-line bg-obsidian">
          <Image
            src={image}
            alt={`${product.name} in ${activeColor?.name ?? 'default'}`}
            fill
            sizes="(max-width: 768px) 90vw, 40vw"
            className="object-cover"
          />
          {discount && (
            <span className="absolute left-3 top-3">
              <Badge tone="sale">-{discount}%</Badge>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-faint">
              {getCategoryName(product.category)}
            </span>
            <h2 className="text-2xl leading-tight text-cream">{product.name}</h2>
            <Rating value={product.rating} count={product.reviews} />
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-gold">
              {formatPrice(product.salePrice ?? product.price)}
            </span>
            {product.salePrice && (
              <span className="text-base text-faint line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted">{product.description}</p>

          {product.inStock ? (
            <>
              <div className="space-y-2.5">
                <span className="text-xs uppercase tracking-[0.16em] text-faint">Size</span>
                <SizeSelector sizes={product.sizes} value={size} onChange={setSize} idPrefix="qv-size" />
              </div>

              <div className="space-y-2.5">
                <span className="text-xs uppercase tracking-[0.16em] text-faint">
                  Colour <span className="text-muted normal-case tracking-normal">— {color}</span>
                </span>
                <ColorSelector colors={product.colors} value={color} onChange={setColor} />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-[0.16em] text-faint">Qty</span>
                <QuantitySelector value={quantity} onChange={setQuantity} />
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
                <Button onClick={handleAdd} className="flex-1">
                  <CartIcon size={16} />
                  Add to Cart
                </Button>
                <Button href={`/products/${product.slug}`} variant="outline" onClick={onClose}>
                  Full Details
                  <ArrowRightIcon size={15} />
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-auto space-y-4">
              <p className="rounded-lg border border-line bg-charcoal/60 p-4 text-sm text-muted">
                This item is currently out of stock. Check the product page for restock details or
                browse similar pieces.
              </p>
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-champagne"
              >
                View product page
                <ArrowRightIcon size={15} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
