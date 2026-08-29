import './global.css';
import { QueryProvider } from './providers/query-provider';
import { Toaster } from 'react-hot-toast';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Anon E-Commerce | Premium Marketplace',
  description: 'Sri Lanka\'s premium multi-vendor e-commerce platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <head />
      <body className="antialiased bg-[var(--white,#ffffff)] text-[var(--davys-gray,#4d4d4d)]">
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--eerie-black)',
                color: 'var(--white)',
                fontFamily: 'inherit',
                fontSize: 'var(--fs-7)',
                borderRadius: 'var(--radius-sm)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: 'var(--ocean-green)',
                  secondary: 'var(--white)',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: 'var(--bittersweet)',
                  secondary: 'var(--white)',
                },
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
