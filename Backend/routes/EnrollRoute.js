const express = require('express')
const router = express.Router()
const { enrollUserInCourse } = require('../controllers/EnrollmentController')
const { protect } = require ('../middleware/authMiddleware')

// route for enrollment creation
router.post('/enroll/:courseId', protect, enrollUserInCourse)

module.exports = router