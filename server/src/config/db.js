import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error('❌ MONGO_URL is not defined in environment variables');
}

const client = new MongoClient(mongoUrl);

const connectDB = async () => {
  try {
    await client.connect();
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const getDB = () => client.db('baseDB');

export { connectDB, getDB };
