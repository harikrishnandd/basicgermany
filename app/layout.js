import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import NavigationHandler from "@/components/NavigationHandler";

export const metadata = {
  title: "Basic Germany - Your starting point in Germany",
  description: "Essential apps and resources for expats in Germany",
  keywords: "Germany, expats, apps, resources, berlin, munich, frankfurt",
  openGraph: {
    title: "Basic Germany",
    description: "Your starting point in Germany",
    url: "https://basicgermany.com",
    siteName: "Basic Germany",
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#272727",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="any" href="/site-icon.png" media="(prefers-color-scheme: dark)" />
        <link rel="icon" type="image/png" sizes="any" href="/site-icon-light.png" media="(prefers-color-scheme: light)" />
        <link rel="apple-touch-icon" href="/site-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
        />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegistration />
        <NavigationHandler />
        {children}
      </body>
    </html>
  );
}

