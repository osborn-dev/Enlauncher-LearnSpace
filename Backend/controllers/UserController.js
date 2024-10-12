const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const  User = require('../models/userModel')
const jwt = require('jsonwebtoken')


// Creating a user
// @route /api/users/
// @access Public
const register = asyncHandler (async (req, res) => {
    const { name, email, username, password } = (req.body)

    if (!name || !email || !username || !password) {
        res.status(400)
        throw new Error('Please include all fields')
    }  

    // checking if user already exists
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

     // Hashing password
     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password, salt)

     // Creating a user
    const user = await User.create({
        name,
        email,
        username,
        password: hashedPassword
    })

    if (user) {
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