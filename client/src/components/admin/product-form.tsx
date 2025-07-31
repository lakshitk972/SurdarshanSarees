import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, insertProductSchema, Category } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { on } from "events";

// Extend the product schema for validation
const productSchema = insertProductSchema.extend({
  id: z.number().optional(),
  slug: z.string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .refine(value => /^[a-z0-9-]+$/.test(value), {
      message: "Slug can only contain lowercase letters, numbers, and hyphens"
    }),
  price: z.coerce.number()
    .min(0, { message: "Price must be a positive number" }),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  // Make these fields optional to match the database schema
  fabric: z.string().optional().nullable(),
  workDetails: z.string().optional().nullable(),
  occasion: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  // Image URLs are stored as an array of strings
  imageUrls: z.array(z.string()).optional().nullable(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: z.infer<typeof insertProductSchema>) => void;
  isSubmitting: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  isSubmitting
}: ProductFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.imageUrls || ["", "", ""]
  );
  
  // Fetch categories for the dropdown
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Set up form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      price: product?.price || 0,
      description: product?.description || "",
      categoryId: product?.categoryId || undefined,
      fabric: product?.fabric || "",
      workDetails: product?.workDetails || "",
      occasion: product?.occasion || "",
      color: product?.color || "",
      imageUrls: product?.imageUrls || ["", "", ""],
      inStock: product?.inStock !== undefined ? product.inStock : true,
      featured: product?.featured || false,
    },
  });
  
  // Update image URLs when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.imageUrls) {
        setImageUrls(value.imageUrls as string[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);
  
  // Handle image URL changes
  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    
    // Update form value
    form.setValue("imageUrls", newImageUrls, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  
  // Filter out empty image URLs before submission
  const handleFormSubmit = (data: FormData) => {
    // Filter out empty image URLs
    const filteredImageUrls = (data.imageUrls || []).filter(url => url.trim() !== "");
    
    // Prepare data for submission
    const submissionData = {
      ...data,
      imageUrls: filteredImageUrls.length > 0 ? filteredImageUrls : null,
    };
    
    onSubmit(submissionData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Golden Silk Saree" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. golden-silk-saree" 
                        {...field} 
                        onChange={(e) => {
                          // Convert to lowercase and replace spaces with hyphens
                          const value = e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Used in product URLs. Only lowercase letters, numbers, and hyphens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 15000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category, index) => {
                          // Use index as fallback if category.id is not available
                          const value = category._id?.toString() || `temp-${index}`;
                          
                          return (
                            <SelectItem 
                              key={category._id || `category-${index}`} 
                              value={value}
                              disabled={!category._id} // Disable if no valid ID
                            >
                              {category.name}
                              {!category._id && " (Invalid)"}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-8 col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>In Stock</FormLabel>
                        <FormDescription>
                          Product is available for purchase
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          Highlight on homepage and collections
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Product Details Tab */}
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fabric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fabric</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Ghazi Silk, Sifon" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="workDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Details</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Jardoji, Gotta Patti" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="occasion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occasion</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Wedding, Festival" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Maroon, Gold" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-8">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex-1 space-y-2">
                    <FormLabel>Image {index + 1} URL</FormLabel>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={imageUrls[index] || ""}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    />
                    
                    {imageUrls[index] && (
                      <div className="mt-2 relative aspect-square overflow-hidden rounded-md border">
                        <img
                          src={imageUrls[index]}
                          alt={`Product image ${index + 1}`}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            // Replace with placeholder on error
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/200?text=Invalid+URL";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <FormDescription>
                Enter URLs for product images. We recommend square images (1:1 ratio) for best display.
              </FormDescription>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit" className="bg-maroon hover:bg-maroon-dark" disabled={isSubmitting} onClick={() =>{
            // console.log("Form submitted with values:", form.getValues()),
            onSubmit(form.getValues());
          }}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              product ? "Update Product" : "Add Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}