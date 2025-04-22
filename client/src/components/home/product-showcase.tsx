import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShoppingCartIcon, ArrowRightIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Sample product data for showcase
const products = [
  {
    id: 1,
    name: "Organic Tomatoes",
    farmer: "Green Valley Farms",
    price: 85,
    originalPrice: 100,
    minOrder: 25,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1566842600175-97dca3c5ad01?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
    inStock: true,
    category: "vegetables"
  },
  {
    id: 2,
    name: "Fresh Potatoes",
    farmer: "Hill Top Produce",
    price: 35,
    originalPrice: null,
    minOrder: 50,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
    inStock: true,
    category: "vegetables"
  },
  {
    id: 3,
    name: "Basmati Rice",
    farmer: "Punjab Farmers Co-op",
    price: 120,
    originalPrice: 140,
    minOrder: 100,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1594062634806-5e068c578270?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
    inStock: true,
    category: "grains"
  },
  {
    id: 4,
    name: "Alphonso Mangoes",
    farmer: "Konkan Orchards",
    price: 450,
    originalPrice: null,
    minOrder: 5,
    unit: "dozen",
    image: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
    inStock: false,
    category: "fruits"
  }
];

export default function ProductShowcase() {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <section className="py-16 bg-white" id="products">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Featured Products</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Discover a variety of fresh produce directly from local farmers</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-neutral-100 rounded-full p-1">
            <button 
              className={`px-4 py-2 rounded-full font-heading font-medium transition ${
                activeCategory === "all" ? "bg-primary text-white" : "hover:bg-neutral-200"
              }`}
              onClick={() => setActiveCategory("all")}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 rounded-full font-heading font-medium transition ${
                activeCategory === "fruits" ? "bg-primary text-white" : "hover:bg-neutral-200"
              }`}
              onClick={() => setActiveCategory("fruits")}
            >
              Fruits
            </button>
            <button 
              className={`px-4 py-2 rounded-full font-heading font-medium transition ${
                activeCategory === "vegetables" ? "bg-primary text-white" : "hover:bg-neutral-200"
              }`}
              onClick={() => setActiveCategory("vegetables")}
            >
              Vegetables
            </button>
            <button 
              className={`px-4 py-2 rounded-full font-heading font-medium transition ${
                activeCategory === "grains" ? "bg-primary text-white" : "hover:bg-neutral-200"
              }`}
              onClick={() => setActiveCategory("grains")}
            >
              Grains
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-semibold">{product.name}</h3>
                  <span className={`${
                    product.inStock 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                    } text-xs px-2 py-1 rounded`}
                  >
                    {product.inStock ? "In Stock" : "Limited"}
                  </span>
                </div>
                <div className="text-neutral-600 text-sm mb-2">By {product.farmer}</div>
                <div className="mb-3">
                  <span className="text-primary font-semibold">
                    {formatCurrency(product.price)}/{product.unit}
                  </span>
                  {product.originalPrice && (
                    <span className="text-neutral-500 text-sm line-through ml-2">
                      {formatCurrency(product.originalPrice)}/{product.unit}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-neutral-600">Min Order: {product.minOrder}{product.unit}</div>
                  <Link href="/login">
                    <button className="text-primary hover:text-primary-dark flex items-center">
                      <ShoppingCartIcon className="h-4 w-4 mr-1" /> Add
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/marketplace">
            <Button variant="link" className="text-primary hover:text-primary-dark font-medium">
              View All Products <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
