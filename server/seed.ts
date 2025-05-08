import { db } from "./db";
import { users, categories, products } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Check if data already exists
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Seed admin user
    const [adminUser] = await db.insert(users).values({
      username: "admin",
      password: await hashPassword("admin123"),
      name: "Admin User",
      email: "admin@surdharshansilks.com",
      isAdmin: true
    }).returning();

    console.log(`Created admin user: ${adminUser.username}`);

    // Seed categories
    const [silkSarees] = await db.insert(categories).values({
      name: "Silk Sarees",
      slug: "silk-sarees",
      description: "Luxurious handcrafted silk sarees"
    }).returning();

    const [designerLehengas] = await db.insert(categories).values({
      name: "Designer Lehengas", 
      slug: "designer-lehengas", 
      description: "Exclusive designer lehengas"
    }).returning();

    const [premiumFabrics] = await db.insert(categories).values({
      name: "Premium Fabrics", 
      slug: "premium-fabrics", 
      description: "Fine fabrics for custom creations"
    }).returning();

    console.log("Created categories");

    // Seed products
    await db.insert(products).values({
      name: "Kanchipuram Silk Bridal Saree",
      slug: "kanchipuram-silk-bridal-saree",
      description: "Exquisite handcrafted Kanchipuram silk saree with intricate gold zari work. Perfect for wedding ceremonies.",
      price: 35999,
      categoryId: silkSarees.id,
      imageUrls: ["https://pixabay.com/get/g38c35c3b1e151604ae647bd0f053d4d5a2e429b8c7e4faa2d902fbe7ec26aadd8f012f1b35573cbee1872645c860c1edab2b79dd729df2c7da1e9dfb862fe58c_1280.jpg"],
      fabric: "Pure Kanchipuram Silk",
      workDetails: "Gold zari work with traditional temple border",
      inStock: true,
      featured: true
    });

    await db.insert(products).values({
      name: "Banarasi Silk Festival Saree",
      slug: "banarasi-silk-festival-saree",
      description: "Rich Banarasi silk saree with intricate gold and silver zari work. Ideal for festive occasions.",
      price: 24999,
      categoryId: silkSarees.id,
      imageUrls: ["https://pixabay.com/get/g6af868092d7629d7cdf65e37c548c5123320a28c2a7a0752ecda2fe1835f0675ef32b647a602b65f066c9c75e10460251122a1c55a403af7f3faa8a1e5f53937_1280.jpg"],
      fabric: "Banarasi Silk",
      workDetails: "Gold and silver zari border and pallu",
      inStock: true,
      featured: true
    });

    await db.insert(products).values({
      name: "Royal Bridal Lehenga",
      slug: "royal-bridal-lehenga",
      description: "Stunning heavily embroidered bridal lehenga crafted with the finest materials and artisanal embroidery.",
      price: 49999,
      categoryId: designerLehengas.id,
      imageUrls: ["https://pixabay.com/get/gede6e4f1832f0d15c04249382ae0b4972693be098402796fcba79714c96a4478e41452ae1bc3b14a2e2cc76879c4f1d9e70d25c5472c0bfc283046b6420614ed_1280.jpg"],
      fabric: "Raw Silk with Velvet Accents",
      workDetails: "Zardozi, crystal and pearl embellishments",
      inStock: true,
      featured: true
    });

    await db.insert(products).values({
      name: "Handcrafted Zari Silk Dupatta",
      slug: "handcrafted-zari-silk-dupatta",
      description: "Luxury embroidered silk dupatta with intricate gold work. Perfect complement to any traditional outfit.",
      price: 12499,
      categoryId: premiumFabrics.id,
      imageUrls: ["https://pixabay.com/get/ge31a9ff1cf7f8d9ac712ff209160478407186623812aa516f9a8bd3cf5927b621b917155abcdc494c4255e918a730b2cc7e08a29698ba81f860cced4f1ed12d0_1280.jpg"],
      fabric: "Pure Silk",
      workDetails: "Hand-embroidered gold zari work",
      inStock: true,
      featured: true
    });

    console.log("Created products");
    console.log("Database seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

export { seed };