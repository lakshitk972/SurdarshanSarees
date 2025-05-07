import { Helmet } from "react-helmet";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Product, InsertProduct } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductForm } from "@/components/admin/product-form";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: [`/api/admin/products/${id}`],
    queryFn: async () => {
      // Since we don't have a direct endpoint to fetch a single product by ID,
      // we'll fetch all products and find the one we need
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const products: Product[] = await res.json();
      const product = products.find(p => p.id === parseInt(id!));
      if (!product) throw new Error("Product not found");
      return product;
    },
    enabled: !!id,
  });
  
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin" },
    { label: "Products", href: "/admin/products" },
    { label: "Edit Product" },
  ];
  
  const updateProductMutation = useMutation({
    mutationFn: async (productData: InsertProduct) => {
      const res = await apiRequest("PUT", `/api/admin/products/${id}`, productData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      });
      navigate("/admin/products");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (data: InsertProduct) => {
    updateProductMutation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-maroon" />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  if (isError || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h1 className="text-2xl font-playfair font-bold mb-4">Product Not Found</h1>
              <p className="text-gray-500 mb-6">
                The product you are trying to edit does not exist or has been removed.
              </p>
              <Button asChild className="bg-maroon hover:bg-maroon-dark text-white">
                <a href="/admin/products">Return to Products</a>
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Edit Product | Admin | Surdharshan Sarees</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
              
              <div className="flex items-center mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/admin/products")}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <h1 className="text-3xl font-playfair font-bold">Edit Product</h1>
              </div>
              <p className="text-gray-600 mt-1">
                Editing: {product.name}
              </p>
            </div>
            
            <div className="bg-white rounded-md shadow-md p-6">
              <ProductForm 
                product={product}
                onSubmit={handleSubmit} 
                isSubmitting={updateProductMutation.isPending} 
              />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
