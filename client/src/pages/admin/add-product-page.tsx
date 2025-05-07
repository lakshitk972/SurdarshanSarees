import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertProduct } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductForm } from "@/components/admin/product-form";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

export default function AddProductPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin" },
    { label: "Products", href: "/admin/products" },
    { label: "Add New Product" },
  ];
  
  const createProductMutation = useMutation({
    mutationFn: async (productData: InsertProduct) => {
      const res = await apiRequest("POST", "/api/admin/products", productData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "Product created",
        description: "The product has been created successfully",
      });
      navigate("/admin/products");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (data: InsertProduct) => {
    createProductMutation.mutate(data);
  };
  
  return (
    <>
      <Helmet>
        <title>Add New Product | Admin | Surdharshan Sarees</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
              
              <h1 className="text-3xl font-playfair font-bold mt-4">Add New Product</h1>
            </div>
            
            <div className="bg-white rounded-md shadow-md p-6">
              <ProductForm 
                onSubmit={handleSubmit} 
                isSubmitting={createProductMutation.isPending} 
              />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
