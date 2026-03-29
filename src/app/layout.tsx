import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { Toaster } from 'sonner';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Financial Dashboard',
  description: 'Modern Expense Tracker built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/30 selection:text-primary-foreground`}>
        <ExpenseProvider>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 max-w-7xl mx-auto items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-6 md:gap-10">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <span className="inline-block font-bold">Trackit</span>
                  </Link>
                  <nav className="hidden md:flex gap-6">
                    <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60 text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link href="/expenses" className="transition-colors hover:text-foreground/80 text-foreground/60 text-sm font-medium">
                      Transactions
                    </Link>
                  </nav>
                </div>
                {/* Mobile nav indicator could go here */}
                <div className="flex items-center md:hidden">
                    <Link href="/expenses" className="text-sm font-medium hover:text-primary">
                      View All
                    </Link>
                </div>
              </div>
            </header>
            
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
              {children}
            </main>
          </div>
          <Toaster theme="dark" position="bottom-right" />
        </ExpenseProvider>
      </body>
    </html>
  );
}
