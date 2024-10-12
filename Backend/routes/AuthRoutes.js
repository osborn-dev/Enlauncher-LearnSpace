// Import express and passport modules, initialize a new router
const express = require('express')
const passport = require('passport')
const router = express.Router()

// Redirect the user to Google for authentication on '/google' route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// Handle callback from Google after user authenticates on '/google/callback' route
router.get(
    '/google/callback', 
    passport.authenticate('google', { 
        successRedirect: 'http://localhost:3000', // Redirect to client after successful authentication
        failureRedirect: '/' // Redirect to home page on failure
    })
)

// Logout route, destroy session, and redirect to client homepage
router.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {                 // Passport logout function
        if (err) {                        // Handle potential errors on logout
            return next(err)
        }
        res.redirect('http://localhost:3000')  // Redirect to client homepage after logout
    })
})

// Export router to be used in server setup
module.exports = router

// URL for successful redirect after login or logout
// http://localhost:3000
