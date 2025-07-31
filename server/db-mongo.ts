import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function connectToMongoDB() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.log('No MongoDB URI provided, using in-memory storage instead');
      return;
    }

    // Check if already connected
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB is already connected');
      return;
    }

    const options = {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    };

    console.log(`Connecting to MongoDB`);
    await mongoose.connect(mongoUri, options);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.log('Using in-memory storage instead');
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection event: connected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection event: error - ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection event: disconnected');
});

// Gracefully close the MongoDB connection when the Node process ends
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState >= 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});