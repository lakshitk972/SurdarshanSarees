import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CustomOrderForm } from "@/components/forms/custom-order-form";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Scissors, FlagTriangleLeft, Ruler, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomOrderPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Custom Order" },
  ];
  
  return (
    <>
      <Helmet>
        <title>Custom Order | Surdharshan Sarees</title>
        <meta 
          name="description" 
          content="Request a custom-designed saree, lehenga, or ethnic wear tailored to your preferences. Our master craftsmen will bring your vision to life."
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-playfair font-bold mb-4">Custom Order Request</h1>
                <p className="text-gray-600 mb-6">
                  Looking for something unique? Our skilled artisans can create bespoke sarees, lehengas, and other ethnic wear tailored specifically to your requirements.
                </p>
                
                <div className="bg-white rounded-md shadow-md p-6 mb-6">
                  <h2 className="text-xl font-playfair font-semibold mb-4">How It Works</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-maroon/10 p-3 rounded-full mr-4">
                        <FlagTriangleLeft className="h-5 w-5 text-maroon" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">1. Submit Your Request</h3>
                        <p className="text-sm text-gray-600">
                          Fill out the form with your design ideas, fabric preferences, and budget.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-maroon/10 p-3 rounded-full mr-4">
                        <Ruler className="h-5 w-5 text-maroon" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">2. Consultation</h3>
                        <p className="text-sm text-gray-600">
                          Our design team will contact you to discuss details, measurements, and provide initial sketches.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-maroon/10 p-3 rounded-full mr-4">
                        <Scissors className="h-5 w-5 text-maroon" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">3. Crafting Process</h3>
                        <p className="text-sm text-gray-600">
                          Once design and materials are approved, our master craftsmen begin the creation process.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-maroon/10 p-3 rounded-full mr-4">
                        <Package className="h-5 w-5 text-maroon" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">4. Delivery</h3>
                        <p className="text-sm text-gray-600">
                          Your custom creation is carefully packaged and delivered to your doorstep.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-maroon/5 border border-maroon/20 rounded-md p-4">
                  <h3 className="text-maroon font-medium mb-2">Note</h3>
                  <p className="text-sm text-gray-700">
                    Custom orders typically take 4-6 weeks to complete depending on complexity and current order volume. A 50% advance payment is required to begin the crafting process.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-md shadow-md p-8"
              >
                <h2 className="text-2xl font-playfair font-semibold mb-6">Request Form</h2>
                <CustomOrderForm />
              </motion.div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
