import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { ThemeToggleButton } from './ThemeToggleButton';

export function AppHeader() {
  return (
    <header className="bg-card border-b border-border/60 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity">
          <Leaf className="h-7 w-7 sm:h-8 sm:w-8" />
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">PlantIQ</h1>
        </Link>
        
        <ThemeToggleButton />
      </div>
    </header>
  );
}
