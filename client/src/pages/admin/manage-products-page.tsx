import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductList } from "@/components/admin/product-list";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

export default function ManageProductsPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin" },
    { label: "Manage Products" },
  ];
  
  return (
    <>
      <Helmet>
        <title>Manage Products | Admin | Surdharshan Sarees</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
              
              <div className="mt-4 flex justify-between items-center">
                <h1 className="text-3xl font-playfair font-bold">Manage Products</h1>
              </div>
            </div>
            
            <ProductList />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
