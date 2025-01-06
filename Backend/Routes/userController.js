const User = require('../Models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getSingup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword, // Store the hashed password
      role 
    });

    // Save the user to the database
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token with the user's ID and email, and set expiry
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Updated secret key
      { expiresIn: process.env.JWT_EXPIRES_IN } // Token expiry from .env
    );

    // Send token as a response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


 

const changePassword = async (req, res) => {    
    try {
        const { email, oldPassword, newPassword } = req.body;
        const user = await
        User.findOne({ email, password: oldPassword });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Error in changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
module.exports = {getSingup , getLogin , changePassword};