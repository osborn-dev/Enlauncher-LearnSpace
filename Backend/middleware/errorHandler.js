// Handles errors in the application
// Setting the status code on the "res" object to the main status code, and if it's not there, a 500 status is sent
const errorHandler = (err, req, res, next) => {
    // Determine the status code to use for the response
    // If res.statusCode is already set, use that; otherwise, default to 500 (Internal Server Error)
    const statusCode = res.statusCode ? res.statusCode : 500;
    
    // Set the response status code to the determined status code
    res.status(statusCode);

    // Send a JSON response with the error message and stack trace
    res.json({
        // Include the error message in the response
        message: err.message,
        // Include the stack trace in the response if the environment is not 'production'
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}

// Export the errorHandler function to be used as middleware in the application
module.exports = { errorHandler };
