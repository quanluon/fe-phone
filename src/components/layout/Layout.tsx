import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from '../molecules/BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};
