import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeftIcon, 
  ShoppingCartIcon, 
  TrashIcon, 
  TruckIcon,
  AlertTriangleIcon
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/cart-store";
import CartItem from "@/components/cart/cart-item";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Cart() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const { items, clearCart, removeFromCart, updateQuantity } = useCartStore();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
  });

  // Get fresh product data for each item in cart
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    enabled: items.length > 0 && !!user,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "You can track your order in the Orders section.",
      });
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      navigate("/orders");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to place order",
        description: error.message || "There was an error placing your order. Please try again.",
      });
      setIsSubmitting(false);
    },
  });

  // Calculate cart total and check product availability
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Check for availability issues
  const availabilityIssues = items.map(item => {
    const product = products.find((p: any) => p.id === item.productId);
    if (!product) return { item, issue: "Product not found" };
    if (!product.inStock) return { item, issue: "Product out of stock" };
    if (product.availableQuantity < item.quantity) {
      return { 
        item, 
        issue: `Only ${product.availableQuantity} ${product.unit} available`,
        availableQuantity: product.availableQuantity
      };
    }
    return null;
  }).filter(Boolean);

  // Place order handler
  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to place an order.",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty cart",
        description: "Your cart is empty. Please add some products before placing an order.",
      });
      return;
    }

    if (availabilityIssues.length > 0) {
      toast({
        variant: "destructive",
        title: "Availability issues",
        description: "Some products in your cart have availability issues. Please update your cart.",
      });
      return;
    }

    setIsSubmitting(true);

    // Prepare order items
    const orderItems = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    // Prepare order data
    const orderData = {
      order: {
        status: "pending",
        paymentStatus: "pending",
        shippingAddress: shippingAddress || user.address,
        deliveryNotes,
      },
      items: orderItems,
    };

    try {
      await createOrderMutation.mutateAsync(orderData);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // If user is not a buyer, redirect to marketplace
  if (user && user.userType !== 'buyer') {
    navigate("/marketplace");
    return null;
  }

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/marketplace" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Cart Items */}
        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">
                Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
              </CardTitle>
              {items.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 text-muted-foreground"
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your cart?")) {
                      clearCart();
                      toast({
                        title: "Cart cleared",
                        description: "All items have been removed from your cart.",
                      });
                    }
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                  Clear Cart
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCartIcon className="h-12 w-12 text-muted mb-4" />
                  <h3 className="text-lg font-semibold">Your cart is empty</h3>
                  <p className="text-muted-foreground mt-1 mb-6">
                    Add some products to your cart from the marketplace.
                  </p>
                  <Link href="/marketplace">
                    <Button>Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onRemove={() => removeFromCart(item.productId)}
                      onUpdateQuantity={(newQuantity) => updateQuantity(item.productId, newQuantity)}
                      availabilityIssue={availabilityIssues.find(issue => issue?.item.productId === item.productId)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="md:w-1/3">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>To be determined</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>

                {availabilityIssues.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-700 text-sm">
                    <div className="flex">
                      <AlertTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Availability issues detected</p>
                        <p className="mt-1">
                          Some products in your cart have availability issues. Please update quantities or remove these items.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shipping Address</label>
                  <Textarea
                    placeholder={user?.address || "Enter your shipping address..."}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Notes (Optional)</label>
                  <Textarea
                    placeholder="Any special instructions for delivery..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  className="w-full gap-2" 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || availabilityIssues.length > 0 || items.length === 0}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <TruckIcon className="h-4 w-4" />
                      Place Order
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
