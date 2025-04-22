import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStockStatusColor, getStockStatusLabel } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import { PackageIcon, ShoppingCartIcon, InfoIcon } from "lucide-react";

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
  userType?: string;
}

export default function ProductGrid({ products, isLoading, userType }: ProductGridProps) {
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  
  const isBuyer = userType === 'buyer';
  
  const handleAddToCart = (product: any) => {
    if (!isBuyer) {
      toast({
        title: "Cannot add to cart",
        description: "Only buyers can add products to cart. Please log in as a buyer.",
        variant: "destructive"
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: product.minOrderQuantity,
      unit: product.unit,
      farmerId: product.farmerId,
      farmerName: product.farmerName || "Unknown Farmer",
      imageUrl: product.imageUrl
    });
    
    toast({
      title: "Added to cart",
      description: `${product.minOrderQuantity} ${product.unit} of ${product.name} added to cart.`,
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <PackageIcon className="h-16 w-16 text-muted mb-4" />
        <h3 className="text-xl font-semibold">No products found</h3>
        <p className="text-muted-foreground mt-2 max-w-lg">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-md transition">
          <Link href={`/product/${product.id}`}>
            <div className="relative h-48 bg-neutral-100 overflow-hidden">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <InfoIcon className="h-12 w-12 text-neutral-300" />
                </div>
              )}
              <Badge 
                className={`absolute top-2 right-2 ${getStockStatusColor(product.inStock, product.availableQuantity)}`}
              >
                {getStockStatusLabel(product.inStock, product.availableQuantity)}
              </Badge>
            </div>
          </Link>
          
          <CardContent className="p-4">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold mb-1 hover:text-primary transition-colors">{product.name}</h3>
            </Link>
            
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-primary font-bold">{formatCurrency(product.price)}/{product.unit}</span>
              {product.isOrganic && (
                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs border-green-200">Organic</Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.description || "No description available."}
            </div>
            
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
              <span>Min: {product.minOrderQuantity} {product.unit}</span>
              <span>Available: {product.availableQuantity} {product.unit}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href={`/product/${product.id}`} className="flex-1">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
              
              {isBuyer && (
                <Button 
                  className="flex-none"
                  size="icon" 
                  disabled={!product.inStock || product.availableQuantity < product.minOrderQuantity}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
