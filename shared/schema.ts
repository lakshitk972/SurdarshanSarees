import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product category model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  imageUrls: json("image_urls").$type<string[]>().default([]),
  features: json("features").$type<string[]>().default([]),
  fabric: text("fabric"),
  workDetails: text("work_details"),
  inStock: boolean("in_stock").default(true),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cart model
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("pending"),
  totalAmount: doublePrecision("total_amount").notNull(),
  shippingAddress: text("shipping_address"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Order items model
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

// Custom order request model
export const customOrderRequests = pgTable("custom_order_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  requirements: text("requirements").notNull(),
  budget: doublePrecision("budget"),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema validations
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  productId: true,
  quantity: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertCustomOrderRequestSchema = createInsertSchema(customOrderRequests).pick({
  name: true,
  email: true,
  phone: true,
  requirements: true,
  budget: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertCustomOrderRequest = z.infer<typeof insertCustomOrderRequestSchema>;
export type CustomOrderRequest = typeof customOrderRequests.$inferSelect;
