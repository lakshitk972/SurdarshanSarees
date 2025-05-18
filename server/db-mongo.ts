import mongoose from 'mongoose';

// Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/surdharshan';

// Connect to MongoDB
export async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return false;
  }
}

export default mongoose;