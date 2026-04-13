// ═══════════════════════════════════════════════════════════════════════
// 📄 Layout النهائي المتكامل
// ✨ مع دعم: اللغات، الوضع الليلي، RTL/LTR، SEO، Fonts
// ═══════════════════════════════════════════════════════════════════════

import './globals.css'
import { Cairo, Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/react'
import { AppProvider } from '@/contexts/AppContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/admin/Toast'
import LayoutSwitcher from '@/components/LayoutSwitcher'

// ═══════════════════════════════════════════════════════════════════════
// Fonts Configuration
// ═══════════════════════════════════════════════════════════════════════

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hawari.tours'

export const metadata = {
  title: {
    default: 'Hawari Tours | رحلات سقطرى السياحية',
    template: '%s | Hawari Tours'
  },
  description: 'استكشف جزيرة سقطرى مع Hawari Tours. رحلات تخييم ومغامرات بحرية في أجمل جزيرة على وجه الأرض. Discover Socotra Island with unforgettable tours and marine adventures.',
  keywords: [
    'سقطرى',
    'سياحة',
    'رحلات',
    'اليمن',
    'تخييم',
    'مغامرات',
    'Socotra',
    'Tours',
    'Yemen',
    'Travel',
    'Adventure',
    'Camping',
    'Marine Tours',
    'Dragon Blood Tree',
    'Socotra Island'
  ],
  authors: [
    {
      name: 'Hawari Tours',
      url: siteUrl
    }
  ],
  creator: 'Hawari Tours',
  publisher: 'Hawari Tours',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'ar_YE',
    alternateLocale: ['en_US'],
    url: siteUrl,
    siteName: 'Hawari Tours',
    title: 'Hawari Tours | اكتشف جمال سقطرى - Discover Socotra Beauty',
    description: 'رحلات سياحية مميزة في جزيرة سقطرى - جنة اليمن الخفية. Unforgettable tours in Socotra Island - Yemen\'s Hidden Paradise.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hawari Tours - Socotra Island',
        type: 'image/jpeg'
      }
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Hawari Tours | Socotra Island Adventures',
    description: 'رحلات سياحية مميزة في جزيرة سقطرى. Unforgettable tours in Yemen\'s paradise.',
    images: ['/og-image.jpg'],
    creator: '@HawariTours',
  },

  // Icons & Manifest
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#00A86B',
      },
    ],
  },
  manifest: '/site.webmanifest',

  // Additional Meta Tags
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
    languages: {
      'ar-YE': '/ar',
      'en-US': '/en',
    },
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add NEXT_PUBLIC_GOOGLE_VERIFICATION to your env vars)
  ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  }),

  // App Info
  applicationName: 'Hawari Tours',
  appleWebApp: {
    capable: true,
    title: 'Hawari Tours',
    statusBarStyle: 'black-translucent',
  },

  // Format Detection
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  // Category
  category: 'travel',
}

// ═══════════════════════════════════════════════════════════════════════
// Viewport Configuration
// ═══════════════════════════════════════════════════════════════════════

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00A86B' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' }
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// Root Layout Component
// ═══════════════════════════════════════════════════════════════════════

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('locale')?.value
  const themeCookie = cookieStore.get('theme')?.value
  const locale = localeCookie === 'en' ? 'en' : 'ar'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const themeClass = themeCookie === 'dark' ? ' dark' : ''

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} ${inter.variable}${themeClass}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#00A86B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=yes" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelAgency',
              name: 'Hawari Tours',
              description: 'رحلات سياحية مميزة في جزيرة سقطرى',
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              image: `${siteUrl}/og-image.jpg`,
              telephone: '+967772371581',
              email: 'info@hawari.tours',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Socotra',
                addressCountry: 'YE'
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '12.4634',
                longitude: '53.8237'
              },
              sameAs: [
                'https://facebook.com/hawaritours',
                'https://instagram.com/hawaritours',
                'https://twitter.com/hawaritours'
              ],
              areaServed: {
                '@type': 'Country',
                name: 'Yemen'
              },
              priceRange: '$$',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5.0',
                reviewCount: '127',
                bestRating: '5',
                worstRating: '1'
              }
            })
          }}
        />
      </head>

      <body className={`${cairo.className} antialiased`}>
        {/* App Provider للغة والوضع الليلي */}
        <AppProvider>
          <AuthProvider>
            <ToastProvider>
              <LayoutSwitcher>{children}</LayoutSwitcher>
            </ToastProvider>
          </AuthProvider>
        </AppProvider>
        <Analytics />

        {/* Analytics - Google Analytics (اختياري) */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
