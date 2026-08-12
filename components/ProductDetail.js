'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getCategoryName } from '@/lib/products';
import { getSizeGuide } from '@/data/size-guides';
import { RETURNS, SHIPPING } from '@/data/site';
import { discountPercent, formatPrice } from '@/lib/utils';
import ProductGallery from './ProductGallery';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Rating from './ui/Rating';
import Modal from './ui/Modal';
import { ColorSelector, QuantitySelector, SizeSelector } from './ProductOptions';
import {
  CartIcon,
  CheckIcon,
  HeartIcon,
  RefreshIcon,
  RulerIcon,
  TruckIcon,
} from './ui/Icons';

/**
 * The buy panel and gallery for a single product.
 *
 * Colour selection is owned here because it drives both the cart line and the
 * lead gallery image.
 */
export default function ProductDetail({ product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : null);
  const [color, setColor] = useState(product.colors[0]?.name ?? null);
  const [quantity, setQuantity] = useState(1);
  const [attemptedAdd, setAttemptedAdd] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const activeColor = product.colors.find((item) => item.name === color) || product.colors[0];
  const discount = discountPercent(product);
  const price = product.salePrice ?? product.price;
  const sizeGuide = getSizeGuide(product.category);

  function validate() {
    setAttemptedAdd(true);
    if (!size) {
      toast({
        title: 'Choose a size first',
        description: 'Select a size to add this item to your cart.',
        variant: 'error',
      });
      return false;
    }
    return true;
  }

  function handleAdd() {
    if (!validate()) return false;
    addItem({ product, size, color, quantity, image: activeColor?.image });
    return true;
  }

  function handleBuyNow() {
    if (handleAdd()) router.push('/checkout');
  }

  function toggleWishlist() {
    setWishlisted((value) => {
      const next = !value;
      toast({
        title: next
          ? `${product.name} saved to your wishlist.`
          : `${product.name} removed from your wishlist.`,
        description: next
          ? 'Wishlists are kept for this visit only — no account needed.'
          : undefined,
      });
      return next;
    });
  }

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery
          images={product.images}
          activeSrc={activeColor?.image}
          productName={product.name}
        />

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[0.68rem] uppercase tracking-[0.18em] text-faint">
                {getCategoryName(product.category)}
              </span>
              {product.isNew && <Badge tone="outline">New</Badge>}
              {discount && <Badge tone="sale">-{discount}%</Badge>}
            </div>

            <h1 className="text-balance text-3xl leading-tight text-cream sm:text-4xl">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <Rating value={product.rating} size={16} />
              <span className="text-xs text-faint">{product.reviews} reviews</span>
              <span className="text-xs text-faint">SKU {product.sku}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-gold">{formatPrice(price)}</span>
            {product.salePrice && (
              <>
                <span className="text-lg text-faint line-through">{formatPrice(product.price)}</span>
                <span className="text-xs uppercase tracking-[0.14em] text-red-400">
                  Save {formatPrice(product.price - product.salePrice)}
                </span>
              </>
            )}
          </div>

          <p className="text-pretty text-sm leading-relaxed text-muted sm:text-base">
            {product.description}
          </p>

          <div className="rule-gold opacity-30" aria-hidden="true" />

          {product.inStock ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-faint">
                    Size{size && <span className="ml-2 normal-case tracking-normal text-cream">{size}</span>}
                  </span>
                  {sizeGuide && (
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs text-gold transition-colors hover:text-champagne"
                    >
                      <RulerIcon size={14} />
                      Size guide
                    </button>
                  )}
                </div>
                <SizeSelector
                  sizes={product.sizes}
                  value={size}
                  onChange={setSize}
                  error={attemptedAdd && !size}
                />
                {attemptedAdd && !size && (
                  <p role="alert" className="text-xs text-red-400">
                    Please select a size.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.16em] text-faint">
                  Colour <span className="ml-2 normal-case tracking-normal text-cream">{color}</span>
                </span>
                <ColorSelector colors={product.colors} value={color} onChange={setColor} />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs uppercase tracking-[0.16em] text-faint">Quantity</span>
                <QuantitySelector value={quantity} onChange={setQuantity} />
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckIcon size={13} />
                  In stock
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={handleAdd} size="lg" className="flex-1">
                  <CartIcon size={17} />
                  Add to Cart
                </Button>
                <Button onClick={handleBuyNow} variant="outline" size="lg" className="flex-1">
                  Buy Now
                </Button>
                <button
                  type="button"
                  onClick={toggleWishlist}
                  aria-pressed={wishlisted}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-full border transition-all duration-300 md:h-14 md:w-14 ${
                    wishlisted
                      ? 'border-gold bg-gold/12 text-gold'
                      : 'border-line text-muted hover:border-gold/45 hover:text-gold'
                  }`}
                >
                  <HeartIcon size={19} filled={wishlisted} />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 rounded-xl border border-line bg-charcoal/50 p-5">
              <p className="text-sm font-medium text-cream">Currently out of stock</p>
              <p className="text-sm leading-relaxed text-muted">
                This item is not available to order right now. Get in touch and we will tell you when
                it is back, or browse the related pieces below.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/contact" variant="outline" size="sm">
                  Ask about restock
                </Button>
                <Button href={`/products?category=${product.category}`} variant="ghost" size="sm">
                  Similar products
                </Button>
              </div>
            </div>
          )}

          {/* Assurances */}
          <ul className="grid gap-3 rounded-xl border border-line bg-graphite p-5 sm:grid-cols-2">
            <Assurance
              Icon={TruckIcon}
              title="Shipping"
              body={`Prepared in ${SHIPPING.estimate.processingDays}, then ${SHIPPING.estimate.majorCities} to major cities.`}
              href="/shipping"
            />
            <Assurance
              Icon={RefreshIcon}
              title="Returns"
              body={`${RETURNS.windowDays}-day returns on unused catalogue items.`}
              href="/returns"
            />
          </ul>

          {/* Details */}
          <div className="divide-y divide-line border-y border-line">
            <DetailBlock title="Product details">
              <p className="leading-relaxed">{product.longDescription}</p>
            </DetailBlock>

            <DetailBlock title="Material & care">
              <p className="mb-3">
                <span className="text-cream">Material: </span>
                {product.material}
              </p>
              <ul className="space-y-1.5">
                {product.care.map((instruction) => (
                  <li key={instruction} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/60" aria-hidden="true" />
                    {instruction}
                  </li>
                ))}
              </ul>
            </DetailBlock>

            <DetailBlock title="Shipping & returns">
              <p className="mb-2 leading-relaxed">
                Orders are prepared in {SHIPPING.estimate.processingDays} and dispatched across
                Pakistan. Shipping is a flat {formatPrice(SHIPPING.flatRate)}, free over{' '}
                {formatPrice(SHIPPING.freeThreshold)}. Cash on Delivery is available nationwide.
              </p>
              <p className="leading-relaxed">
                Unused catalogue items can be returned within {RETURNS.windowDays} days. Customised
                items are made to order and cannot be returned for a change of mind, but are always
                covered if they arrive damaged, defective or incorrect.
              </p>
            </DetailBlock>
          </div>
        </div>
      </div>

      {sizeGuide && (
        <Modal
          open={sizeGuideOpen}
          onClose={() => setSizeGuideOpen(false)}
          title="Size guide"
          description={sizeGuide.note}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[26rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  {sizeGuide.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-3 py-3 text-left text-[0.68rem] uppercase tracking-[0.14em] text-gold"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeGuide.rows.map((row) => (
                  <tr key={row[0]} className="border-b border-line/60 last:border-0">
                    {row.map((cell, index) => (
                      <td
                        key={`${row[0]}-${index}`}
                        className={`px-3 py-3 ${index === 0 ? 'font-medium text-cream' : 'text-muted'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-faint">
            Still unsure? Measure a garment you already own and wear often, then match it against the
            chest figure — it is a far more reliable guide than body measurements.
          </p>
        </Modal>
      )}
    </>
  );
}

function Assurance({ Icon, title, body, href }) {
  return (
    <li className="flex gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-gold" />
      <div className="min-w-0">
        <a href={href} className="text-sm text-cream transition-colors hover:text-gold">
          {title}
        </a>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{body}</p>
      </div>
    </li>
  );
}

function DetailBlock({ title, children }) {
  return (
    <details className="group py-4" open>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm uppercase tracking-[0.14em] text-cream marker:hidden">
        {title}
        <span
          aria-hidden="true"
          className="text-gold transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pt-4 text-sm text-muted">{children}</div>
    </details>
  );
}
