import Link from 'next/link';
import { Leaf, Moon, Sun } from 'lucide-react';
// import { Button } from '@/components/ui/button'; // If using a theme toggle button

export function AppHeader() {
  // const { theme, setTheme } = useTheme(); // Example for theme toggle
  // For now, no theme toggle functionality, just styling update

  return (
    <header className="bg-card border-b border-border/60 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity">
          <Leaf className="h-7 w-7 sm:h-8 sm:w-8" />
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Verdant Vision</h1>
        </Link>
        
        {/* Placeholder for theme toggle or other actions */}
        {/* <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button> */}
      </div>
    </header>
  );
}
