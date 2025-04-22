import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "./header";
import Footer from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
    enabled: !isPublicRoute(location),
    onError: () => {
      if (!isPublicRoute(location)) {
        navigate('/login');
      }
    }
  });

  useEffect(() => {
    // Simulating loading state
    setIsLoading(false);
  }, []);

  // Define public routes that don't require authentication
  function isPublicRoute(path: string): boolean {
    const publicRoutes = ['/', '/login', '/register'];
    return publicRoutes.includes(path) || path.startsWith('/?');
  }

  // Redirect to dashboard if logged in and trying to access login/register
  useEffect(() => {
    if (currentUser && (location === '/login' || location === '/register')) {
      navigate('/dashboard');
    }
  }, [currentUser, location, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const showFooter = !['/dashboard', '/profile', '/marketplace', '/cart', '/orders', '/analytics'].some(
    route => location.startsWith(route)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
