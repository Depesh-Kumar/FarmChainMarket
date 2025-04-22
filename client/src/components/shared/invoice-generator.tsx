import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileTextIcon, DownloadIcon, PrinterIcon, XIcon } from "lucide-react";

interface InvoiceGeneratorProps {
  order: any;
  orderItems: any[];
  onClose: () => void;
}

export default function InvoiceGenerator({ order, orderItems, onClose }: InvoiceGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Calculate order totals
  const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.total, 0);
  const taxRate = 0.05; // 5% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  
  // Format invoice number
  const invoiceNumber = `INV-${order.id.toString().padStart(6, '0')}`;
  
  // Generate current date
  const currentDate = new Date().toLocaleDateString();
  
  // Handle download
  const handleDownload = () => {
    setIsGenerating(true);
    
    // In a real app, this would generate a PDF or call an API
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsGenerating(false);
      alert("Invoice download functionality would be implemented here.");
    }, 1500);
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Invoice #{invoiceNumber}
          </DialogTitle>
          <DialogDescription>
            Order placed on {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-white p-6 rounded-md space-y-6 print:p-0">
          {/* Invoice Header */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">FarmChain</h2>
              <p className="text-sm text-muted-foreground">Direct Farm to Business Marketplace</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Invoice #{invoiceNumber}</p>
              <p className="text-sm text-muted-foreground">Date: {currentDate}</p>
              <p className="text-sm text-muted-foreground">Order ID: #{order.id}</p>
            </div>
          </div>
          
          {/* Addresses */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">From</h3>
              <p className="font-medium">FarmChain</p>
              <p className="text-sm">123 Agriculture Way</p>
              <p className="text-sm">Farm County, FC 12345</p>
              <p className="text-sm">support@farmchain.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">To</h3>
              <p className="font-medium">Buyer #{order.buyerId}</p>
              {order.shippingAddress ? (
                <p className="text-sm">{order.shippingAddress}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No address provided</p>
              )}
            </div>
          </div>
          
          {/* Items Table */}
          <div>
            <h3 className="font-semibold mb-2">Items Purchased</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 font-medium">Item</th>
                    <th className="text-right p-2 font-medium">Unit Price</th>
                    <th className="text-right p-2 font-medium">Quantity</th>
                    <th className="text-right p-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">
                        <div className="font-medium">{item.productName || `Product #${item.productId}`}</div>
                      </td>
                      <td className="p-2 text-right">{formatCurrency(item.pricePerUnit)}</td>
                      <td className="p-2 text-right">{item.quantity} {item.unit}</td>
                      <td className="p-2 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tax (5%):</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t mt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Payment Status:</span>
                <span className="font-medium">{order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="text-sm text-muted-foreground border-t pt-4">
            <p className="mb-1"><strong>Note:</strong> Thank you for your business with FarmChain!</p>
            <p>For any questions or concerns regarding this order, please contact support@farmchain.com</p>
          </div>
        </div>
        
        <DialogFooter>
          <div className="flex items-center gap-2 w-full">
            <Button variant="outline" onClick={onClose} className="gap-1">
              <XIcon className="h-4 w-4" />
              Close
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="ml-auto gap-1"
            >
              <PrinterIcon className="h-4 w-4" />
              Print
            </Button>
            <Button 
              onClick={handleDownload} 
              disabled={isGenerating}
              className="gap-1"
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <DownloadIcon className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}