import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircleIcon } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="md:flex md:items-center md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Powerful Dashboards for Farmers & Buyers</h2>
            <p className="text-neutral-600 mb-6">Track your business performance with intuitive analytics dashboards designed for both farmers and business buyers.</p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircleIcon className="text-primary" />
                </div>
                <div className="ml-3">
                  <h3 className="font-heading font-semibold">Real-time Sales Analytics</h3>
                  <p className="text-neutral-600">Track your sales performance, popular products, and revenue trends.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircleIcon className="text-primary" />
                </div>
                <div className="ml-3">
                  <h3 className="font-heading font-semibold">Inventory Management</h3>
                  <p className="text-neutral-600">Keep track of stock levels and get alerts when inventory is running low.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircleIcon className="text-primary" />
                </div>
                <div className="ml-3">
                  <h3 className="font-heading font-semibold">Order Tracking</h3>
                  <p className="text-neutral-600">Follow order status from placement to delivery with real-time updates.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/login">
                <Button variant="default" size="lg">
                  Try Demo Dashboard
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-primary px-4 py-3 text-white">
                <div className="flex items-center">
                  <div className="rounded-full w-2 h-2 bg-red-500 mr-1"></div>
                  <div className="rounded-full w-2 h-2 bg-yellow-500 mr-1"></div>
                  <div className="rounded-full w-2 h-2 bg-green-500 mr-1"></div>
                  <div className="ml-2 font-medium">Farmer Dashboard</div>
                </div>
              </div>
              <div className="p-4">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Dashboard Preview" 
                  className="rounded border border-neutral-200 shadow-sm w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
