import { useEffect } from "react";
import { useLocation, useNavigate } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  Settings,
  Users,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location] = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  // If still loading or not authenticated, show loading
  if (isLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Navigation items
  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Inventory",
      href: "/admin/inventory-management",
      icon: <Package className="h-5 w-5" />,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      label: "Custom Requests",
      href: "/admin/custom-requests",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 bg-offwhite">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar */}
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-xl font-playfair font-bold text-maroon mb-6">
                Admin Panel
              </h2>
              
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      location === item.href
                        ? "bg-maroon/10 text-maroon"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-2xl font-playfair font-bold text-charcoal">
                {title}
              </h1>
              
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}