const asyncHandler = require('express-async-handler'); 
const Course = require('../models/Course'); 
const Session = require('../models/Session');

// Controller to add a new session to a specific course
const addSessionToCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params; // Get courseId from request parameters
    const { title, description, startTime, duration, videoUrl } = req.body; // Destructure session details from request body
    
    if (!title || !description || !startTime || !duration || !videoUrl) { // Validate all fields are provided
        res.status(400);
        throw new Error('Please include all fields'); 
    }

    // Ensuring the course exists in the database
    const course = await Course.findById(courseId); // Finding the course by ID
    if (!course) { 
        return res.status(404).json({ message: 'Course not found' }); 
    }

    // Checking if a session with the same title already exists for the course
    const existingSession = await Session.findOne({ title, courseId }); // Search for an existing session
    if (existingSession) { 
        return res.status(400).json({ message: 'A session with this title already exists for the course.' }); 
    }

    // Creating a new session with the provided details
    const session = new Session({
        title, 
        description, 
        courseId, 
        videoUrl, 
        startTime, 
        duration 
    });

    // Save the newly created session to the database
    await session.save(); // Save session

    // Respond with success message and session details
    res.status(201).json({ message: 'Session added successfully', session });
});

// Export the addSessionToCourse function for use in other files
module.exports = {
    addSessionToCourse,
};
