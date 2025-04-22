import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary to-[#4C956C] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="md:flex md:items-center">
          <div className="md:w-1/2 md:pr-8">
            <h1 className="font-heading font-bold text-4xl md:text-5xl leading-tight mb-4">
              From Farm to Business, <br />
              <span className="text-accent">Without Middlemen</span>
            </h1>
            <p className="text-lg mb-8 opacity-90">
              FarmChain connects farmers directly with businesses, eliminating middlemen and ensuring better prices for farmers and fresher produce for buyers.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register?type=farmer">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-accent hover:text-primary-dark">
                  I'm a Farmer
                </Button>
              </Link>
              <Link href="/register?type=buyer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary">
                  I'm a Buyer
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Farmer with crops" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
