import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { EditIcon, AlertCircleIcon } from "lucide-react";

interface ProductCardProps {
  product: any;
  showFull?: boolean;
}

export default function ProductCard({ product, showFull = false }: ProductCardProps) {
  const isLowStock = product.availableQuantity < product.minOrderQuantity * 2;

  return (
    <div className="rounded-md border p-3 hover:bg-neutral-50 transition-colors">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium">{formatCurrency(product.price)}/{product.unit}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              product.inStock 
                ? isLowStock
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {product.inStock 
                ? isLowStock
                  ? "Low Stock"
                  : "In Stock" 
                : "Out of Stock"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex space-x-1">
            <Link href={`/product/${product.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="View Product">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </Button>
            </Link>
            <Link href={`/profile?editProduct=${product.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit Product">
                <EditIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {showFull && (
            <div className="text-sm mt-2 text-muted-foreground">
              {product.availableQuantity} {product.unit} available
            </div>
          )}
        </div>
      </div>
      
      {showFull && (
        <>
          {product.description && (
            <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </div>
          )}
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="bg-neutral-100 p-2 rounded">
              <span className="block">Min. Order:</span>
              <span className="font-medium">{product.minOrderQuantity} {product.unit}</span>
            </div>
            <div className="bg-neutral-100 p-2 rounded">
              <span className="block">Category:</span>
              <span className="font-medium">{product.categoryId || "Uncategorized"}</span>
            </div>
          </div>
          
          {isLowStock && (
            <div className="mt-3 flex items-center gap-1 text-xs text-amber-600 bg-amber-50 p-2 rounded">
              <AlertCircleIcon className="h-3.5 w-3.5" />
              <span>Low stock alert! Consider adding more inventory.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
