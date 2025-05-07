import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { InsertCartItem, CartItem, Product } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type CartContextType = {
  cartItems: (CartItem & { product: Product })[];
  isLoading: boolean;
  error: Error | null;
  addToCartMutation: UseMutationResult<CartItem, Error, InsertCartItem>;
  updateCartItemMutation: UseMutationResult<CartItem, Error, { id: number; quantity: number }>;
  removeFromCartMutation: UseMutationResult<void, Error, number>;
  clearCartMutation: UseMutationResult<void, Error, void>;
  totalItems: number;
  subtotal: number;
};

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Check if user is logged in by making a request
  const {
    data: isAuthenticated = false,
    isLoading: authLoading
  } = useQuery<boolean>({
    queryKey: ['/api/auth/status'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/user');
        return res.status === 200;
      } catch (e) {
        return false;
      }
    }
  });

  const {
    data: cartItems = [],
    error,
    isLoading,
  } = useQuery<(CartItem & { product: Product })[], Error>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
    queryFn: async ({ signal }) => {
      if (!isAuthenticated) return [];
      try {
        const res = await fetch("/api/cart", { signal });
        if (!res.ok) {
          throw new Error("Failed to fetch cart items");
        }
        return await res.json();
      } catch (e) {
        console.error("Failed to fetch cart items:", e);
        return [];
      }
    }
  });

  const addToCartMutation = useMutation({
    mutationFn: async (item: InsertCartItem) => {
      const res = await apiRequest("POST", "/api/cart", item);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "The item has been added to your cart",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCartItemMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to clear cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading: isLoading || authLoading,
        error,
        addToCartMutation,
        updateCartItemMutation,
        removeFromCartMutation,
        clearCartMutation,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
