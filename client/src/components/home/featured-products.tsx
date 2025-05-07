import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProducts() {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4;
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products?featured=true"],
  });
  
  const totalPages = Math.ceil(products.length / productsPerPage);
  
  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };
  
  const displayedProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-playfair font-bold">Exquisite Collection</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`flex items-center justify-center w-10 h-10 rounded-full border ${
                currentPage === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 hover:border-maroon text-maroon transition-colors"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full border ${
                currentPage >= totalPages - 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 hover:border-maroon text-maroon transition-colors"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-6 w-2/3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-5 w-1/3" />
                    </div>
                  </div>
                ))
            : displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
        
        <div className="text-center mt-10">
          <Button
            asChild
            className="border-2 border-maroon text-maroon hover:bg-maroon hover:text-white px-8 py-3 font-medium transition-colors"
            variant="outline"
          >
            <Link href="/products">View All Collections</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
