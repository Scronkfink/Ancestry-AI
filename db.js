const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_KEY);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = { connectToDatabase };