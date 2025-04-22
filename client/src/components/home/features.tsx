import { 
  ShieldCheckIcon, 
  ClipboardListIcon, 
  ShoppingCartIcon, 
  MapPinIcon, 
  LineChartIcon, 
  FileTextIcon 
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheckIcon className="text-primary" />,
    title: "Secure Registration",
    description: "Simple but secure verification process for both farmers and business buyers"
  },
  {
    icon: <ClipboardListIcon className="text-primary" />,
    title: "Inventory Management",
    description: "Easy tools for farmers to list, update, and manage their available crops"
  },
  {
    icon: <ShoppingCartIcon className="text-primary" />,
    title: "Bulk Ordering",
    description: "Efficient bulk ordering system optimized for business purchasing needs"
  },
  {
    icon: <MapPinIcon className="text-primary" />,
    title: "Order Tracking",
    description: "Real-time order status and delivery tracking for transparency"
  },
  {
    icon: <LineChartIcon className="text-primary" />,
    title: "Analytics Dashboard",
    description: "Insights and analytics on sales, popular products, and buying patterns"
  },
  {
    icon: <FileTextIcon className="text-primary" />,
    title: "Invoice Generation",
    description: "Automatic invoice creation and management for all transactions"
  }
];

export default function Features() {
  return (
    <section className="py-16 bg-neutral-100" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Platform Features</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Everything farmers and businesses need to trade directly and efficiently.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-start mb-4">
                <div className="bg-primary-light bg-opacity-20 p-3 rounded-md mr-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-semibold text-lg">{feature.title}</h3>
              </div>
              <p className="text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
