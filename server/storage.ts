import { 
  User, InsertUser, 
  Product, InsertProduct, 
  Category, InsertCategory,
  CartItem, InsertCartItem,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  CustomOrderRequest, InsertCustomOrderRequest
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Product operations
  getProducts(filters?: { 
    categoryId?: number;
    categorySlug?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Cart operations
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  createCartItem(userId: number, cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, cartItem: Partial<CartItem>): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Order operations
  getOrders(userId?: number): Promise<Order[]>;
  getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
  createOrder(userId: number, order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Custom order request operations
  getCustomOrderRequests(): Promise<CustomOrderRequest[]>;
  getCustomOrderRequest(id: number): Promise<CustomOrderRequest | undefined>;
  createCustomOrderRequest(userId: number | null, request: InsertCustomOrderRequest): Promise<CustomOrderRequest>;
  updateCustomOrderRequestStatus(id: number, status: string): Promise<CustomOrderRequest | undefined>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private customOrderRequests: Map<number, CustomOrderRequest>;
  private currentIds: {
    users: number;
    categories: number;
    products: number;
    cartItems: number;
    orders: number;
    orderItems: number;
    customOrderRequests: number;
  };
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.customOrderRequests = new Map();
    
    this.currentIds = {
      users: 1,
      categories: 1,
      products: 1,
      cartItems: 1,
      orders: 1,
      orderItems: 1,
      customOrderRequests: 1
    };

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });

    // Seed initial admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$vk.cDkQJfYFZGRnL6aoEKeBnxuOOA8gTM7UUcJ1HOE72pQ3w1.yCO", // "admin123"
      name: "Admin User",
      email: "admin@surdharshansilks.com",
    }).then(user => {
      this.updateUser(user.id, { isAdmin: true });
    });

    // Seed some categories
    const categoryPromises = [
      this.createCategory({ name: "Silk Sarees", slug: "silk-sarees", description: "Luxurious handcrafted silk sarees" }),
      this.createCategory({ name: "Designer Lehengas", slug: "designer-lehengas", description: "Exclusive designer lehengas" }),
      this.createCategory({ name: "Premium Fabrics", slug: "premium-fabrics", description: "Fine fabrics for custom creations" })
    ];

    // Seed some products after categories are created
    Promise.all(categoryPromises).then(categories => {
      // Silk Sarees
      this.createProduct({
        name: "Kanchipuram Silk Bridal Saree",
        slug: "kanchipuram-silk-bridal-saree",
        description: "Exquisite handcrafted Kanchipuram silk saree with intricate gold zari work. Perfect for wedding ceremonies.",
        price: 35999,
        categoryId: categories[0].id,
        imageUrls: ["https://pixabay.com/get/g38c35c3b1e151604ae647bd0f053d4d5a2e429b8c7e4faa2d902fbe7ec26aadd8f012f1b35573cbee1872645c860c1edab2b79dd729df2c7da1e9dfb862fe58c_1280.jpg"],
        fabric: "Pure Kanchipuram Silk",
        workDetails: "Gold zari work with traditional temple border",
        inStock: true,
        featured: true
      });

      this.createProduct({
        name: "Banarasi Silk Festival Saree",
        slug: "banarasi-silk-festival-saree",
        description: "Rich Banarasi silk saree with intricate gold and silver zari work. Ideal for festive occasions.",
        price: 24999,
        categoryId: categories[0].id,
        imageUrls: ["https://pixabay.com/get/g6af868092d7629d7cdf65e37c548c5123320a28c2a7a0752ecda2fe1835f0675ef32b647a602b65f066c9c75e10460251122a1c55a403af7f3faa8a1e5f53937_1280.jpg"],
        fabric: "Banarasi Silk",
        workDetails: "Gold and silver zari border and pallu",
        inStock: true,
        featured: true
      });

      // Designer Lehengas
      this.createProduct({
        name: "Royal Bridal Lehenga",
        slug: "royal-bridal-lehenga",
        description: "Stunning heavily embroidered bridal lehenga crafted with the finest materials and artisanal embroidery.",
        price: 49999,
        categoryId: categories[1].id,
        imageUrls: ["https://pixabay.com/get/gede6e4f1832f0d15c04249382ae0b4972693be098402796fcba79714c96a4478e41452ae1bc3b14a2e2cc76879c4f1d9e70d25c5472c0bfc283046b6420614ed_1280.jpg"],
        fabric: "Raw Silk with Velvet Accents",
        workDetails: "Zardozi, crystal and pearl embellishments",
        inStock: true,
        featured: true
      });

      // Premium Fabrics
      this.createProduct({
        name: "Handcrafted Zari Silk Dupatta",
        slug: "handcrafted-zari-silk-dupatta",
        description: "Luxury embroidered silk dupatta with intricate gold work. Perfect complement to any traditional outfit.",
        price: 12499,
        categoryId: categories[2].id,
        imageUrls: ["https://pixabay.com/get/ge31a9ff1cf7f8d9ac712ff209160478407186623812aa516f9a8bd3cf5927b621b917155abcdc494c4255e918a730b2cc7e08a29698ba81f860cced4f1ed12d0_1280.jpg"],
        fabric: "Pure Silk",
        workDetails: "Hand-embroidered gold zari work",
        inStock: true,
        featured: true
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const timestamp = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false,
      createdAt: timestamp
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentIds.categories++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | undefined> {
    const category = await this.getCategory(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product operations
  async getProducts(filters?: {
    categoryId?: number;
    categorySlug?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters) {
      if (filters.categoryId) {
        products = products.filter(product => product.categoryId === filters.categoryId);
      }

      if (filters.categorySlug) {
        const category = await this.getCategoryBySlug(filters.categorySlug);
        if (category) {
          products = products.filter(product => product.categoryId === category.id);
        }
      }

      if (filters.featured !== undefined) {
        products = products.filter(product => product.featured === filters.featured);
      }

      if (filters.minPrice !== undefined) {
        products = products.filter(product => product.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        products = products.filter(product => product.price <= filters.maxPrice!);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) || 
          (product.description && product.description.toLowerCase().includes(searchTerm))
        );
      }
    }

    return products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentIds.products++;
    const timestamp = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: timestamp 
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Cart operations
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const cartItems = Array.from(this.cartItems.values())
      .filter(item => item.userId === userId);
    
    return Promise.all(cartItems.map(async item => {
      const product = await this.getProduct(item.productId);
      return { ...item, product: product! };
    }));
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async createCartItem(userId: number, insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === userId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      // Update quantity instead of creating new item
      const updatedItem = await this.updateCartItem(existingItem.id, { 
        quantity: existingItem.quantity + insertCartItem.quantity 
      });
      return updatedItem!;
    }

    const id = this.currentIds.cartItems++;
    const timestamp = new Date();
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id, 
      userId, 
      createdAt: timestamp 
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, cartItemData: Partial<CartItem>): Promise<CartItem | undefined> {
    const cartItem = await this.getCartItem(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, ...cartItemData };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const cartItems = Array.from(this.cartItems.values())
      .filter(item => item.userId === userId);
    
    cartItems.forEach(item => {
      this.cartItems.delete(item.id);
    });
    
    return true;
  }

  // Order operations
  async getOrders(userId?: number): Promise<Order[]> {
    let orders = Array.from(this.orders.values());
    
    if (userId) {
      orders = orders.filter(order => order.userId === userId);
    }
    
    return orders;
  }

  async getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const orderItems = Array.from(this.orderItems.values())
      .filter(item => item.orderId === id);
    
    const itemsWithProducts = await Promise.all(orderItems.map(async item => {
      const product = await this.getProduct(item.productId);
      return { ...item, product: product! };
    }));

    return { ...order, items: itemsWithProducts };
  }

  async createOrder(userId: number, insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.currentIds.orders++;
    const timestamp = new Date();
    const order: Order = { 
      ...insertOrder, 
      id, 
      userId, 
      createdAt: timestamp 
    };
    this.orders.set(id, order);

    // Create order items
    items.forEach(item => {
      const orderItemId = this.currentIds.orderItems++;
      const orderItem: OrderItem = { 
        ...item, 
        id: orderItemId, 
        orderId: id 
      };
      this.orderItems.set(orderItemId, orderItem);
    });

    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Custom order request operations
  async getCustomOrderRequests(): Promise<CustomOrderRequest[]> {
    return Array.from(this.customOrderRequests.values());
  }

  async getCustomOrderRequest(id: number): Promise<CustomOrderRequest | undefined> {
    return this.customOrderRequests.get(id);
  }

  async createCustomOrderRequest(userId: number | null, insertRequest: InsertCustomOrderRequest): Promise<CustomOrderRequest> {
    const id = this.currentIds.customOrderRequests++;
    const timestamp = new Date();
    const request: CustomOrderRequest = { 
      ...insertRequest, 
      id, 
      userId: userId || 0, 
      status: "new",
      createdAt: timestamp 
    };
    this.customOrderRequests.set(id, request);
    return request;
  }

  async updateCustomOrderRequestStatus(id: number, status: string): Promise<CustomOrderRequest | undefined> {
    const request = await this.getCustomOrderRequest(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, status };
    this.customOrderRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
