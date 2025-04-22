import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
import { TrashIcon, AlertTriangleIcon, MinusIcon, PlusIcon } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/cart-store";

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  availabilityIssue?: any;
}

export default function CartItem({ 
  item, 
  onRemove, 
  onUpdateQuantity, 
  availabilityIssue 
}: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  
  // Update local quantity when item updates
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);
  
  // Handle quantity input changes
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
      onUpdateQuantity(value);
    }
  };
  
  // Increment/decrement quantity
  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onUpdateQuantity(newQuantity);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(newQuantity);
    }
  };
  
  // Calculate item total
  const total = item.price * quantity;
  
  return (
    <div className="border rounded-md p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 flex-shrink-0">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover rounded" 
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 rounded flex items-center justify-center text-neutral-400">
              No image
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/product/${item.productId}`}>
                <h3 className="font-medium hover:text-primary cursor-pointer">{item.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Sold by {item.farmerName}
              </p>
              <p className="text-sm font-medium text-primary mt-1">
                {formatCurrency(item.price)}/{item.unit}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-muted-foreground"
              onClick={onRemove}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Availability Issue Warning */}
          {availabilityIssue && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-2 mt-2 text-amber-700 text-xs flex items-start">
              <AlertTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{availabilityIssue.issue}</span>
            </div>
          )}
          
          {/* Quantity Control */}
          <div className="flex items-center mt-4">
            <div className="text-sm text-muted-foreground mr-4">Quantity:</div>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 h-8 mx-2 text-center"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={incrementQuantity}
                disabled={availabilityIssue?.availableQuantity !== undefined && quantity >= availabilityIssue.availableQuantity}
              >
                <PlusIcon className="h-3 w-3" />
              </Button>
              <span className="ml-2 text-sm">{item.unit}</span>
            </div>
            
            <div className="ml-auto font-medium">
              {formatCurrency(total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}