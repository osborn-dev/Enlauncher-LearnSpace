// Import necessary modules and configurations
const express = require('express')
const dotenv = require('dotenv')
dotenv.config() // Load environment variables
const Passport = require('passport') // For Google OAuth setup
const connectDB = require('./config/db') // MongoDB connection configuration
const MongoStore = require('connect-mongo') // MongoDB session store for express-session
const cors = require('cors') // Cross-Origin Resource Sharing
const session = require('express-session') // Session management
const passport = require('./googleOauth/passport') // Google OAuth configuration
const colors = require('colors') // For colored console logs
const { errorHandler } = require('./middleware/errorHandler') // Custom error handler

// Import the User model if needed for Passport deserialization
const User = require('./models/userModel')

// Connect to the database
connectDB()

const app = express()

// Middleware for CORS and body parsing
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true // Allow credentials with CORS
}))

app.use(express.json()) // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })) // Parse URL-encoded request bodies

// Initialize express-session with MongoDB session store
// ! session to be worked on 
app.use(session({
    secret: process.env.SESSION_SECRET, // Session secret for signing cookies
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    store: MongoStore.create({ // Use MongoDB as session store
        mongoUrl: process.env.MONGO_URI, // Database URL
        collectionName: 'sessions', // Name of the session collection
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day in milliseconds
    }
}));

// Initialize Passport and session handling
app.use(Passport.initialize()) // Initialize Passport middleware
app.use(Passport.session()) // Use Passport's session support

// Endpoints for user registration and authentication
app.use('/api/users', require('./routes/UserRoutes')) // For local registration
app.use('/auth', require('./routes/AuthRoutes')) // For Google OAuth routes

// Custom error handler middleware
app.use(errorHandler)

// Passport serialization and deserialization
passport.serializeUser((user, done) => {
    done(null, user.id) // Serialize user by user ID
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Find user by ID in the database
        done(null, user); // Deserialize user object
    } catch (err) {
        done(err, null); // Handle any errors
    }
});

// Start the server and listen on the specified port
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`.cyan.underline) // Log successful server start
})
