import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { insertCustomOrderRequestSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const customOrderSchema = insertCustomOrderRequestSchema.extend({
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  budget: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().positive("Budget must be a positive number").optional()
  ),
});

type CustomOrderFormValues = z.infer<typeof customOrderSchema>;

export function CustomOrderForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<CustomOrderFormValues>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      requirements: "",
      budget: undefined,
    },
  });
  
  const customOrderMutation = useMutation({
    mutationFn: async (data: CustomOrderFormValues) => {
      const res = await apiRequest("POST", "/api/custom-order", data);
      return await res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Custom order request submitted",
        description: "We will contact you shortly to discuss your requirements.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit request",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: CustomOrderFormValues) => {
    customOrderMutation.mutate(data);
  };
  
  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-md shadow-md text-center"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-emerald" />
        </div>
        <h3 className="text-2xl font-playfair font-bold mb-4">Request Submitted!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for your custom order request. Our design team will review your requirements and contact you within 24-48 hours to discuss further details.
        </p>
        <Button 
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="border-maroon text-maroon hover:bg-maroon hover:text-white"
        >
          Submit Another Request
        </Button>
      </motion.div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormDescription>
                  We may contact you to discuss your requirements
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Your budget in Rupees" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={(e) => {
                      field.onChange(e.target.value === '' ? '' : Number(e.target.value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Approximate budget for your custom order
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your custom order in detail. Include information about the type of garment, fabric preferences, color, design elements, and any reference images you might have."
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Please be as detailed as possible to help us understand your requirements
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={customOrderMutation.isPending}
          className="w-full bg-maroon hover:bg-maroon-dark text-white"
        >
          {customOrderMutation.isPending ? "Submitting..." : "Submit Custom Order Request"}
        </Button>
      </form>
    </Form>
  );
}
