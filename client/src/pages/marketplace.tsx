import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  SearchIcon, 
  FilterIcon, 
  ShoppingCartIcon 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductGrid from "@/components/marketplace/product-grid";
import ProductFilter from "@/components/marketplace/product-filter";
import { useCartStore } from "@/lib/cart-store";

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const cartItems = useCartStore((state) => state.items);
  
  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false
  });

  // Get all products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products', { categoryId: selectedCategory }]
  });

  // Get categories for filtering
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories']
  });

  // Filter products based on search term
  const filteredProducts = products.filter((product: any) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        {user?.userType === 'buyer' && (
          <Button
            variant="outline"
            className="md:w-auto w-full"
            onClick={() => {
              if (cartItems.length === 0) {
                toast({
                  title: "Your cart is empty",
                  description: "Add some products to your cart first",
                  variant: "destructive"
                });
                return;
              }
              window.location.href = "/cart";
            }}
          >
            <ShoppingCartIcon className="mr-2 h-4 w-4" />
            Cart ({cartItems.length})
          </Button>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20">
            <h3 className="font-semibold mb-4">Product Categories</h3>
            <ProductFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Filter Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden p-4 border rounded-md">
                <h3 className="font-semibold mb-4">Product Categories</h3>
                <ProductFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={(category) => {
                    setSelectedCategory(category);
                    setShowFilters(false);
                  }}
                />
              </div>
            )}
            
            {/* Active filters */}
            {selectedCategory && (
              <div className="flex items-center space-x-2">
                <div className="text-sm">Filters:</div>
                <div className="flex">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {categories.find((c: any) => c.id === selectedCategory)?.name}
                    <button 
                      className="ml-2 text-primary hover:text-primary-dark"
                      onClick={() => setSelectedCategory(null)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Separator className="mb-6" />
          
          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            userType={user?.userType}
          />
        </div>
      </div>
    </div>
  );
}
