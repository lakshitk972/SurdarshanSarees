import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartItemCard } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  Loader2
} from "lucide-react";

export default function CartPage() {
  const [, navigate] = useLocation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cartItems, isLoading, totalItems, clearCartMutation } = useCart();
  
  const handleCheckout = () => {
    // Simulating checkout process
    setIsCheckingOut(true);
    setTimeout(() => {
      clearCartMutation.mutate();
      navigate("/checkout-success");
    }, 2000);
  };
  
  return (
    <>
      <Helmet>
        <title>Shopping Cart | Surdharshan Sarees</title>
        <meta name="description" content="Review and manage items in your shopping cart. Proceed to checkout to complete your purchase." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-playfair font-bold mb-6">Shopping Cart</h1>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-maroon mb-4" />
                <p className="text-gray-500">Loading your cart...</p>
              </div>
            ) : totalItems === 0 ? (
              <div className="bg-white rounded-md shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <ShoppingBag className="h-16 w-16 text-gray-400" />
                </div>
                <h2 className="text-2xl font-playfair font-medium mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button asChild className="bg-maroon hover:bg-maroon-dark text-white">
                  <Link href="/products">
                    Browse Products <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-md shadow-md p-6">
                    <div className="mb-4 flex justify-between items-center">
                      <h2 className="text-xl font-playfair font-semibold">
                        Cart Items ({totalItems})
                      </h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => clearCartMutation.mutate()}
                        disabled={clearCartMutation.isPending}
                        className="text-gray-500 hover:text-red-500 hover:bg-transparent"
                      >
                        {clearCartMutation.isPending ? "Clearing..." : "Clear Cart"}
                      </Button>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <CartItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Frequently bought together or recommended products can be added here */}
                </div>
                
                <div className="lg:col-span-1">
                  <CartSummary onCheckout={handleCheckout} />
                  
                  <div className="mt-6 bg-white rounded-md shadow-md p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-gold mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        This is a demo application. No real transactions will be processed. In a production environment, this would connect to a secure payment gateway.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Checkout overlay */}
            {isCheckingOut && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-md p-8 max-w-md w-full text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-maroon mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Processing Your Order</h2>
                  <p className="text-gray-600">
                    Please wait while we process your payment and confirm your order...
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
