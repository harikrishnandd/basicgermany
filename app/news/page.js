import NewsClient from './client-page';

// Client component only - no SSR to avoid timeout issues
export default function NewsPage() {
  return (
    <div className="app-container">
      {/* Main News Content */}
      <main className="main-content">
        <NewsClient />
      </main>
    </div>
  );
}
