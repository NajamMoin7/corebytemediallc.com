import { BRAND } from '@/data/site';

/**
 * Page metadata builder.
 *
 * Next merges the `metadata` export shallowly: a page that exports its own
 * `openGraph` object replaces the root layout's entirely, including the image
 * picked up from the `opengraph-image` file convention. Routing every page
 * through this helper means the share card, canonical URL and Twitter card can
 * never be dropped by accident.
 */

/** The generated share card in `app/opengraph-image.png`. */
export const OG_IMAGE = {
  url: '/opengraph-image.png',
  width: 1200,
  height: 630,
  alt: `${BRAND.name} — ${BRAND.tagline}`,
};

export function pageMetadata({
  title,
  description,
  path,
  shareTitle,
  images = [OG_IMAGE],
  noindex = false,
  nofollow = false,
}) {
  const socialTitle = shareTitle || `${title} | ${BRAND.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: BRAND.name,
      title: socialTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: images.map((image) => (typeof image === 'string' ? image : image.url)),
    },
    ...(noindex || nofollow
      ? { robots: { index: !noindex, follow: !nofollow } }
      : {}),
  };
}
