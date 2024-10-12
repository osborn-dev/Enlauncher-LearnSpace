// Load environment variables and user model, initialize Passport and Google OAuth strategy
const dotenv = require('dotenv')
dotenv.config()
const User = require('../models/userModel')
const Passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

// Configure Passport to use Google OAuth 2.0 strategy
Passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,          // Google client ID from .env file
    clientSecret: process.env.CLIENT_SECRET,  // Google client secret from .env file
    callbackURL: "/auth/google/callback",     // URL Google redirects to after authentication
},
async (accessToken, refreshToken, profile, done) => {   // Verify callback with profile info
    try {
        let user = await User.findOne({ googleID: profile.id })   // Find user by Google ID

        if (user) { 
            // User exists, pass user back to the app
            return done(null, user)
        } else {
            // User does not exist, create and save a new user with Google profile data
            user = new User({
                googleID: profile.id,               // Google profile ID
                name: profile.displayName,          // Google profile display name
                email: profile.emails[0].value,     // Primary email from Google profile
                profileImage: profile.photos[0].value,  // Profile picture from Google
            })
            await user.save()                       // Save new user to database
            return done(null, user)                 // Pass newly created user back
        }
    } catch (error) {
        console.error(error)
        return done(error, null)                    // Handle any errors
    }
}
))

module.exports = Passport  // Export configured Passport instance
