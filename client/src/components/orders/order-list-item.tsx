import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface OrderListItemProps {
  order: any;
  userType?: string;
}

export default function OrderListItem({ order, userType }: OrderListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFarmer = userType === 'farmer';
  const isBuyer = userType === 'buyer';
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 bg-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Order #{order.id}</h3>
              <Badge className={getStatusColor(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-semibold">{formatCurrency(order.totalAmount || 0)}</div>
              <div className="text-xs text-muted-foreground">
                {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-2"
              >
                {isExpanded ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </Button>
              
              <Link href={`/orders/${order.id}`}>
                <Button size="sm">View Details</Button>
              </Link>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <Separator />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium">{getStatusLabel(order.status)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Payment</div>
                <div className="font-medium">
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">
                  {isFarmer ? 'Buyer' : 'Seller'}
                </div>
                <div className="font-medium">
                  {isFarmer ? `Buyer #${order.buyerId}` : `Farmer #${order.farmerId}`}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Last Updated</div>
                <div className="font-medium">{formatDate(order.updatedAt)}</div>
              </div>
            </div>
            
            {order.shippingAddress && (
              <div className="text-sm">
                <div className="text-muted-foreground">Shipping Address</div>
                <div className="font-medium">{order.shippingAddress}</div>
              </div>
            )}
            
            {order.deliveryNotes && (
              <div className="text-sm">
                <div className="text-muted-foreground">Delivery Notes</div>
                <div className="font-medium">{order.deliveryNotes}</div>
              </div>
            )}
            
            {order.items && order.items.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Order Items</div>
                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm bg-muted/50 p-2 rounded">
                      <div>
                        {item.productName || `Product #${item.productId}`} ({item.quantity} {item.unit})
                      </div>
                      <div className="font-medium">
                        {formatCurrency(item.pricePerUnit)} × {item.quantity} = {formatCurrency(item.total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}