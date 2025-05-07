import { useRef, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartSummaryProps {
  onCheckout?: () => void;
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const promoInputRef = useRef<HTMLInputElement>(null);
  
  const { cartItems, subtotal } = useCart();
  
  const shippingCost = subtotal >= 10000 ? 0 : 250;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shippingCost - discount;
  
  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true);
    }
  };
  
  const togglePromoSection = () => {
    setIsPromoOpen(!isPromoOpen);
    if (!isPromoOpen && promoInputRef.current) {
      setTimeout(() => {
        promoInputRef.current?.focus();
      }, 100);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <div className="bg-offwhite rounded-md p-6">
      <h2 className="text-xl font-playfair font-semibold mb-6">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
          </span>
        </div>
        
        {promoApplied && (
          <div className="flex justify-between text-emerald">
            <span>Discount (WELCOME10)</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-maroon">{formatPrice(total)}</span>
          </div>
          
          {subtotal >= 10000 && (
            <p className="text-xs text-emerald mt-1">
              You've qualified for free shipping!
            </p>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <button 
          onClick={togglePromoSection}
          className="flex items-center text-gray-700 hover:text-maroon text-sm w-full"
        >
          {isPromoOpen ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
          {promoApplied ? "Promo code applied" : "Apply promo code"}
        </button>
        
        <AnimatePresence>
          {isPromoOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 flex">
                <input
                  ref={promoInputRef}
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-sm focus:outline-none focus:border-maroon"
                />
                <Button
                  onClick={handleApplyPromo}
                  disabled={!promoCode || promoApplied}
                  className="rounded-l-none bg-maroon hover:bg-maroon-dark text-white"
                >
                  Apply
                </Button>
              </div>
              {promoApplied && (
                <p className="text-xs text-emerald mt-1">
                  Promo code "WELCOME10" successfully applied!
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Button
        onClick={onCheckout}
        className="w-full bg-maroon hover:bg-maroon-dark text-white py-6 rounded-sm"
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        Proceed to Checkout
      </Button>
      
      <div className="mt-6 text-center">
        <Link href="/products">
          <a className="text-sm text-gray-600 hover:text-maroon">
            Continue Shopping
          </a>
        </Link>
      </div>
    </div>
  );
}
