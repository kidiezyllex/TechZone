// Change to MySQL
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// export const mongoURI = process.env.MONGODB_URI;

// export const jwtSecret = process.env.JWT_SECRET;
// export const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

// /**
//  * Connect to MongoDB
//  */
// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(mongoURI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     process.exit(1);
//   }
// };

// export const disconnectDB = async () => {
//   try {
//     await mongoose.disconnect();
//     console.log('MongoDB Disconnected');
//   } catch (error) {
//     console.error(`Error disconnecting from MongoDB: ${error.message}`);
//   }
// };

// mongoose.set('strictQuery', true);

// // Export mongoose instance
// export default mongoose; 