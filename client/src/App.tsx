import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./hooks/use-cart";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductsPage from "@/pages/products-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import CustomOrderPage from "@/pages/custom-order-page";
import { ProtectedRoute, AdminRoute } from "./lib/protected-route";
import DashboardPage from "@/pages/admin/dashboard-page";
import ManageProductsPage from "@/pages/admin/manage-products-page";
import AddProductPage from "@/pages/admin/add-product-page";
import EditProductPage from "@/pages/admin/edit-product-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:category" component={ProductsPage} />
      <Route path="/product/:slug" component={ProductDetailPage} />
      <ProtectedRoute path="/cart" component={CartPage} />
      <Route path="/custom-order" component={CustomOrderPage} />
      
      {/* Admin Routes */}
      <AdminRoute path="/admin" component={DashboardPage} />
      <AdminRoute path="/admin/products" component={ManageProductsPage} />
      <AdminRoute path="/admin/products/add" component={AddProductPage} />
      <AdminRoute path="/admin/products/edit/:id" component={EditProductPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
