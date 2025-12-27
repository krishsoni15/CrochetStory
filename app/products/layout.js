// SEO: Metadata for Products page
export const metadata = {
  title: 'Products - Handmade Crochet Items | CrochetStory',
  description: 'Browse our complete collection of handmade crochet products. Shop home decor, hair accessories, gift articles, and custom crochet items. All products are handcrafted with love, eco-friendly materials, and affordable prices.',
  keywords: [
    'crochet products',
    'handmade crochet items',
    'crochet home decor',
    'crochet hair accessories',
    'crochet gifts',
    'buy crochet online',
    'custom crochet',
    'crochet shop India',
  ],
  openGraph: {
    title: 'Products - Handmade Crochet Items | CrochetStory',
    description: 'Browse our complete collection of handmade crochet products. Shop home decor, hair accessories, gift articles, and custom crochet items.',
    url: '/products',
    images: [
      {
        url: '/images/imgi_206_images-removebg-preview.png',
        width: 1200,
        height: 630,
        alt: 'CrochetStory Products - Handmade Crochet Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products - Handmade Crochet Items | CrochetStory',
    description: 'Browse our complete collection of handmade crochet products.',
  },
  alternates: {
    canonical: '/products',
  },
};

export default function ProductsLayout({ children }) {
  return children;
}

