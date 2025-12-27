import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Pipeline AI - Build, train, and deploy AI like software.',
  description: 'A no-code / low-code platform for building and deploying AI & ML pipelines.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn('font-sans antialiased', inter.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
