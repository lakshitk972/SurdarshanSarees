import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function connectToMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.log('No MongoDB URI provided, using in-memory storage instead');
      return;
    }
    
    console.log('Attempting to connect to MongoDB...');
    
    // Check if we already have a connection
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB is already connected');
      return;
    }

    // Set connection options for better stability
    const options = {
      serverSelectionTimeoutMS: 15000, // 15 seconds to select server
      socketTimeoutMS: 45000, // 45 seconds to establish connection
    };

    await mongoose.connect(mongoUri, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.log('Using in-memory storage instead');
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Gracefully close the MongoDB connection when the Node process ends
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState >= 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});