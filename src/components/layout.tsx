import { NavLink, Outlet } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center gap-4 px-4">
          <h1 className="text-lg font-semibold">MUI NPM Stats</h1>
          <nav className="flex items-center gap-2">
            <NavLink to="/">
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(!isActive && 'text-muted-foreground')}
                >
                  Presets
                </Button>
              )}
            </NavLink>
            <NavLink to="/package-breakdown">
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(!isActive && 'text-muted-foreground')}
                >
                  Package Breakdown
                </Button>
              )}
            </NavLink>
          </nav>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
