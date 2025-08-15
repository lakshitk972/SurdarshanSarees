import mongoose, { Schema, Document, model } from 'mongoose';

// User Interface and Schema
export interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  address: { type: String },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Category Interface and Schema
export interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Product Interface and Schema
export interface IProduct extends Document {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  categoryId?: string;
  imageUrls?: string[];
  fabric?: string;
  workDetails?: string;
  features?: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  description: { type: String },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  imageUrls: [{ type: String }],
  fabric: { type: String },
  workDetails: { type: String },
  features: [{ type: String }],
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Cart Item Interface and Schema
export interface ICartItem extends Document {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

// Order Interface and Schema
export interface IOrder extends Document {
  _id: string;
  userId: string;
  status: string;
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true, default: 'pending' },
  totalPrice: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// Order Item Interface and Schema
export interface IOrderItem extends Document {
  _id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Custom Order Request Interface and Schema
export interface ICustomOrderRequest extends Document {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  budget: number;
  status: string;
  createdAt: Date;
}

const customOrderRequestSchema = new Schema<ICustomOrderRequest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// Review Interface and Schema
export interface IReview extends Document {
  _id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  helpfulCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Create and export models
export const User = mongoose.models.User || model<IUser>('User', userSchema);
export const Category = mongoose.models.Category || model<ICategory>('Category', categorySchema);
export const Product = mongoose.models.Product || model<IProduct>('Product', productSchema);
export const CartItem = mongoose.models.CartItem || model<ICartItem>('CartItem', cartItemSchema);
export const Order = mongoose.models.Order || model<IOrder>('Order', orderSchema);
export const OrderItem = mongoose.models.OrderItem || model<IOrderItem>('OrderItem', orderItemSchema);
export const CustomOrderRequest = mongoose.models.CustomOrderRequest || model<ICustomOrderRequest>('CustomOrderRequest', customOrderRequestSchema);
export const Review = mongoose.models.Review || model<IReview>('Review', reviewSchema);