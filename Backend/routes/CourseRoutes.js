const express = require('express')
const router = express.Router()

const { createCourse } = require('../controllers/CourseController')
const { protect, instructorOnly } = require('../middleware/authMiddleware')

router.post('/course',protect, instructorOnly, createCourse)

module.exports = router