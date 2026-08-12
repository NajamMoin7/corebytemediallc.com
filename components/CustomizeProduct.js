'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { CUSTOM_PRODUCTS, ACCEPTED_EXTENSIONS, MAX_FILE_BYTES } from '@/data/customize';
import {
  DEFAULT_TRANSFORM,
  buildCustomCartLine,
  clearDraft,
  readArtwork,
  readDraft,
  saveDraft,
  validateArtwork,
} from '@/lib/customize';
import { useIsHydrated } from '@/lib/hooks';
import { cn, clamp, formatFileSize, formatPrice } from '@/lib/utils';
import { ColorSelector, QuantitySelector, SizeSelector } from './ProductOptions';
import Button from './ui/Button';
import { Skeleton, Spinner } from './ui/LoadingSpinner';
import {
  AlertIcon,
  CartIcon,
  CheckIcon,
  CloseIcon,
  MoveIcon,
  RefreshIcon,
  RotateIcon,
  UploadIcon,
  ZoomIcon,
} from './ui/Icons';

const POSITION_LIMIT = 60; // percent of the print panel the art may drift
const SCALE_RANGE = { min: 0.2, max: 2.5, step: 0.05 };
const ROTATION_RANGE = { min: -180, max: 180, step: 1 };

/**
 * Client-side product customiser.
 *
 * Everything runs in the browser: the uploaded file is read with FileReader,
 * held as a data URL, positioned with pointer/keyboard controls, and carried
 * into the cart. No network request is made and no file leaves the device — see
 * lib/customize.js for the seam where a real upload endpoint would attach.
 */
export default function CustomizeProduct() {
  // A saved draft lives in localStorage, which does not exist during the server
  // render. Waiting for hydration lets the builder seed its state directly from
  // the draft instead of resetting it in an effect afterwards.
  const hydrated = useIsHydrated();

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-10 xl:gap-14">
        <Skeleton className="aspect-4/5 w-full" />
        <div className="space-y-5">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return <Customizer initialDraft={readDraft()} />;
}

function resolveDraft(draft) {
  const savedBase =
    draft?.baseKey && CUSTOM_PRODUCTS.find((product) => product.key === draft.baseKey);

  if (!savedBase) {
    const fallback = CUSTOM_PRODUCTS[0];
    return {
      base: fallback,
      size: fallback.sizes[2] ?? fallback.sizes[0],
      color: fallback.colors[0].name,
      quantity: 1,
      artwork: null,
      fileName: '',
      fileSize: 0,
      transform: DEFAULT_TRANSFORM,
    };
  }

  return {
    base: savedBase,
    size: savedBase.sizes.includes(draft.size) ? draft.size : savedBase.sizes[0],
    color:
      savedBase.colors.find((option) => option.name === draft.color)?.name ??
      savedBase.colors[0].name,
    quantity: draft.quantity || 1,
    artwork: draft.artwork || null,
    fileName: draft.fileName || '',
    fileSize: draft.fileSize || 0,
    transform: draft.transform || DEFAULT_TRANSFORM,
  };
}

