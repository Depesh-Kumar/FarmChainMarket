import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

interface OrderCardProps {
  order: any;
  userType: string;
  expanded?: boolean;
}

export default function OrderCard({ order, userType, expanded = false }: OrderCardProps) {
  const isFarmer = userType === 'farmer';
  
  // Format status name
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="rounded-md border p-3 hover:bg-neutral-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">Order #{order.id}</h3>
            <Badge className={getStatusColor(order.status)}>
              {formatStatus(order.status)}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Placed on {formatDate(order.createdAt)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
            <div className="text-xs text-muted-foreground">
              {isFarmer ? "Received from buyer" : "Total amount"}
            </div>
          </div>
          <Link href={`/orders/${order.id}`}>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </Link>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 text-sm">
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <div className="text-xs text-muted-foreground">Payment Status</div>
              <div className="font-medium">{formatStatus(order.paymentStatus)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last Updated</div>
              <div className="font-medium">{formatDate(order.updatedAt)}</div>
            </div>
          </div>
          
          {order.shippingAddress && (
            <div className="mt-3">
              <div className="text-xs text-muted-foreground">Shipping Address</div>
              <div className="font-medium mt-1 line-clamp-2">{order.shippingAddress}</div>
            </div>
          )}
          
          {order.status === 'pending' && (
            <div className="mt-3 p-2 bg-yellow-50 text-yellow-800 rounded-md text-xs">
              This order is awaiting confirmation. {isFarmer ? "Please confirm or cancel soon." : "The farmer will confirm your order soon."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
