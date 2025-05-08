import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilter } from "@/components/products/product-filter";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Product, Category } from "@shared/schema";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ProductsPage() {
  const [location, params] = useLocation();
  const categorySlug = params?.category;
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("search") || "";
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: categorySlug || "",
    minPrice: 5000,
    maxPrice: 50000,
    search: searchQuery,
  });
  
  // Update active filters when URL params change
  useEffect(() => {
    setActiveFilters(prev => ({
      ...prev,
      category: categorySlug || "",
      search: searchQuery,
    }));
  }, [categorySlug, searchQuery]);
  
  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Build query string for products
  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    if (activeFilters.category) {
      params.append("category", activeFilters.category);
    }
    
    if (activeFilters.minPrice && activeFilters.minPrice !== 5000) {
      params.append("minPrice", activeFilters.minPrice.toString());
    }
    
    if (activeFilters.maxPrice && activeFilters.maxPrice !== 50000) {
      params.append("maxPrice", activeFilters.maxPrice.toString());
    }
    
    if (activeFilters.search) {
      params.append("search", activeFilters.search);
    }
    
    return params.toString();
  };
  
  // Fetch products based on filters
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ['/api/products', buildQueryString()],
  });
  
  // Get current category name
  const currentCategory = categories.find(cat => cat.slug === categorySlug);
  
  // Handle filter changes
  const handleFilterChange = (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setActiveFilters(prev => ({
      ...prev,
      ...filters,
    }));
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setActiveFilters({
      category: "",
      minPrice: 5000,
      maxPrice: 50000,
      search: "",
    });
    
    // Reset URL to products without category
    if (categorySlug) {
      window.location.href = "/products";
    }
  };
  
  // Build page title and breadcrumbs
  const pageTitle = currentCategory 
    ? `${currentCategory.name} | Surdharshan Sarees` 
    : activeFilters.search
      ? `Search: ${activeFilters.search} | Surdharshan Sarees`
      : "All Products | Surdharshan Sarees";
  
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    ...(currentCategory ? [{ label: currentCategory.name }] : []),
    ...(activeFilters.search && !currentCategory ? [{ label: `Search: ${activeFilters.search}` }] : []),
  ];
  
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta 
          name="description" 
          content={
            currentCategory
              ? `Explore our collection of ${currentCategory.name.toLowerCase()}. Handcrafted with premium materials and exquisite craftsmanship.`
              : "Browse our luxury collection of sarees, lehengas, and fabrics. Handcrafted excellence for every occasion."
          } 
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
              
              <div className="flex justify-between items-center mt-4">
                <h1 className="text-3xl font-playfair font-bold">
                  {currentCategory ? currentCategory.name : activeFilters.search ? `Search: ${activeFilters.search}` : "All Products"}
                </h1>
                
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                    <div className="h-full py-6 pr-6">
                      <ProductFilter
                        selectedCategory={activeFilters.category}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              {(activeFilters.category || 
                activeFilters.minPrice !== 5000 || 
                activeFilters.maxPrice !== 50000 || 
                activeFilters.search) && (
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500 mr-2">Active filters:</span>
                  {activeFilters.category && (
                    <span className="inline-flex items-center bg-maroon/10 text-maroon text-xs rounded-full px-3 py-1 mr-2">
                      Category: {categories.find(c => c.slug === activeFilters.category)?.name || activeFilters.category}
                      <button
                        onClick={() => handleFilterChange({ category: "" })}
                        className="ml-1 text-maroon hover:text-maroon-dark"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {(activeFilters.minPrice !== 5000 || activeFilters.maxPrice !== 50000) && (
                    <span className="inline-flex items-center bg-maroon/10 text-maroon text-xs rounded-full px-3 py-1 mr-2">
                      Price: ₹{activeFilters.minPrice.toLocaleString()} - ₹{activeFilters.maxPrice.toLocaleString()}
                      <button
                        onClick={() => handleFilterChange({ minPrice: 5000, maxPrice: 50000 })}
                        className="ml-1 text-maroon hover:text-maroon-dark"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {activeFilters.search && (
                    <span className="inline-flex items-center bg-maroon/10 text-maroon text-xs rounded-full px-3 py-1 mr-2">
                      Search: {activeFilters.search}
                      <button
                        onClick={() => {
                          setActiveFilters(prev => ({ ...prev, search: "" }));
                          window.location.href = categorySlug ? `/products/${categorySlug}` : "/products";
                        }}
                        className="ml-1 text-maroon hover:text-maroon-dark"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-gray-500 hover:text-maroon underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
              {/* Desktop Filters Sidebar */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <ProductFilter
                    selectedCategory={activeFilters.category}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                  />
                </div>
              </div>
              
              {/* Products Grid */}
              <div>
                {isError ? (
                  <div className="flex flex-col items-center justify-center h-64 bg-white rounded-md p-6">
                    <p className="text-red-500 mb-4">Failed to load products</p>
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <ProductGrid products={products} isLoading={isLoading} />
                )}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
