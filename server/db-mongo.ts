import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function connectToMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/surdharshan';
    
    console.log('Attempting to connect to MongoDB...');
    
    // Check if we already have a connection
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB is already connected');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
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
  await mongoose.connection.close();
  process.exit(0);
});