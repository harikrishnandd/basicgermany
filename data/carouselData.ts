import { CarouselCard } from '@/components/ProductCarousel';

/**
 * Sample Carousel Data
 * 
 * This data can be moved to a CMS or Firestore in the future
 */
export const carouselData: CarouselCard[] = [
  {
    id: '1',
    category: 'WHAT TO WATCH',
    title: 'Essential Apps for Germany',
    subtitle: 'Navigate your new life with confidence. Curated tools for banking, transport, and daily living.',
    ctaText: 'Explore Apps',
    ctaLink: '/knowledge/',
    imageUrl: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg',
    theme: 'green',
  },
  {
    id: '2',
    category: 'NOW STREAMING',
    title: 'Knowledge Hub',
    subtitle: 'Everything you need to know about Germany. From Anmeldung to tax registration.',
    ctaText: 'Read Articles',
    ctaLink: '/knowledge/',
    imageUrl: 'https://images.pexels.com/photos/5504137/pexels-photo-5504137.jpeg',
    theme: 'dark',
  },
  {
    id: '3',
    category: 'FEATURED',
    title: 'Community Resources',
    subtitle: 'Connect with fellow expats. Share experiences and get advice from those who\'ve been there.',
    ctaText: 'Join Community',
    ctaLink: '/knowledge/',
    imageUrl: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg',
    theme: 'purple',
  },
];
