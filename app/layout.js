import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { BRAND, CONTACT, LOGO, SITE_URL, STORE_CONFIG } from '@/data/site';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — Premium Print-on-Demand Apparel & Accessories`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: [
    'print on demand USA',
    'custom t-shirts',
    'custom hoodies',
    'personalized mugs',
    'custom printing',
    'Core Byte Media',
    'custom apparel',
    'design your own shirt',
    'made to order apparel',
  ],
  authors: [{ name: BRAND.legalName }],
  creator: BRAND.legalName,
  publisher: BRAND.legalName,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: BRAND.name,
    url: SITE_URL,
    title: `${BRAND.name} — Premium Print-on-Demand`,
    description: BRAND.description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} — Premium Print-on-Demand`,
    description: BRAND.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'shopping',
};

export const viewport = {
  themeColor: '#050506',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const ORGANISATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: BRAND.legalName,
  url: SITE_URL,
  description: BRAND.description,
  slogan: BRAND.tagline,
  logo: `${SITE_URL}${LOGO.full}`,
  image: `${SITE_URL}/opengraph-image.png`,
  email: CONTACT.email,
  telephone: CONTACT.phoneDisplay,
  currenciesAccepted: STORE_CONFIG.currency.code,
  areaServed: {
    '@type': 'Country',
    name: STORE_CONFIG.countryName,
  },
  // Built from CONTACT so there is one place to correct it, and the street line
  // is omitted entirely when the address is not published.
  address: {
    '@type': 'PostalAddress',
    ...(CONTACT.showStreetAddress ? { streetAddress: CONTACT.location.street } : {}),
    addressLocality: CONTACT.location.city,
    addressRegion: CONTACT.location.state,
    postalCode: CONTACT.location.postalCode,
    addressCountry: STORE_CONFIG.country,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: CONTACT.email,
    telephone: CONTACT.phoneDisplay,
    areaServed: STORE_CONFIG.country,
    availableLanguage: 'English',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-ink text-cream antialiased">
        <script
          type="application/ld+json"
          // Static, developer-authored JSON — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION_JSON_LD) }}
        />
        <Providers>
          <Header />
          <main id="main" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
