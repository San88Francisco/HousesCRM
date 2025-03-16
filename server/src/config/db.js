const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URL);

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

module.exports = { connectDB, getDB };
