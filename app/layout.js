import './globals.css';
import SmoothScrollProvider from '../components/SmoothScrollProvider';
import CustomCursor from '../components/CustomCursor';
import DelightMessage from '../components/DelightMessage';
import SecretInteraction from '../components/SecretInteraction';
import ImageFix from '../components/ImageFix';

export const metadata = {
  title: 'CrochetStory - Handcrafted Crochet Products',
  description: 'Beautiful handmade crochet products crafted with love and expertise',
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
