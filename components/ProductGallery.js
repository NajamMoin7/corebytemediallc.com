'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon, ZoomIcon } from './ui/Icons';

/**
 * Product image gallery with thumbnail navigation and pointer-tracked zoom.
 *
 * Zoom is applied as a transform-origin shift on the image rather than a second
 * magnified layer, which keeps it to one composited element. It is disabled on
 * touch pointers, where panning is the expected gesture instead.
 */
export default function ProductGallery({ images, activeSrc = null, productName }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const frameRef = useRef(null);

  // A colour swatch selection swaps the lead image, so jump back to it.
  // Adjusting during render (rather than in an effect) avoids painting the old
  // image for a frame first — see react.dev "adjusting state when a prop changes".
  const [lastSrc, setLastSrc] = useState(activeSrc);
  if (activeSrc !== lastSrc) {
    setLastSrc(activeSrc);
    setIndex(0);
    setZoomed(false);
  }

  const gallery = activeSrc
    ? [{ src: activeSrc, alt: `${productName} — selected colour` }, ...images.slice(1)]
    : images;

  const current = gallery[index] || gallery[0];

  function handlePointerMove(event) {
    if (!zoomed || event.pointerType === 'touch') return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  function step(direction) {
    setIndex((current) => (current + direction + gallery.length) % gallery.length);
    setZoomed(false);
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-5">
      {/* Main frame */}
      <div className="relative flex-1">
        <div
          ref={frameRef}
          className="group relative aspect-4/5 overflow-hidden rounded-xl border border-line bg-obsidian"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setZoomed(false)}
        >
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority={index === 0}
            className={cn(
              'animate-fade-in object-cover transition-transform duration-500 ease-out',
              zoomed ? 'scale-[2]' : 'scale-100',
            )}
            style={zoomed ? { transformOrigin: `${origin.x}% ${origin.y}%` } : undefined}
          />

          <button
            type="button"
            onClick={() => setZoomed((value) => !value)}
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
            aria-pressed={zoomed}
            className={cn(
              'absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ink/85 text-cream backdrop-blur-sm transition-all duration-300',
              'hover:border-gold/50 hover:text-gold',
              zoomed && 'border-gold/60 text-gold',
            )}
          >
            <ZoomIcon size={17} />
          </button>

          {gallery.length > 1 && (
            <>
              <GalleryArrow direction="prev" onClick={() => step(-1)} />
              <GalleryArrow direction="next" onClick={() => step(1)} />
            </>
          )}

          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-line bg-ink/80 px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-muted backdrop-blur-sm">
            {index + 1} / {gallery.length}
          </span>
        </div>

        <p className="mt-2.5 hidden text-center text-[0.68rem] text-faint lg:block">
          Click the image or the zoom control for a closer look.
        </p>
      </div>

      {/* Thumbnails */}
      <div
        className="no-scrollbar flex gap-3 overflow-x-auto lg:w-24 lg:shrink-0 lg:flex-col lg:overflow-visible"
        role="tablist"
        aria-label={`${productName} images`}
      >
        {gallery.map((image, position) => (
          <button
            key={image.src}
            type="button"
            role="tab"
            aria-selected={position === index}
            aria-label={image.alt}
            onClick={() => {
              setIndex(position);
              setZoomed(false);
            }}
            className={cn(
              'relative aspect-4/5 w-20 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 lg:w-full',
              position === index
                ? 'border-gold opacity-100'
                : 'border-line opacity-60 hover:border-gold/40 hover:opacity-100',
            )}
          >
            <Image src={image.src} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function GalleryArrow({ direction, onClick }) {
  const isPrev = direction === 'prev';
  const Icon = isPrev ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Previous image' : 'Next image'}
      className={cn(
        'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink/85 text-cream backdrop-blur-sm transition-all duration-300',
        'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100',
        'hover:border-gold/50 hover:text-gold',
        isPrev ? 'left-3' : 'right-3',
      )}
    >
      <Icon size={17} />
    </button>
  );
}
