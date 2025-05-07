import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCartMutation } = useCart();

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div 
        className="product-card group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden mb-4 bg-offwhite rounded-md h-80">
          <img 
            src={product.imageUrls?.[0] || '/placeholder-image.jpg'} 
            alt={product.name} 
            className="product-image w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 m-4 space-y-2">
            <Button 
              size="icon"
              variant="ghost"
              onClick={handleAddToWishlist}
              className="flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md hover:bg-maroon hover:text-white transition-colors"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button 
              size="icon"
              variant="ghost"
              onClick={handleAddToCart}
              className="flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md hover:bg-maroon hover:text-white transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
          >
            <Button 
              onClick={() => setIsQuickViewOpen(true)}
              className="w-full bg-maroon hover:bg-maroon-dark text-white py-2 rounded-sm transition-colors"
            >
              Quick View
            </Button>
          </motion.div>
        </div>
        <div>
          <Link href={`/product/${product.slug}`} className="font-playfair text-lg font-medium hover:text-maroon transition-colors">
            {product.name}
          </Link>
          <div className="flex justify-between items-center mt-2">
            <p className="font-montserrat text-maroon font-semibold">
              {formatPrice(product.price)}
            </p>
            <div className="flex text-gold">
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="text-gray-500 text-xs ml-1">(24)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair">{product.name}</DialogTitle>
            <DialogDescription className="text-maroon font-semibold">
              {formatPrice(product.price)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="overflow-hidden rounded-md">
              <img
                src={product.imageUrls?.[0] || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Description</h4>
                <p className="text-gray-600">{product.description}</p>
              </div>
              {product.fabric && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Fabric</h4>
                  <p className="text-gray-600">{product.fabric}</p>
                </div>
              )}
              {product.workDetails && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Work Details</h4>
                  <p className="text-gray-600">{product.workDetails}</p>
                </div>
              )}
              <div className="pt-4 flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="w-1/2 bg-maroon hover:bg-maroon-dark text-white"
                >
                  Add to Cart
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-1/2 border-maroon text-maroon hover:bg-maroon hover:text-white"
                >
                  <Link href={`/product/${product.slug}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
