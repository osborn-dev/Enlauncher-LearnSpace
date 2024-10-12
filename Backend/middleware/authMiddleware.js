// Import necessary modules
const jwt = require('jsonwebtoken'); // Module for working with JSON Web Tokens
const asyncHandler = require('express-async-handler'); // Middleware to handle exceptions in async route handlers
const User = require('../models/userModel'); // Import the User model

// Middleware function to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // CHECKING FOR BEARER TOKEN
    // Check if the authorization header is present and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // GETTING TOKEN FROM THE HEADER
            // Split the authorization header and get the token part (array[1])
            token = req.headers.authorization.split(' ')[1];

            // VERIFYING TOKEN
            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // GETTING THE USER FROM (TOKEN)
            // Find the user by the id encoded in the token, excluding the password field
            req.user = await User.findById(decoded.id).select('-password');

            // Ensure the next piece of middleware is called
            next();
        } catch (error) {
            console.log(error); // Log the error for debugging
            res.status(401); // Set the response status to 401 (Unauthorized)
            throw new Error('Not authorised'); // Throw an error indicating the user is not authorized
        }
    }

    // If no token is found
    if (!token) {
        res.status(401); // Set the response status to 401 (Unauthorized)
        throw new Error('Not authorised'); // Throw an error indicating the user is not authorized
    }
});

// Export the protect middleware function to be used in other parts of the application
module.exports = { protect };
