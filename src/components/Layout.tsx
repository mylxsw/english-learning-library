import React from "react";
import { Link, useLocation } from "wouter";
import { Headphones, BookOpen, Menu, X, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="py-6 flex items-center gap-2 px-2">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="font-sans font-bold text-xl tracking-tight">English Lib</span>
      </div>
      
      <nav className="flex-1 space-y-1 py-4">
        <Link href="/">
          <Button 
            variant={location === "/" ? "secondary" : "ghost"} 
            className="w-full justify-start gap-3 font-medium text-base h-12"
            onClick={() => setIsMobileOpen(false)}
          >
            <BookOpen className="h-5 w-5" />
            Library
          </Button>
        </Link>
        {/* Placeholder for future features */}
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 font-medium text-base h-12 text-muted-foreground"
          disabled
        >
          <Headphones className="h-5 w-5" />
          Playlists (Soon)
        </Button>
      </nav>

      <div className="py-6 border-t mt-auto">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
        >
          <Github className="h-4 w-4" />
          <span>Source Code</span>
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r px-6 fixed inset-y-0 z-50 bg-sidebar/50 backdrop-blur-sm">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/80 backdrop-blur-md z-50 px-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-sans font-bold text-lg">English Lib</span>
         </div>
         <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <NavContent />
            </SheetContent>
         </Sheet>
      </div>

      {/* Main Content */}
      <main className={cn(
        "flex-1 md:pl-72 w-full transition-all duration-200 ease-in-out",
        "pt-20 md:pt-0" // Add padding for mobile header
      )}>
        <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
