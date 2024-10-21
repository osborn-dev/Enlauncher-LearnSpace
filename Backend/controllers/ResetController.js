const bcrypt = require('bcryptjs') 
const crypto = require('crypto'); 
const asyncHandler = require('express-async-handler') 
const User = require('../models/userModel') 
const sendPasswordResetEmail = require('../utils/PassRes'); // Importing the function to send password reset emails

// Forgot Password Handler
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body; // Extracting the email from the request body

    try {
        const user = await User.findOne({ email }); // Finding the user by email in the database
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex'); // Generate a random reset token
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // Hash the token and store it in the database
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Set token expiration to 10 minutes from now

        await user.save(); // Save the user document with the reset token and expiration

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; // Create the reset URL to send to the user with the raw token
        await sendPasswordResetEmail(email, resetUrl); // Send the reset link to the user's email

        res.status(200).json({ message: 'Password reset link sent to your email' }); // Respond with success message
    } catch (error) {
        res.status(500).json({ message: 'Server error' }); // If error occurs, respond with server error
    }
});

// Reset Password Handler
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body; // Extracting the new password from the request body

    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex'); // Hash the token from the URL params
        const user = await User.findOne({
            resetPasswordToken: hashedToken, // Find user by the hashed reset token
            resetPasswordExpire: { $gt: Date.now() } // Ensure the token is still valid (not expired)
        });
        console.log(hashedToken)

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = await bcrypt.hash(password, 10); // Hash the new password
        user.resetPasswordToken = undefined; // Remove the reset token from the user document
        user.resetPasswordExpire = undefined; // Remove the reset token expiration from the user document
        
        await user.save(); 
        
        res.status(200).json({ message: 'Password reset successful' }); 
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error)
    }
});

module.exports = {
    forgotPassword, 
    resetPassword 
}
