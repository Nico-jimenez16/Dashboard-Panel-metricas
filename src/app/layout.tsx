import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import { Sidebar } from '@/components/layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dashboard Microinformática — BCC',
  description: 'Panel de control de incidentes IT del Banco de Córdoba',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full">
        <Providers>
          <div className="flex h-full">
            <Sidebar />
            <div className="ml-60 flex flex-1 flex-col min-h-screen">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
