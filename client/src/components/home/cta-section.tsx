import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CTASection() {
  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">Ready to Transform Your Agricultural Business?</h2>
        <p className="text-white opacity-90 max-w-2xl mx-auto mb-8">
          Join thousands of farmers and businesses already using FarmChain to eliminate middlemen and improve their profits.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/register?type=farmer">
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto bg-white text-primary hover:bg-accent transition"
            >
              Register as Farmer
            </Button>
          </Link>
          <Link href="/register?type=buyer">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-primary-dark text-white border border-white hover:bg-primary-light transition"
            >
              Register as Buyer
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
