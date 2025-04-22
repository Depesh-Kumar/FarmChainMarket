import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeftIcon, 
  FileTextIcon, 
  ExternalLinkIcon, 
  AlertTriangleIcon,
  ClipboardCheckIcon
} from "lucide-react";
import { 
  formatCurrency, 
  formatDate, 
  getStatusColor,
  getStatusLabel
} from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import InvoiceGenerator from "@/components/shared/invoice-generator";

export default function OrderDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  
  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me']
  });
  
  // Get order details
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/orders/${id}`],
    enabled: !!id
  });
  
  // Extract order and items from data
  const order = data?.order;
  const orderItems = data?.items || [];
  
  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number, status: string }) => {
      return apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Order status updated",
        description: `Order status has been updated to ${getStatusLabel(newStatus)}.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/orders/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to update order status",
        description: error.message || "There was an error updating the order status.",
      });
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });
  
  // Handle order status update
  const handleUpdateStatus = async () => {
    if (!order || !newStatus || newStatus === order.status) return;
    
    setIsUpdating(true);
    try {
      await updateOrderStatusMutation.mutateAsync({
        orderId: order.id,
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  
  // Determine if the user can update the order status
  const canUpdateStatus = () => {
    if (!user || !order) return false;
    
    const isFarmer = user.userType === 'farmer';
    const isBuyer = user.userType === 'buyer';
    
    // Buyers can only cancel pending orders
    if (isBuyer && order.buyerId === user.id) {
      return order.status === 'pending';
    }
    
    // Farmers can update order status if they are involved
    if (isFarmer) {
      // Assume farmers can update any order they can view
      return true;
    }
    
    return false;
  };
  
  // Get available status options based on current status and user type
  const getStatusOptions = () => {
    if (!order || !user) return [];
    
    const isFarmer = user.userType === 'farmer';
    const isBuyer = user.userType === 'buyer';
    
    if (isBuyer) {
      // Buyers can only cancel pending orders
      return order.status === 'pending' ? ['cancelled'] : [];
    }
    
    if (isFarmer) {
      switch (order.status) {
        case 'pending':
          return ['confirmed', 'cancelled'];
        case 'confirmed':
          return ['shipped', 'cancelled'];
        case 'shipped':
          return ['delivered', 'cancelled'];
        default:
          return [];
      }
    }
    
    return [];
  };
  
  const statusOptions = getStatusOptions();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="container py-12 px-4 text-center">
        <AlertTriangleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link href="/orders">
          <Button>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }
  
  // Calculate order total from items
  const orderTotal = orderItems.reduce((total: number, item: any) => total + item.total, 0);

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/orders" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowInvoice(true)}
          >
            <FileTextIcon className="h-4 w-4" />
            View Invoice
          </Button>
          
          {canUpdateStatus() && statusOptions.length > 0 && (
            <div className="flex gap-2">
              <Select
                value={newStatus}
                onValueChange={setNewStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                disabled={!newStatus || isUpdating}
                onClick={handleUpdateStatus}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'} in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="font-medium">{item.productName || `Product #${item.productId}`}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.pricePerUnit)}
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="font-medium">Total</div>
              <div className="font-bold">{formatCurrency(orderTotal)}</div>
            </CardFooter>
          </Card>
          
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Shipping Address</div>
                  <div className="mt-1">{order.shippingAddress || "No shipping address provided"}</div>
                </div>
                
                {order.deliveryNotes && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Delivery Notes</div>
                    <div className="mt-1">{order.deliveryNotes}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Order ID</div>
                  <div>#{order.id}</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Date Placed</div>
                  <div>{formatDate(order.createdAt)}</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                  <div>{formatDate(order.updatedAt)}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Subtotal</div>
                  <div>{formatCurrency(orderTotal)}</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Shipping</div>
                  <div>To be determined</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <div>Total</div>
                <div>{formatCurrency(orderTotal)}</div>
              </div>
              
              <div className="flex justify-between">
                <div className="text-sm font-medium text-muted-foreground">Payment Status</div>
                <Badge variant={order.paymentStatus === "paid" ? "default" : "outline"}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </Badge>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col space-y-2">
              {(order.status === "delivered" || order.status === "completed") && (
                <Button className="w-full gap-2" variant="outline">
                  <ClipboardCheckIcon className="h-4 w-4" />
                  Leave Review
                </Button>
              )}
              
              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={() => setShowInvoice(true)}
              >
                <FileTextIcon className="h-4 w-4" />
                View Invoice
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Invoice Modal */}
      {showInvoice && (
        <InvoiceGenerator
          order={order}
          orderItems={orderItems}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
