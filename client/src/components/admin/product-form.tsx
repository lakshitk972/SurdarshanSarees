import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { insertProductSchema, Product, Category } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X } from "lucide-react";

const MAX_IMAGE_URLS = 5;

const productSchema = insertProductSchema
  .omit({ id: true, createdAt: true })
  .extend({
    price: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().positive("Price must be a positive number")
    ),
    imageUrlInput: z.string().url("Must be a valid URL").optional(),
    imageUrls: z.string().url().array(),
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
  const [imageUrlInput, setImageUrlInput] = useState("");
  const { toast } = useToast();
  
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price || undefined,
      categoryId: product?.categoryId || undefined,
      imageUrls: product?.imageUrls || [],
      imageUrlInput: "",
      fabric: product?.fabric || "",
      workDetails: product?.workDetails || "",
      inStock: product?.inStock ?? true,
      featured: product?.featured ?? false,
    },
  });
  
  // Update form values when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        imageUrls: product.imageUrls,
        imageUrlInput: "",
        fabric: product.fabric || "",
        workDetails: product.workDetails || "",
        inStock: product.inStock,
        featured: product.featured,
      });
    }
  }, [product, form]);
  
  const handleAddImageUrl = () => {
    const currentImages = form.getValues("imageUrls") || [];
    
    if (currentImages.length >= MAX_IMAGE_URLS) {
      toast({
        title: "Maximum images reached",
        description: `You can only add up to ${MAX_IMAGE_URLS} images.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!imageUrlInput) return;
    
    try {
      // Validate URL
      new URL(imageUrlInput);
      
      form.setValue("imageUrls", [...currentImages, imageUrlInput]);
      setImageUrlInput("");
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveImageUrl = (index: number) => {
    const currentImages = [...form.getValues("imageUrls")];
    currentImages.splice(index, 1);
    form.setValue("imageUrls", currentImages);
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    
    // Only auto-generate slug if it's a new product or slug is empty
    if (!product || !form.getValues("slug")) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      form.setValue("slug", slug);
    }
  };
  
  const handleFormSubmit = (data: ProductFormValues) => {
    // Remove imageUrlInput field which is just for UI
    const { imageUrlInput, ...productData } = data;
    onSubmit(productData as z.infer<typeof insertProductSchema>);
  };
  
  if (isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-maroon" />
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter product name" 
                    {...field} 
                    onChange={handleNameChange}
                  />
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
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="product-slug" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  URL-friendly product identifier
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter product description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter price in Rupees" 
                    {...field} 
                    value={field.value === undefined ? '' : field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value === '' ? '' : Number(e.target.value));
                    }}
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
                <FormLabel>Category *</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(Number(value))} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fabric"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fabric</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Pure Silk, Cotton" {...field} />
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
                  <Input placeholder="e.g., Zari embroidery, Handwoven" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="inStock"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">In Stock</FormLabel>
                  <FormDescription>
                    Is this product currently available?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured Product</FormLabel>
                  <FormDescription>
                    Show this product on the homepage?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-3">
          <FormLabel>Product Images</FormLabel>
          
          <div className="flex space-x-2">
            <Input
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="Enter image URL"
              className="flex-grow"
            />
            <Button 
              type="button"
              onClick={handleAddImageUrl}
              className="bg-maroon hover:bg-maroon-dark"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          <FormDescription>
            Add up to {MAX_IMAGE_URLS} product images
          </FormDescription>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-3">
            {form.watch("imageUrls")?.map((url, index) => (
              <div key={index} className="relative group">
                <div className="border rounded-md overflow-hidden bg-offwhite aspect-square relative">
                  <img 
                    src={url} 
                    alt={`Product image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrl(index)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {form.formState.errors.imageUrls && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.imageUrls.message}
            </p>
          )}
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-maroon hover:bg-maroon-dark text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {product ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{product ? "Update Product" : "Create Product"}</>
          )}
        </Button>
      </form>
    </Form>
  );
}
