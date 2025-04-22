import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircleIcon,
  PackageIcon, 
  TruckIcon, 
  UsersIcon, 
  ArrowRightIcon, 
  BarChart3Icon,
  ShoppingCartIcon 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import AnalyticsCard from "@/components/dashboard/analytics-card";
import ProductCard from "@/components/dashboard/product-card";
import OrderCard from "@/components/dashboard/order-card";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Get current user
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/me'],
  });

  // Get products (for farmers)
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', { farmerId: user?.id }],
    enabled: !!user && user.userType === 'farmer',
  });

  // Get orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders'],
    enabled: !!user,
  });

  // Loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isFarmer = user?.userType === 'farmer';

  // Calculate statistics
  const totalSales = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter((order: any) => order.status === 'pending').length;
  const recentProducts = isFarmer ? products.slice(0, 4) : [];
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || user?.username}!
          </p>
        </div>
        {isFarmer && (
          <Link href="/profile?addProduct=true">
            <Button className="gap-2">
              <PlusCircleIcon className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isFarmer && <TabsTrigger value="products">Products</TabsTrigger>}
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AnalyticsCard 
              title="Total Sales"
              value={formatCurrency(totalSales)}
              description="Lifetime sales value"
              icon={<BarChart3Icon className="h-5 w-5 text-primary" />}
            />
            
            <AnalyticsCard 
              title="Products"
              value={isFarmer ? products.length.toString() : "N/A"}
              description={isFarmer ? "Total products listed" : "Not applicable for buyers"}
              icon={<PackageIcon className="h-5 w-5 text-primary" />}
            />
            
            <AnalyticsCard 
              title="Orders"
              value={orders.length.toString()}
              description="Total orders placed/received"
              icon={<TruckIcon className="h-5 w-5 text-primary" />}
            />
            
            <AnalyticsCard 
              title="Pending Orders"
              value={pendingOrders.toString()}
              description="Orders awaiting action"
              icon={<UsersIcon className="h-5 w-5 text-primary" />}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {isFarmer && (
              <Card className="col-span-full lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md font-medium">Recent Products</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1" onClick={() => setActiveTab("products")}>
                    See all <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {productsLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : recentProducts.length > 0 ? (
                    <div className="space-y-3">
                      {recentProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <PackageIcon className="h-12 w-12 text-muted mb-2" />
                      <h3 className="text-lg font-semibold">No products listed yet</h3>
                      <p className="text-muted-foreground mt-1">
                        Start selling by adding your first product.
                      </p>
                      <Link href="/profile?addProduct=true">
                        <Button className="mt-4 gap-2">
                          <PlusCircleIcon className="h-4 w-4" />
                          Add Product
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <Card className={`col-span-full ${isFarmer ? 'lg:col-span-4' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => setActiveTab("orders")}>
                  See all <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-3">
                    {recentOrders.map((order: any) => (
                      <OrderCard key={order.id} order={order} userType={user.userType} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <TruckIcon className="h-12 w-12 text-muted mb-2" />
                    <h3 className="text-lg font-semibold">No orders yet</h3>
                    <p className="text-muted-foreground mt-1">
                      {isFarmer 
                        ? "You haven't received any orders yet." 
                        : "You haven't placed any orders yet."}
                    </p>
                    {!isFarmer && (
                      <Link href="/marketplace">
                        <Button className="mt-4">Browse Products</Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="text-md font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {isFarmer ? (
                    <>
                      <Link href="/profile?addProduct=true">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <PlusCircleIcon className="h-4 w-4" />
                          Add Product
                        </Button>
                      </Link>
                      <Link href="/orders">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <TruckIcon className="h-4 w-4" />
                          Manage Orders
                        </Button>
                      </Link>
                      <Link href="/analytics">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <BarChart3Icon className="h-4 w-4" />
                          View Analytics
                        </Button>
                      </Link>
                      <Link href="/profile">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <UsersIcon className="h-4 w-4" />
                          Update Profile
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/marketplace">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <PackageIcon className="h-4 w-4" />
                          Browse Products
                        </Button>
                      </Link>
                      <Link href="/cart">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <ShoppingCartIcon className="h-4 w-4" />
                          View Cart
                        </Button>
                      </Link>
                      <Link href="/orders">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <TruckIcon className="h-4 w-4" />
                          Track Orders
                        </Button>
                      </Link>
                      <Link href="/profile">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <UsersIcon className="h-4 w-4" />
                          Update Profile
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {isFarmer && (
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">My Products</h2>
              <Link href="/profile?addProduct=true">
                <Button className="gap-2">
                  <PlusCircleIcon className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
            
            {productsLoading ? (
              <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product: any) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <ProductCard product={product} showFull />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <PackageIcon className="h-16 w-16 text-muted mb-4" />
                <h3 className="text-xl font-semibold">No products listed yet</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Start selling by adding your first product. Add details, pricing, and inventory information.
                </p>
                <Link href="/profile?addProduct=true">
                  <Button className="mt-6 gap-2">
                    <PlusCircleIcon className="h-4 w-4" />
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        )}
        
        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-semibold">My Orders</h2>
            {!isFarmer && (
              <Link href="/marketplace">
                <Button className="gap-2">
                  <PackageIcon className="h-4 w-4" />
                  Browse Products
                </Button>
              </Link>
            )}
          </div>
          
          {ordersLoading ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <OrderCard order={order} userType={user.userType} expanded />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <TruckIcon className="h-16 w-16 text-muted mb-4" />
              <h3 className="text-xl font-semibold">No orders yet</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                {isFarmer 
                  ? "You haven't received any orders yet. Orders will appear here when buyers place them." 
                  : "You haven't placed any orders yet. Browse the marketplace to find products."}
              </p>
              {!isFarmer && (
                <Link href="/marketplace">
                  <Button className="mt-6">Browse Products</Button>
                </Link>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