function Customizer({ initialDraft }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [restored] = useState(() => resolveDraft(initialDraft));

  const [base, setBase] = useState(restored.base);
  const [size, setSize] = useState(restored.size);
  const [color, setColor] = useState(restored.color);
  const [quantity, setQuantity] = useState(restored.quantity);

  const [artwork, setArtwork] = useState(restored.artwork);
  const [fileName, setFileName] = useState(restored.fileName);
  const [fileSize, setFileSize] = useState(restored.fileSize);
  const [transform, setTransform] = useState(restored.transform);

  const [reading, setReading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [draftWarning, setDraftWarning] = useState(false);

  const fileInputRef = useRef(null);
  const printAreaRef = useRef(null);
  const dragState = useRef(null);

  const activeColor = base.colors.find((option) => option.name === color) || base.colors[0];

  /* ---------------- Draft persistence ---------------- */

  // Writing to localStorage is a side effect on an external system, which is
  // what effects are for. The quota outcome is handled at upload time instead,
  // since artwork is the only thing large enough to exceed it.
  useEffect(() => {
    saveDraft({
      baseKey: base.key,
      size,
      color,
      quantity,
      artwork,
      fileName,
      fileSize,
      transform,
    });
  }, [base, size, color, quantity, artwork, fileName, fileSize, transform]);

  /* ---------------- Product selection ---------------- */

  function selectBase(next) {
    setBase(next);
    setSize(next.sizes.includes(size) ? size : (next.sizes[2] ?? next.sizes[0]));
    const matching = next.colors.find((option) => option.name === color);
    setColor(matching?.name ?? next.colors[0].name);
    setTransform(DEFAULT_TRANSFORM);
  }

  /* ---------------- Artwork upload ---------------- */

  const handleFile = useCallback(
    async (file) => {
      setUploadError(null);

      const error = validateArtwork(file);
      if (error) {
        setUploadError(error);
        toast({ title: 'Upload failed', description: error, variant: 'error' });
        return;
      }

      setReading(true);
      try {
        const dataUrl = await readArtwork(file);
        setArtwork(dataUrl);
        setFileName(file.name);
        setFileSize(file.size);
        setTransform(DEFAULT_TRANSFORM);

        // Artwork is the only thing large enough to blow the localStorage quota,
        // so this is where we find out whether the draft will survive a refresh.
        setDraftWarning(
          !saveDraft({
            baseKey: base.key,
            size,
            color,
            quantity,
            artwork: dataUrl,
            fileName: file.name,
            fileSize: file.size,
            transform: DEFAULT_TRANSFORM,
          }),
        );

        toast({
          title: 'Design added to the preview.',
          description: 'Drag it on the mockup, or use the controls to scale and rotate.',
          variant: 'success',
        });
      } catch (readError) {
        const message = readError.message || 'That file could not be read.';
        setUploadError(message);
        toast({ title: 'Upload failed', description: message, variant: 'error' });
      } finally {
        setReading(false);
      }
    },
    [toast, base.key, size, color, quantity],
  );

  function onInputChange(event) {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
    // Allow re-selecting the same file after a reset.
    event.target.value = '';
  }

  function onDrop(event) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function removeArtwork() {
    setArtwork(null);
    setFileName('');
    setFileSize(0);
    setTransform(DEFAULT_TRANSFORM);
    setUploadError(null);
  }

  /* ---------------- Positioning ---------------- */

  const updateTransform = useCallback((patch) => {
    setTransform((current) => ({ ...current, ...patch }));
  }, []);

  function onArtworkPointerDown(event) {
    if (!artwork) return;
    const rect = printAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
      width: rect.width,
      height: rect.height,
    };
  }

  function onArtworkPointerMove(event) {
    const state = dragState.current;
    if (!state) return;
    event.preventDefault();

    const deltaX = ((event.clientX - state.startX) / state.width) * 100;
    const deltaY = ((event.clientY - state.startY) / state.height) * 100;

    updateTransform({
      x: clamp(state.originX + deltaX, -POSITION_LIMIT, POSITION_LIMIT),
      y: clamp(state.originY + deltaY, -POSITION_LIMIT, POSITION_LIMIT),
    });
  }

  function endDrag(event) {
    if (!dragState.current) return;
    dragState.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function onArtworkKeyDown(event) {
    const nudge = event.shiftKey ? 5 : 1;
    const moves = {
      ArrowUp: { y: transform.y - nudge },
      ArrowDown: { y: transform.y + nudge },
      ArrowLeft: { x: transform.x - nudge },
      ArrowRight: { x: transform.x + nudge },
    };

    const move = moves[event.key];
    if (!move) return;

    event.preventDefault();
    updateTransform({
      x: clamp(move.x ?? transform.x, -POSITION_LIMIT, POSITION_LIMIT),
      y: clamp(move.y ?? transform.y, -POSITION_LIMIT, POSITION_LIMIT),
    });
  }

  function resetDesign() {
    setTransform(DEFAULT_TRANSFORM);
    toast({ title: 'Design position reset.' });
  }

  function resetEverything() {
    removeArtwork();
    setBase(CUSTOM_PRODUCTS[0]);
    setSize(CUSTOM_PRODUCTS[0].sizes[2] ?? CUSTOM_PRODUCTS[0].sizes[0]);
    setColor(CUSTOM_PRODUCTS[0].colors[0].name);
    setQuantity(1);
    clearDraft();
    setDraftWarning(false);
    toast({ title: 'Customiser cleared.' });
  }

  /* ---------------- Cart ---------------- */

  function addToCart({ goToCheckout = false } = {}) {
    if (!artwork) {
      setUploadError('Upload a design before adding this product to your cart.');
      toast({
        title: 'No design uploaded',
        description: 'Add your artwork first — that is what makes it a custom product.',
        variant: 'error',
      });
      fileInputRef.current?.focus();
      return;
    }

    const line = buildCustomCartLine({
      base,
      size,
      color,
      quantity,
      artwork,
      fileName,
      transform,
      designId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    });

    addItem(line, { silent: true });
    toast({
      title: `${base.name} added to your cart.`,
      description: `${size} · ${color} · your design`,
      variant: 'success',
    });

    if (goToCheckout) router.push('/checkout');
  }

  const lineTotal = base.basePrice * quantity;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-10 xl:gap-14">
      {/* ------------------------------- Preview ------------------------------- */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-line bg-obsidian">
          <Image
            key={activeColor.image}
            src={activeColor.image}
            alt={`${base.name} mockup in ${activeColor.name}`}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
            className="animate-fade-in object-cover"
          />

          {/* Print panel */}
          <div
            ref={printAreaRef}
            className={cn(
              'absolute rounded-sm transition-colors duration-300',
              artwork ? 'border border-dashed border-gold/25' : 'border-2 border-dashed border-gold/50',
            )}
            style={{
              left: `${base.printArea.cx - base.printArea.w / 2}%`,
              top: `${base.printArea.cy - base.printArea.h / 2}%`,
              width: `${base.printArea.w}%`,
              height: `${base.printArea.h}%`,
            }}
          >
            {!artwork && (
              <span className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-1.5 text-center">
                <UploadIcon size={20} className="text-gold/70" />
                <span className="text-[0.58rem] uppercase tracking-[0.14em] text-gold/70">
                  Print area
                </span>
              </span>
            )}

            {artwork && (
              /* The artwork is a local data URL that only exists in this browser,
                 so next/image cannot optimise or serve it. */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={artwork}
                alt="Your uploaded design, positioned on the product preview"
                draggable={false}
                tabIndex={0}
                role="application"
                aria-label="Design placement. Drag to move, or use the arrow keys to nudge."
                onPointerDown={onArtworkPointerDown}
                onPointerMove={onArtworkPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={onArtworkKeyDown}
                className="absolute max-h-full max-w-full cursor-grab touch-none select-none object-contain outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-gold"
                style={{
                  left: `${50 + transform.x}%`,
                  top: `${50 + transform.y}%`,
                  transform: `translate(-50%, -50%) rotate(${transform.rotation}deg) scale(${transform.scale})`,
                }}
              />
            )}
          </div>

          <span className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-line bg-ink/85 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.12em] text-muted backdrop-blur-sm">
              {base.name} · {activeColor.name}
            </span>
            {artwork && (
              <span className="rounded-full border border-gold/35 bg-ink/85 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.12em] text-gold backdrop-blur-sm">
                Drag to reposition
              </span>
            )}
          </span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-faint">
          {base.printNote} The preview approximates placement and scale — it is not a colour proof.
        </p>
      </div>

      {/* ------------------------------- Controls ------------------------------ */}
      <div className="space-y-8">
        {/* 1. Product */}
        <Step number="01" title="Select a product">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {CUSTOM_PRODUCTS.map((product) => {
              const selected = product.key === base.key;
              return (
                <button
                  key={product.key}
                  type="button"
                  onClick={() => selectBase(product)}
                  aria-pressed={selected}
                  className={cn(
                    'group flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all duration-300',
                    selected
                      ? 'border-gold bg-gold/[0.09]'
                      : 'border-line bg-charcoal/50 hover:border-gold/40',
                  )}
                >
                  <span className="relative h-14 w-full overflow-hidden rounded bg-obsidian">
                    <Image
                      src={product.colors[0].image}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </span>
                  <span className={cn('text-xs leading-tight', selected ? 'text-gold' : 'text-cream')}>
                    {product.name.replace('Custom ', '')}
                  </span>
                  <span className="text-[0.65rem] text-faint">{formatPrice(product.basePrice)}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted">{base.blurb}</p>
        </Step>

        {/* 2. Options */}
        <Step number="02" title="Choose your options">
          <div className="space-y-5">
            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-[0.14em] text-faint">Size</span>
              <SizeSelector sizes={base.sizes} value={size} onChange={setSize} idPrefix="cz-size" />
            </div>

            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-[0.14em] text-faint">
                Colour <span className="ml-1 normal-case tracking-normal text-cream">{color}</span>
              </span>
              <ColorSelector colors={base.colors} value={color} onChange={setColor} />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-[0.14em] text-faint">Quantity</span>
              <QuantitySelector value={quantity} onChange={setQuantity} />
            </div>
          </div>
        </Step>

        {/* 3. Upload */}
        <Step number="03" title="Upload your design">
          <input
            ref={fileInputRef}
            id="artwork-upload"
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={onInputChange}
            className="sr-only"
          />

          {!artwork ? (
            <label
              htmlFor="artwork-upload"
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                'flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300',
                dragOver
                  ? 'border-gold bg-gold/[0.08]'
                  : uploadError
                    ? 'border-red-500/50 bg-red-500/[0.04]'
                    : 'border-line bg-charcoal/40 hover:border-gold/45 hover:bg-gold/[0.04]',
              )}
            >
              {reading ? (
                <Spinner size={30} />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-gold">
                  <UploadIcon size={22} />
                </span>
              )}
              <span className="text-sm text-cream">
                {reading ? 'Reading your file…' : 'Drop your artwork here or click to browse'}
              </span>
              <span className="text-xs leading-relaxed text-faint">
                PNG, JPG or SVG · up to {formatFileSize(MAX_FILE_BYTES)}
                <br />
                A transparent PNG around 2000 px wide gives the best result.
              </span>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 rounded-lg border border-gold/25 bg-gold/[0.05] p-3.5">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-line bg-ink">
                  {/* Local data URL — next/image cannot optimise this. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={artwork} alt="" className="h-full w-full object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm text-cream">
                    <CheckIcon size={13} className="shrink-0 text-gold" />
                    <span className="truncate">{fileName}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-faint">
                    {formatFileSize(fileSize)} · stays in your browser
                  </span>
                </span>
                <button
                  type="button"
                  onClick={removeArtwork}
                  aria-label="Remove uploaded design"
                  className="shrink-0 rounded-full border border-line p-2 text-faint transition-colors hover:border-red-500/50 hover:text-red-400"
                >
                  <CloseIcon size={14} />
                </button>
              </div>

              <label
                htmlFor="artwork-upload"
                className="inline-flex cursor-pointer items-center gap-2 text-xs text-gold transition-colors hover:text-champagne"
              >
                <UploadIcon size={14} />
                Replace with a different file
              </label>
            </div>
          )}

          {uploadError && (
            <p role="alert" className="mt-3 flex items-start gap-2 text-xs text-red-400">
              <AlertIcon size={14} className="mt-px shrink-0" />
              {uploadError}
            </p>
          )}
        </Step>

        {/* 4. Position */}
        <Step number="04" title="Position your design">
          {!artwork ? (
            <p className="rounded-lg border border-line bg-charcoal/40 p-4 text-xs leading-relaxed text-muted">
              Upload a design and these controls become active. You will be able to drag it on the
              mockup, or fine-tune the scale and rotation here.
            </p>
          ) : (
            <div className="space-y-5">
              <Slider
                Icon={ZoomIcon}
                label="Scale"
                value={transform.scale}
                display={`${Math.round(transform.scale * 100)}%`}
                {...SCALE_RANGE}
                onChange={(value) => updateTransform({ scale: value })}
              />

              <Slider
                Icon={RotateIcon}
                label="Rotation"
                value={transform.rotation}
                display={`${transform.rotation}°`}
                {...ROTATION_RANGE}
                onChange={(value) => updateTransform({ rotation: value })}
              />

              <div className="space-y-2.5">
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-faint">
                  <MoveIcon size={14} className="text-gold/70" />
                  Position
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <MiniSlider
                    label="Horizontal"
                    value={transform.x}
                    onChange={(value) => updateTransform({ x: value })}
                  />
                  <MiniSlider
                    label="Vertical"
                    value={transform.y}
                    onChange={(value) => updateTransform({ y: value })}
                  />
                </div>
                <p className="text-[0.68rem] leading-relaxed text-faint">
                  You can also drag the design directly on the preview, or focus it and nudge with
                  the arrow keys (hold Shift for larger steps).
                </p>
              </div>

              <Button variant="ghost" size="sm" onClick={resetDesign} className="-ml-4">
                <RefreshIcon size={14} />
                Reset Design
              </Button>
            </div>
          )}
        </Step>

        {/* 5. Add to cart */}
        <div className="space-y-4 rounded-xl border border-line bg-graphite p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">
              {base.name} × {quantity}
            </span>
            <span className="text-2xl font-semibold text-gold">{formatPrice(lineTotal)}</span>
          </div>

          <p className="text-xs leading-relaxed text-faint">
            {formatPrice(base.basePrice)} each. Printing is included — there is no setup fee and no
            minimum order.
          </p>

          <div className="flex flex-col gap-2.5">
            <Button onClick={() => addToCart()} size="lg" fullWidth>
              <CartIcon size={17} />
              Add Customized Product to Cart
            </Button>
            <Button
              onClick={() => addToCart({ goToCheckout: true })}
              variant="outline"
              size="sm"
              fullWidth
            >
              Add and Check Out
            </Button>
            <button
              type="button"
              onClick={resetEverything}
              className="text-center text-xs text-faint transition-colors hover:text-red-400"
            >
              Clear everything and start again
            </button>
          </div>
        </div>

        {draftWarning && (
          <p className="flex items-start gap-2 rounded-lg border border-line bg-charcoal/40 p-4 text-xs leading-relaxed text-muted">
            <AlertIcon size={14} className="mt-px shrink-0 text-gold/70" />
            Your design is too large to save in this browser, so it will not survive a page refresh.
            It still works normally for this visit — try a smaller file if you want it kept.
          </p>
        )}

        <p className="rounded-lg border border-gold/20 bg-gold/[0.04] p-4 text-xs leading-relaxed text-champagne">
          <span className="font-medium">How your file is handled.</span> The preview runs entirely in
          your browser — your artwork is never uploaded to a server from this page. After you order,
          we email you to collect the original file so we can print it at full resolution. You are
          responsible for holding the rights to any artwork you send us.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Step({ number, title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/35 text-xs font-semibold text-gold">
          {number}
        </span>
        <span className="text-lg text-cream">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Slider({ Icon, label, value, display, min, max, step, onChange }) {
  const id = `slider-${label.toLowerCase()}`;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-faint">
          <Icon size={14} className="text-gold/70" />
          {label}
        </label>
        <span className="text-xs tabular-nums text-cream">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate accent-[#c9a227]"
      />
    </div>
  );
}

function MiniSlider({ label, value, onChange }) {
  const id = `pos-${label.toLowerCase()}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center justify-between text-[0.68rem] text-faint">
        {label}
        <span className="tabular-nums text-muted">{value.toFixed(0)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={-POSITION_LIMIT}
        max={POSITION_LIMIT}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate accent-[#c9a227]"
      />
    </div>
  );
}
