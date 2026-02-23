import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RESUMER — Resume Management System',
  description: 'Build your resume. Find your candidates. All in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceMono.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
