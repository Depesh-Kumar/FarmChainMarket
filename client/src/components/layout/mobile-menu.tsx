import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userType?: string;
  onLogout: () => void;
  isLoggedIn?: boolean;
}

export function MobileMenu({ isOpen, onClose, userType, onLogout, isLoggedIn }: MobileMenuProps) {
  if (!isOpen) return null;

  // Dashboard menu items
  if (isLoggedIn && userType) {
    return (
      <div className="md:hidden py-4 border-t border-neutral-200">
        <div className="flex flex-col space-y-3">
          <Link href="/dashboard" className="font-medium py-2 hover:text-primary transition" onClick={onClose}>
            Dashboard
          </Link>
          <Link href="/marketplace" className="font-medium py-2 hover:text-primary transition" onClick={onClose}>
            Marketplace
          </Link>
          <Link href="/orders" className="font-medium py-2 hover:text-primary transition" onClick={onClose}>
            Orders
          </Link>
          {userType === 'farmer' && (
            <Link href="/analytics" className="font-medium py-2 hover:text-primary transition" onClick={onClose}>
              Analytics
            </Link>
          )}
          <Link href="/profile" className="font-medium py-2 hover:text-primary transition" onClick={onClose}>
            My Profile
          </Link>
          {userType === 'buyer' && (
            <Link href="/cart" className="font-medium py-2 hover:text-primary transition" onClick={onClose}>
              Cart
            </Link>
          )}
          <div className="pt-2">
            <Button variant="destructive" className="w-full" onClick={() => { onLogout(); onClose(); }}>
              Log Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Public menu items
  return (
    <div className="md:hidden py-4 border-t border-neutral-200">
      <div className="flex flex-col space-y-3">
        <Link href="/" className="font-medium py-2 hover:text-primary transition" onClick={onClose}>
          Home
        </Link>
        <Link href="/marketplace" className="font-medium py-2 hover:text-primary transition" onClick={onClose}>
          Marketplace
        </Link>
        <a href="#features" className="font-medium py-2 hover:text-primary transition" onClick={onClose}>
          Features
        </a>
        <a href="#testimonials" className="font-medium py-2 hover:text-primary transition" onClick={onClose}>
          Testimonials
        </a>
        <div className="flex flex-col space-y-2 pt-2">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" onClick={onClose}>
                <Button variant="default" className="w-full">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => { onLogout(); onClose(); }}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={onClose}>
                <Button variant="default" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
