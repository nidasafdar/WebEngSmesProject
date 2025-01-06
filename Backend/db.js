const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDb = async () => {
  try {
    // Check if MONGO_URI is available in the .env file
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing in .env file');
      process.exit(1);
    }

    // Connect to MongoDB with additional connection options (optional but recommended)
    await mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true,        // Use the new URL parser
    //   useUnifiedTopology: true,     // Use the new unified topology engine
    });

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDb;
