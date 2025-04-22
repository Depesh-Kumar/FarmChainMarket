import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LeafIcon, ShoppingCartIcon, UserIcon, MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { MobileMenu } from "./mobile-menu";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = `bg-white ${
    isScrolled ? "shadow-md" : "shadow-sm"
  } sticky top-0 z-50 transition-shadow duration-300`;

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // If on dashboard related pages, show a different header
  const isDashboardPage = ['/dashboard', '/profile', '/marketplace', '/cart', '/orders', '/analytics'].some(
    route => location.startsWith(route)
  );

  if (isDashboardPage && user) {
    return (
      <header className={headerClass}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="text-primary font-heading font-bold text-2xl flex items-center">
              <LeafIcon className="mr-2 text-primary" />
              FarmChain
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className={`font-medium ${location === '/dashboard' ? 'text-primary' : 'hover:text-primary'} transition`}>
                Dashboard
              </Link>
              <Link href="/marketplace" className={`font-medium ${location.startsWith('/marketplace') ? 'text-primary' : 'hover:text-primary'} transition`}>
                Marketplace
              </Link>
              <Link href="/orders" className={`font-medium ${location.startsWith('/orders') ? 'text-primary' : 'hover:text-primary'} transition`}>
                Orders
              </Link>
              {user.userType === 'farmer' && (
                <Link href="/analytics" className={`font-medium ${location === '/analytics' ? 'text-primary' : 'hover:text-primary'} transition`}>
                  Analytics
                </Link>
              )}
            </nav>
            
            <div className="flex items-center space-x-4">
              {user.userType === 'buyer' && (
                <Link href="/cart" className="relative">
                  <ShoppingCartIcon className="h-6 w-6 text-neutral-700 hover:text-primary transition" />
                  <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs">0</Badge>
                </Link>
              )}
              
              <Link href="/profile" className="hidden md:flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                </div>
                <span className="font-medium">{user.name || user.username}</span>
              </Link>
              
              <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:inline-flex">
                Logout
              </Button>
              
              <button
                className="md:hidden text-neutral-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
          
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            userType={user?.userType}
            onLogout={handleLogout}
          />
        </div>
      </header>
    );
  }

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="text-primary font-heading font-bold text-2xl flex items-center">
            <LeafIcon className="mr-2 text-primary" />
            FarmChain
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium ${location === '/' ? 'text-primary' : 'hover:text-primary'} transition`}>
              Home
            </Link>
            <Link href="/marketplace" className={`font-medium ${location === '/marketplace' ? 'text-primary' : 'hover:text-primary'} transition`}>
              Marketplace
            </Link>
            <a href="#features" className="font-medium hover:text-primary transition">
              Features
            </a>
            <a href="#testimonials" className="font-medium hover:text-primary transition">
              Testimonials
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="hidden md:inline-flex">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="default" className="hidden md:inline-flex" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="hidden md:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="default" className="hidden md:inline-flex">
                    Register
                  </Button>
                </Link>
              </>
            )}
            
            <button
              className="md:hidden text-neutral-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
        
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          userType={user?.userType}
          onLogout={handleLogout}
          isLoggedIn={!!user}
        />
      </div>
    </header>
  );
}
