import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thank you for subscribing!",
        description: "You have been added to our mailing list.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-playfair font-bold mb-4">Join Our Exclusive Circle</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to receive updates on new collections, exclusive offers, and styling inspiration.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3 border border-gray-300 focus:outline-none focus:border-maroon rounded-t-sm sm:rounded-l-sm sm:rounded-r-none mb-2 sm:mb-0"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-maroon hover:bg-maroon-dark text-white px-6 py-3 font-medium rounded-b-sm sm:rounded-r-sm sm:rounded-l-none transition-colors"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          
          <p className="text-gray-500 text-sm mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
