import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useParams } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductDetails } from "@/components/products/product-details";
import { CustomerReviews } from "@/components/products/customer-reviews";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Product, Category } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function ProductDetailPage() {
  const { slug } = useParams();
  
  // Fetch product by slug
  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
    enabled: !!slug,
  });
  
  // Fetch categories for breadcrumbs
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Find product category
  const productCategory = product && categories.find(cat => cat.id === product.categoryId);
  
  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    ...(productCategory ? [{ label: productCategory.name, href: `/products/${productCategory.slug}` }] : []),
    ...(product ? [{ label: product.name }] : []),
  ];
  
  if (isProductLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-maroon mb-4" />
              <p className="text-gray-500">Loading product details...</p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  if (isProductError || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h1 className="text-2xl font-playfair font-bold mb-4">Product Not Found</h1>
              <p className="text-gray-500 mb-6">
                The product you are looking for does not exist or has been removed.
              </p>
              <Button asChild className="bg-maroon hover:bg-maroon-dark text-white">
                <a href="/products">Return to Products</a>
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
        <title>{`${product.name} | Surdharshan Sarees`}</title>
        <meta name="description" content={product.description || `Explore our ${product.name}. Handcrafted with premium materials and exquisite artisanship.`} />
        <meta property="og:title" content={`${product.name} | Surdharshan Sarees`} />
        <meta property="og:description" content={product.description || `Explore our ${product.name}. Handcrafted with premium materials and exquisite artisanship.`} />
        <meta property="og:image" content={product.imageUrls[0]} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="INR" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            
            <ProductDetails product={product} />
            
            {/* Customer Reviews */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <CustomerReviews productId={product.id} />
            </div>
            
            {/* Similar Products section can be added here */}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
