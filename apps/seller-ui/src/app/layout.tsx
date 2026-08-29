import './global.css';
import { QueryProvider } from './providers/query-provider';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'LankaPremium Seller Center',
  description: 'Manage your shop, list products, track orders, and configure payouts.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
          {children}
          </AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#131921',
                color: '#fff',
                fontFamily: 'inherit',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#152512',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ff3f40',
                  secondary: '#fff',
                },
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  )
}
