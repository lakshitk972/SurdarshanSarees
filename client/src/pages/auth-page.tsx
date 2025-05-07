import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register form schema extending the insertUserSchema
const registerSchema = insertUserSchema
  .extend({
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
    },
  });
  
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove confirmPassword as it's not in the schema
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };
  
  return (
    <>
      <Helmet>
        <title>Sign In | Surdharshan Sarees</title>
        <meta name="description" content="Sign in to your Surdharshan Sarees account to access your orders, wishlist, and more." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-12 bg-offwhite">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto md:mx-0 w-full"
              >
                <Card className="border-none shadow-lg">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-playfair text-center">
                      {activeTab === "login" ? "Welcome Back" : "Create Account"}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {activeTab === "login"
                        ? "Sign in to your account to continue"
                        : "Join us to explore our exclusive collections"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      defaultValue="login"
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-2 mb-6">
                        <TabsTrigger value="login">Sign In</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="login">
                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <FormField
                              control={loginForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button
                              type="submit"
                              className="w-full bg-maroon hover:bg-maroon-dark text-white"
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? "Signing in..." : "Sign In"}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                      
                      <TabsContent value="register">
                        <Form {...registerForm}>
                          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                            <FormField
                              control={registerForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your full name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Choose a username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="Enter your email address"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="Create a password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="Confirm your password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button
                              type="submit"
                              className="w-full bg-maroon hover:bg-maroon-dark text-white"
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? "Creating account..." : "Create Account"}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:block"
              >
                <div className="relative">
                  <img
                    src="https://pixabay.com/get/g38c35c3b1e151604ae647bd0f053d4d5a2e429b8c7e4faa2d902fbe7ec26aadd8f012f1b35573cbee1872645c860c1edab2b79dd729df2c7da1e9dfb862fe58c_1280.jpg"
                    alt="Luxury Saree"
                    className="rounded-lg shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 rounded-lg">
                    <h2 className="text-white text-3xl font-playfair font-bold mb-2">
                      Join Our Exclusive Circle
                    </h2>
                    <p className="text-white/90 mb-4">
                      Create an account to access special offers, track orders, and save your favorite designs.
                    </p>
                    <ul className="text-white/80 space-y-2 mb-4">
                      <li className="flex items-center">
                        <span className="mr-2 text-gold">✓</span> Early access to new collections
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-gold">✓</span> Exclusive member discounts
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-gold">✓</span> Priority booking for custom orders
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
