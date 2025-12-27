import './globals.css';
import SmoothScrollProvider from '../components/SmoothScrollProvider';
import CustomCursor from '../components/CustomCursor';
import DelightMessage from '../components/DelightMessage';
import SecretInteraction from '../components/SecretInteraction';
import ImageFix from '../components/ImageFix';

// SEO: Comprehensive metadata for all pages
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://crochetstory.com'),
  title: {
    default: 'CrochetStory - Handmade Crochet Products | Premium Quality',
    template: '%s | CrochetStory'
  },
  description: 'Discover beautiful handmade crochet products crafted with love. Shop premium crochet items including home decor, hair accessories, and gift articles. Customizable designs, eco-friendly materials, and affordable prices. Made in Ahmedabad, India.',
  keywords: [
    'crochet products',
    'handmade crochet',
    'crochet home decor',
    'crochet hair accessories',
    'crochet gifts',
    'handcrafted crochet',
    'custom crochet',
    'crochet items India',
    'Ahmedabad crochet',
    'eco-friendly crochet',
    'premium crochet',
    'crochet accessories',
    'handmade gifts',
    'sustainable crochet'
  ],
  authors: [{ name: 'CrochetStory' }],
  creator: 'CrochetStory',
  publisher: 'CrochetStory',
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
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'CrochetStory',
    title: 'CrochetStory - Handmade Crochet Products | Premium Quality',
    description: 'Discover beautiful handmade crochet products crafted with love. Shop premium crochet items including home decor, hair accessories, and gift articles.',
    images: [
      {
        url: '/images/imgi_206_images-removebg-preview.png',
        width: 1200,
        height: 630,
        alt: 'CrochetStory - Handmade Crochet Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrochetStory - Handmade Crochet Products',
    description: 'Discover beautiful handmade crochet products crafted with love. Shop premium crochet items.',
    images: ['/images/imgi_206_images-removebg-preview.png'],
    creator: '@crochetstory',
  },
  alternates: {
    canonical: '/',
  },
  category: 'E-commerce',
  classification: 'Handmade Crochet Products',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="lenis lenis-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Fix Image constructor before React loads
              (function() {
                if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                  // Preserve native Image constructor
                  const OriginalImage = window.Image;
                  
                  // Create wrapper that works with both 'new Image()' and 'Image()'
                  const ImageWrapper = function(width, height) {
                    const img = document.createElement('img');
                    if (width !== undefined) img.width = width;
                    if (height !== undefined) img.height = height;
                    return img;
                  };
                  
                  if (window.HTMLImageElement) {
                    ImageWrapper.prototype = window.HTMLImageElement.prototype;
                  }
                  
                  // Only replace if needed
                  try {
                    const test = new window.Image();
                    if (!(test instanceof HTMLImageElement)) {
                      window.Image = ImageWrapper;
                    }
                  } catch (e) {
                    window.Image = ImageWrapper;
                  }
                  
                  if (OriginalImage && OriginalImage !== ImageWrapper) {
                    window.NativeImage = OriginalImage;
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-cream-50">
        {/* SEO: Structured Data - Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'CrochetStory',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://crochetstory.com',
              description: 'Beautiful handmade crochet products crafted with love and expertise',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crochetstory.com'}/products?search={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* SEO: Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CrochetStory',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://crochetstory.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crochetstory.com'}/images/imgi_206_images-removebg-preview.png`,
              description: 'Handmade crochet products crafted with love and expertise',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Ahmedabad',
                addressCountry: 'IN',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-7265924325',
                contactType: 'Customer Service',
                email: 'crochetstory@gmail.com',
                areaServed: 'IN',
                availableLanguage: ['en', 'hi'],
              },
              sameAs: [
                // Add social media links if available
              ],
            }),
          }}
        />
        <ImageFix />
        <CustomCursor />
        <DelightMessage />
        <SecretInteraction />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
