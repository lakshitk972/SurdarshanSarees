import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search,
  Edit,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Product } from "@shared/schema";
import { ProductForm } from "@/components/admin/product-form";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function InventoryManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
  const itemsPerPage = 10;
  
  // Fetch products
  const { 
    data: products = [], 
    isLoading,
    refetch 
  } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.fabric && product.fabric.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.workDetails && product.workDetails.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Handle product deletion
  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      // Delete product API call would go here
      // await deleteProductMutation.mutateAsync(productToDelete);
      console.log(`Deleting product with ID: ${productToDelete}`);
      setIsDeleteAlertOpen(false);
      setProductToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <AdminLayout title="Inventory Management">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">Loading inventory data...</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Inventory Management">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button className="bg-maroon hover:bg-maroon-dark text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm 
              onSubmit={(data) => {
                console.log("Adding new product:", data);
                setIsAddProductOpen(false);
                refetch();
              }}
              isSubmitting={false}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Products Table */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img 
                        src={product.imageUrls[0]} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.slug}</div>
                  </TableCell>
                  <TableCell>
                    {/* This would display the actual category name in a real application */}
                    {product.categoryId || "-"}
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.inStock ? "default" : "destructive"}
                      className={product.inStock ? "bg-emerald-500" : ""}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {product.fabric && <div><span className="font-medium">Fabric:</span> {product.fabric}</div>}
                      {product.workDetails && <div><span className="font-medium">Work:</span> {product.workDetails}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          {editProduct && (
                            <ProductForm 
                              product={product}
                              onSubmit={(data) => {
                                console.log("Updating product:", data);
                                refetch();
                              }}
                              isSubmitting={false}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteClick(product.id)}
                        className="border-red-200 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No products found. Try a different search term or add a new product.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(index + 1)}
                className={
                  currentPage === index + 1 
                    ? "bg-maroon hover:bg-maroon-dark text-white" 
                    : ""
                }
              >
                {index + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => 
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Alert */}
      <AlertDialog 
        open={isDeleteAlertOpen} 
        onOpenChange={setIsDeleteAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product and remove it from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}