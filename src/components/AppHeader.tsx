import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
          <Leaf className="h-8 w-8" />
          <h1 className="text-2xl font-semibold">Verdant Vision</h1>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
