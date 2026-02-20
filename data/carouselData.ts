import { CarouselCard } from '@/components/ProductCarousel';

/**
 * Carousel Data for Products Page
 * These cards showcase featured content and products
 * 
 * Future: Move to CMS/Firestore for easy admin updates
 */
export const carouselData: CarouselCard[] = [
  {
    id: '1',
    category: 'ESSENTIAL TOOLS',
    title: 'Apps for Living in Germany',
    subtitle: 'Navigate your new life with confidence. Discover curated tools for banking, transportation, healthcare, and daily living.',
    ctaText: 'Explore Apps',
    ctaLink: '/knowledge/',
    imageUrl: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=1600',
    theme: 'green' as const,
  },
  {
    id: '2',
    category: 'FEATURED GUIDE',
    title: 'Banking & Finance',
    subtitle: 'Everything you need to know about opening a German bank account, managing finances, and understanding the tax system.',
    ctaText: 'Learn More',
    ctaLink: '/knowledge/',
    imageUrl: 'https://images.pexels.com/photos/5504137/pexels-photo-5504137.jpeg?auto=compress&cs=tinysrgb&w=1600',
    theme: 'dark' as const,
  },
  {
    id: '3',
    category: 'COMPLETE GUIDE',
    title: 'Visa & Bureaucracy',
    subtitle: 'Step-by-step guidance for residence permits, Anmeldung, and navigating German bureaucracy with confidence.',
    ctaText: 'Get Started',
    ctaLink: '/knowledge/',
    imageUrl: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1600',
    theme: 'purple' as const,
  },
];