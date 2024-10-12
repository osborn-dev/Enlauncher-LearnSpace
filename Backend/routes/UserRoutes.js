// Import express and initialize a new router
const express = require('express')
const router = express.Router()

// Import functions from the UserController and protect middleware for route protection
const { register, login, getMe } = require('../controllers/UserController')
const { protect } = require('../middleware/authMiddleware')

// Route for user registration, calls the register function
router.post('/', register)

// Route for user login, calls the login function
router.post('/login', login)

// Protected route to get the current user's data, calls getMe function if protect middleware authorizes
router.get('/me', protect, getMe)

// Export the router to be used in server setup
module.exports = router
