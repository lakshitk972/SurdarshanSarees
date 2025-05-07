import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Phone,
  Mail
} from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logoutMutation } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        {/* Top bar */}
        <div className="hidden md:flex justify-between items-center py-2 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <a href="tel:+919876543210" className="text-sm text-gray-600 hover:text-maroon flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gold" />
              +91 98765 43210
            </a>
            <a href="mailto:contact@surdharshansilks.com" className="text-sm text-gray-600 hover:text-maroon flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gold" />
              contact@surdharshansilks.com
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-maroon">Track Order</a>
            <a href="#" className="text-sm text-gray-600 hover:text-maroon">Store Locator</a>
            <a href="#" className="text-sm text-gray-600 hover:text-maroon">Customer Care</a>
          </div>
        </div>
        
        {/* Main header */}
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-maroon">
              Surdharshan<span className="text-gold">Sarees</span>
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link href="/" className={`header-nav-item ${location === '/' ? 'text-maroon' : ''}`}>
                Home
              </Link>
              <Link href="/products/silk-sarees" className={`header-nav-item ${location.includes('/products/silk-sarees') ? 'text-maroon' : ''}`}>
                Sarees
              </Link>
              <Link href="/products/designer-lehengas" className={`header-nav-item ${location.includes('/products/designer-lehengas') ? 'text-maroon' : ''}`}>
                Lehengas
              </Link>
              <Link href="/products/premium-fabrics" className={`header-nav-item ${location.includes('/products/premium-fabrics') ? 'text-maroon' : ''}`}>
                Fabrics
              </Link>
              <Link href="/custom-order" className={`header-nav-item ${location === '/custom-order' ? 'text-maroon' : ''}`}>
                Custom Order
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:border-gold"
                  autoFocus
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </form>
            ) : (
              <button 
                onClick={() => setSearchOpen(true)} 
                className="hidden md:flex text-charcoal hover:text-maroon"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
            
            <div className="flex items-center space-x-4">
              <Link href="/favorites" className="text-charcoal hover:text-maroon">
                <Heart className="h-5 w-5" />
              </Link>
              
              {user ? (
                <div className="relative group">
                  <button className="text-charcoal hover:text-maroon">
                    <User className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-medium">{user.name || user.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {user.isAdmin && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/auth" className="text-charcoal hover:text-maroon">
                  <User className="h-5 w-5" />
                </Link>
              )}
              
              <Link href="/cart" className="relative text-charcoal hover:text-maroon">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-maroon text-white text-xs rounded-full">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <Link href="/" className="mb-6">
                    <h1 className="text-2xl font-playfair font-bold text-maroon">
                      Surdharshan<span className="text-gold">Sarees</span>
                    </h1>
                  </Link>
                  
                  <form onSubmit={handleSearch} className="relative mb-6">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:border-gold"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </form>
                  
                  <nav className="flex flex-col space-y-4">
                    <Link href="/" className="text-lg font-medium">Home</Link>
                    <Link href="/products/silk-sarees" className="text-lg font-medium">Sarees</Link>
                    <Link href="/products/designer-lehengas" className="text-lg font-medium">Lehengas</Link>
                    <Link href="/products/premium-fabrics" className="text-lg font-medium">Fabrics</Link>
                    <Link href="/custom-order" className="text-lg font-medium">Custom Order</Link>
                  </nav>
                  
                  <div className="mt-auto pt-6 border-t border-gray-200">
                    {user ? (
                      <div className="space-y-4">
                        <p className="font-medium">Signed in as {user.username}</p>
                        {user.isAdmin && (
                          <Link href="/admin" className="block text-maroon">
                            Admin Dashboard
                          </Link>
                        )}
                        <Button 
                          onClick={handleLogout}
                          variant="outline"
                          className="w-full border-maroon text-maroon hover:bg-maroon hover:text-white"
                        >
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <Link href="/auth">
                        <Button className="w-full bg-maroon hover:bg-maroon-dark text-white">
                          Sign in
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
