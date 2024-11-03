// Import necessary modules
const jwt = require('jsonwebtoken'); // For JWT verification
const asyncHandler = require('express-async-handler'); // Middleware for async handling
const User = require('../models/userModel'); // User model
const Instructor = require('../models/Instructor'); // Instructor model
const Author = require('../models/Author')

// Middleware function to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for the token in the authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Get the token part

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get the user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Middleware function to check if the user is an instructor
const instructorOnly = asyncHandler(async (req, res, next) => {
    // Check if the user ID exists in the Instructor model
    const instructor = await Instructor.findOne({ userId: req.user._id });
    
    if (!instructor) {
        res.status(403); // Forbidden status
        throw new Error('Access restricted to instructors');
    }

    next(); // Allow access if user is an instructor
});

// Middleware function to enable content creation
const attachAuthorId = asyncHandler(async (req, res, next) => {
    const { _id: userId } = req.user;
  
    // Find the author linked to this user
    const author = await Author.findOne({ userId });
  
    if (!author) {
      return res.status(404).json({ message: 'Author profile not found for this user.' });
    }
  
    // Attach authorId to the request object
    req.authorId = author._id;
    next();
  });

module.exports = { protect, instructorOnly, attachAuthorId };
