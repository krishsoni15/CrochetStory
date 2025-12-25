import './globals.css';
import SmoothScrollProvider from '../components/SmoothScrollProvider';
import CustomCursor from '../components/CustomCursor';
import DelightMessage from '../components/DelightMessage';
import ScrollController from '../components/ScrollController';
import SecretInteraction from '../components/SecretInteraction';

export const metadata = {
  title: 'CrochetStory - Handcrafted Crochet Products',
  description: 'Beautiful handmade crochet products crafted with love and expertise',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="lenis lenis-smooth">
      <body className="bg-cream-50">
        <CustomCursor />
        <DelightMessage />
        <ScrollController />
        <SecretInteraction />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
