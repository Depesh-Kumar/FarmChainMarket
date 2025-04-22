import { UserPlusIcon, SproutIcon, TruckIcon } from "lucide-react";

const steps = [
  {
    icon: <UserPlusIcon className="text-white text-xl" />,
    title: "1. Register",
    description: "Sign up as a farmer or business buyer with simple verification process"
  },
  {
    icon: <SproutIcon className="text-white text-xl" />,
    title: "2. List or Browse",
    description: "Farmers list crops, buyers browse and order from verified producers"
  },
  {
    icon: <TruckIcon className="text-white text-xl" />,
    title: "3. Deliver & Pay",
    description: "Track orders, manage delivery, and handle secure payments"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">How FarmChain Works</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Our platform makes it simple for farmers to connect with businesses and manage their sales efficiently.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-neutral-100 rounded-lg p-6 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
