/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Temporarily hardcoded to bypass Firebase App Hosting environment variable issue
    NEXT_PUBLIC_ADMIN_PASSWORD: 'OtBsYy9RbG5L1X8X@12',
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    // Basic Germany Firebase config (hardcoded)
    NEXT_PUBLIC_FIREBASE_API_KEY: 'AIzaSyBzFtAqNBpWiNlEnkThX5F8MOUwxuweyeA',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'basic-germany.firebaseapp.com',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'basic-germany',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'basic-germany.firebasestorage.app',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '1077537204573',
    NEXT_PUBLIC_FIREBASE_APP_ID: '1:1077537204573:web:92ef71b9e26c006b4ba0b4',
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'G-7DES80ZZ21',
    // Bulletin Firebase config (hardcoded)
    NEXT_PUBLIC_BULLETIN_API_KEY: 'AIzaSyDvCoF0ARLMwWDfdblVaOdw-WbhdjSvV3U',
    NEXT_PUBLIC_BULLETIN_AUTH_DOMAIN: 'bullettin-hzqbvq.firebaseapp.com',
    NEXT_PUBLIC_BULLETIN_PROJECT_ID: 'bullettin-hzqbvq',
    NEXT_PUBLIC_BULLETIN_STORAGE_BUCKET: 'bullettin-hzqbvq.appspot.com',
    NEXT_PUBLIC_BULLETIN_MESSAGING_SENDER_ID: '664060285424',
    NEXT_PUBLIC_BULLETIN_APP_ID: '1:664060285424:web:e830794f34844fb8ee0d35',
  },
  images: {
    unoptimized: false, // Enable Next.js Image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/basic-germany.firebasestorage.app/**',
      },
      {
        protocol: 'https',
        hostname: 'basicgermany.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  trailingSlash: true,
};

export default nextConfig;
