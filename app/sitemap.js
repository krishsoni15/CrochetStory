// SEO: Dynamic sitemap generation for all pages
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crochetstory.com';
  
  // Static pages - Always include these
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Try to fetch products for dynamic product pages (only if API is available)
  // This will work in production when the API is running
  try {
    // Use internal API route during build, or external URL in production
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? `${baseUrl}/api/products`
      : 'http://localhost:3000/api/products';
    
    const res = await fetch(apiUrl, { 
      next: { revalidate: 3600 }, // Revalidate every hour
      // Don't fail if API is not available during build
      cache: 'no-store'
    });
    
    if (res.ok) {
      const products = await res.json();
      // If you have individual product pages, uncomment below:
      // const productPages = products.map((product) => ({
      //   url: `${baseUrl}/products/${product._id}`,
      //   lastModified: new Date(product.updatedAt || product.createdAt || new Date()),
      //   changeFrequency: 'weekly',
      //   priority: 0.8,
      // }));
      // return [...staticPages, ...productPages];
    }
  } catch (error) {
    // Silently fail - sitemap will still work with static pages
    // This is expected during build time if API is not available
  }

  return staticPages;
}

