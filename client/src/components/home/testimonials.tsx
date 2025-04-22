import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";

const testimonials = [
  {
    quote: "Since joining FarmChain, my income has increased by 40%. I now sell directly to restaurants and get better prices for my organic vegetables.",
    name: "Rajesh Singh",
    role: "Organic Farmer, Punjab",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "As a restaurant owner, FarmChain has revolutionized our sourcing. We get fresher ingredients, better prices, and can showcase farm-to-table transparency to our customers.",
    name: "Priya Sharma",
    role: "Restaurant Owner, Bangalore",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "The analytics tools have helped me understand which crops bring the best returns. I've optimized my farm's production and increased my customer base significantly.",
    name: "Mohan Patel",
    role: "Rice Farmer, Andhra Pradesh",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Success Stories</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Hear from farmers and businesses who have transformed their operations with FarmChain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-neutral-100 border-0">
              <CardContent className="p-6 relative">
                <div className="absolute -top-4 right-6 text-primary-light text-5xl opacity-20">
                  <QuoteIcon className="h-10 w-10" />
                </div>
                <div className="relative">
                  <p className="mb-4 text-neutral-700 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-heading font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
