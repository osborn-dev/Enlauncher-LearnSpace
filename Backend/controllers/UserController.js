const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const  User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config()


 // Configure the transporter
 const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email provider
    auth: {
        user: process.env.EMAIL,
        pass: process.env.GOOGLE_PASS
    }
})

// Function to send a welcome email using Nodemailer
const sendWelcomeEmail = async (email, name) => {
    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Welcome to LearnSpace, ${name}`,
        text: `Hi ${name},

Welcome to LearnSpace! We’re thrilled to have you join our community of learners and explorers. 🎓✨

Here at LearnSpace, we believe in creating a supportive environment where everyone can grow and reach their full potential. Whether you're here to expand your knowledge, work on new skills, or connect with like-minded individuals, we’re excited to see where this journey takes you!

To get started, simply log in to your account and check out your dashboard for the latest resources and community updates.

If you have any questions or need help along the way, don’t hesitate to reach out. We're here for you every step of the way!

Best wishes,
The LearnSpace Team`
    }

    // Send the email
    await transporter.sendMail(mailOptions)
}

// Creating a user
// @route /api/users/
// @access Public
const register = asyncHandler(async (req, res) => {
    const { name, email, username, password } = req.body // Destructure user details from request body

    if (!name || !email || !username || !password) { // Check if all required fields are provided
        res.status(400) // Return 400 status if any field is missing
        throw new Error('Please include all fields') // Throw an error for missing fields
    }

    // Check if user already exists in the database
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400) // Return 400 status if user exists
        throw new Error('User already exists') // Throw error for existing user
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10) // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt) // Hash the password using the salt

    // Create a new user in the database
    const user = await User.create({
        name,
        email,
        username,
        password: hashedPassword // Save the hashed password
    })

    if (user) {
        // Send a welcome email to the user
        await sendWelcomeEmail(user.email, user.name)
        
        // Return the user details and a token in the response
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id) // Generate a JWT token for the user
        });
    } else {
        res.status(400) // Return 400 status if user creation fails
        throw new Error('Invalid user data') // Throw error for invalid data
    }
})

// logs in an existing user
const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body // Destructure login details from request body
    const user = await User.findOne({email}) // Find user by email
    // Check if user exists and if the password matches
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id, // Return user details and token
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id) // Generate JWT token
        });
    } else {
        res.status(401) // Return 401 status for invalid credentials
        throw new Error('Invalid Credentials') // Throw error for wrong login details
    }
})

// Get current logged-in user information
const getMe = asyncHandler(async (req, res) => {
    // Extract user details from the authenticated request
    const user = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
    }
    res.status(200).json(user) // Return the user data
})

// Generate a JWT token for user authentication
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { // Sign the token with the user ID and secret
        expiresIn: '7d' // Set the token to expire in 7 days
    })
}

module.exports = {
    register,
    login,
    getMe
}