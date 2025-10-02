import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  console.log('Attempting to connect to MongoDB...');
  
  if (!uri) {
    console.error('MONGO_URI is not set in environment variables');
    throw new Error('MONGO_URI environment variable is not set');
  }

  try {
    await mongoose.connect(uri, { 
      autoIndex: true,
      retryWrites: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      ssl: true
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('MongoDB connection error details:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
    console.log('Please check:');
    console.log('1. Your internet connection');
    console.log('2. The MongoDB Atlas connection string');
    console.log('3. Network access settings in MongoDB Atlas');
    process.exit(1);
  }
}
