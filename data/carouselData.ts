import { CarouselCard } from '@/components/ProductCarousel';

/**
 * Carousel Data for Products Page
 * Can be moved to CMS/Firestore in the future
 */
export const carouselData: CarouselCard[] = [
  {
    id: '1',
    category: 'WHAT TO WATCH',
    title: 'Essential Apps for Germany',
    subtitle: 'Navigate your new life with confidence. Curated tools for banking, transport, and daily living.',
    ctaText: 'Explore Apps',
    ctaLink: '/knowledge/',
    imageUrl: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=1200',
    theme: 'green' as const,
  },
  {
    id: '2',
    category: 'FEATURED',
    title: 'Banking & Finance Guide',
    subtitle: 'Open your German bank account and manage finances with ease.',
    ctaText: 'Learn More',
    ctaLink: '/knowledge/',
    imageUrl: 'https://images.pexels.com/photos/5504137/pexels-photo-5504137.jpeg?auto=compress&cs=tinysrgb&w=1200',
    theme: 'dark' as const,
  },
  {
    id: '3',
    category: 'FROM THE EDITORS',
    title: 'Visa & Bureaucracy Help',
    subtitle: 'Step-by-step guidance for residence permits and registration.',
    ctaText: 'Get Started',
    ctaLink: '/knowledge/',
    imageUrl: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1200',
    theme: 'purple' as const,
  },
];
