import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  RefreshCcw, 
  ShieldCheck,
  Maximize
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ImagePreviewModal } from "./image-preview-modal";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [previewOpen, setPreviewOpen] = useState(false);
  
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
      quantity,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`,
    });
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const nextImage = () => {
    if (!product.imageUrls || product.imageUrls.length <= 1) return;
    setCurrentImage((prev) => 
      prev === product.imageUrls.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    if (!product.imageUrls || product.imageUrls.length <= 1) return;
    setCurrentImage((prev) => 
      prev === 0 ? product.imageUrls.length - 1 : prev - 1
    );
  };
  
  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative overflow-hidden bg-offwhite rounded-md h-[500px]">
          <div 
            className="w-full h-full cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
            onMouseMove={handleZoom}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <div 
                  className="w-full h-full bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${product.imageUrls?.[currentImage] || ''})`,
                    backgroundSize: isZoomed ? "150%" : "contain",
                    backgroundPosition: isZoomed 
                      ? `${zoomPosition.x}% ${zoomPosition.y}%` 
                      : "center",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Full-screen preview button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewOpen(true);
            }}
            className="absolute top-4 right-4 z-10 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-charcoal p-2 rounded-full"
            aria-label="View full screen"
          >
            <Maximize className="h-5 w-5" />
          </button>
          
          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-charcoal p-2 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-charcoal p-2 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Thumbnails */}
        {product.imageUrls && product.imageUrls.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto">
            {product.imageUrls.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                  currentImage === index ? "border-maroon" : "border-transparent"
                }`}
              >
                <img 
                  src={imageUrl} 
                  alt={`${product.name} - view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
        
        {/* Image Preview Modal */}
        {product.imageUrls && (
          <ImagePreviewModal
            images={product.imageUrls}
            initialIndex={currentImage}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
          />
        )}
      </div>
      
      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-charcoal mb-2">
            {product.name}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-2xl text-maroon font-semibold">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-4 h-4 text-gold fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 ml-2">(18 reviews)</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4">
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
        
        {/* Product Details */}
        <div className="space-y-4">
          {product.fabric && (
            <div className="flex">
              <span className="w-1/3 text-gray-700 font-medium">Fabric:</span>
              <span className="w-2/3 text-gray-600">{product.fabric}</span>
            </div>
          )}
          
          {product.workDetails && (
            <div className="flex">
              <span className="w-1/3 text-gray-700 font-medium">Work Details:</span>
              <span className="w-2/3 text-gray-600">{product.workDetails}</span>
            </div>
          )}
          
          <div className="flex">
            <span className="w-1/3 text-gray-700 font-medium">Availability:</span>
            <span className={`w-2/3 ${product.inStock ? "text-emerald" : "text-red-500"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
        
        {/* Quantity Selector */}
        <div className="mt-6 space-y-2">
          <p className="text-gray-700 font-medium">Quantity:</p>
          <div className="flex h-10 w-32">
            <button
              onClick={decrementQuantity}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              -
            </button>
            <div className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300">
              {quantity}
            </div>
            <button
              onClick={incrementQuantity}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || addToCartMutation.isPending}
            className="w-full sm:w-2/3 bg-maroon hover:bg-maroon-dark text-white px-6 py-3 rounded-sm transition-colors"
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
          <Button
            onClick={handleAddToWishlist}
            variant="outline"
            className="w-full sm:w-1/3 border-maroon text-maroon hover:bg-maroon hover:text-white rounded-sm transition-colors"
          >
            <Heart className="mr-2 h-4 w-4" /> Wishlist
          </Button>
        </div>
        
        {/* Product benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center p-4 bg-offwhite rounded-md">
            <Truck className="h-6 w-6 text-maroon mb-2" />
            <h4 className="font-medium text-sm">Free Shipping</h4>
            <p className="text-xs text-gray-500">On orders above ₹10,000</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-offwhite rounded-md">
            <RefreshCcw className="h-6 w-6 text-maroon mb-2" />
            <h4 className="font-medium text-sm">Easy Returns</h4>
            <p className="text-xs text-gray-500">7 days return policy</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-offwhite rounded-md">
            <ShieldCheck className="h-6 w-6 text-maroon mb-2" />
            <h4 className="font-medium text-sm">Quality Guarantee</h4>
            <p className="text-xs text-gray-500">Authentic handcrafted products</p>
          </div>
        </div>
        
        {/* Custom Order CTA */}
        <div className="mt-8 p-4 bg-gold/10 border border-gold/20 rounded-md">
          <p className="text-sm text-gray-700 mb-2">
            Looking for customizations or something special?
          </p>
          <Link href="/custom-order">
            <a className="text-maroon hover:underline font-medium text-sm">
              Request a custom order →
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
