import { Product } from "@shared/schema";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8)
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
          ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
