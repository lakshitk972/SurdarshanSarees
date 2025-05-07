import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  ClipboardList,
  BarChart3,
  ArrowRight,
  CircleDollarSign,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Product, CustomOrderRequest, Order } from "@shared/schema";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Fetch data for dashboard
  const { data: products = [], isLoading: isProductsLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });
  
  const { data: customOrders = [], isLoading: isCustomOrdersLoading } = useQuery<CustomOrderRequest[]>({
    queryKey: ["/api/admin/custom-orders"],
  });
  
  // Sample data for visualization
  const recentProducts = products.slice(0, 5);
  const recentCustomOrders = customOrders.slice(0, 5);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  if (isProductsLoading || isCustomOrdersLoading) {
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
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Surdharshan Sarees</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <h1 className="text-3xl font-playfair font-bold">Admin Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.name || user?.username}. Here's an overview of your store.
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">{products.length}</div>
                    <Package className="h-8 w-8 text-maroon opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">
                    New Custom Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">
                      {customOrders.filter(o => o.status === "new").length}
                    </div>
                    <ClipboardList className="h-8 w-8 text-maroon opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">
                    Out of Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">
                      {products.filter(p => !p.inStock).length}
                    </div>
                    <AlertCircle className="h-8 w-8 text-amber-500 opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">
                    Featured Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">
                      {products.filter(p => p.featured).length}
                    </div>
                    <BarChart3 className="h-8 w-8 text-maroon opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Button asChild className="bg-maroon hover:bg-maroon-dark text-white h-auto py-6">
                <Link href="/admin/products/add">
                  <div className="flex flex-col items-center text-center">
                    <Package className="h-8 w-8 mb-2" />
                    <span className="text-lg font-medium">Add New Product</span>
                    <span className="text-xs opacity-80 mt-1">Create a new product listing</span>
                  </div>
                </Link>
              </Button>
              
              <Button asChild className="bg-maroon hover:bg-maroon-dark text-white h-auto py-6">
                <Link href="/admin/products">
                  <div className="flex flex-col items-center text-center">
                    <CircleDollarSign className="h-8 w-8 mb-2" />
                    <span className="text-lg font-medium">Manage Products</span>
                    <span className="text-xs opacity-80 mt-1">Update or delete product listings</span>
                  </div>
                </Link>
              </Button>
              
              <Button asChild className="bg-maroon hover:bg-maroon-dark text-white h-auto py-6">
                <Link href="/admin/custom-orders">
                  <div className="flex flex-col items-center text-center">
                    <ClipboardList className="h-8 w-8 mb-2" />
                    <span className="text-lg font-medium">Custom Orders</span>
                    <span className="text-xs opacity-80 mt-1">View and manage custom order requests</span>
                  </div>
                </Link>
              </Button>
            </div>
            
            {/* Recent Activity */}
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="products">Recent Products</TabsTrigger>
                <TabsTrigger value="custom-orders">Custom Order Requests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <CardTitle>Recently Added Products</CardTitle>
                    <CardDescription>
                      The {recentProducts.length} most recently added products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentProducts.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No products added yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {recentProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="flex items-center">
                              {product.imageUrls && product.imageUrls.length > 0 ? (
                                <div className="w-12 h-12 rounded-md overflow-hidden bg-offwhite mr-4">
                                  <img 
                                    src={product.imageUrls[0]} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center mr-4">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {formatPrice(product.price)} • {product.inStock ? "In Stock" : "Out of Stock"}
                                </p>
                              </div>
                            </div>
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <a className="text-maroon hover:text-maroon-dark flex items-center text-sm">
                                Edit <ArrowRight className="ml-1 h-4 w-4" />
                              </a>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4 text-center">
                      <Button asChild variant="outline">
                        <Link href="/admin/products">View All Products</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="custom-orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Custom Order Requests</CardTitle>
                    <CardDescription>
                      The {recentCustomOrders.length} most recent custom order requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentCustomOrders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No custom order requests yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {recentCustomOrders.map((order) => (
                          <div key={order.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{order.name}</h3>
                              <span className={`text-xs px-2.5 py-0.5 rounded-full ${
                                order.status === "new" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : order.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {order.email} • {order.phone || "No phone"}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {order.requirements}
                            </p>
                            {order.budget && (
                              <p className="text-sm text-maroon mt-1">
                                Budget: {formatPrice(order.budget)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4 text-center">
                      <Button asChild variant="outline">
                        <Link href="/admin/custom-orders">View All Custom Orders</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
