import session from "express-session";
import MongoStore from "connect-mongo";
import { 
  User, 
  Category, 
  Product, 
  CartItem, 
  Order, 
  OrderItem, 
  CustomOrderRequest, 
  Review,
  IUser,
  ICategory,
  IProduct,
  ICartItem,
  IOrder,
  IOrderItem,
  ICustomOrderRequest,
  IReview
} from "./models/model";
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

export interface IStorage {
  // User operations
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: Omit<IUser, '_id' | 'createdAt'>): Promise<IUser>;
  updateUser(id: string, user: Partial<IUser>): Promise<IUser | null>;

  // Category operations
  getCategories(): Promise<ICategory[]>;
  getCategory(id: string): Promise<ICategory | null>;
  getCategoryBySlug(slug: string): Promise<ICategory | null>;
  createCategory(category: Omit<ICategory, '_id' | 'createdAt'>): Promise<ICategory>;
  updateCategory(id: string, category: Partial<ICategory>): Promise<ICategory | null>;
  deleteCategory(id: string): Promise<boolean>;

  // Product operations
  getProducts(filters?: { 
    categoryId?: string;
    categorySlug?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct | null>;
  getProductBySlug(slug: string): Promise<IProduct | null>;
  createProduct(product: Omit<IProduct, '_id' | 'createdAt'>): Promise<IProduct>;
  updateProduct(id: string, product: Partial<IProduct>): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<boolean>;

  // Cart operations
  getCartItems(userId: string): Promise<(ICartItem & { product: IProduct })[]>;
  getCartItem(id: string): Promise<ICartItem | null>;
  createCartItem(userId: string, cartItem: Omit<ICartItem, '_id' | 'userId' | 'createdAt'>): Promise<ICartItem>;
  updateCartItem(id: string, cartItem: Partial<ICartItem>): Promise<ICartItem | null>;
  deleteCartItem(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;

  // Order operations
  getOrders(userId?: string): Promise<IOrder[]>;
  getOrder(id: string): Promise<(IOrder & { items: (IOrderItem & { product: IProduct })[] }) | null>;
  createOrder(userId: string, order: Omit<IOrder, '_id' | 'userId' | 'createdAt'>, items: Omit<IOrderItem, '_id' | 'orderId' | 'createdAt'>[]): Promise<IOrder>;
  updateOrderStatus(id: string, status: string): Promise<IOrder | null>;

  // Custom order request operations
  getCustomOrderRequests(): Promise<ICustomOrderRequest[]>;
  getCustomOrderRequest(id: string): Promise<ICustomOrderRequest | null>;
  createCustomOrderRequest(userId: string | null, request: Omit<ICustomOrderRequest, '_id' | 'userId' | 'createdAt'>): Promise<ICustomOrderRequest>;
  updateCustomOrderRequestStatus(id: string, status: string): Promise<ICustomOrderRequest | null>;

  // Review operations
  getProductReviews(productId: string): Promise<(IReview & { username: string })[]>;
  getReview(id: string): Promise<IReview | null>;
  createReview(review: Omit<IReview, '_id' | 'createdAt'>): Promise<IReview>;
  incrementHelpfulCount(id: string): Promise<IReview | null>;

  // Session store
  sessionStore: session.Store;
}

export class MongoDBStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7, // 1 week
    });
  }

  // User operations
  async getUser(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id).lean();
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username }).lean();
    } catch (error) {
      console.error('Error getting user by username:', error);
      return null;
    }
  }

  async createUser(user: Omit<IUser, '_id' | 'createdAt'>): Promise<IUser> {
    try {
      const newUser = new User(user);
      await newUser.save();
      return newUser.toObject();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true }
      ).lean();
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  // Category operations
  async getCategories(): Promise<ICategory[]> {
    try {
      return await Category.find().lean();
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  async getCategory(id: string): Promise<ICategory | null> {
    try {
      return await Category.findById(id).lean();
    } catch (error) {
      console.error('Error getting category:', error);
      return null;
    }
  }

  async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    try {
      return await Category.findOne({ slug }).lean();
    } catch (error) {
      console.error('Error getting category by slug:', error);
      return null;
    }
  }

  async createCategory(category: Omit<ICategory, '_id' | 'createdAt'>): Promise<ICategory> {
    try {
      const newCategory = new Category(category);
      await newCategory.save();
      return newCategory.toObject();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { $set: categoryData },
        { new: true }
      ).lean();
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const result = await Category.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  // Product operations
  async getProducts(filters?: {
    categoryId?: string;
    categorySlug?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<IProduct[]> {
    try {
      let query: any = {};

      if (filters) {
        if (filters.categoryId) {
          query.categoryId = filters.categoryId;
        }

        if (filters.categorySlug && !filters.categoryId) {
          const category = await Category.findOne({ slug: filters.categorySlug }).lean();
          if (category) {
            query.categoryId = category._id;
          }
        }

        if (filters.featured !== undefined) {
          query.featured = filters.featured;
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          query.price = {};
          if (filters.minPrice !== undefined) {
            query.price.$gte = filters.minPrice;
          }
          if (filters.maxPrice !== undefined) {
            query.price.$lte = filters.maxPrice;
          }
        }

        if (filters.search) {
          query.$or = [
            { name: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } },
            { fabric: { $regex: filters.search, $options: 'i' } },
            { workDetails: { $regex: filters.search, $options: 'i' } }
          ];
        }
      }

      return await Product.find(query).lean();
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  async getProduct(id: string): Promise<IProduct | null> {
    try {
      return await Product.findById(id).lean();
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  }

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    try {
      return await Product.findOne({ slug }).lean();
    } catch (error) {
      console.error('Error getting product by slug:', error);
      return null;
    }
  }

  async createProduct(product: Omit<IProduct, '_id' | 'createdAt'>): Promise<IProduct> {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      return newProduct.toObject();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: productData },
        { new: true }
      ).lean();
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Cart operations
  async getCartItems(userId: string): Promise<(ICartItem & { product: IProduct })[]> {
    try {
      const cartItems = await CartItem.find({ userId }).lean();
      
      const cartItemsWithProduct = await Promise.all(
        cartItems.map(async (item) => {
          const product = await Product.findById(item.productId).lean();
          return {
            ...item,
            product: product as IProduct
          };
        })
      );
      
      return cartItemsWithProduct.filter(item => item.product) as (ICartItem & { product: IProduct })[];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  async getCartItem(id: string): Promise<ICartItem | null> {
    try {
      return await CartItem.findById(id).lean();
    } catch (error) {
      console.error('Error getting cart item:', error);
      return null;
    }
  }

  async createCartItem(userId: string, cartItem: Omit<ICartItem, '_id' | 'userId' | 'createdAt'>): Promise<ICartItem> {
    try {
      // Check if the item is already in the cart
      const existingItem = await CartItem.findOne({
        userId,
        productId: cartItem.productId
      });

      if (existingItem) {
        // Update the quantity
        existingItem.quantity += cartItem.quantity;
        await existingItem.save();
        return existingItem.toObject();
      }

      // Create new cart item
      const newCartItem = new CartItem({
        ...cartItem,
        userId
      });
      
      await newCartItem.save();
      return newCartItem.toObject();
    } catch (error) {
      console.error('Error creating cart item:', error);
      throw error;
    }
  }

  async updateCartItem(id: string, cartItemData: Partial<ICartItem>): Promise<ICartItem | null> {
    try {
      const updatedCartItem = await CartItem.findByIdAndUpdate(
        id,
        { $set: cartItemData },
        { new: true }
      ).lean();
      return updatedCartItem;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return null;
    }
  }

  async deleteCartItem(id: string): Promise<boolean> {
    try {
      const result = await CartItem.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      return false;
    }
  }

  async clearCart(userId: string): Promise<boolean> {
    try {
      await CartItem.deleteMany({ userId });
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  // Order operations
  async getOrders(userId?: string): Promise<IOrder[]> {
    try {
      const query = userId ? { userId } : {};
      return await Order.find(query).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  async getOrder(id: string): Promise<(IOrder & { items: (IOrderItem & { product: IProduct })[] }) | null> {
    try {
      const order = await Order.findById(id).lean();
      if (!order) return null;

      const orderItems = await OrderItem.find({ orderId: id }).lean();
      
      const itemsWithProducts = await Promise.all(
        orderItems.map(async (item) => {
          const product = await Product.findById(item.productId).lean();
          return {
            ...item,
            product: product as IProduct
          };
        })
      );

      return {
        ...order,
        items: itemsWithProducts.filter(item => item.product) as (IOrderItem & { product: IProduct })[]
      };
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  async createOrder(
    userId: string,
    order: Omit<IOrder, '_id' | 'userId' | 'createdAt'>,
    items: Omit<IOrderItem, '_id' | 'orderId' | 'createdAt'>[]
  ): Promise<IOrder> {
    try {
      // Create order
      const newOrder = new Order({
        ...order,
        userId
      });
      
      await newOrder.save();
      
      // Create order items
      await Promise.all(
        items.map(async (item) => {
          const orderItem = new OrderItem({
            ...item,
            orderId: newOrder._id
          });
          await orderItem.save();
        })
      );
      
      // Clear cart after successful order
      await this.clearCart(userId);
      
      return newOrder.toObject();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      ).lean();
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      return null;
    }
  }

  // Custom order request operations
  async getCustomOrderRequests(): Promise<ICustomOrderRequest[]> {
    try {
      return await CustomOrderRequest.find().sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error getting custom order requests:', error);
      return [];
    }
  }

  async getCustomOrderRequest(id: string): Promise<ICustomOrderRequest | null> {
    try {
      return await CustomOrderRequest.findById(id).lean();
    } catch (error) {
      console.error('Error getting custom order request:', error);
      return null;
    }
  }

  async createCustomOrderRequest(
    userId: string | null,
    request: Omit<ICustomOrderRequest, '_id' | 'userId' | 'createdAt'>
  ): Promise<ICustomOrderRequest> {
    try {
      const newRequest = new CustomOrderRequest({
        ...request,
        userId: userId || undefined
      });
      
      await newRequest.save();
      return newRequest.toObject();
    } catch (error) {
      console.error('Error creating custom order request:', error);
      throw error;
    }
  }

  async updateCustomOrderRequestStatus(id: string, status: string): Promise<ICustomOrderRequest | null> {
    try {
      const updatedRequest = await CustomOrderRequest.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      ).lean();
      return updatedRequest;
    } catch (error) {
      console.error('Error updating custom order request status:', error);
      return null;
    }
  }

  // Review operations
  async getProductReviews(productId: string): Promise<(IReview & { username: string })[]> {
    try {
      const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean();
      
      const reviewsWithUsername = await Promise.all(
        reviews.map(async (review) => {
          const user = await User.findById(review.userId).lean();
          return {
            ...review,
            username: user ? user.username : 'Anonymous'
          };
        })
      );
      
      return reviewsWithUsername as (IReview & { username: string })[];
    } catch (error) {
      console.error('Error getting product reviews:', error);
      return [];
    }
  }

  async getReview(id: string): Promise<IReview | null> {
    try {
      return await Review.findById(id).lean();
    } catch (error) {
      console.error('Error getting review:', error);
      return null;
    }
  }

  async createReview(review: Omit<IReview, '_id' | 'createdAt'>): Promise<IReview> {
    try {
      // Check if user has already reviewed this product
      const existingReview = await Review.findOne({
        userId: review.userId,
        productId: review.productId
      });

      if (existingReview) {
        // Update existing review
        existingReview.rating = review.rating;
        existingReview.comment = review.comment;
        await existingReview.save();
        return existingReview.toObject();
      }

      // Create new review
      const newReview = new Review({
        ...review,
        helpfulCount: 0
      });
      
      await newReview.save();
      return newReview.toObject();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async incrementHelpfulCount(id: string): Promise<IReview | null> {
    try {
      const updatedReview = await Review.findByIdAndUpdate(
        id,
        { $inc: { helpfulCount: 1 } },
        { new: true }
      ).lean();
      return updatedReview;
    } catch (error) {
      console.error('Error incrementing helpful count:', error);
      return null;
    }
  }
}

export const storage = new MongoDBStorage();