const mongoose = require('mongoose');

// Define the Course Schema
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor', // Reference to the Instructor model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically set the update date
    }
});

courseSchema.index({ name: 1, instructorId: 1 }, { unique: true });

// Update updatedAt field on every save
courseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Course model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
