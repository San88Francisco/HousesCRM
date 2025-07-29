import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

const connectDB = async () => {
  try {
    await client.connect();
    console.warn('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const getDB = () => client.db('baseDB');

export { connectDB, getDB };
