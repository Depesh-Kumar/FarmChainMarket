import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  ShoppingCartIcon,
  TruckIcon,
  PackageIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  FileTextIcon
} from "lucide-react";
import OrderListItem from "@/components/orders/order-list-item";

export default function Orders() {
  const [filter, setFilter] = useState("all");
  
  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me']
  });
  
  // Get orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/orders']
  });
  
  // Filter orders based on status
  const filteredOrders = filter === "all"
    ? orders
    : orders.filter((order: any) => order.status === filter);
  
  // Group orders by status for the overview section
  const pendingOrders = orders.filter((order: any) => order.status === "pending").length;
  const confirmedOrders = orders.filter((order: any) => order.status === "confirmed").length;
  const shippedOrders = orders.filter((order: any) => order.status === "shipped").length;
  const deliveredOrders = orders.filter((order: any) => order.status === "delivered").length;
  const cancelledOrders = orders.filter((order: any) => order.status === "cancelled").length;
  
  // User type
  const isFarmer = user?.userType === 'farmer';
  const isBuyer = user?.userType === 'buyer';

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            {isFarmer 
              ? "View and manage orders from buyers" 
              : "Track your orders and view order history"}
          </p>
        </div>
        {isBuyer && (
          <Link href="/marketplace">
            <Button className="gap-2">
              <ShoppingCartIcon className="h-4 w-4" />
              Place New Order
            </Button>
          </Link>
        )}
      </div>
      
      {/* Order Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className={`${filter === "all" ? "border-primary bg-primary/5" : ""}`}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Button
              variant="ghost"
              className="w-full h-full flex flex-col p-2"
              onClick={() => setFilter("all")}
            >
              <PackageIcon className="h-8 w-8 mb-2" />
              <span className="text-xl font-bold">{orders.length}</span>
              <span className="text-sm text-muted-foreground">All Orders</span>
            </Button>
          </CardContent>
        </Card>
        
        <Card className={`${filter === "pending" ? "border-primary bg-primary/5" : ""}`}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Button
              variant="ghost"
              className="w-full h-full flex flex-col p-2"
              onClick={() => setFilter("pending")}
            >
              <AlertTriangleIcon className="h-8 w-8 mb-2 text-yellow-500" />
              <span className="text-xl font-bold">{pendingOrders}</span>
              <span className="text-sm text-muted-foreground">Pending</span>
            </Button>
          </CardContent>
        </Card>
        
        <Card className={`${filter === "confirmed" ? "border-primary bg-primary/5" : ""}`}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Button
              variant="ghost"
              className="w-full h-full flex flex-col p-2"
              onClick={() => setFilter("confirmed")}
            >
              <PackageIcon className="h-8 w-8 mb-2 text-blue-500" />
              <span className="text-xl font-bold">{confirmedOrders}</span>
              <span className="text-sm text-muted-foreground">Confirmed</span>
            </Button>
          </CardContent>
        </Card>
        
        <Card className={`${filter === "shipped" ? "border-primary bg-primary/5" : ""}`}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Button
              variant="ghost"
              className="w-full h-full flex flex-col p-2"
              onClick={() => setFilter("shipped")}
            >
              <TruckIcon className="h-8 w-8 mb-2 text-purple-500" />
              <span className="text-xl font-bold">{shippedOrders}</span>
              <span className="text-sm text-muted-foreground">Shipped</span>
            </Button>
          </CardContent>
        </Card>
        
        <Card className={`${filter === "delivered" ? "border-primary bg-primary/5" : ""}`}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Button
              variant="ghost"
              className="w-full h-full flex flex-col p-2"
              onClick={() => setFilter("delivered")}
            >
              <CheckCircleIcon className="h-8 w-8 mb-2 text-green-500" />
              <span className="text-xl font-bold">{deliveredOrders}</span>
              <span className="text-sm text-muted-foreground">Delivered</span>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Orders List */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order: any) => (
                <OrderListItem
                  key={order.id}
                  order={order}
                  userType={user?.userType}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileTextIcon className="h-12 w-12 text-muted mb-4" />
              <h3 className="text-lg font-semibold">No orders found</h3>
              <p className="text-muted-foreground mt-1 mb-6">
                {filter === "all"
                  ? isBuyer
                    ? "You haven't placed any orders yet."
                    : "You haven't received any orders yet."
                  : `You don't have any ${filter} orders.`}
              </p>
              {isBuyer && (
                <Link href="/marketplace">
                  <Button>Shop Now</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
