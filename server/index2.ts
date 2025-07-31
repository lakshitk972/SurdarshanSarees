import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { connectToMongoDB } from "./db-mongo";
import { seedMongoDB } from "./seed-mongo";
import { createServer } from "http";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Database and routes initialization
let isInitialized = false;

const initialize = async () => {
  if (!isInitialized) {
    try {
      await connectToMongoDB();
      await seedMongoDB();
      await registerRoutes(app);
      isInitialized = true;
      console.log("Server initialized successfully");
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  }
};

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Create HTTP server
const server = createServer(app);

// For local development
if (process.env.NODE_ENV !== "production") {
  (async () => {
    await initialize();
    
    // IMPORTANT: Use Vite dev server for development
    await setupVite(app, server);
    
    const port = 5000;
    server.listen(port, () => {
      console.log(`Development server running on port ${port}`);
      console.log(`Frontend: http://localhost:${port}`);
      console.log(`API: http://localhost:${port}/api`);
    });
  })();
}

// For Vercel deployment (production)
let initializedApp: express.Application | null = null;

const getProductionApp = async () => {
  if (!initializedApp) {
    await initialize();
    
    // IMPORTANT: Use static serving for production
    serveStatic(app);
    
    initializedApp = app;
  }
  return initializedApp;
};

// Export for Vercel
export default async (req: Request, res: Response) => {
  try {
    const app = await getProductionApp();
    return app(req, res);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
