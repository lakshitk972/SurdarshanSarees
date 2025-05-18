import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { User, Category, Product } from "./models";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedMongoDB() {
  try {
    // Check if we already have users
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log("Seeding users...");
      
      // Create admin user
      const adminPassword = await hashPassword("admin123");
      await User.create({
        username: "admin",
        email: "admin@surdharshandesigner.com",
        password: adminPassword,
        isAdmin: true
      });
      
      // Create regular user
      const userPassword = await hashPassword("user123");
      await User.create({
        username: "user",
        email: "user@example.com",
        password: userPassword,
        isAdmin: false
      });
      
      console.log("Users seeded successfully");
    } else {
      console.log("Users already exist, skipping user seed");
    }
    
    // Check if we already have categories
    const categoryCount = await Category.countDocuments();
    
    if (categoryCount === 0) {
      console.log("Seeding categories...");
      
      // Create categories
      const categories = [
        {
          name: "Sarees",
          slug: "sarees",
          description: "Elegant and traditional sarees for all occasions"
        },
        {
          name: "Lehengas",
          slug: "lehengas",
          description: "Beautiful lehengas for weddings and special occasions"
        },
        {
          name: "Bridal Wear",
          slug: "bridal-wear",
          description: "Special collections for the bride"
        },
        {
          name: "Casual Wear",
          slug: "casual-wear",
          description: "Comfortable and stylish everyday wear"
        }
      ];
      
      const createdCategories = await Category.insertMany(categories);
      console.log("Categories seeded successfully");
      
      // Check if we already have products
      const productCount = await Product.countDocuments();
      
      if (productCount === 0) {
        console.log("Seeding products...");
        
        // Map category ids
        const categoriesMap = createdCategories.reduce((acc, category) => {
          acc[category.slug] = category._id;
          return acc;
        }, {} as Record<string, string>);
        
        // Create products
        const products = [
          {
            name: "Royal Ghazi Silk Saree",
            slug: "royal-ghazi-silk-saree",
            price: 25000,
            description: "A luxurious ghazi silk saree with intricate gotta patti work.",
            categoryId: categoriesMap["sarees"],
            fabric: "Ghazi Silk",
            workDetails: "Gotta Patti, Jardozi",
            imageUrls: [
              "https://i.imgur.com/1A6tNes.jpg",
              "https://i.imgur.com/2B7tNes.jpg"
            ],
            features: ["Handcrafted", "Premium Quality", "Includes Blouse Piece"],
            inStock: true,
            featured: true
          },
          {
            name: "Pink Bandni Lehenga",
            slug: "pink-bandni-lehenga",
            price: 35000,
            description: "Beautiful pink bandni lehenga with mirror work and golden embellishments.",
            categoryId: categoriesMap["lehengas"],
            fabric: "Bandni",
            workDetails: "Mirror Work, Golden Embroidery",
            imageUrls: [
              "https://i.imgur.com/3C6tNes.jpg",
              "https://i.imgur.com/4D7tNes.jpg"
            ],
            features: ["Designer Piece", "Full Flare", "Includes Dupatta"],
            inStock: true,
            featured: true
          },
          {
            name: "Bridal Red Lehenga Set",
            slug: "bridal-red-lehenga-set",
            price: 50000,
            description: "Traditional bridal red lehenga with heavy zari work and kundan embellishments.",
            categoryId: categoriesMap["bridal-wear"],
            fabric: "Raw Silk",
            workDetails: "Zari, Kundan, Sequins",
            imageUrls: [
              "https://i.imgur.com/5E6tNes.jpg",
              "https://i.imgur.com/6F7tNes.jpg"
            ],
            features: ["Bridal Set", "Includes Blouse and Dupatta", "Custom Sizing Available"],
            inStock: true,
            featured: true
          },
          {
            name: "Casual Cotton Saree",
            slug: "casual-cotton-saree",
            price: 5000,
            description: "Lightweight cotton saree with simple block prints, perfect for daily wear.",
            categoryId: categoriesMap["casual-wear"],
            fabric: "Cotton",
            workDetails: "Block Print",
            imageUrls: [
              "https://i.imgur.com/7G6tNes.jpg",
              "https://i.imgur.com/8H7tNes.jpg"
            ],
            features: ["Breathable Fabric", "Easy to Drape", "Includes Blouse Piece"],
            inStock: true,
            featured: false
          }
        ];
        
        await Product.insertMany(products);
        console.log("Products seeded successfully");
      } else {
        console.log("Products already exist, skipping product seed");
      }
    } else {
      console.log("Categories already exist, skipping category seed");
    }
    
    console.log("Database seeding completed successfully");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}