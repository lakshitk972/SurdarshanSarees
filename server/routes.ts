import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-mongo.js";
import { setupAuth } from "./auth-mongo.js";
import { insertProductSchema, insertCartItemSchema, insertCustomOrderRequestSchema } from "@shared/schema.js";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Product routes
  app.get("/api/products", async (req, res) => {
    const { category, featured, minPrice, maxPrice, search, fabric, workDetails } = req.query;
    
    const filters: any = {};
    
    if (category) {
      filters.categorySlug = category as string;
    }
    
    if (featured === "true") {
      filters.featured = true;
    }
    
    if (minPrice) {
      filters.minPrice = parseFloat(minPrice as string);
    }
    
    if (maxPrice) {
      filters.maxPrice = parseFloat(maxPrice as string);
    }
    
    if (search) {
      filters.search = search as string;
    }
    
    if (fabric) {
      filters.fabric = fabric as string;
    }
    
    if (workDetails) {
      filters.workDetails = workDetails as string;
    }
    
    const products = await storage.getProducts(filters);
    res.json(products);
  });

  app.get("/api/products/:slug", async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:slug", async (req, res) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const cartItems = await storage.getCartItems(req.user._id);
    res.json(cartItems);
  });

  app.post("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const cartData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.createCartItem(req.user._id, cartData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart data", errors: error.errors });
      }
      throw error;
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const cartItem = await storage.getCartItem(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    if (cartItem.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const updatedItem = await storage.updateCartItem(req.params.id, req.body);
    res.json(updatedItem);
  });

  app.delete("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const cartItem = await storage.getCartItem(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    if (cartItem.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    await storage.deleteCartItem(req.params.id);
    res.status(204).send();
  });

  app.delete("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    await storage.clearCart(req.user.id);
    res.status(204).send();
  });

  // Custom order request routes
  app.post("/api/custom-order", async (req, res) => {
    try {
      const requestData = insertCustomOrderRequestSchema.parse(req.body);
      const userId = req.isAuthenticated() ? req.user.id : null;
      const customOrder = await storage.createCustomOrderRequest(userId, requestData);
      res.status(201).json(customOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      throw error;
    }
  });

  // Admin routes
  app.get("/api/admin/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/admin/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      throw error;
    }
  });

  app.put("/api/admin/products/:id", async (req, res) => {
    const productId = (req.params.id);
    const product = await storage.getProduct(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    try {
      const updatedProduct = await storage.updateProduct(productId, req.body);
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      throw error;
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    const productId = req.params.id;
    console.log(productId + " server")
    const product = await storage.getProduct(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    await storage.deleteProduct(productId);
    res.status(204).send();
  });

  app.get("/api/admin/custom-orders", async (req, res) => {
    const customOrders = await storage.getCustomOrderRequests();
    res.json(customOrders);
  });

  app.put("/api/admin/custom-orders/:id/status", async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    const updatedOrder = await storage.updateCustomOrderRequestStatus(orderId, status);
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Custom order request not found" });
    }
    
    res.json(updatedOrder);
  });

  const httpServer = createServer(app);
  return httpServer;
}
