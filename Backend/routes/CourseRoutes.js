const express = require('express')
const router = express.Router()
const { createCourse } = require('../controllers/CourseController')
const { protect, instructorOnly } = require('../middleware/authMiddleware')
const { addSessionToCourse} = require('../controllers/SessionController')

router.post('/course',protect, instructorOnly, createCourse)

// endpoint for session creation
router.post('/course/:courseId/session', addSessionToCourse)

module.exports = router