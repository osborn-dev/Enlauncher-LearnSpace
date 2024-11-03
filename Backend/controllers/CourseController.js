const asyncHandler = require('express-async-handler');
const Course = require('../models/Course'); // Import Course model
const Instructor = require('../models/Instructor'); // Import Instructor model

const createCourse = asyncHandler(async (req, res) => {
    const { name, description, startDate, endDate, expertise } = req.body; 
    const userId = req.user._id; // Get user ID from request (assumed populated by middleware)

    // Check if instructor exists for this user; return error if not found
    // Find instructor by userId and populate courses with name and description fields
    const instructor = await Instructor.findOne({ userId }).populate('courses', 'name description');
    console.log(instructor);

    // Return 404 response if instructor is not found
    if (!instructor) {
        return res.status(404).json({ message: "Instructor not found. Cannot create course." });
    }


    // Check if instructor already has a course with this name
    const existingCourse = await Course.findOne({ name, instructorId: instructor._id });
    if (existingCourse) {
        return res.status(400).json({ message: "Course with this name already exists for this instructor" });
    }

    // Create the course with the instructor's ID
    const newCourse = await Course.create({
        name,
        description,
        expertise,
        instructorId: instructor._id,
        startDate,
        endDate,
    });

    // Adding course ID to instructor's courses array
    await Instructor.findByIdAndUpdate(
        instructor,
        { $push: { courses: newCourse._id } },
        { new: true }
    );

    // success response with new course details
    res.status(201).json({
        message: 'Course created successfully',
        course: newCourse,
    });
});

module.exports = { createCourse }; // Export createCourse function
