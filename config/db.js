import mongoose from 'mongoose';

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default dbConnect;