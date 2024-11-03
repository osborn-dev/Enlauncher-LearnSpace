// Import express and initialize a new router
const express = require('express')
const router = express.Router()

// Import functions from the UserController and protect middleware for route protection
const { register, login, getMe, registerInstructor } = require('../controllers/UserController')
const { protect, attachAuthorId } = require('../middleware/authMiddleware')
const { createAuthor, getAuthorWithDetails } = require('../controllers/AuthorController')
const {createContent, getContentWithDetails, updateEngagement, addComment} = require('../controllers/ContentController')

// Route for user registration, calls the register function
router.post('/', register)

// Route for instructor registration, calls the register function
router.post('/instructor', registerInstructor)

// Route for user login, calls the login function
router.post('/login', login)

// Protected route to get the current user's data, calls getMe function if protect middleware authorizes
router.get('/me', protect, getMe)

router.post('/authors', protect, createAuthor); // Route for creating a new author
router.get('/authors/:authorId', getAuthorWithDetails); // Route for getting an author with details

// Route to create new content
router.post('/content', protect, attachAuthorId, createContent);
// Route to get content with details, including comments and engagement metrics
router.get('/content/:contentId', getContentWithDetails);
// Route to update likes, shares, or reposts on content
router.patch('/content/:contentId/engagement', protect, updateEngagement);
// Route to add a comment to content
router.post('/content/:contentId/comments', protect, addComment);


// Export the router to be used in server setup
module.exports = router
