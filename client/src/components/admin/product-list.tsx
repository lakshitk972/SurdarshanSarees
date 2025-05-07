import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, MoreVertical, Edit, Trash, Plus, Star } from "lucide-react";

export function ProductList() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { toast } = useToast();
  
  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });
  
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
      setProductToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-maroon mb-4" />
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Failed to load products</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] })}
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Button 
          asChild
          className="bg-maroon hover:bg-maroon-dark text-white"
        >
          <Link href="/admin/products/add">
            <Plus className="mr-1 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-md">
          {searchQuery ? (
            <>
              <p className="text-gray-500 mb-2">No products match your search</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-4">No products found</p>
              <Button 
                asChild
                className="bg-maroon hover:bg-maroon-dark text-white"
              >
                <Link href="/admin/products/add">
                  <Plus className="mr-1 h-4 w-4" /> Add Your First Product
                </Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-offwhite">
                          <img 
                            src={product.imageUrls[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium flex items-center">
                          {product.name}
                          {product.featured && (
                            <Star className="ml-1 h-3 w-3 text-gold fill-gold" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.categoryId}</TableCell>
                  <TableCell>
                    {product.inStock ? (
                      <Badge className="bg-emerald text-white hover:bg-emerald">In Stock</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">Out of Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/product/${product.slug}`}>
                            <a className="w-full cursor-pointer">View Product</a>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setProductToDelete(product)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setProductToDelete(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProduct}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
