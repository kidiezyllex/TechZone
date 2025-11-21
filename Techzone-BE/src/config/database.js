import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/techzone';

export const jwtSecret = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error.message}`);
  }
};

mongoose.set('strictQuery', true);

export default mongoose;
