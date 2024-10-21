const nodemailer = require('nodemailer'); // Importing the Nodemailer library for sending emails
require('dotenv').config(); 

// Creating a transporter object to configure email sending with Gmail and authentication
const transporter = nodemailer.createTransport({
    service: 'gmail', // Using Gmail as the email service
    auth: {
        user: process.env.EMAIL, // Sender's email address from environment variables
        pass: process.env.GOOGLE_PASS // Google App password for authentication from environment variables
    }
});

// Function to send the password reset email
const sendPasswordResetEmail = async (email, resetUrl) => {
    // Email options: sender, recipient, subject, and body (with the reset link)
    const mailOptions = {
        from: process.env.EMAIL, // Sender's email address
        to: email, // Recipient's email address
        subject: 'Password Reset Request', // Subject of the email
        html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>` // HTML content with the reset URL
    };

    await transporter.sendMail(mailOptions); // Sending the email using the configured transporter
};

module.exports = sendPasswordResetEmail; 
