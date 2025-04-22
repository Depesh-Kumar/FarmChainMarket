import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeftIcon,
  ShoppingCartIcon, 
  StarIcon, 
  TruckIcon,
  InfoIcon,
  UserIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  AlertTriangleIcon
} from "lucide-react";
import { formatCurrency, getStockStatusColor, getStockStatusLabel } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/cart-store";

export default function ProductDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState<number>(0);
  const { addToCart, getItemQuantity } = useCartStore();
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });
  
  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
  });
  
  // Get cart quantity for this product (if any)
  useEffect(() => {
    if (product) {
      const cartQuantity = getItemQuantity(product.id);
      setQuantity(cartQuantity > 0 ? cartQuantity : product.minOrderQuantity);
    }
  }, [product, getItemQuantity]);
  
  // Get farmer details
  const { data: farmer } = useQuery({
    queryKey: [`/api/users/${product?.farmerId}`],
    enabled: !!product?.farmerId,
  });
  
  // Fetch category details
  const { data: category } = useQuery({
    queryKey: [`/api/categories/${product?.categoryId}`],
    enabled: !!product?.categoryId,
  });
  
  // Fetch product reviews
  const { data: reviews = [] } = useQuery({
    queryKey: [`/api/products/${id}/reviews`],
    enabled: !!id,
  });
  
  // Handle quantity input changes
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    }
  };
  
  // Increment/decrement quantity
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(product?.minOrderQuantity || 1, prev - 1));
  };
  
  // Add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if quantity meets minimum order requirement
    if (quantity < product.minOrderQuantity) {
      toast({
        variant: "destructive",
        title: "Minimum order not met",
        description: `Minimum order quantity is ${product.minOrderQuantity} ${product.unit}.`,
      });
      return;
    }
    
    // Check if quantity exceeds available quantity
    if (quantity > product.availableQuantity) {
      toast({
        variant: "destructive",
        title: "Not enough stock",
        description: `Only ${product.availableQuantity} ${product.unit} available.`,
      });
      return;
    }
    
    // Add to cart
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      unit: product.unit,
      farmerId: product.farmerId,
      farmerName: farmer?.name || "Unknown Farmer",
      imageUrl: product.imageUrl
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.unit} of ${product.name} added to cart.`,
    });
  };
  
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container py-12 px-4 text-center">
        <AlertTriangleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/marketplace">
          <Button>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }
  
  const isBuyer = user?.userType === 'buyer';

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/marketplace" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="md:order-1">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-80 md:h-96 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-80 md:h-96 bg-neutral-200 rounded-lg flex items-center justify-center">
              <InfoIcon className="h-12 w-12 text-neutral-400" />
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="md:order-2">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Badge className={getStockStatusColor(product.inStock, product.availableQuantity)}>
              {getStockStatusLabel(product.inStock, product.availableQuantity)}
            </Badge>
          </div>
          
          <div className="flex items-center mb-4">
            {category && (
              <Badge variant="outline" className="mr-2">
                {category.name}
              </Badge>
            )}
            {product.isOrganic && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Organic
              </Badge>
            )}
          </div>
          
          <div className="flex items-baseline mb-6">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(product.price)}/{product.unit}
            </span>
          </div>
          
          {product.description && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-neutral-600">{product.description}</p>
            </div>
          )}
          
          <div className="flex items-center mb-6">
            <UserIcon className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground">
              Sold by <strong>{farmer?.name || "Unknown Farmer"}</strong>
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-neutral-100 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Available</div>
              <div className="font-medium">{product.availableQuantity} {product.unit}</div>
            </div>
            <div className="bg-neutral-100 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Minimum Order</div>
              <div className="font-medium">{product.minOrderQuantity} {product.unit}</div>
            </div>
          </div>
          
          {isBuyer && product.inStock && (
            <div className="space-y-4">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity}
                  disabled={quantity <= product.minOrderQuantity}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min={product.minOrderQuantity}
                  max={product.availableQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="mx-2 text-center"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity}
                  disabled={quantity >= product.availableQuantity}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
                <span className="ml-2 text-sm text-muted-foreground">{product.unit}</span>
              </div>
              
              <Button 
                className="w-full gap-2" 
                onClick={handleAddToCart}
                disabled={!product.inStock || product.availableQuantity < product.minOrderQuantity}
              >
                <ShoppingCartIcon className="h-4 w-4" />
                Add to Cart
              </Button>
              
              <div className="flex items-center text-sm mt-2">
                <TruckIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Orders are typically processed within 1-2 business days
                </span>
              </div>
            </div>
          )}
          
          {isBuyer && !product.inStock && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2" />
              <span>This product is currently out of stock.</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        {reviews.length > 0 ? (
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                ({reviews.length} reviews)
              </span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm">
                          {review.userId.toString().charAt(0)}
                        </div>
                        <span className="ml-2 font-medium">User #{review.userId}</span>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-neutral-600">{review.comment || "No comment provided."}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-50 rounded-lg">
            <StarIcon className="h-12 w-12 mx-auto text-neutral-300" />
            <h3 className="font-medium mt-2">No Reviews Yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This product doesn't have any reviews yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
