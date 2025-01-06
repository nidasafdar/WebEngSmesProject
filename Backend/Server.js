// Server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// console.log('Access Token Secret:', process.env.ACCESS_TOKEN_SECRET);

const User = require('./Routes/userController');
const authenticateToken = require('./Token');
const { isAdmin } = require('./Routes/newsController');

// Import the CreateNews and GetNews from newsController.js
const { PostNews, GetNews} = require('./Routes/newsController'); // Correct import
const { getSingup, getLogin, changePassword, } = require('./Routes/userController');

// Create the Express app
const app = express();
app.use(cors({ origin: 'http://127.0.0.1:5500' }));


// Middleware
app.use(express.json());
// app.use(cors());

// MongoDB connection function
const connectDb = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is missing in .env file');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDb();

// Routes
// app.post('/news',  CreateNews); // This route should now work correctly
app.get('/login', GetNews);
app.post('/postnews', PostNews);

// app.get('/regional-news', GetRegionalNews);
// app.get('/api/news/:country', GetNews);
app.get('/api/news/:country', GetNews); // This will call your GetNews function when country is provided

app.post('/signup', getSingup);
app.get('/userlogin', getLogin);
app.get('/changePassword',authenticateToken, changePassword);


// Define the port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
