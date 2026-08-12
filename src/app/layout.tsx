import type { Metadata } from 'next';
import React from 'react';
import '../index.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Reap Trip | ដំណើរកម្សាន្ត - Cambodia Camping & Hiking Planner',
  description: 'Practical guide for Cambodian nature destinations, community guides, expense splitters, camp meal planner & trip reports.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts for English & Khmer */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Leaflet CSS for Maps */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body>
        <Providers>
          <div className="app-root">
            <Navbar />
            <main className="app-main-content">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
