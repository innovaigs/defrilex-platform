import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Defrilex - Premium Professional Services Marketplace',
    template: '%s | Defrilex',
  },
  description: 'Connect with elite professionals across six specialized service categories. Premium marketplace for high-quality professional engagements.',
  keywords: [
    'professional services',
    'freelancers',
    'marketplace',
    'linguists',
    'virtual assistants',
    'customer service',
    'web developers',
    'digital marketers',
    'AI agents',
  ],
  authors: [{ name: 'Defrilex Team' }],
  creator: 'Defrilex',
  publisher: 'Defrilex',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Defrilex - Premium Professional Services Marketplace',
    description: 'Connect with elite professionals across six specialized service categories.',
    siteName: 'Defrilex',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Defrilex - Premium Professional Services Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Defrilex - Premium Professional Services Marketplace',
    description: 'Connect with elite professionals across six specialized service categories.',
    images: ['/og-image.jpg'],
    creator: '@defrilex',
  },
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1a365d" />
        <meta name="msapplication-TileColor" content="#1a365d" />
        <meta name="theme-color" content="#1a365d" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        <SessionProvider>
          <div id="root" className="min-h-screen flex flex-col">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </SessionProvider>
        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  );
}
