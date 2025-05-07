import { useState } from "react";
import { Link } from "wouter";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem, Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";

interface CartItemProps {
  item: CartItem & { product: Product };
}

export function CartItemCard({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const { updateCartItemMutation, removeFromCartMutation } = useCart();
  
  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setQuantity(newQuantity);
    updateCartItemMutation.mutate({
      id: item.id,
      quantity: newQuantity
    });
  };
  
  const handleRemoveItem = () => {
    removeFromCartMutation.mutate(item.id);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center py-6 border-b border-gray-200">
      <div className="flex-shrink-0 w-full md:w-24 h-24 bg-offwhite rounded-md overflow-hidden mb-4 md:mb-0 md:mr-6">
        <Link href={`/product/${item.product.slug}`}>
          <a>
            <img 
              src={item.product.imageUrls[0]} 
              alt={item.product.name} 
              className="w-full h-full object-cover"
            />
          </a>
        </Link>
      </div>
      
      <div className="flex-grow md:mr-6">
        <Link href={`/product/${item.product.slug}`}>
          <a className="text-lg font-medium text-charcoal hover:text-maroon transition-colors">
            {item.product.name}
          </a>
        </Link>
        
        {item.product.fabric && (
          <p className="text-sm text-gray-500 mt-1">
            Fabric: {item.product.fabric}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-6 mt-4 md:mt-0">
        <div className="flex items-center h-9">
          <button
            onClick={() => handleUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1 || updateCartItemMutation.isPending}
            className="w-9 h-9 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            -
          </button>
          <div className="w-10 h-9 flex items-center justify-center border-t border-b border-gray-300">
            {updateCartItemMutation.isPending ? (
              <div className="h-4 w-4 border-2 border-maroon border-t-transparent rounded-full animate-spin"></div>
            ) : (
              quantity
            )}
          </div>
          <button
            onClick={() => handleUpdateQuantity(quantity + 1)}
            disabled={updateCartItemMutation.isPending}
            className="w-9 h-9 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            +
          </button>
        </div>
        
        <div className="w-24 text-right">
          <p className="font-semibold text-maroon">
            {formatPrice(item.product.price)}
          </p>
          <p className="text-sm text-gray-500">
            {formatPrice(item.product.price * quantity)}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemoveItem}
          disabled={removeFromCartMutation.isPending}
          className="text-gray-400 hover:text-red-500 hover:bg-transparent"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
