import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, DownloadIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Generate sample date labels for the past 7 days
const getDaysArray = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
  }
  return days;
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("week");
  
  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
  });
  
  // Get all products (for a farmer)
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products', { farmerId: user?.id }],
    enabled: !!user && user.userType === 'farmer',
  });
  
  // Get all orders
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    enabled: !!user,
  });
  
  // If not a farmer, redirect to dashboard
  if (user && user.userType !== 'farmer') {
    return (
      <div className="container py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Analytics Access Restricted</h1>
        <p className="text-muted-foreground mb-6">The analytics dashboard is only available for farmers.</p>
        <Link href="/dashboard">
          <button className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark">
            Go to Dashboard
          </button>
        </Link>
      </div>
    );
  }
  
  // Process orders to get sales data
  const salesData = getDaysArray().map(day => {
    // In a real app, you would filter orders by day and sum their totals
    // For now, we're generating random data
    return {
      name: day,
      sales: Math.floor(Math.random() * 5000) + 1000
    };
  });
  
  // Total sales calculation
  const totalSales = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
  
  // Product performance data
  const productPerformance = products.map((product: any) => {
    // In a real app, you would calculate actual sales for each product
    return {
      name: product.name,
      value: Math.floor(Math.random() * 100) + 10
    };
  }).slice(0, 5); // Limit to 5 products for the pie chart
  
  // Order status distribution
  const orderStatusCounts = {
    pending: orders.filter((order: any) => order.status === 'pending').length,
    confirmed: orders.filter((order: any) => order.status === 'confirmed').length,
    shipped: orders.filter((order: any) => order.status === 'shipped').length,
    delivered: orders.filter((order: any) => order.status === 'delivered').length,
    cancelled: orders.filter((order: any) => order.status === 'cancelled').length
  };
  
  const orderStatusData = [
    { name: 'Pending', value: orderStatusCounts.pending },
    { name: 'Confirmed', value: orderStatusCounts.confirmed },
    { name: 'Shipped', value: orderStatusCounts.shipped },
    { name: 'Delivered', value: orderStatusCounts.delivered },
    { name: 'Cancelled', value: orderStatusCounts.cancelled }
  ];
  
  // Inventory levels
  const inventoryData = products.map((product: any) => ({
    name: product.name,
    quantity: product.availableQuantity,
    min: product.minOrderQuantity
  })).slice(0, 5); // Limit to 5 products
  
  // Random colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farm Analytics</h1>
          <p className="text-muted-foreground">
            Insights and performance metrics for your farm business
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Select 
            value={timeRange} 
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <button className="p-2 rounded-md bg-neutral-100 hover:bg-neutral-200">
            <DownloadIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-muted-foreground">Total Sales</div>
              <div className="bg-green-100 text-green-700 p-1 rounded-full">
                <TrendingUpIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>12% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-muted-foreground">Total Orders</div>
              <div className="bg-blue-100 text-blue-700 p-1 rounded-full">
                <TrendingUpIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>8% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-muted-foreground">Active Products</div>
              <div className="bg-purple-100 text-purple-700 p-1 rounded-full">
                <TrendingUpIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-bold">{products.filter((p: any) => p.inStock).length}</div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>4% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
              <div className="bg-red-100 text-red-700 p-1 rounded-full">
                <TrendingUpIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-bold">24.5%</div>
            <div className="flex items-center mt-2 text-sm text-red-600">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              <span>2% from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Total sales revenue for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${value}`} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
                  <Area type="monotone" dataKey="sales" stroke="#2C6E49" fill="#2C6E49" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Top selling products by sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {productPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} units`, 'Sold']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Breakdown of orders by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderStatusData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                  <Bar dataKey="value" fill="#4C956C">
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Levels</CardTitle>
            <CardDescription>Current stock levels of your top products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={inventoryData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value, name) => [value, name === 'min' ? 'Min Order' : 'Available']} />
                  <Legend />
                  <Bar dataKey="quantity" name="Available" fill="#2C6E49" />
                  <Bar dataKey="min" name="Min Order" fill="#FEFEE3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
          <CardDescription>Key trends and recommendations for your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-semibold text-green-700">Revenue Opportunity</h3>
              <p className="text-green-700 mt-1">Organic Tomatoes have shown 25% higher profit margins. Consider increasing production.</p>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="font-semibold text-yellow-700">Inventory Alert</h3>
              <p className="text-yellow-700 mt-1">Several products are running low on stock. Review inventory levels to avoid stockouts.</p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-700">Customer Insight</h3>
              <p className="text-blue-700 mt-1">Restaurant buyers place larger orders on Mondays and Tuesdays. Consider special promotions on these days.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
