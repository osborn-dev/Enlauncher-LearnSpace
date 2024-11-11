const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment'); 
const Course = require('../models/Course'); // 

// Controller function to enroll a user in a course
const enrollUserInCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params; // Get courseId from request parameters
    const userId = req.user._id; // Get userId from the authenticated user's information

    // Checking if the course exists in the database
    const course = await Course.findById(courseId); // Find course by ID
    if (!course) { // If course is not found, send 404 error
        return res.status(404).json({ message: 'Course not found' }); // Respond with error message
    }

    // Checking if the user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) { 
        return res.status(400).json({ message: 'User already enrolled in this course' }); 
    }

    // Creating a new enrollment record for the user in the course
    const enrollment = new Enrollment({
        userId, // Set the userId field to the current user's ID
        courseId, // Set the courseId field to the specified course ID
        startDate: new Date(), // Set the enrollment start date to the current date
    });
    await enrollment.save(); // Save the new enrollment to the database

    res.status(201).json({
        message: 'User successfully enrolled',
        enrollment, // Send back the enrollment details
    });
});

// ? TODO = USER PROGRESS TRACKING

module.exports = { enrollUserInCourse };
