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
    const { name, email, username, password } = req.body

    if (!name || !email || !username || !password) {
        res.status(400)
        throw new Error('Please include all fields')
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        username,
        password: hashedPassword
    })

    if (user) {
        // Send a welcome email
        await sendWelcomeEmail(user.email, user.name)
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id)
        });
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// logs in an existing user
// @route /api/users/login
// @access Private
const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body
    const user = await User.findOne({email})
    // checking for existing user and password match
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id)
        });
    } else {
        res.status(401)
        throw new Error('Invalid Credentials')
    }
})

// / @desc Get current user
// @route /api/users/me
// @access private
const getMe = asyncHandler(async (req, res) => {
    // restructuring the model
    const user = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
    }
    res.status(200).json(user)
})

// / JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

module.exports = {
    register,
    login,
    getMe
}