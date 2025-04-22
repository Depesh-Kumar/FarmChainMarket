import { Link } from "wouter";
import { LeafIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-bold text-xl mb-4 flex items-center">
              <LeafIcon className="mr-2" /> FarmChain
            </h3>
            <p className="text-neutral-400 mb-4">
              Connecting farmers directly with businesses for a more sustainable and profitable agricultural ecosystem.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-light transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-primary-light transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-primary-light transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-primary-light transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-400 hover:text-white transition">Home</Link></li>
              <li><a href="#features" className="text-neutral-400 hover:text-white transition">How It Works</a></li>
              <li><Link href="/marketplace" className="text-neutral-400 hover:text-white transition">Marketplace</Link></li>
              <li><a href="#testimonials" className="text-neutral-400 hover:text-white transition">Testimonials</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Farmers</h4>
            <ul className="space-y-2">
              <li><Link href="/register" className="text-neutral-400 hover:text-white transition">Registration</Link></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition">Listing Products</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition">Pricing Guide</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition">Order Management</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition">Analytics Tools</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Buyers</h4>
            <ul className="space-y-2">
              <li><Link href="/register" className="text-neutral-400 hover:text-white transition">Registration</Link></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition">Browsing Products</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition">Bulk Ordering</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition">Delivery Tracking</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition">Invoice Management</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-neutral-400">&copy; {new Date().getFullYear()} FarmChain. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition">Privacy Policy</a>
              <a href="#" className="text-neutral-400 hover:text-white transition">Terms of Service</a>
              <a href="#" className="text-neutral-400 hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
