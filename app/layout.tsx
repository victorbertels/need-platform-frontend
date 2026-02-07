import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostNeedFAB from '@/components/PostNeedFAB';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Need - Whatever You NEED',
  description: 'Find local help and services in Belgium. Post a need, get bids, choose the perfect person.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <PostNeedFAB />
        <Footer />
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '16px',
              border: '1px solid #334155',
            },
          }}
        />
      </body>
    </html>
  );
}
