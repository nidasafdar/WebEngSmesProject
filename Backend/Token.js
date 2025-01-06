const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticateToken = (req, res, next) => {
  // Retrieve the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // Get token from "Bearer <token>"

  // If token is missing, send unauthorized status
  if (token == null) return res.sendStatus(401);

  // Verify the token using JWT
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);  // Token verification failed
    req.user = user;  // Attach the decoded user info to the request
    next();  // Continue to the next middleware or route handler
  });
};

module.exports = authenticateToken;
