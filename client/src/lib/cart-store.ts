import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define cart item type
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  farmerId: number;
  farmerName: string;
  imageUrl?: string;
}

// Define cart store interface
interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  getItemQuantity: (productId: number) => number;
  clearCart: () => void;
}

// Create the cart store with persistence
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to cart or update quantity if it already exists
      addToCart: (item: CartItem) => {
        const { items } = get();
        const existingItem = items.find(i => i.productId === item.productId);
        
        if (existingItem) {
          set({
            items: items.map(i => 
              i.productId === item.productId 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      
      // Remove item from cart
      removeFromCart: (productId: number) => {
        const { items } = get();
        set({ items: items.filter(i => i.productId !== productId) });
      },
      
      // Update item quantity
      updateQuantity: (productId: number, quantity: number) => {
        const { items } = get();
        set({
          items: items.map(i => 
            i.productId === productId 
              ? { ...i, quantity }
              : i
          )
        });
      },
      
      // Get quantity of item in cart
      getItemQuantity: (productId: number) => {
        const { items } = get();
        const item = items.find(i => i.productId === productId);
        return item ? item.quantity : 0;
      },
      
      // Clear the cart
      clearCart: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'cart-storage', // name of the local storage key
    }
  )
);